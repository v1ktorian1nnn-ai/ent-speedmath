const prisma = require("../config/db");
const { verifySocketToken } = require("../middleware/auth");
const { pickRandomProblems, getRecentlySeenProblemIds } = require("../routes/problems");

const PROBLEMS_PER_DUEL = 8;
const GROUP_MIN_PLAYERS = 3;
const GROUP_MAX_PLAYERS = 6;
const GROUP_WAIT_MS = 15000; // сколько ждём набора группы, прежде чем стартовать с тем, что есть
const FINISHED_DUEL_TTL_MS = 10 * 60 * 1000; // сколько после дуэли ещё можно предложить реванш

// Набор разрешённых быстрых фраз — намеренно закрытый список (не свободный
// ввод текста), чтобы не городить модерацию и не пускать спам/оскорбления.
const ALLOWED_REACTIONS = ["👍", "🔥", "😅", "🤝", "ГГ!", "Ух, это было близко!", "Математика — сила!"];

// Очереди ожидания матчмейкинга, отдельно для 1v1 и group
const queue1v1 = []; // [{ socket, user }]
const queueGroup = []; // [{ socket, user }]
let groupTimer = null;

// duelId -> { duel, sockets: Map(userId -> socket), problems, progress: Map(userId -> {index, correctCount}) }
const activeDuels = new Map();

// duelId -> { mode, players: [{ socket, user }], rematchSet: Set(userId) }
// Хранится недолго после завершения дуэли — только чтобы можно было предложить реванш.
const finishedDuels = new Map();

let ioRef = null;

function registerDuelHandlers(io) {
  ioRef = io;

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const payload = verifySocketToken(token);
      socket.user = payload; // { id, username }
      next();
    } catch (err) {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("duel:join", async ({ mode }) => {
      if (mode === "1v1") {
        queue1v1.push({ socket, user: socket.user });
        socket.emit("duel:queued", { mode });
        tryMatch1v1(io);
      } else if (mode === "group") {
        queueGroup.push({ socket, user: socket.user });
        socket.emit("duel:queued", { mode });
        if (queueGroup.length >= GROUP_MAX_PLAYERS) {
          await startGroupDuel(io);
        } else if (!groupTimer) {
          groupTimer = setTimeout(() => startGroupDuel(io), GROUP_WAIT_MS);
        }
      }
    });

    socket.on("duel:leaveQueue", () => {
      removeFromQueue(queue1v1, socket);
      removeFromQueue(queueGroup, socket);
    });

    socket.on("duel:answer", async ({ duelId, problemIndex, chosenIndex, timeMs }) => {
      const entry = activeDuels.get(duelId);
      if (!entry) return;

      const problem = entry.problems[problemIndex];
      if (!problem) return;

      const correct = problem.correctIndex === chosenIndex;
      const progress = entry.progress.get(socket.user.id);
      if (!progress || progress.index !== problemIndex) return; // защита от повторов/рассинхрона

      progress.index += 1;
      progress.correctCount += correct ? 1 : 0;
      progress.timeMs += timeMs;

      // Сообщаем всем участникам комнаты, насколько продвинулся этот игрок
      // (без деталей ответа — только прогресс, чтобы не спойлерить задачу)
      io.to(`duel:${duelId}`).emit("duel:progress", {
        userId: socket.user.id,
        username: socket.user.username,
        index: progress.index,
        total: entry.problems.length,
      });

      socket.emit("duel:answerResult", { correct, correctIndex: problem.correctIndex });

      if (progress.index >= entry.problems.length) {
        progress.finishedAt = Date.now();
        await finishParticipantIfDone(io, duelId, socket.user.id);
      }
    });

    // Быстрая фраза/эмодзи — во время гонки или на экране результатов
    socket.on("duel:reaction", ({ duelId, text }) => {
      if (!ALLOWED_REACTIONS.includes(text)) return;
      io.to(`duel:${duelId}`).emit("duel:reactionReceived", {
        userId: socket.user.id,
        username: socket.user.username,
        text,
      });
    });

    // Запрос реванша — стартуем новую дуэль тем же составом, как только
    // согласились все ещё подключённые участники прошлой дуэли.
    socket.on("duel:rematch", async ({ duelId }) => {
      const record = finishedDuels.get(duelId);
      if (!record) return;

      const isParticipant = record.players.some((p) => p.user.id === socket.user.id);
      if (!isParticipant) return;

      record.rematchSet.add(socket.user.id);

      io.to(`duel:${duelId}`).emit("duel:rematchWaiting", {
        userId: socket.user.id,
        username: socket.user.username,
        readyCount: record.rematchSet.size,
        total: record.players.length,
      });

      const connectedPlayers = record.players.filter((p) => p.socket.connected);
      const allReady =
        connectedPlayers.length >= 2 &&
        connectedPlayers.every((p) => record.rematchSet.has(p.user.id));

      if (allReady) {
        finishedDuels.delete(duelId);
        await createAndStartDuel(io, record.mode, connectedPlayers);
      }
    });

    socket.on("disconnect", () => {
      removeFromQueue(queue1v1, socket);
      removeFromQueue(queueGroup, socket);
    });
  });
}

function removeFromQueue(queue, socket) {
  const idx = queue.findIndex((e) => e.socket.id === socket.id);
  if (idx !== -1) queue.splice(idx, 1);
}

async function tryMatch1v1(io) {
  if (queue1v1.length < 2) return;
  const a = queue1v1.shift();
  const b = queue1v1.shift();
  await createAndStartDuel(io, "1v1", [a, b]);
}

async function startGroupDuel(io) {
  clearTimeout(groupTimer);
  groupTimer = null;

  if (queueGroup.length < GROUP_MIN_PLAYERS) {
    return; // недостаточно игроков — ждём следующего вызова таймера/присоединения
  }

  const players = queueGroup.splice(0, GROUP_MAX_PLAYERS);
  await createAndStartDuel(io, "group", players);
}

async function createAndStartDuel(io, mode, players) {
  // Чтобы задачи не повторялись у игроков, исключаем те, что недавно видел
  // ЛЮБОЙ из участников — набор всё равно общий для честности соревнования.
  const excludeArrays = await Promise.all(
    players.map((p) => getRecentlySeenProblemIds(p.user.id))
  );
  const excludeIds = [...new Set(excludeArrays.flat())];

  const problems = await pickRandomProblems(PROBLEMS_PER_DUEL, undefined, excludeIds);

  const duel = await prisma.duel.create({
    data: {
      mode,
      status: "active",
      problemIds: problems.map((p) => p.id),
      participants: {
        create: players.map((p) => ({ userId: p.user.id })),
      },
    },
  });

  const socketsMap = new Map();
  const progress = new Map();

  for (const p of players) {
    p.socket.join(`duel:${duel.id}`);
    socketsMap.set(p.user.id, p.socket);
    progress.set(p.user.id, { index: 0, correctCount: 0, timeMs: 0, finishedAt: null });
  }

  activeDuels.set(duel.id, {
    duel,
    sockets: socketsMap,
    problems, // содержит correctIndex — хранится только на сервере
    progress,
  });

  // Отдаём клиентам задачи БЕЗ правильных ответов
  const safeProblems = problems.map(({ correctIndex, ...rest }) => rest);
  io.to(`duel:${duel.id}`).emit("duel:start", {
    duelId: duel.id,
    mode,
    problems: safeProblems,
    opponents: players.map((p) => ({ id: p.user.id, username: p.user.username })),
  });
}

async function finishParticipantIfDone(io, duelId, userId) {
  const entry = activeDuels.get(duelId);
  if (!entry) return;

  const allFinished = [...entry.progress.values()].every((p) => p.finishedAt !== null);

  if (allFinished) {
    await finalizeDuel(io, duelId);
  }
}

async function finalizeDuel(io, duelId) {
  const entry = activeDuels.get(duelId);
  if (!entry) return;

  const results = [...entry.progress.entries()]
    .map(([userId, p]) => ({ userId, ...p }))
    .sort((a, b) => {
      if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
      return a.timeMs - b.timeMs;
    });

  results.forEach((r, i) => (r.place = i + 1));

  for (const r of results) {
    await prisma.duelParticipant.updateMany({
      where: { duelId, userId: r.userId },
      data: {
        finishedAt: new Date(),
        totalTimeMs: r.timeMs,
        correctCount: r.correctCount,
        place: r.place,
      },
    });
  }

  await prisma.duel.update({
    where: { id: duelId },
    data: { status: "finished", finishedAt: new Date() },
  });

  const usersById = {};
  for (const [uid, sock] of entry.sockets.entries()) {
    usersById[uid] = sock.user?.username;
  }

  io.to(`duel:${duelId}`).emit("duel:results", {
    results: results.map((r) => ({
      userId: r.userId,
      username: usersById[r.userId],
      correctCount: r.correctCount,
      timeMs: r.timeMs,
      place: r.place,
    })),
  });

  // Сохраняем состав участников на некоторое время — вдруг кто-то предложит реванш
  finishedDuels.set(duelId, {
    mode: entry.duel.mode,
    players: [...entry.sockets.entries()].map(([userId, socket]) => ({ socket, user: socket.user })),
    rematchSet: new Set(),
  });
  setTimeout(() => finishedDuels.delete(duelId), FINISHED_DUEL_TTL_MS);

  activeDuels.delete(duelId);
}

// Если участник не успел закончить (например завис) — по таймауту завершаем дуэль
// принудительно тем, что успели набрать. Простая защита от "вечных" комнат.
setInterval(() => {
  const now = Date.now();
  for (const [duelId, entry] of activeDuels.entries()) {
    const startedAt = entry.duel.createdAt?.getTime?.() ?? now;
    const elapsed = now - startedAt;
    if (elapsed > 10 * 60 * 1000 && ioRef) {
      // 10 минут — аварийный потолок на дуэль
      finalizeDuel(ioRef, duelId).catch(() => {});
    }
  }
}, 30000);

module.exports = { registerDuelHandlers, ALLOWED_REACTIONS };
