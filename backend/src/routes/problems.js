const express = require("express");
const multer = require("multer");
const path = require("path");
const prisma = require("../config/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "..", "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `problem_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Публичный (для авторизованных) список тем — нужен для фильтров на фронте
router.get("/topics", requireAuth, async (req, res) => {
  const rows = await prisma.problem.findMany({
    where: { isActive: true },
    select: { topic: true },
    distinct: ["topic"],
  });
  res.json(rows.map((r) => r.topic));
});

// Достаём N случайных активных задач (используется и для практики, и для дуэлей)
async function pickRandomProblems(count, topic) {
  const where = { isActive: true, ...(topic ? { topic } : {}) };
  const all = await prisma.problem.findMany({ where, select: { id: true } });
  const shuffled = all.sort(() => Math.random() - 0.5);
  const ids = shuffled.slice(0, count).map((p) => p.id);
  return prisma.problem.findMany({ where: { id: { in: ids } } });
}

router.get("/practice-set", requireAuth, async (req, res) => {
  const count = Math.min(parseInt(req.query.count, 10) || 10, 30);
  const topic = req.query.topic || undefined;
  const problems = await pickRandomProblems(count, topic);

  // Не отдаём правильный индекс на клиент до ответа
  const safe = problems.map(({ correctIndex, ...rest }) => rest);
  res.json(safe);
});

// --- Админ: управление банком задач ---

router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  const problems = await prisma.problem.findMany({ orderBy: { id: "desc" } });
  res.json(problems);
});

router.post("/admin", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  const { topic, difficulty, statement, correctIndex } = req.body;
  let options = req.body.options;

  try {
    options = typeof options === "string" ? JSON.parse(options) : options;
  } catch {
    return res.status(400).json({ error: "Поле options должно быть корректным JSON-массивом строк" });
  }

  if (!topic || !statement || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: "Заполните тему, условие и минимум 2 варианта ответа" });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const problem = await prisma.problem.create({
    data: {
      topic,
      difficulty: parseInt(difficulty, 10) || 1,
      statement,
      options,
      correctIndex: parseInt(correctIndex, 10) || 0,
      imageUrl,
    },
  });

  res.json(problem);
});

router.put("/admin/:id", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { topic, difficulty, statement, correctIndex, isActive } = req.body;
  let options = req.body.options;

  const data = {};
  if (topic) data.topic = topic;
  if (difficulty) data.difficulty = parseInt(difficulty, 10);
  if (statement) data.statement = statement;
  if (correctIndex !== undefined) data.correctIndex = parseInt(correctIndex, 10);
  if (isActive !== undefined) data.isActive = isActive === "true" || isActive === true;
  if (options) {
    try {
      data.options = typeof options === "string" ? JSON.parse(options) : options;
    } catch {
      return res.status(400).json({ error: "Поле options должно быть корректным JSON-массивом" });
    }
  }
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

  const problem = await prisma.problem.update({ where: { id }, data });
  res.json(problem);
});

router.delete("/admin/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await prisma.problem.delete({ where: { id } });
  res.json({ ok: true });
});

module.exports = { router, pickRandomProblems };
