import React from 'react';

export default function SalaryResult({ result, grade, hobong }) {
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    const ResultRow = ({ label, value, isTotal = false, isSub = false, isDeduction = false }) => (
        <div className={`flex justify-between items-center py-2 border-b border-dashed border-slate-200 last:border-0 ${isSub ? 'pl-3 text-sm' : ''}`}>
            <span className={`${isTotal ? 'text-xl font-black text-slate-900' : 'text-base font-bold text-slate-700'} ${isDeduction ? 'text-red-700' : ''}`}>
                {label}
            </span>
            <span className={`${isTotal ? 'text-xl font-black text-blue-600' : 'text-base font-bold text-slate-900'} ${isDeduction ? 'text-red-600' : ''}`}>
                {isDeduction && '- '}{formatMoney(value)}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col h-full gap-6">

            {/* TOP ROW: Monthly + Deductions (Takes more space: flex-[2]) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-[2] min-h-0">
                {/* 1. Monthly (Top Left) */}
                <div className="bg-white border-4 border-slate-800 rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] flex flex-col justify-between h-full">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center justify-between">
                            <span>월 예상 급여 (세전)</span>
                            <span className="text-sm bg-slate-100 px-3 py-1 rounded-md border border-slate-200 text-slate-600 font-bold">
                                {grade} {hobong}호봉
                            </span>
                        </h2>
                        <div className="flex flex-col justify-around flex-1 space-y-1">
                            <ResultRow label="기본급 (본봉)" value={result.baseSalary} />
                            <ResultRow label="정액급식비" value={result.mealAllowance} />
                            {result.managerAllowance > 0 && <ResultRow label="관리자수당" value={result.managerAllowance} />}
                            {result.familyAllowance > 0 && <ResultRow label="가족수당" value={result.familyAllowance} />}
                            {result.corporationAllowance > 0 && <ResultRow label="법인/직책 수당" value={result.corporationAllowance} />}
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t-4 border-slate-800">
                        <ResultRow label="월 지급총액" value={result.monthlyTotal} isTotal={true} />
                    </div>
                </div>

                {/* 2. Deductions (Top Right) */}
                <div className="bg-red-50 border-4 border-red-800 rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(153,27,27,0.3)] flex flex-col justify-between h-full">
                    <h2 className="text-xl font-black text-red-900 mb-4">공제 예상액</h2>
                    <div className="flex flex-col justify-around flex-1 space-y-1">
                        <ResultRow label="국민연금 (4.5%)" value={result.deductions.nationalPension} isSub={true} isDeduction={true} />
                        <ResultRow label="건강보험 (3.545%)" value={result.deductions.healthInsurance} isSub={true} isDeduction={true} />
                        <ResultRow label="장기요양 (12.95%)" value={result.deductions.longTermCare} isSub={true} isDeduction={true} />
                        <ResultRow label="고용보험 (0.9%)" value={result.deductions.employmentInsurance} isSub={true} isDeduction={true} />
                        <ResultRow label="세금 (소득세+지방세)" value={result.deductions.incomeTax + result.deductions.localIncomeTax} isSub={true} isDeduction={true} />
                    </div>
                    <div className="mt-4 pt-3 border-t-2 border-red-200 flex justify-between items-center text-red-900 font-bold">
                        <span className="text-base">공제 합계</span>
                        <span className="text-xl">- {formatMoney(result.deductions.total)}</span>
                    </div>
                </div>
            </div>

            {/* MIDDLE ROW: Net Pay (Fixed height) */}
            <div className="bg-blue-50 border-4 border-blue-600 rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(37,99,235,0.3)] flex-none flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-900">실 수령액 (월)</span>
                    <span className="text-xs text-blue-800 opacity-70 mt-1">* 비과세 식대 및 부양가족 공제 적용</span>
                </div>
                <span className="text-5xl font-black text-blue-600 tracking-tight">{formatMoney(result.netPay)}</span>
            </div>

            {/* BOTTOM ROW: Annual (Takes less space: flex-[1]) */}
            <div className="bg-yellow-50 border-4 border-yellow-800 rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(161,98,7,0.3)] flex-[1] min-h-0 flex flex-col justify-center">
                <h2 className="text-xl font-black text-yellow-900 mb-4 border-b-2 border-yellow-200 pb-2">연봉 예상액</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 content-center">
                    <div className="space-y-2 flex flex-col justify-center">
                        <div className="flex justify-between text-yellow-900 opacity-90 text-base font-bold border-b border-yellow-100 pb-1">
                            <span>12개월 급여</span>
                            <span>{formatMoney(result.monthlyTotal * 12)}</span>
                        </div>
                        <div className="flex justify-between text-yellow-900 opacity-90 text-base font-bold border-b border-yellow-100 pb-1">
                            <span>명절휴가비 (120%)</span>
                            <span>{formatMoney(result.annualHoliday)}</span>
                        </div>
                        <div className="flex justify-between text-yellow-900 opacity-90 text-base font-bold border-b border-yellow-100 pb-1">
                            <span>서울시 복지포인트</span>
                            <span>{formatMoney(result.welfarePoints)}</span>
                        </div>
                        {result.districtAllowance > 0 && (
                            <div className="flex justify-between text-yellow-900 opacity-90 text-base font-bold border-b border-yellow-100 pb-1">
                                <span>자치구 복지포인트/수당</span>
                                <span>{formatMoney(result.districtAllowance)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center space-y-3 md:border-l-2 md:border-yellow-200 md:pl-8">
                        <div className="flex justify-between items-end">
                            <span className="text-base font-bold text-yellow-800">연봉 (세전)</span>
                            <span className="text-2xl font-black text-yellow-900">{formatMoney(result.annualTotal)}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2 border-t border-yellow-200/50">
                            <span className="text-lg font-black text-blue-900">연봉 (세후)</span>
                            <span className="text-3xl font-black text-blue-900">{formatMoney(result.annualNetPay)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-xs text-center text-gray-500 font-medium">
                    * 2025년 서울시 사회복지시설 종사자 인건비 지급기준 (추정치)
                </div>
            </div>
        </div>
    );
}
