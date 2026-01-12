export const SALARY_TABLE = {
  // 1급: 관장, 원장 (10인 이상 15년 이상, 10인 미만 25년 이상)
  // 2026년 기준: 16호봉부터 적용
  "1급": {
    16: 4912000, 17: 4969000, 18: 5022000, 19: 5096000, 20: 5173000,
    21: 5271000, 22: 5336000, 23: 5395000, 24: 5451000, 25: 5506000,
    26: 5577000, 27: 5622000, 28: 5661000, 29: 5729000, 30: 5788000,
  },
  // 2급: 관장, 원장 (10인 이상 11~15년, 10인 미만 15~25년) / 부장 (10인 이상 15년~)
  "2급": {
    1: 3169000, 2: 3239000, 3: 3312000, 4: 3390000, 5: 3470000,
    6: 3561000, 7: 3663000, 8: 3763000, 9: 3863000, 10: 3963000,
    11: 4063000, 12: 4124000, 13: 4177000, 14: 4263000, 15: 4363000,
    16: 4524000, 17: 4602000, 18: 4642000, 19: 4738000, 20: 4802000,
    21: 4862000, 22: 4921000, 23: 4985000, 24: 5046000, 25: 5107000,
    26: 5170000, 27: 5233000, 28: 5296000, 29: 5365000, 30: 5424000,
    31: 5484000
  },
  // 3급: 관장, 원장 (10인 미만 15년 미만) / 부장, 사무국장 (15년 미만) / 과장
  "3급": {
    1: 2703000, 2: 2784000, 3: 2872000, 4: 2969000, 5: 3068000,
    6: 3167000, 7: 3266000, 8: 3365000, 9: 3475000, 10: 3575000,
    11: 3675000, 12: 3730000, 13: 3785000, 14: 3850000, 15: 3915000,
    16: 4005000, 17: 4073000, 18: 4147000, 19: 4212000, 20: 4278000,
    21: 4339000, 22: 4399000, 23: 4454000, 24: 4513000, 25: 4568000,
    26: 4623000, 27: 4681000, 28: 4744000, 29: 4807000, 30: 4867000,
    31: 4917000
  },
  // 4급: 대리 / 선임생활지도원
  "4급": {
    1: 2550000, 2: 2577000, 3: 2604000, 4: 2631000, 5: 2712000,
    6: 2812000, 7: 2912000, 8: 3004000, 9: 3102000, 10: 3202000,
    11: 3298000, 12: 3359000, 13: 3426000, 14: 3494000, 15: 3566000,
    16: 3637000, 17: 3708000, 18: 3776000, 19: 3841000, 20: 3902000,
    21: 3966000, 22: 4025000, 23: 4077000, 24: 4122000, 25: 4176000,
    26: 4223000, 27: 4270000, 28: 4317000, 29: 4364000, 30: 4411000,
    31: 4461000
  },
  // 5급: 사회복지사, 간호사 등
  "5급": {
    1: 2518000, 2: 2545000, 3: 2572000, 4: 2597000, 5: 2618000,
    6: 2638000, 7: 2659000, 8: 2743000, 9: 2842000, 10: 2929000,
    11: 3008000, 12: 3069000, 13: 3148000, 14: 3228000, 15: 3281000,
    16: 3351000, 17: 3401000, 18: 3472000, 19: 3530000, 20: 3590000,
    21: 3644000, 22: 3698000, 23: 3776000, 24: 3841000, 25: 3895000,
    26: 3935000, 27: 3979000, 28: 4023000, 29: 4063000, 30: 4113000,
    31: 4178000
  },
  // 관리직: 간호조무사, 사무원 등
  "관리직": {
    1: 2492000, 2: 2519000, 3: 2546000, 4: 2571000, 5: 2593000,
    6: 2616000, 7: 2643000, 8: 2664000, 9: 2684000, 10: 2844000,
    11: 2941000, 12: 2996000, 13: 3053000, 14: 3104000, 15: 3162000,
    16: 3218000, 17: 3265000, 18: 3330000, 19: 3388000, 20: 3448000,
    21: 3527000, 22: 3585000, 23: 3639000, 24: 3701000, 25: 3740000,
    26: 3789000, 27: 3839000, 28: 3898000, 29: 3960000, 30: 4018000,
    31: 4078000
  },
  // 기능직: 생활보조원, 조리원, 관리인 등
  "기능직": {
    1: 2466000, 2: 2493000, 3: 2520000, 4: 2545000, 5: 2567000,
    6: 2591000, 7: 2618000, 8: 2640000, 9: 2661000, 10: 2705000,
    11: 2780000, 12: 2847000, 13: 2893000, 14: 2959000, 15: 3010000,
    16: 3081000, 17: 3150000, 18: 3218000, 19: 3272000, 20: 3336000,
    21: 3410000, 22: 3471000, 23: 3530000, 24: 3574000, 25: 3629000,
    26: 3729000, 27: 3789000, 28: 3849000, 29: 3909000, 30: 3969000,
    31: 3969000
  }
};

// 2025 Salary Table for YoY Comparison
export const SALARY_TABLE_2025 = {
  // 1급: 16호봉부터 적용
  "1급": {
    16: 4746000, 17: 4801000, 18: 4852000, 19: 4924000, 20: 4998000,
    21: 5093000, 22: 5156000, 23: 5213000, 24: 5267000, 25: 5320000,
    26: 5388000, 27: 5432000, 28: 5470000, 29: 5535000, 30: 5592000,
  },
  "2급": {
    1: 3091000, 2: 3158000, 3: 3229000, 4: 3314000, 5: 3391000,
    6: 3558000, 7: 3650000, 8: 3750000, 9: 3857000, 10: 3964000,
    11: 4060000, 12: 4124000, 13: 4177000, 14: 4236000, 15: 4295000,
    16: 4351000, 17: 4404000, 18: 4466000, 19: 4520000, 20: 4579000,
    21: 4655000, 22: 4716000, 23: 4774000, 24: 4814000, 25: 4881000,
    26: 4941000, 27: 5002000, 28: 5065000, 29: 5126000, 30: 5187000,
    31: 5250000
  },
  "3급": {
    1: 2612000, 2: 2690000, 3: 2775000, 4: 2869000, 5: 2964000,
    6: 3064000, 7: 3163000, 8: 3262000, 9: 3361000, 10: 3459000,
    11: 3554000, 12: 3604000, 13: 3657000, 14: 3720000, 15: 3783000,
    16: 3871000, 17: 3935000, 18: 4007000, 19: 4070000, 20: 4133000,
    21: 4192000, 22: 4250000, 23: 4303000, 24: 4360000, 25: 4414000,
    26: 4464000, 27: 4532000, 28: 4545000, 29: 4588000, 30: 4649000,
    31: 4710000
  },
  "4급": {
    1: 2464000, 2: 2490000, 3: 2516000, 4: 2542000, 5: 2620000,
    6: 2719000, 7: 2817000, 8: 2902000, 9: 2997000, 10: 3094000,
    11: 3186000, 12: 3226000, 13: 3291000, 14: 3366000, 15: 3458000,
    16: 3514000, 17: 3583000, 18: 3648000, 19: 3711000, 20: 3770000,
    21: 3832000, 22: 3884000, 23: 3935000, 24: 3983000, 25: 4035000,
    26: 4080000, 27: 4117000, 28: 4156000, 29: 4193000, 30: 4230000,
    31: 4294000
  },
  "5급": {
    1: 2433000, 2: 2459000, 3: 2485000, 4: 2509000, 5: 2529000,
    6: 2549000, 7: 2569000, 8: 2650000, 9: 2746000, 10: 2830000,
    11: 2906000, 12: 2965000, 13: 3042000, 14: 3119000, 15: 3170000,
    16: 3241000, 17: 3286000, 18: 3355000, 19: 3411000, 20: 3469000,
    21: 3521000, 22: 3574000, 23: 3621000, 24: 3668000, 25: 3713000,
    26: 3754000, 27: 3790000, 28: 3830000, 29: 3867000, 30: 3911000,
    31: 3974000
  },
  "관리직": {
    1: 2408000, 2: 2434000, 3: 2460000, 4: 2484000, 5: 2505000,
    6: 2528000, 7: 2554000, 8: 2574000, 9: 2668000, 10: 2748000,
    11: 2842000, 12: 2895000, 13: 2950000, 14: 2999000, 15: 3055000,
    16: 3109000, 17: 3155000, 18: 3217000, 19: 3273000, 20: 3331000,
    21: 3408000, 22: 3464000, 23: 3516000, 24: 3576000, 25: 3614000,
    26: 3661000, 27: 3709000, 28: 3766000, 29: 3826000, 30: 3882000,
    31: 3940000
  },
  "기능직": {
    1: 2383000, 2: 2409000, 3: 2435000, 4: 2459000, 5: 2480000,
    6: 2503000, 7: 2529000, 8: 2551000, 9: 2571000, 10: 2614000,
    11: 2696000, 12: 2751000, 13: 2795000, 14: 2859000, 15: 2908000,
    16: 2994000, 17: 3050000, 18: 3109000, 19: 3161000, 20: 3223000,
    21: 3295000, 22: 3354000, 23: 3411000, 24: 3453000, 25: 3506000,
    26: 3535000, 27: 3594000, 28: 3653000, 29: 3712000, 30: 3769000,
    31: 3829000
  }
};

// 2025 Deduction rates for comparison
export const DEDUCTION_RATES_2025 = {
  PENSION: 0.045, // 4.5% (2025)
  HEALTH: 0.0354, // 3.545% (2025)
  CARE: 0.1295, // 12.95% of Health (2025)
  EMPLOYMENT: 0.009, // 0.9%
};

export const DEDUCTION_RATES = {
  PENSION: 0.0475, // 4.75% (2026)
  HEALTH: 0.03595, // 3.595% (2026)
  CARE: 0.1314, // 13.14% of Health (2026)
  EMPLOYMENT: 0.009, // 0.9%
};

export const ALLOWANCE_RULES = {
  MEAL: 140000, // 2026년: 140,000원 (2025년 대비 10,000원 인상)
  MANAGER: 220000, // 2026년: 220,000원 (2025년 대비 20,000원 인상)
  WELFARE_POINT_HIGH: 400000, // 10 Hobong+
  WELFARE_POINT_LOW: 300000,  // <10 Hobong
  FAMILY: {
    SPOUSE: 40000,
    CHILD_1: 50000,
    CHILD_2: 80000,
    CHILD_3_PLUS: 120000,
    OTHERS: 20000
  }
};

// 2025 Allowance Rules
export const ALLOWANCE_RULES_2025 = {
  MEAL: 130000, // 2025년: 130,000원
  MANAGER: 200000, // 2025년: 200,000원
  WELFARE_POINT_HIGH: 400000,
  WELFARE_POINT_LOW: 300000,
  FAMILY: {
    SPOUSE: 40000,
    CHILD_1: 50000,
    CHILD_2: 80000,
    CHILD_3_PLUS: 120000,
    OTHERS: 20000
  }
};

/**
 * Calculate family allowance with detailed child counts
 * @param {boolean} hasSpouse - Whether the person has a spouse
 * @param {number|object} numChildren - Number of children OR object with {first, second, thirdPlus}
 * @param {number} numOthers - Number of other dependents
 */
export function calculateFamilyAllowance(hasSpouse, numChildren, numOthers) {
  let total = 0;
  if (hasSpouse) total += ALLOWANCE_RULES.FAMILY.SPOUSE;

  // Support both legacy (number) and new (object) formats
  if (typeof numChildren === 'object' && numChildren !== null) {
    // New format: { first: 0|1, second: 0|1, thirdPlus: number }
    if (numChildren.first) total += ALLOWANCE_RULES.FAMILY.CHILD_1;
    if (numChildren.second) total += ALLOWANCE_RULES.FAMILY.CHILD_2;
    if (numChildren.thirdPlus > 0) total += numChildren.thirdPlus * ALLOWANCE_RULES.FAMILY.CHILD_3_PLUS;
  } else {
    // Legacy format: simple number count
    if (numChildren > 0) total += ALLOWANCE_RULES.FAMILY.CHILD_1;
    if (numChildren > 1) total += ALLOWANCE_RULES.FAMILY.CHILD_2;
    if (numChildren > 2) total += (numChildren - 2) * ALLOWANCE_RULES.FAMILY.CHILD_3_PLUS;
  }

  if (numOthers > 0) total += numOthers * ALLOWANCE_RULES.FAMILY.OTHERS;

  return total;
}

/**
 * Calculate total number of children from detailed format
 */
export function getTotalChildren(numChildren) {
  if (typeof numChildren === 'object' && numChildren !== null) {
    return (numChildren.first ? 1 : 0) + (numChildren.second ? 1 : 0) + (numChildren.thirdPlus || 0);
  }
  return numChildren || 0;
}

// Simple simplified tax estimator (approximate for display)
export function calculateIncomeTax(taxableMonthly, numPeople) {
  // Use the default simplified bracket logic
  let tax = 0;
  if (taxableMonthly < 1060000) return 0;

  if (taxableMonthly < 2000000) tax = (taxableMonthly - 1060000) * 0.01;
  else if (taxableMonthly < 3000000) tax = 20000 + (taxableMonthly - 2000000) * 0.05;
  else if (taxableMonthly < 4000000) tax = 80000 + (taxableMonthly - 3000000) * 0.10;
  else tax = 180000 + (taxableMonthly - 4000000) * 0.15;

  tax = Math.max(0, tax - (numPeople * 10000));

  return Math.round(tax / 10) * 10;
}

/**
 * Calculates salary for a specific month.
 * Does NOT include Holiday Bonus logic internally here (handled in annual report or separately),
 * unless we want to simulate a specific month.
 * 
 * For the main "Monthly Estimate" display, we usually show the "Normal" month (no holiday bonus).
 */
export function calculateSalary(grade, hobong, options = {}) {
  const baseSalary = SALARY_TABLE[grade]?.[hobong] || 0;
  const mealAllowance = ALLOWANCE_RULES.MEAL;
  const managerAllowance = options.isManager ? ALLOWANCE_RULES.MANAGER : 0;
  const familyAllowance = calculateFamilyAllowance(options.hasSpouse, options.numChildren, options.numOthers);
  
  // Custom Allowances (Monthly portion)
  const corpData = options.additionalAllowances?.corporation || { amount: 0, type: 'monthly' };
  let monthlyCorporation = corpData.type === 'yearly' ? Math.floor(corpData.amount / 12) : corpData.amount;
  
  // District Allowance
  // Structure: { type: 'none'|'point'|'allowance', amount: 0, frequency: 'monthly'|'yearly' }
  const distData = options.additionalAllowances?.district || { type: 'none', amount: 0, frequency: 'monthly' };
  
  let annualDistrict = 0;
  let monthlyDistrictEstimate = 0; // For the "Monthly Estimate" box

  if (distData.type === 'point') {
      // Welfare Point: Paid in Jun/Dec.
      // Input Amount is "Annual Total".
      // Monthly Estimate Box: 0 (User sees it in Annual Report)
      // Annual Total: Amount (Input is already annual total)
      monthlyDistrictEstimate = 0;
      annualDistrict = distData.amount;
  } else if (distData.type === 'allowance') {
      // Allowance: Paid Monthly or Yearly
      if (distData.frequency === 'yearly') {
          monthlyDistrictEstimate = Math.floor(distData.amount / 12);
          annualDistrict = distData.amount;
      } else {
          monthlyDistrictEstimate = distData.amount;
          annualDistrict = distData.amount * 12;
      }
  }
  
  // Ordinary Wage Calculation (New Formula)
  // Ordinary Wage = Base + (Annual Holiday Bonus / 12)
  const annualHolidayTotal = baseSalary * 1.2;
  const ordinaryWage = baseSalary + Math.floor(annualHolidayTotal / 12);

  // Allowances Total (Monthly Normal)
  const monthlyTotal = baseSalary + mealAllowance + managerAllowance + familyAllowance + monthlyCorporation + monthlyDistrictEstimate;

  // Deductions (Monthly Normal)
  const nonTaxableAmount = mealAllowance; // Meal is non-taxable
  const taxableIncome = Math.max(0, monthlyTotal - nonTaxableAmount);

  const pensionIncome = Math.min(taxableIncome, 6170000); // 2026 cap check needed, using existing
  const nationalPension = Math.floor(pensionIncome * DEDUCTION_RATES.PENSION / 10) * 10;
  const healthInsurance = Math.floor(taxableIncome * DEDUCTION_RATES.HEALTH / 10) * 10;
  const longTermCare = Math.floor(healthInsurance * DEDUCTION_RATES.CARE / 10) * 10;
  const employmentInsurance = Math.floor(taxableIncome * DEDUCTION_RATES.EMPLOYMENT / 10) * 10;

  const totalChildren = getTotalChildren(options.numChildren);
  const numFamily = 1 + (options.hasSpouse ? 1 : 0) + totalChildren + options.numOthers;
  const incomeTax = calculateIncomeTax(taxableIncome, numFamily);
  const localIncomeTax = Math.floor(incomeTax * 0.1 / 10) * 10;

  const totalDeductions = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;
  const netPay = monthlyTotal - totalDeductions;

  // Annual estimates for the summary box
  // Holiday Bonus = 60% * 2 times = 120% of base salary
  const annualHoliday = Math.floor(baseSalary * 1.2) || 0;
  
  // Welfare Points (Seoul City)
  const welfarePoints = hobong >= 10 ? ALLOWANCE_RULES.WELFARE_POINT_HIGH : ALLOWANCE_RULES.WELFARE_POINT_LOW;
  
  // Annual Total (Pre-Tax) = (Monthly * 12) + Holiday Bonus + Welfare Points + District Allowance
  const annualTotal = (monthlyTotal * 12) + annualHoliday + (welfarePoints || 0) + (annualDistrict || 0);
  
  // Annual Net Pay (Post-Tax) = (Net Pay * 12) + Holiday Bonus - estimated tax + Welfare Points + District Allowance
  // For simplicity, estimate annual deductions by multiplying monthly deductions by 12
  const annualNetPay = (netPay * 12) + annualHoliday + (welfarePoints || 0) + (annualDistrict || 0);

  return {
    baseSalary,
    mealAllowance,
    managerAllowance,
    familyAllowance,
    corporationAllowance: monthlyCorporation,
    districtAllowance: annualDistrict || 0, 
    monthlyDistrictEstimate, 
    ordinaryWage, 
    monthlyTotal,
    deductions: {
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
      total: totalDeductions
    },
    netPay,
    // Annual fields
    annualHoliday,
    welfarePoints: welfarePoints || 0,
    annualTotal,
    annualNetPay
  };
}

/**
 * Generates a 12-month report including salary steps (promotion) and holiday bonuses.
 */
export function generateAnnualReport(startGrade, startHobong, promotionMonth, options = {}) {
  const months = [];
  let currentHobong = startHobong;
  let annualTotalPreTax = 0;
  let annualTotalPostTax = 0;
  let annualHolidayTotal = 0;

  // District Allowance Logic for Report
  const distData = options.additionalAllowances?.district || { type: 'none', amount: 0, frequency: 'monthly' };
  let annualDistrictTotal = 0;

  // Holiday Bonus Months: customizable, default Feb (2) and Sep (9)
  const holidayBonusMonths = options.holidayBonusMonths || [2, 9];

  for (let m = 1; m <= 12; m++) {
    // 1. Determine Hobong for this month
    if (promotionMonth && m >= promotionMonth) {
      currentHobong = startHobong + 1;
    } else {
      currentHobong = startHobong;
    }
    
    if (currentHobong > 31) currentHobong = 31;

    const baseSalary = SALARY_TABLE[startGrade]?.[currentHobong] || 0;
    
    // 2. Allowances
    const mealAllowance = ALLOWANCE_RULES.MEAL;
    const managerAllowance = options.isManager ? ALLOWANCE_RULES.MANAGER : 0;
    const familyAllowance = calculateFamilyAllowance(options.hasSpouse, options.numChildren, options.numOthers);
    
    const corpData = options.additionalAllowances?.corporation || { amount: 0, type: 'monthly' };
    let monthlyCorporation = corpData.type === 'yearly' ? Math.floor(corpData.amount / 12) : corpData.amount;

    // District Allowance (Report Logic)
    let monthlyDistrict = 0;
    if (distData.type === 'point') {
        // Jun & Dec. Input is "Annual Total", so pay half each time.
        if (m === 6 || m === 12) {
            monthlyDistrict = Math.floor(distData.amount / 2);
        }
    } else if (distData.type === 'allowance') {
        // Monthly or Yearly
        if (distData.frequency === 'yearly') {
            monthlyDistrict = Math.floor(distData.amount / 12);
        } else {
            monthlyDistrict = distData.amount;
        }
    }

    // 3. Holiday Bonus -> 60% of Base for each holiday bonus month
    let holidayBonus = 0;
    if (holidayBonusMonths.includes(m)) {
      holidayBonus = Math.floor(baseSalary * 0.6);
    }

    const monthlyTotal = baseSalary + mealAllowance + managerAllowance + familyAllowance + monthlyCorporation + monthlyDistrict + holidayBonus;

    // 5. Deductions
    const nonTaxable = mealAllowance; 
    const taxable = Math.max(0, monthlyTotal - nonTaxable);

    const pensionIncome = Math.min(taxable, 6170000);
    const nationalPension = Math.floor(pensionIncome * DEDUCTION_RATES.PENSION / 10) * 10;
    const healthInsurance = Math.floor(taxable * DEDUCTION_RATES.HEALTH / 10) * 10;
    const longTermCare = Math.floor(healthInsurance * DEDUCTION_RATES.CARE / 10) * 10;
    const employmentInsurance = Math.floor(taxable * DEDUCTION_RATES.EMPLOYMENT / 10) * 10;
    
    const numChildren = getTotalChildren(options.numChildren);
    const numFamily = 1 + (options.hasSpouse ? 1 : 0) + numChildren + options.numOthers;
    const incomeTax = calculateIncomeTax(taxable, numFamily);
    const localIncomeTax = Math.floor(incomeTax * 0.1 / 10) * 10;
    
    const totalDeductions = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;
    const netPay = monthlyTotal - totalDeductions;

    months.push({
      month: m,
      baseSalary,
      hobong: currentHobong,
      isPromotionMonth: promotionMonth && m === promotionMonth,
      mealAllowance,
      managerAllowance,
      familyAllowance,
      corporationAllowance: monthlyCorporation,
      districtAllowance: monthlyDistrict, 
      holidayBonus,
      monthlyTotal,
      taxable,
      deductions: {
        nationalPension,
        healthInsurance,
        longTermCare,
        employmentInsurance,
        incomeTax,
        localIncomeTax,
        total: totalDeductions
      },
      netPay
    });

    annualTotalPreTax += monthlyTotal;
    annualTotalPostTax += netPay;
    annualHolidayTotal += holidayBonus;
    annualDistrictTotal += monthlyDistrict;
  }

  // Add Welfare Points to Annual Total (Post-calculation)
  // Let's use startHobong for status.
  const welfarePoints = startHobong >= 10 ? ALLOWANCE_RULES.WELFARE_POINT_HIGH : ALLOWANCE_RULES.WELFARE_POINT_LOW;
  
  const finalAnnualPreTax = annualTotalPreTax + welfarePoints;
  const finalAnnualPostTax = annualTotalPostTax + welfarePoints; // Assuming welfare points are tax-free or just added blindly as per previous logic

  return {
    months,
    promotionMonth,
    summary: {
      annualPreTax: finalAnnualPreTax,
      annualPostTax: finalAnnualPostTax,
      annualHoliday: annualHolidayTotal,
      welfarePoints,
      annualDistrict: annualDistrictTotal 
    }
  };
}

/**
 * Calculate estimated 2025 annual salary for YoY comparison
 * This is a simplified calculation for comparison purposes
 */
export function calculate2025AnnualSalary(grade, hobong, options = {}) {
  const baseSalary = SALARY_TABLE_2025[grade]?.[hobong] || 0;
  const mealAllowance = ALLOWANCE_RULES_2025.MEAL;
  const managerAllowance = options.isManager ? ALLOWANCE_RULES_2025.MANAGER : 0;
  
  // Calculate family allowance using 2025 rules (same rates for simplicity)
  let familyAllowance = 0;
  if (options.hasSpouse) familyAllowance += ALLOWANCE_RULES_2025.FAMILY.SPOUSE;
  
  const numChildren = getTotalChildren(options.numChildren);
  if (numChildren > 0) familyAllowance += ALLOWANCE_RULES_2025.FAMILY.CHILD_1;
  if (numChildren > 1) familyAllowance += ALLOWANCE_RULES_2025.FAMILY.CHILD_2;
  if (numChildren > 2) familyAllowance += (numChildren - 2) * ALLOWANCE_RULES_2025.FAMILY.CHILD_3_PLUS;
  if (options.numOthers > 0) familyAllowance += options.numOthers * ALLOWANCE_RULES_2025.FAMILY.OTHERS;
  
  // Monthly total
  const monthlyTotal = baseSalary + mealAllowance + managerAllowance + familyAllowance;
  
  // Holiday Bonus (120% of base annual)
  const annualHoliday = Math.floor(baseSalary * 1.2);
  
  // Welfare Points
  const welfarePoints = hobong >= 10 ? ALLOWANCE_RULES_2025.WELFARE_POINT_HIGH : ALLOWANCE_RULES_2025.WELFARE_POINT_LOW;
  
  // Annual Total (Pre-Tax)
  const annualTotal = (monthlyTotal * 12) + annualHoliday + welfarePoints;
  
  return {
    annualTotal,
    baseSalary,
    monthlyTotal,
    annualHoliday,
    welfarePoints
  };
}

