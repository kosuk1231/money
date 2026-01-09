import { calculateSalary, generateAnnualReport } from './src/data/salaryData.js';

console.log("Starting Verification for Seoul Social Worker Salary 2026 (Phase 3 Update)...\n");

const tests = [
    {
        name: "Case 1: Monthly Normal",
        input: {
            grade: "4급",
            hobong: 5,
            options: { isManager: false, hasSpouse: true, numChildren: 1, numOthers: 0 }
        },
        expected: {
            baseSalary: 2529000,
            monthlyTotal: 2749000,
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

console.log("--- Annual Report (District Logic) Tests ---");

// Test 1: District Point (Jun/Dec)
console.log("[Test Annual 4] District Type: Point (Jun/Dec only)");
const pointReport = generateAnnualReport("5급", 1, null, { 
    additionalAllowances: { district: { type: 'point', amount: 500000, frequency: 'monthly' } } // Freq shouldn't matter for Point
});
const junP = pointReport.months.find(m => m.month === 6);
const decP = pointReport.months.find(m => m.month === 12);
const mayP = pointReport.months.find(m => m.month === 5);

if (junP.districtAllowance === 500000 && decP.districtAllowance === 500000 && mayP.districtAllowance === 0) {
     console.log("  ✅ Passed: Point applies only to Jun/Dec.");
     passed++;
} else {
     console.error(`  ❌ Failed: Jun ${junP.districtAllowance}, May ${mayP.districtAllowance}`);
}

// Test 2: District Allowance (Monthly)
console.log("[Test Annual 5] District Type: Allowance (Monthly)");
const monthlyReport = generateAnnualReport("5급", 1, null, { 
    additionalAllowances: { district: { type: 'allowance', amount: 100000, frequency: 'monthly' } }
});
const janM = monthlyReport.months.find(m => m.month === 1);
if (janM.districtAllowance === 100000) {
    console.log("  ✅ Passed: Allowance (Monthly) applies to every month.");
    passed++;
} else {
    console.error(`  ❌ Failed: Jan ${janM.districtAllowance}`);
}

// Test 3: District Allowance (Yearly)
console.log("[Test Annual 6] District Type: Allowance (Yearly)");
const yearlyReport = generateAnnualReport("5급", 1, null, { 
    additionalAllowances: { district: { type: 'allowance', amount: 1200000, frequency: 'yearly' } }
});
const janY = yearlyReport.months.find(m => m.month === 1);
if (janY.districtAllowance === 100000) { // 1.2m / 12 = 100k
    console.log("  ✅ Passed: Allowance (Yearly) is prorated.");
    passed++;
} else {
    console.error(`  ❌ Failed: Jan ${janY.districtAllowance} (Expected 100000)`);
}

console.log(`\nVerification Complete: ${passed}/${tests.length + 3} passed.`);
