const express = require("express");
const prisma = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Начать сессию практики
router.post("/start", requireAuth, async (req, res) => {
  const session = await prisma.practiceSession.create({
    data: { userId: req.user.id },
  });
  res.json({ sessionId: session.id });
});

// Отправить ответ на одну задачу в рамках сессии
router.post("/attempt", requireAuth, async (req, res) => {
  const { sessionId, problemId, chosenIndex, timeMs } = req.body;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) return res.status(404).json({ error: "Задача не найдена" });

  const correct = problem.correctIndex === chosenIndex;

  const attempt = await prisma.practiceAttempt.create({
    data: {
      sessionId,
      userId: req.user.id,
      problemId,
      chosenIndex,
      correct,
      timeMs,
    },
  });

  res.json({ correct, correctIndex: problem.correctIndex, attemptId: attempt.id });
});

// Завершить сессию — считаем итог и кладём в общий рейтинг
router.post("/finish", requireAuth, async (req, res) => {
  const { sessionId } = req.body;

  const attempts = await prisma.practiceAttempt.findMany({ where: { sessionId } });
  if (attempts.length === 0) {
    return res.status(400).json({ error: "В сессии нет ни одного ответа" });
  }

  const totalTimeMs = attempts.reduce((sum, a) => sum + a.timeMs, 0);
  const correctCount = attempts.filter((a) => a.correct).length;

  const session = await prisma.practiceSession.update({
    where: { id: sessionId },
    data: {
      finishedAt: new Date(),
      totalTimeMs,
      correctCount,
      totalCount: attempts.length,
    },
  });

  res.json(session);
});

// Общий рейтинг (leaderboard): лучшие завершённые сессии, отсортированные
// сначала по числу правильных ответов, потом по суммарному времени.
router.get("/leaderboard", requireAuth, async (req, res) => {
  const sessions = await prisma.practiceSession.findMany({
    where: { finishedAt: { not: null } },
    include: { user: { select: { username: true } } },
    orderBy: [{ correctCount: "desc" }, { totalTimeMs: "asc" }],
    take: 50,
  });

  res.json(
    sessions.map((s) => ({
      username: s.user.username,
      correctCount: s.correctCount,
      totalCount: s.totalCount,
      totalTimeMs: s.totalTimeMs,
      finishedAt: s.finishedAt,
    }))
  );
});

// История результатов текущего пользователя
router.get("/history", requireAuth, async (req, res) => {
  const sessions = await prisma.practiceSession.findMany({
    where: { userId: req.user.id, finishedAt: { not: null } },
    orderBy: { finishedAt: "desc" },
    take: 50,
  });
  res.json(sessions);
});

// Архив ошибок: задачи, последний ответ на которые был неверным.
// Если позже пользователь решит задачу верно (в обычной тренировке),
// она сама пропадёт из этого списка — учитывается именно ПОСЛЕДНЯЯ попытка.
router.get("/mistakes", requireAuth, async (req, res) => {
  const attempts = await prisma.practiceAttempt.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 300,
    select: { problemId: true, correct: true },
  });

  const latestByProblem = new Map();
  for (const a of attempts) {
    if (!latestByProblem.has(a.problemId)) {
      latestByProblem.set(a.problemId, a.correct);
    }
  }

  const mistakeIds = [...latestByProblem.entries()]
    .filter(([, correct]) => !correct)
    .map(([problemId]) => problemId)
    .slice(0, 50);

  if (mistakeIds.length === 0) return res.json([]);

  const problems = await prisma.problem.findMany({ where: { id: { in: mistakeIds } } });
  const safe = problems.map(({ correctIndex, ...rest }) => rest);
  // Сохраняем порядок "от самой недавней ошибки к более старой"
  const ordered = mistakeIds.map((id) => safe.find((p) => p.id === id)).filter(Boolean);
  res.json(ordered);
});

// Проверка ответа в режиме "работы над ошибками" — без таймера и без
// влияния на статистику/рейтинг, просто сверка с правильным вариантом.
router.post("/check-answer", requireAuth, async (req, res) => {
  const { problemId, chosenIndex } = req.body;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) return res.status(404).json({ error: "Задача не найдена" });

  const correct = problem.correctIndex === chosenIndex;
  res.json({ correct, correctIndex: problem.correctIndex });
});

module.exports = router;
