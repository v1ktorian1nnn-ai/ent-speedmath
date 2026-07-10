// 30 новых задач по планиметрии (сложность 1-4, без задач максимальной
// сложности 5 по просьбе). Не пересекается с предыдущими пакетами.
// Ответы проверены вычислениями (sympy/Python).
// Запуск: node prisma/seed-planimetry-30.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const problems = [
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите площадь треугольника с основанием 8 и высотой 5.", options: ["13", "20", "26", "40"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите площадь квадрата со стороной 7.", options: ["14", "28", "49", "56"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите периметр прямоугольника со сторонами 4 и 9.", options: ["13", "22", "26", "36"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 2, statement: "В прямоугольном треугольнике катеты равны 6 и 8. Найдите гипотенузу.", options: ["10", "12", "14", "48"], correctIndex: 0 },
  { topic: "Планиметрия", difficulty: 2, statement: "В прямоугольном треугольнике гипотенуза равна 13, один катет равен 5. Найдите второй катет.", options: ["8", "10", "12", "14"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите площадь прямоугольного треугольника с катетами 5 и 12.", options: ["25", "30", "32", "60"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 1, statement: "Чему равна сумма углов четырёхугольника?", options: ["180°", "270°", "360°", "540°"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите площадь параллелограмма со стороной 6 и высотой к этой стороне 4.", options: ["10", "20", "24", "48"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 3, statement: "Найдите площадь равностороннего треугольника со стороной 4.", options: ["2√3", "4√3", "8√3", "16√3"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите диагональ прямоугольника со сторонами 6 и 8.", options: ["9", "10", "11", "14"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Гипотенуза прямоугольного треугольника равна 10. Найдите радиус описанной около него окружности.", options: ["2.5", "5", "10", "20"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите длину окружности радиусом 5 (используйте π ≈ 3.14).", options: ["15.7", "31.4", "62.8", "78.5"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 3, statement: "Найдите площадь сектора круга радиусом 6 с центральным углом 60° (используйте π ≈ 3.14).", options: ["9.42", "18.84", "37.68", "113.04"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 3, statement: "Найдите длину дуги окружности радиусом 4 с центральным углом 90° (используйте π ≈ 3.14).", options: ["3.14", "6.28", "12.56", "25.12"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите среднюю линию трапеции с основаниями 5 и 11.", options: ["6", "7", "8", "16"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите площадь треугольника со сторонами 3, 4 и 5.", options: ["5", "6", "7", "12"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 3, statement: "Площадь квадрата равна 8. Найдите его диагональ.", options: ["2", "4", "8", "4√2"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Найдите площадь круга, вписанного в квадрат со стороной 8 (используйте π ≈ 3.14).", options: ["25.12", "50.24", "78.5", "100.48"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 2, statement: "Углы треугольника относятся как 1:2:3. Найдите наибольший угол.", options: ["60°", "90°", "108°", "120°"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 3, statement: "Основание равнобедренного треугольника равно 6, высота к основанию равна 4. Найдите боковую сторону.", options: ["4", "5", "6", "7"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 1, statement: "В треугольнике угол A = 50°, угол B = 70°. Найдите угол C.", options: ["50°", "55°", "60°", "70°"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 3, statement: "Катеты прямоугольного треугольника равны 3 и 4. Найдите радиус вписанной окружности.", options: ["0.5", "1", "1.5", "2"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 4, statement: "Квадрат вписан в окружность радиусом 5. Найдите площадь квадрата.", options: ["25", "50", "75", "100"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 4, statement: "Равнобедренная трапеция имеет основания 4 и 10 и боковую сторону 5. Найдите её площадь.", options: ["24", "28", "32", "36"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 3, statement: "Хорда окружности радиусом 5 стягивает центральный угол 60°. Найдите длину хорды.", options: ["3", "4", "5", "6"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 2, statement: "В прямоугольном треугольнике катет равен 9, гипотенуза равна 15. Найдите площадь треугольника.", options: ["45", "54", "60", "108"], correctIndex: 1 },
  { topic: "Планиметрия", difficulty: 3, statement: "Площадь равностороннего треугольника равна 9√3. Найдите его периметр.", options: ["12", "15", "18", "24"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 3, statement: "Диагонали ромба равны 10 и 24. Найдите сторону ромба.", options: ["11", "12", "13", "14"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 1, statement: "Найдите площадь ромба со стороной 10 и высотой 6.", options: ["16", "30", "60", "600"], correctIndex: 2 },
  { topic: "Планиметрия", difficulty: 3, statement: "Найдите площадь сектора круга радиусом 3 с центральным углом 120° (используйте π ≈ 3.14).", options: ["4.71", "9.42", "18.84", "28.26"], correctIndex: 1 },
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
