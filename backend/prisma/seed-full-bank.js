// Массовая загрузка проверенного набора задач (50 шт, 10 тем ЕНТ).
// Это ОРИГИНАЛЬНЫЕ задачи в формате/духе профильной математики ЕНТ,
// а не воспроизведение реальных прошлых заданий (у них может быть
// авторское право у Национального центра тестирования РК) — все ответы
// вычислены и перепроверены (см. чат) перед добавлением сюда.
//
// Запуск: node prisma/seed-full-bank.js
// Скрипт ДОБАВЛЯЕТ задачи (не трогает существующие) — можно запускать
// один раз после обычного npm run seed, либо вместо него.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const problems = [
  // --- Алгебра ---
  { topic: "Алгебра", difficulty: 2, statement: "Решите уравнение: 2x² - 5x - 3 = 0. Найдите больший корень.", options: ["-0.5", "1", "3", "4"], correctIndex: 2 },
  { topic: "Алгебра", difficulty: 3, statement: "Решите неравенство: x² - 4x + 3 ≤ 0. Укажите верный промежуток.", options: ["(-∞;1]", "[1;3]", "[3;+∞)", "(-∞;+∞)"], correctIndex: 1 },
  { topic: "Алгебра", difficulty: 1, statement: "Упростите выражение: (a² - b²)/(a - b), при a ≠ b.", options: ["a + b", "a - b", "a² + b²", "1"], correctIndex: 0 },
  { topic: "Алгебра", difficulty: 2, statement: "Решите уравнение |2x - 6| = 8. Найдите сумму всех корней.", options: ["-6", "-1", "6", "7"], correctIndex: 2 },
  { topic: "Алгебра", difficulty: 2, statement: "Числа x и y таковы, что x + y = 7, xy = 12. Найдите большее из чисел.", options: ["3", "4", "5", "7"], correctIndex: 1 },

  // --- Тригонометрия ---
  { topic: "Тригонометрия", difficulty: 1, statement: "Вычислите cos(60°).", options: ["0", "1/2", "√3/2", "1"], correctIndex: 1 },
  { topic: "Тригонометрия", difficulty: 1, statement: "Упростите выражение: sin²(x) + cos²(x).", options: ["0", "1", "sin(2x)", "2"], correctIndex: 1 },
  { topic: "Тригонометрия", difficulty: 3, statement: "Сколько решений имеет уравнение sin(x) = 0 на промежутке [0; 2π)?", options: ["1", "2", "3", "4"], correctIndex: 1 },
  { topic: "Тригонометрия", difficulty: 1, statement: "Найдите tg(45°).", options: ["0", "1", "√3", "√3/3"], correctIndex: 1 },
  { topic: "Тригонометрия", difficulty: 3, statement: "Упростите выражение: (1 - cos(2x)) / 2.", options: ["cos²(x)", "sin²(x)", "tg²(x)", "1"], correctIndex: 1 },

  // --- Логарифмы и показательная функция ---
  { topic: "Логарифмы", difficulty: 1, statement: "Вычислите log₃(81).", options: ["3", "4", "5", "9"], correctIndex: 1 },
  { topic: "Логарифмы", difficulty: 1, statement: "Решите уравнение: 2^x = 32.", options: ["4", "5", "6", "16"], correctIndex: 1 },
  { topic: "Логарифмы", difficulty: 2, statement: "Вычислите log₂(1/8).", options: ["-3", "-2", "2", "3"], correctIndex: 0 },
  { topic: "Логарифмы", difficulty: 3, statement: "Решите уравнение: log₂(x) + log₂(x - 2) = 3 (x > 2).", options: ["2", "4", "6", "8"], correctIndex: 1 },
  { topic: "Логарифмы", difficulty: 2, statement: "Вычислите: 3⁰ + 3⁻¹.", options: ["1", "4/3", "3", "1/3"], correctIndex: 1 },

  // --- Производная ---
  { topic: "Производная", difficulty: 2, statement: "Функция f(x) = x² - 6x + 5. При каком x производная f'(x) равна нулю?", options: ["2", "3", "4", "6"], correctIndex: 1 },
  { topic: "Производная", difficulty: 1, statement: "Найдите производную функции f(x) = 5x³.", options: ["15x²", "5x²", "15x", "3x²"], correctIndex: 0 },
  { topic: "Производная", difficulty: 2, statement: "Найдите производную функции f(x) = sin(x) + cos(x).", options: ["cos(x) - sin(x)", "-sin(x) - cos(x)", "cos(x) + sin(x)", "sin(x) - cos(x)"], correctIndex: 0 },
  { topic: "Производная", difficulty: 3, statement: "Сколько критических точек (f'(x) = 0) у функции f(x) = x³ - 3x?", options: ["0", "1", "2", "3"], correctIndex: 2 },
  { topic: "Производная", difficulty: 3, statement: "Уравнение касательной к графику f(x) = x² в точке x = 1 имеет вид y = kx + b. Чему равно k?", options: ["0", "1", "2", "4"], correctIndex: 2 },

  // --- Первообразная и интеграл ---
  { topic: "Интеграл", difficulty: 2, statement: "Найдите первообразную F(x) для f(x) = 2x (константу считайте равной 0).", options: ["x", "x²", "2x²", "x²/2"], correctIndex: 1 },
  { topic: "Интеграл", difficulty: 2, statement: "Вычислите определённый интеграл: ∫ от 0 до 1 от 2x dx.", options: ["0", "1", "2", "4"], correctIndex: 1 },
  { topic: "Интеграл", difficulty: 2, statement: "Найдите первообразную для f(x) = cos(x) (константу считайте равной 0).", options: ["sin(x)", "-sin(x)", "cos(x)", "-cos(x)"], correctIndex: 0 },
  { topic: "Интеграл", difficulty: 3, statement: "Вычислите определённый интеграл: ∫ от 0 до 2 от x² dx.", options: ["8/3", "4/3", "2", "8"], correctIndex: 0 },
  { topic: "Интеграл", difficulty: 3, statement: "Найдите первообразную для f(x) = 1/x, x > 0 (константу считайте равной 0).", options: ["ln(x)", "1/x²", "x·ln(x)", "e^x"], correctIndex: 0 },

  // --- Планиметрия ---
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите площадь треугольника с основанием 10 и высотой 6.", options: ["16", "30", "60", "50"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите диагональ квадрата со стороной 4.", options: ["4", "4√2", "8", "2√2"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 1, statement: "Чему равна сумма углов треугольника?", options: ["90°", "180°", "270°", "360°"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите площадь круга радиусом 3 (используйте π ≈ 3.14).", options: ["18.84", "28.26", "9.42", "6.28"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 1, statement: "В прямоугольном треугольнике катеты равны 3 и 4. Найдите гипотенузу.", options: ["5", "6", "7", "25"], correctIndex: 0 },

  // --- Стереометрия ---
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите объём куба со стороной 3.", options: ["9", "18", "27", "81"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите площадь полной поверхности куба со стороной 2.", options: ["8", "16", "24", "48"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите объём цилиндра с радиусом основания 2 и высотой 5 (используйте π ≈ 3.14).", options: ["31.4", "62.8", "125.6", "20"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите объём шара радиусом 3 (используйте π ≈ 3.14).", options: ["113.04", "37.68", "28.26", "84.78"], correctIndex: 0 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите диагональ прямоугольного параллелепипеда с рёбрами 3, 4 и 12.", options: ["12", "13", "14", "19"], correctIndex: 1 },

  // --- Прогрессии ---
  { topic: "Прогрессии", difficulty: 1, statement: "Арифметическая прогрессия: a₁ = 2, d = 3. Найдите a₅.", options: ["11", "14", "17", "20"], correctIndex: 1 },
  { topic: "Прогрессии", difficulty: 1, statement: "Геометрическая прогрессия: b₁ = 3, q = 2. Найдите b₄.", options: ["12", "24", "48", "6"], correctIndex: 1 },
  { topic: "Прогрессии", difficulty: 2, statement: "Найдите сумму первых 10 членов арифметической прогрессии с a₁ = 1, d = 1.", options: ["45", "50", "55", "60"], correctIndex: 2 },
  { topic: "Прогрессии", difficulty: 3, statement: "Найдите сумму бесконечной геометрической прогрессии с b₁ = 4, q = 1/2.", options: ["4", "6", "8", "16"], correctIndex: 2 },
  { topic: "Прогрессии", difficulty: 2, statement: "В арифметической прогрессии a₃ = 7, a₇ = 19. Найдите разность d.", options: ["2", "3", "4", "6"], correctIndex: 1 },

  // --- Комбинаторика и вероятность ---
  { topic: "Вероятность", difficulty: 2, statement: "Сколькими способами можно выбрать 2 предмета из 5 различных?", options: ["10", "20", "5", "25"], correctIndex: 0 },
  { topic: "Вероятность", difficulty: 1, statement: "Монету подбросили один раз. Найдите вероятность выпадения орла.", options: ["0.25", "0.5", "0.75", "1"], correctIndex: 1 },
  { topic: "Вероятность", difficulty: 2, statement: "В коробке 3 красных и 2 синих шара. Найдите вероятность вытащить красный шар.", options: ["0.4", "0.5", "0.6", "0.8"], correctIndex: 2 },
  { topic: "Вероятность", difficulty: 2, statement: "Сколько перестановок можно составить из 4 различных элементов?", options: ["12", "16", "24", "64"], correctIndex: 2 },
  { topic: "Вероятность", difficulty: 2, statement: "Бросают игральный кубик. Найдите вероятность выпадения числа больше 4.", options: ["1/6", "1/3", "1/2", "2/3"], correctIndex: 1 },

  // --- Текстовые задачи ---
  { topic: "Текстовые задачи", difficulty: 1, statement: "Скорость поезда 80 км/ч. За сколько часов он пройдёт 240 км?", options: ["2", "3", "4", "5"], correctIndex: 1 },
  { topic: "Текстовые задачи", difficulty: 2, statement: "Цена товара выросла на 20% и стала равна 240 тенге. Какой была первоначальная цена?", options: ["180", "192", "200", "220"], correctIndex: 2 },
  { topic: "Текстовые задачи", difficulty: 3, statement: "Первая труба наполняет бассейн за 6 часов, вторая — за 3 часа. За сколько часов бассейн наполнят обе трубы вместе?", options: ["1", "2", "3", "4"], correctIndex: 1 },
  { topic: "Текстовые задачи", difficulty: 1, statement: "В классе 30 учеников, 40% из них — мальчики. Сколько в классе девочек?", options: ["12", "15", "18", "20"], correctIndex: 2 },
  { topic: "Текстовые задачи", difficulty: 1, statement: "Сумма двух чисел равна 15, а их разность равна 5. Найдите большее число.", options: ["5", "7", "10", "12"], correctIndex: 2 },
];

async function main() {
  let added = 0;
  for (const p of problems) {
    // Простая защита от повторной загрузки при повторном запуске скрипта
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
