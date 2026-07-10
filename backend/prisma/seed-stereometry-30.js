// 30 новых задач по стереометрии (сложность 1-4). Не пересекается
// с предыдущими пакетами. Ответы проверены вычислениями (sympy/Python).
// Запуск: node prisma/seed-stereometry-30.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const problems = [
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите объём куба со стороной 4.", options: ["16", "48", "64", "96"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите площадь полной поверхности прямоугольного параллелепипеда с рёбрами 2, 3 и 4.", options: ["26", "44", "52", "104"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите объём прямоугольного параллелепипеда с рёбрами 5, 4 и 3.", options: ["12", "47", "60", "120"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите диагональ куба со стороной 3.", options: ["3", "3√2", "3√3", "9"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите площадь полной поверхности куба со стороной 5.", options: ["25", "100", "125", "150"], correctIndex: 3 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите объём цилиндра с радиусом основания 3 и высотой 6 (используйте π ≈ 3.14).", options: ["56.52", "84.78", "169.56", "339.12"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите площадь боковой поверхности цилиндра с радиусом 2 и высотой 5 (используйте π ≈ 3.14).", options: ["31.4", "62.8", "125.6", "20"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите объём конуса с радиусом основания 6 и высотой 2 (используйте π ≈ 3.14).", options: ["37.68", "75.36", "150.72", "226.08"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите площадь основания конуса радиусом 4 (используйте π ≈ 3.14).", options: ["12.56", "25.12", "50.24", "100.48"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите объём шара радиусом 2 (используйте π ≈ 3.14).", options: ["16.75", "25.12", "33.49", "50.24"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите диагональ прямоугольного параллелепипеда с рёбрами 2, 3 и 6.", options: ["6", "7", "8", "9"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите объём прямоугольной призмы со стороной основания 4 и высотой 10 (основание — квадрат).", options: ["40", "80", "160", "640"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите площадь полной поверхности цилиндра с радиусом 3 и высотой 4 (используйте π ≈ 3.14).", options: ["65.94", "131.88", "263.76", "37.68"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите объём цилиндра с диаметром основания 6 и высотой 5 (используйте π ≈ 3.14).", options: ["70.65", "141.3", "282.6", "47.1"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите площадь поверхности шара радиусом 5 (используйте π ≈ 3.14).", options: ["78.5", "157", "314", "392.5"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите объём шара радиусом 1 (используйте π ≈ 3.14).", options: ["3.14", "4.19", "6.28", "12.56"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Объём куба равен 27. Найдите длину его ребра.", options: ["2", "3", "4", "9"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Площадь полной поверхности куба равна 96. Найдите длину его ребра.", options: ["3", "4", "5", "16"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 3, statement: "Радиус основания цилиндра равен 2, его объём равен 25.12. Найдите высоту цилиндра (используйте π ≈ 3.14).", options: ["1", "2", "3", "4"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите объём прямой призмы с площадью основания 12 и высотой 5.", options: ["17", "30", "60", "120"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 2, statement: "Найдите площадь боковой поверхности конуса с радиусом 3 и образующей 5 (используйте π ≈ 3.14).", options: ["23.55", "47.1", "94.2", "141.3"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Радиус основания конуса равен 3, высота равна 4. Найдите длину образующей.", options: ["4", "5", "6", "7"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 3, statement: "Диагональ куба равна 3√3. Найдите объём куба.", options: ["9", "18", "27", "81"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 4, statement: "Найдите площадь диагонального сечения куба со стороной 4.", options: ["16", "16√2", "32", "32√2"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Во сколько раз увеличится объём куба, если его ребро увеличить в 2 раза?", options: ["2", "4", "6", "8"], correctIndex: 3 },
  { topic: "Стереометрия", difficulty: 3, statement: "Найдите объём правильной четырёхугольной пирамиды со стороной основания 6 и высотой 4.", options: ["24", "36", "48", "72"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 1, statement: "Найдите площадь основания правильной четырёхугольной пирамиды со стороной 5.", options: ["10", "20", "25", "50"], correctIndex: 2 },
  { topic: "Стереометрия", difficulty: 3, statement: "Площадь основания цилиндра равна 12.56, его высота равна 5. Найдите объём (используйте π ≈ 3.14).", options: ["31.4", "62.8", "125.6", "20"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 2, statement: "Диагональ грани куба равна 4√2. Найдите длину ребра куба.", options: ["2", "4", "4√2", "8"], correctIndex: 1 },
  { topic: "Стереометрия", difficulty: 3, statement: "Во сколько раз объём шара радиусом 4 больше объёма шара радиусом 2?", options: ["2", "4", "6", "8"], correctIndex: 3 },
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
