// Второй пакет из 50 оригинальных задач (не пересекается с seed-full-bank.js).
// Ответы проверены вычислениями (sympy/Python) перед добавлением.
// Запуск: node prisma/seed-full-bank-2.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const problems = [
  // --- Алгебра ---
  { topic: "Алгебра", difficulty: 2, statement: "Решите уравнение: x² - 7x + 12 = 0. Найдите меньший корень.", options: ["2", "3", "4", "12"], correctIndex: 1 },
  { topic: "Алгебра", difficulty: 1, statement: "Упростите выражение: (x² - 9)/(x + 3), при x ≠ -3.", options: ["x - 3", "x + 3", "x²", "1"], correctIndex: 0 },
  { topic: "Алгебра", difficulty: 1, statement: "Решите уравнение: 3(x - 2) = 2x + 1.", options: ["5", "6", "7", "8"], correctIndex: 2 },
  { topic: "Алгебра", difficulty: 3, statement: "Решите неравенство x² - 9 > 0. Укажите верный ответ.", options: ["(-3;3)", "(-∞;-3)∪(3;+∞)", "(-∞;3)", "(3;+∞)"], correctIndex: 1 },
  { topic: "Алгебра", difficulty: 2, statement: "При каких x выражение √(x - 4) имеет смысл?", options: ["x > 0", "x ≥ 0", "x ≥ 4", "x > 4"], correctIndex: 2 },

  // --- Тригонометрия ---
  { topic: "Тригонометрия", difficulty: 1, statement: "Вычислите sin(90°).", options: ["0", "1/2", "√2/2", "1"], correctIndex: 3 },
  { topic: "Тригонометрия", difficulty: 2, statement: "Упростите выражение: tg(x) · ctg(x), где x не кратно π/2.", options: ["0", "1", "tg²(x)", "ctg²(x)"], correctIndex: 1 },
  { topic: "Тригонометрия", difficulty: 1, statement: "Вычислите cos(0°).", options: ["-1", "0", "1/2", "1"], correctIndex: 3 },
  { topic: "Тригонометрия", difficulty: 3, statement: "Сколько решений имеет уравнение cos(x) = 1 на промежутке [0; 2π)?", options: ["0", "1", "2", "3"], correctIndex: 1 },
  { topic: "Тригонометрия", difficulty: 1, statement: "Вычислите sin(π/2).", options: ["0", "1/2", "√3/2", "1"], correctIndex: 3 },

  // --- Логарифмы ---
  { topic: "Логарифмы", difficulty: 1, statement: "Вычислите log₅(25).", options: ["2", "3", "5", "10"], correctIndex: 0 },
  { topic: "Логарифмы", difficulty: 1, statement: "Решите уравнение: 5^x = 125.", options: ["2", "3", "4", "5"], correctIndex: 1 },
  { topic: "Логарифмы", difficulty: 1, statement: "Вычислите log₁₀(1000).", options: ["2", "3", "4", "30"], correctIndex: 1 },
  { topic: "Логарифмы", difficulty: 2, statement: "Вычислите ln(e²) (натуральный логарифм).", options: ["1", "2", "e", "e²"], correctIndex: 1 },
  { topic: "Логарифмы", difficulty: 2, statement: "Вычислите: log₂(4) + log₂(8).", options: ["5", "6", "8", "32"], correctIndex: 0 },

  // --- Производная ---
  { topic: "Производная", difficulty: 2, statement: "Функция f(x) = 4x² - 8x. Найдите f'(0).", options: ["-8", "-4", "0", "8"], correctIndex: 0 },
  { topic: "Производная", difficulty: 2, statement: "Найдите производную функции f(x) = ln(x), x > 0.", options: ["1/x", "x", "ln(x)", "1"], correctIndex: 0 },
  { topic: "Производная", difficulty: 2, statement: "Найдите производную функции f(x) = eˣ.", options: ["eˣ", "x·e^(x-1)", "1", "x"], correctIndex: 0 },
  { topic: "Производная", difficulty: 3, statement: "Найдите вторую производную функции f(x) = x⁴.", options: ["4x³", "12x²", "12x", "x³"], correctIndex: 1 },
  { topic: "Производная", difficulty: 2, statement: "Функция f(x) = -x² + 4x + 1. При каком x функция достигает максимума?", options: ["1", "2", "3", "4"], correctIndex: 1 },

  // --- Интеграл ---
  { topic: "Интеграл", difficulty: 1, statement: "Найдите первообразную для f(x) = 3x² (константу считайте равной 0).", options: ["x³", "3x³", "x²", "3x"], correctIndex: 0 },
  { topic: "Интеграл", difficulty: 1, statement: "Вычислите определённый интеграл: ∫ от 1 до 3 от 1 dx.", options: ["1", "2", "3", "4"], correctIndex: 1 },
  { topic: "Интеграл", difficulty: 2, statement: "Найдите первообразную для f(x) = eˣ (константу считайте равной 0).", options: ["eˣ", "x·eˣ", "eˣ/x", "1"], correctIndex: 0 },
  { topic: "Интеграл", difficulty: 3, statement: "Вычислите определённый интеграл: ∫ от 0 до π от sin(x) dx.", options: ["0", "1", "2", "4"], correctIndex: 2 },
  { topic: "Интеграл", difficulty: 2, statement: "Вычислите определённый интеграл: ∫ от 1 до 2 от 3x² dx.", options: ["6", "7", "8", "9"], correctIndex: 1 },

  // --- Планиметрия ---
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите площадь прямоугольника со сторонами 5 и 8.", options: ["13", "30", "40", "45"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите периметр квадрата со стороной 6.", options: ["12", "18", "24", "36"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите площадь ромба с диагоналями 6 и 8.", options: ["14", "24", "48", "20"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите радиус окружности, вписанной в квадрат со стороной 10.", options: ["2.5", "5", "10", "20"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите площадь трапеции с основаниями 6 и 10 и высотой 4.", options: ["16", "32", "64", "40"], correctIndex: 1 },

  // --- Стереометрия ---
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите объём прямоугольного параллелепипеда с рёбрами 2, 3 и 4.", options: ["9", "14", "24", "48"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите площадь боковой поверхности куба со стороной 3 (4 грани без верха и низа).", options: ["9", "18", "36", "54"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите объём конуса с радиусом основания 3 и высотой 4 (используйте π ≈ 3.14).", options: ["12.56", "37.68", "113.04", "28.26"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите площадь поверхности шара радиусом 2 (используйте π ≈ 3.14).", options: ["12.56", "25.12", "50.24", "33.49"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите объём цилиндра с диаметром основания 4 и высотой 10 (используйте π ≈ 3.14).", options: ["62.8", "125.6", "251.2", "40"], correctIndex: 1 },

  // --- Прогрессии ---
  { topic: "Прогрессии", difficulty: 1, statement: "Арифметическая прогрессия: a₁ = 5, d = -2. Найдите a₆.", options: ["-5", "-3", "3", "5"], correctIndex: 0 },
  { topic: "Прогрессии", difficulty: 1, statement: "Геометрическая прогрессия: b₁ = 2, q = 3. Найдите b₃.", options: ["6", "12", "18", "54"], correctIndex: 2 },
  { topic: "Прогрессии", difficulty: 2, statement: "Найдите сумму первых 5 членов арифметической прогрессии с a₁ = 3, d = 2.", options: ["25", "30", "35", "40"], correctIndex: 2 },
  { topic: "Прогрессии", difficulty: 2, statement: "Найдите сумму первых 4 членов геометрической прогрессии с b₁ = 1, q = 2.", options: ["8", "15", "16", "31"], correctIndex: 1 },
  { topic: "Прогрессии", difficulty: 2, statement: "В арифметической прогрессии a₁ = 10, a₄ = 1. Найдите разность d.", options: ["-3", "-2", "3", "9"], correctIndex: 0 },

  // --- Вероятность ---
  { topic: "Вероятность", difficulty: 3, statement: "В группе 12 человек. Сколькими способами можно выбрать старосту и заместителя (порядок важен)?", options: ["66", "120", "132", "144"], correctIndex: 2 },
  { topic: "Вероятность", difficulty: 2, statement: "Из колоды в 36 карт вытаскивают одну. Найдите вероятность, что это туз (в колоде 4 туза).", options: ["1/36", "1/9", "1/6", "1/4"], correctIndex: 1 },
  { topic: "Вероятность", difficulty: 2, statement: "Бросают две монеты. Найдите вероятность, что выпадут два орла.", options: ["1/8", "1/4", "1/2", "3/4"], correctIndex: 1 },
  { topic: "Вероятность", difficulty: 2, statement: "Сколько трёхзначных чисел без повторения цифр можно составить из цифр 1, 2, 3?", options: ["3", "6", "9", "27"], correctIndex: 1 },
  { topic: "Вероятность", difficulty: 1, statement: "В урне 4 белых и 6 чёрных шаров. Найдите вероятность вытащить чёрный шар.", options: ["0.4", "0.5", "0.6", "0.7"], correctIndex: 2 },

  // --- Текстовые задачи ---
  { topic: "Текстовые задачи", difficulty: 1, statement: "Велосипедист проехал 60 км за 4 часа. Найдите его скорость.", options: ["12 км/ч", "15 км/ч", "20 км/ч", "24 км/ч"], correctIndex: 1 },
  { topic: "Текстовые задачи", difficulty: 1, statement: "Товар стоил 500 тенге и подешевел на 10%. Найдите новую цену.", options: ["400", "450", "480", "490"], correctIndex: 1 },
  { topic: "Текстовые задачи", difficulty: 3, statement: "Один рабочий выполняет работу за 6 часов, а вместе с напарником — за 2 часа. За сколько часов справится напарник, работая один?", options: ["2", "3", "4", "6"], correctIndex: 1 },
  { topic: "Текстовые задачи", difficulty: 1, statement: "В магазине было 80 кг яблок, продали 35%. Сколько килограммов осталось?", options: ["45", "48", "52", "56"], correctIndex: 2 },
  { topic: "Текстовые задачи", difficulty: 2, statement: "Два числа относятся как 2:3, их сумма равна 40. Найдите большее число.", options: ["16", "20", "24", "30"], correctIndex: 2 },
];

async function main() {
  let added = 0;
  for (const p of problems) {
    const exists = await prisma.problem.findFirst({ where: { statement: p.statement } });
    if (!exists) {
      await prisma.problem.create({ data: p });
      added++;
    }
  }
  console.log(`Готово. Добавлено новых задач: ${added} из ${problems.length}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
