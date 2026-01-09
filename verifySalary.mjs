import { calculateSalary } from './src/data/salaryData.js';

console.log("Starting Verification for Seoul Social Worker Salary 2025...\n");

const tests = [
    {
        name: "Case 1: 4th Grade, 5 Hobong, Spouse, 1 Child",
        input: {
            grade: "4급",
            hobong: 5,
            options: { isManager: false, hasSpouse: true, numChildren: 1, numOthers: 0 }
        },
        expected: {
            baseSalary: 2529000, // From Image 2-1
            mealAllowance: 130000,
            familyAllowance: 90000, // Spouse 40k + Child 50k
            monthlyTotal: 2749000
        }
    },
    {
        name: "Case 2: 1st Grade, 10 Hobong, Single",
        input: {
            grade: "1급",
            hobong: 10,
            options: { isManager: false, hasSpouse: false, numChildren: 0, numOthers: 0 }
        },
        expected: {
            baseSalary: 3964000,
            welfarePoints: 400000, // >= 10 Hobong
            monthlyTotal: 4094000 // Base + Meal(130k)
        }
    },
    {
        name: "Case 3: 5th Grade, 1 Hobong (New Entrant)",
        input: {
            grade: "5급",
            hobong: 1,
            options: { isManager: false, hasSpouse: false, numChildren: 0, numOthers: 0 }
        },
        expected: {
            baseSalary: 2408000,
            welfarePoints: 300000, // < 10 Hobong
            monthlyTotal: 2538000 // Base + Meal(130k)
        }
    }
];

let passed = 0;

tests.forEach((test, index) => {
    console.log(`[Test ${index + 1}] ${test.name}`);
    const result = calculateSalary(test.input.grade, test.input.hobong, test.input.options);

    let casePassed = true;
    Object.keys(test.expected).forEach(key => {
        if (result[key] !== test.expected[key]) {
            console.error(`  ❌ Mismatch on ${key}: Expected ${test.expected[key]}, Got ${result[key]}`);
            casePassed = false;
        }
    });

    if (casePassed) {
        console.log("  ✅ Passed");
        passed++;
    }
    console.log("");
});

console.log(`Verification Complete: ${passed}/${tests.length} passed.`);
