const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const sampleProblems = [
  {
    topic: "Алгебра",
    difficulty: 1,
    statement: "Решите уравнение: 3x + 7 = 22. Чему равен x?",
    options: ["3", "5", "7", "9"],
    correctIndex: 1,
  },
  {
    topic: "Тригонометрия",
    difficulty: 2,
    statement: "Чему равен sin(30°)?",
    options: ["0", "1/2", "√2/2", "1"],
    correctIndex: 1,
  },
  {
    topic: "Производная",
    difficulty: 2,
    statement: "Найдите производную функции f(x) = x^3 - 4x.",
    options: ["3x^2 - 4", "x^2 - 4x", "3x^2 - 4x", "3x - 4"],
    correctIndex: 0,
  },
  {
    topic: "Геометрия",
    difficulty: 3,
    statement: "Площадь круга радиусом 4. Используйте π ≈ 3.14. Выберите ближайший ответ.",
    options: ["12.56", "25.12", "50.24", "16"],
    correctIndex: 2,
  },
  {
    topic: "Логарифмы",
    difficulty: 3,
    statement: "Чему равен log2(32)?",
    options: ["4", "5", "6", "16"],
    correctIndex: 1,
  },
];

async function main() {
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin12345", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: "admin",
        passwordHash,
        isAdmin: true,
      },
    });
    console.log("Создан админ:", adminEmail, "/ пароль: admin12345 (смени после первого входа!)");
  }

  const count = await prisma.problem.count();
  if (count === 0) {
    await prisma.problem.createMany({ data: sampleProblems });
    console.log(`Добавлено ${sampleProblems.length} тестовых задач.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
