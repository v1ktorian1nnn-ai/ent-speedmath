// Утилита: смена пароля пользователя по email.
// Запуск: node prisma/set-password.js user@example.com новыйПароль123

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const [, , email, newPassword] = process.argv;

  if (!email || !newPassword) {
    console.error("Использование: node prisma/set-password.js email новыйПароль");
    process.exit(1);
  }
  if (newPassword.length < 6) {
    console.error("Пароль должен быть не короче 6 символов.");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Пользователь с email "${email}" не найден.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email }, data: { passwordHash } });

  console.log(`Пароль для ${email} успешно изменён.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
