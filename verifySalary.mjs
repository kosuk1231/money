import { calculateSalary, generateAnnualReport } from './src/data/salaryData.js';

console.log("Starting Verification for Seoul Social Worker Salary 2026 (Updated)...\n");

const tests = [
    {
        name: "Case 1: 4th Grade, 5 Hobong, Spouse, 1 Child (Monthly Normal)",
        input: {
            grade: "4급",
            hobong: 5,
            options: { isManager: false, hasSpouse: true, numChildren: 1, numOthers: 0 }
        },
        expected: {
            baseSalary: 2529000,
            mealAllowance: 130000,
            familyAllowance: 90000, 
            monthlyTotal: 2749000,
            ordinaryWage: 2529000 + Math.floor(2529000 * 1.2 / 12) // Base + (Base*1.2/12)
        }
    },
    {
        name: "Case 2: 1st Grade, 10 Hobong (Deduction Rate Check 2026)",
        input: {
            grade: "1급",
            hobong: 10,
            options: { isManager: false, hasSpouse: false, numChildren: 0, numOthers: 0 }
        },
        expectedChecks: (result) => {
             // Pension 4.75%
             const taxable = result.monthlyTotal - result.mealAllowance; // 3964000 + 130000 - 130000 = 3964000
             const expPension = Math.floor(Math.min(taxable, 6170000) * 0.0475 / 10) * 10;
             if (result.deductions.nationalPension !== expPension) {
                 return `Pension mismatch: got ${result.deductions.nationalPension}, expected ${expPension}`;
             }
             // Health 3.595%
             const expHealth = Math.floor(taxable * 0.03595 / 10) * 10;
             if (result.deductions.healthInsurance !== expHealth) {
                 return `Health mismatch: got ${result.deductions.healthInsurance}, expected ${expHealth}`;
             }
             return null;
        }
    }
];

let passed = 0;

console.log("--- Monthly Calculation Tests ---");
tests.forEach((test, index) => {
    console.log(`[Test ${index + 1}] ${test.name}`);
    const result = calculateSalary(test.input.grade, test.input.hobong, test.input.options);

    let casePassed = true;
    if (test.expected) {
        Object.keys(test.expected).forEach(key => {
            if (result[key] !== test.expected[key]) {
                console.error(`  ❌ Mismatch on ${key}: Expected ${test.expected[key]}, Got ${result[key]}`);
                casePassed = false;
            }
        });
    }
    if (test.expectedChecks) {
        const error = test.expectedChecks(result);
        if (error) {
            console.error(`  ❌ ${error}`);
            casePassed = false;
        }
    }

    if (casePassed) {
        console.log("  ✅ Passed");
        passed++;
    }
    console.log("");
});

console.log("--- Annual Report Tests ---");
// Check Promotion Logic
// Grade 5, Hobong 1. Promotion in July (Month 7).
// Jan-Jun: Hobong 1 (2408000). Jul-Dec: Hobong 2 (2434000).
console.log("[Test Annual 1] Promotion Logic (July)");
const report = generateAnnualReport("5급", 1, 7, { isManager: false, hasSpouse: false, numChildren: 0 });
const janFn = report.months.find(m => m.month === 1);
const julFn = report.months.find(m => m.month === 7);

if (janFn.baseSalary === 2408000 && julFn.baseSalary === 2434000) {
    console.log("  ✅ Passed: Base Salary changes correctly in July.");
    passed++;
} else {
    console.error(`  ❌ Failed: Jan ${janFn.baseSalary}, Jul ${julFn.baseSalary}`);
}

// Check Holiday Bonus (Feb, Sep)
console.log("[Test Annual 2] Holiday Bonus (Feb, Sep)");
const febFn = report.months.find(m => m.month === 2);
const sepFn = report.months.find(m => m.month === 9);
const augFn = report.months.find(m => m.month === 8);

const expBonusFeb = Math.floor(janFn.baseSalary * 0.6); // Based on current month salary
const expBonusSep = Math.floor(julFn.baseSalary * 0.6); // Based on current month salary (Hobong 2)

if (febFn.holidayBonus === expBonusFeb && sepFn.holidayBonus === expBonusSep && augFn.holidayBonus === 0) {
    console.log("  ✅ Passed: Holiday bonuses exist in Feb/Sep and correct amount.");
    passed++;
} else {
    console.error(`  ❌ Failed: FebBonus ${febFn.holidayBonus} (Exp ${expBonusFeb}), SepBonus ${sepFn.holidayBonus} (Exp ${expBonusSep})`);
}

console.log(`\nVerification Complete: ${passed}/${tests.length + 2} passed.`);
