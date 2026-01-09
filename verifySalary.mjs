import { calculateSalary, generateAnnualReport } from './src/data/salaryData.js';

console.log("Starting Verification for Seoul Social Worker Salary 2026 (Phase 2 Update)...\n");

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

    if (casePassed) {
        console.log("  ✅ Passed");
        passed++;
    }
    console.log("");
});

console.log("--- Annual Report Tests ---");
console.log("[Test Annual 3] District Allowance Logic (June, Dec)");
const districtAmount = 500000;
const report = generateAnnualReport("5급", 1, null, { 
    isManager: false, 
    hasSpouse: false, 
    numChildren: 0,
    additionalAllowances: { district: districtAmount }
});

const junFn = report.months.find(m => m.month === 6);
const decFn = report.months.find(m => m.month === 12);
const mayFn = report.months.find(m => m.month === 5);

// Check June
if (junFn.districtAllowance === districtAmount && decFn.districtAllowance === districtAmount && mayFn.districtAllowance === 0) {
     console.log("  ✅ Passed: District allowance only in June/Dec.");
     passed++;
} else {
     console.error(`  ❌ Failed: Jun ${junFn.districtAllowance}, Dec ${decFn.districtAllowance}, May ${mayFn.districtAllowance}`);
}

// Check Total Sum includes this
// Monthly Total in June should be Base + Meal + District
const expectedJunTotal = junFn.baseSalary + junFn.mealAllowance + districtAmount; 
if (junFn.monthlyTotal === expectedJunTotal) {
    console.log("  ✅ Passed: Monthly Total in June includes District Allowance.");
    passed++;
} else {
    console.error(`  ❌ Failed: Jun Total ${junFn.monthlyTotal} (Exp ${expectedJunTotal})`);
}


console.log(`\nVerification Complete: ${passed}/${tests.length + 2} passed.`);
