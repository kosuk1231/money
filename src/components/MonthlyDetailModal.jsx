import React, { useState, useEffect } from 'react';
import { ALLOWANCE_RULES, DEDUCTION_RATES, calculateIncomeTax, calculateFamilyAllowance, SALARY_TABLE } from '../data/salaryData';

export default function MonthlyDetailModal({ isOpen, onClose, baseData }) {
    if (!isOpen) return null;

    const [monthDetails, setMonthDetails] = useState({
        overtimeHours: 0,
        holidayWorkHours: 0,
        includeHolidayBonus: false,
        includeWelfarePoints: false
    });

    const [detailResult, setDetailResult] = useState(null);

    // Calculate on render or change
    useEffect(() => {
        calculateDetailed();
    }, [monthDetails, baseData]);

    const calculateDetailed = () => {
        // 1. Base Data
        const baseSalary = SALARY_TABLE[baseData.grade]?.[baseData.hobong] || 0;
        const mealAllowance = ALLOWANCE_RULES.MEAL;
        const managerAllowance = baseData.isManager ? ALLOWANCE_RULES.MANAGER : 0;
        const familyAllowance = calculateFamilyAllowance(baseData.hasSpouse, baseData.numChildren, baseData.numOthers);

        // Custom Allowances (Monthly portion)
        const corpData = baseData.additionalAllowances?.corporation || { amount: 0, type: 'monthly' };
        let monthlyCorporation = corpData.type === 'yearly' ? Math.floor(corpData.amount / 12) : corpData.amount;

        // 2. Overtime & Variable
        // Ordinary Wage for Overtime = Base + Manager + Meal + (Fixed Corp/Job allowance usually included)
        // We will include Monthly Corporation Allowance in Ordinary Wage.
        const ordinaryWage = baseSalary + managerAllowance + mealAllowance + monthlyCorporation;
        const hourlyRate = ordinaryWage / 209;

        const overtimePay = Math.floor(hourlyRate * 1.5 * monthDetails.overtimeHours);

        // Holiday Bonus (60% of Base * 2 times a year -> 120% total, so 60% per time)
        // Actually typically "120% of Base Salary" is annual, so 60% per holiday (Seol/Chuseok)? 
        // Logic in salaryData was "annualHoliday = base * 1.2". So one time is 0.6.
        const holidayBonus = monthDetails.includeHolidayBonus ? Math.floor(baseSalary * 0.6) : 0;

        // Welfare Points (Annual / 2 or 4?) 
        // Usually paid quarterly or bi-annually. Let's assume full annual amount if checked, or maybe half?
        // User asked for "Welfare point payment month", let's assume it adds the full annual points for that month 
        // OR usually it's points used. Let's add the FULL annual amount defined in rules if checked for now.
        const welfarePoints = monthDetails.includeWelfarePoints ?
            (baseData.hobong >= 10 ? ALLOWANCE_RULES.WELFARE_POINT_HIGH : ALLOWANCE_RULES.WELFARE_POINT_LOW) : 0;

        // 3. Totals
        const totalTaxable = baseSalary + managerAllowance + familyAllowance + monthlyCorporation + overtimePay + holidayBonus + welfarePoints; // Meal is non-taxable
        const totalPay = totalTaxable + mealAllowance; // Meal added back for total pay (which includes non-taxable) but Taxable is separate

        // 4. Deductions
        // Taxable Income = Total Pay - NonTaxable(Meal)
        // (Note: Welfare points are usually taxable, Holiday bonus is taxable)
        const taxableIncome = totalPay - mealAllowance; // Meal is the only non-taxable here usually.

        const pensionIncome = Math.min(taxableIncome, 6170000);
        const nationalPension = Math.floor(pensionIncome * DEDUCTION_RATES.PENSION / 10) * 10;
        const healthInsurance = Math.floor(taxableIncome * DEDUCTION_RATES.HEALTH / 10) * 10;
        const longTermCare = Math.floor(healthInsurance * DEDUCTION_RATES.CARE / 10) * 10;
        const employmentInsurance = Math.floor(taxableIncome * DEDUCTION_RATES.EMPLOYMENT / 10) * 10;

        const numFamily = 1 + (baseData.hasSpouse ? 1 : 0) + baseData.numChildren + baseData.numOthers;
        const incomeTax = calculateIncomeTax(taxableIncome, numFamily);
        const localIncomeTax = Math.floor(incomeTax * 0.1 / 10) * 10;

        const totalDeductions = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;

        setDetailResult({
            baseSalary,
            mealAllowance,
            managerAllowance,
            familyAllowance,
            monthlyCorporation,
            overtimePay,
            holidayBonus,
            welfarePoints,
            totalPay,
            deductions: {
                total: totalDeductions,
                nationalPension,
                healthInsurance,
                longTermCare,
                employmentInsurance,
                incomeTax,
                localIncomeTax
            },
            netPay: totalPay - totalDeductions
        });
    };

    const formatMoney = (amount) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h3 className="text-2xl font-black text-slate-800">월별 급여 상세 시뮬레이션</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* INPUTS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label className="block text-sm font-bold text-slate-600 mb-2">시간외 근무 (시간)</label>
                            <div className="relative">
                                <input
                                    type="number" min="0"
                                    className="w-full border-2 border-slate-300 rounded-lg p-2 font-bold focus:border-blue-500 outline-none"
                                    value={monthDetails.overtimeHours}
                                    onChange={(e) => setMonthDetails({ ...monthDetails, overtimeHours: parseInt(e.target.value) || 0 })}
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">시간</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    checked={monthDetails.includeHolidayBonus}
                                    onChange={(e) => setMonthDetails({ ...monthDetails, includeHolidayBonus: e.target.checked })}
                                />
                                <span className="ml-3 font-bold text-slate-700">명절 휴가비 지급</span>
                            </label>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    checked={monthDetails.includeWelfarePoints}
                                    onChange={(e) => setMonthDetails({ ...monthDetails, includeWelfarePoints: e.target.checked })}
                                />
                                <span className="ml-3 font-bold text-slate-700">복지포인트 지급</span>
                            </label>
                        </div>
                    </div>

                    {/* RESULT TABLE */}
                    {detailResult && (
                        <div className="space-y-6">
                            {/* Income Section */}
                            <div>
                                <h4 className="text-lg font-black text-blue-900 border-b-2 border-blue-100 pb-2 mb-3">지급 내역</h4>
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">기본급</td><td className="font-bold">{formatMoney(detailResult.baseSalary)}</td></tr>
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">정액급식비</td><td className="font-bold">{formatMoney(detailResult.mealAllowance)}</td></tr>
                                        {detailResult.managerAllowance > 0 && <tr className="flex justify-between py-2"><td className="text-slate-600">관리자수당</td><td className="font-bold">{formatMoney(detailResult.managerAllowance)}</td></tr>}
                                        {detailResult.familyAllowance > 0 && <tr className="flex justify-between py-2"><td className="text-slate-600">가족수당</td><td className="font-bold">{formatMoney(detailResult.familyAllowance)}</td></tr>}
                                        {detailResult.monthlyCorporation > 0 && <tr className="flex justify-between py-2"><td className="text-slate-600">법인/직책수당</td><td className="font-bold">{formatMoney(detailResult.monthlyCorporation)}</td></tr>}

                                        {/* Variables */}
                                        <tr className={`flex justify-between py-2 ${detailResult.overtimePay > 0 ? 'bg-blue-50 -mx-2 px-2 rounded' : ''}`}>
                                            <td className="text-slate-700 font-bold">시간외 근무수당</td>
                                            <td className="font-bold text-blue-600">{formatMoney(detailResult.overtimePay)}</td>
                                        </tr>
                                        <tr className={`flex justify-between py-2 ${detailResult.holidayBonus > 0 ? 'bg-blue-50 -mx-2 px-2 rounded' : ''}`}>
                                            <td className="text-slate-700 font-bold">명절 휴가비</td>
                                            <td className="font-bold text-blue-600">{formatMoney(detailResult.holidayBonus)}</td>
                                        </tr>
                                        <tr className={`flex justify-between py-2 ${detailResult.welfarePoints > 0 ? 'bg-blue-50 -mx-2 px-2 rounded' : ''}`}>
                                            <td className="text-slate-700 font-bold">복지포인트</td>
                                            <td className="font-bold text-blue-600">{formatMoney(detailResult.welfarePoints)}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot className="border-t-2 border-slate-200 mt-2">
                                        <tr className="flex justify-between py-3">
                                            <td className="font-black text-slate-900 text-lg">지급 총액</td>
                                            <td className="font-black text-blue-600 text-lg">{formatMoney(detailResult.totalPay)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Deduction Section */}
                            <div>
                                <h4 className="text-lg font-black text-red-900 border-b-2 border-red-100 pb-2 mb-3">공제 내역</h4>
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-red-50">
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">국민연금</td><td className="font-bold text-red-700">{formatMoney(detailResult.deductions.nationalPension)}</td></tr>
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">건강보험</td><td className="font-bold text-red-700">{formatMoney(detailResult.deductions.healthInsurance)}</td></tr>
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">장기요양</td><td className="font-bold text-red-700">{formatMoney(detailResult.deductions.longTermCare)}</td></tr>
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">고용보험</td><td className="font-bold text-red-700">{formatMoney(detailResult.deductions.employmentInsurance)}</td></tr>
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">소득세</td><td className="font-bold text-red-700">{formatMoney(detailResult.deductions.incomeTax)}</td></tr>
                                        <tr className="flex justify-between py-2"><td className="text-slate-600">지방소득세</td><td className="font-bold text-red-700">{formatMoney(detailResult.deductions.localIncomeTax)}</td></tr>
                                    </tbody>
                                    <tfoot className="border-t-2 border-red-200 mt-2">
                                        <tr className="flex justify-between py-3">
                                            <td className="font-black text-slate-900 text-lg">공제 총액</td>
                                            <td className="font-black text-red-600 text-lg">{formatMoney(detailResult.deductions.total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Final Net Pay */}
                            <div className="bg-slate-800 text-white rounded-lg p-4 flex justify-between items-center shadow-lg">
                                <span className="text-xl font-bold">실 수령액</span>
                                <span className="text-3xl font-black text-yellow-400">{formatMoney(detailResult.netPay)}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
