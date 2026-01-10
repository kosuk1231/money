import React, { useRef, useState } from 'react';

export default function AnnualReportTable({ annualReport, promotionMonth, holidayBonusMonths = [2, 9] }) {
    const tableRef = useRef(null);
    const pdfContentRef = useRef(null);
    const [isPdfPreview, setIsPdfPreview] = useState(false);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    const formatMoneyCompact = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    const handleDownloadCSV = () => {
        if (!annualReport?.months) return;

        const headers = ['월', '기본급', '정액급식비', '관리자수당', '가족수당', '법인/직책수당', '명절휴가비', '지급총액(세전)', '공제총액', '세금(소득세+지방세)', '실수령액'];
        const rows = annualReport.months.map(m => [
            `${m.month}월`,
            m.baseSalary,
            m.mealAllowance,
            m.managerAllowance,
            m.familyAllowance,
            m.corporationAllowance,
            m.holidayBonus,
            m.monthlyTotal,
            m.deductions.total,
            m.deductions.incomeTax + m.deductions.localIncomeTax,
            m.netPay
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '2026_annual_salary_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    const handlePdfExport = () => {
        setIsPdfPreview(true);
        setTimeout(() => {
            window.print();
            setTimeout(() => setIsPdfPreview(false), 500);
        }, 100);
    };

    if (!annualReport) return null;

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // Mobile Card Component
    const MonthCard = ({ row }) => {
        const isPromotion = row.isPromotionMonth;
        const isHolidayMonth = row.holidayBonus > 0;
        
        return (
            <div className={`monthly-card ${isPromotion ? 'border-l-4 border-l-yellow-500 bg-yellow-50/50' : ''}`}>
                <div className="monthly-card-header">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-800">{row.month}월</span>
                        {isPromotion && (
                            <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">
                                ⬆ 승급
                            </span>
                        )}
                        {isHolidayMonth && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                🎉 명절
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-slate-500 font-medium">{row.hobong}호봉</span>
                </div>
                
                <div className="space-y-1">
                    <div className="monthly-card-row">
                        <span className="text-slate-600">기본급</span>
                        <span className="font-bold">{formatMoney(row.baseSalary)}</span>
                    </div>
                    {row.holidayBonus > 0 && (
                        <div className="monthly-card-row bg-blue-50 -mx-4 px-4 rounded">
                            <span className="text-blue-700 font-bold">명절휴가비</span>
                            <span className="font-bold text-blue-700">{formatMoney(row.holidayBonus)}</span>
                        </div>
                    )}
                    <div className="monthly-card-row">
                        <span className="text-slate-600">기타수당</span>
                        <span className="font-bold">{formatMoney(
                            row.mealAllowance + row.managerAllowance + row.familyAllowance + row.corporationAllowance + row.districtAllowance
                        )}</span>
                    </div>
                    
                    <div className="h-px bg-slate-200 my-2"></div>
                    
                    <div className="monthly-card-row">
                        <span className="text-blue-900 font-bold">지급총액</span>
                        <span className="font-black text-blue-700">{formatMoney(row.monthlyTotal)}</span>
                    </div>
                    <div className="monthly-card-row">
                        <span className="text-red-600">공제</span>
                        <span className="font-bold text-red-600">-{formatMoney(row.deductions.total)}</span>
                    </div>
                    
                    <div className="h-px bg-slate-300 my-2"></div>
                    
                    <div className="monthly-card-row">
                        <span className="text-lg font-black text-slate-900">실수령액</span>
                        <span className="text-lg font-black text-yellow-700">{formatMoney(row.netPay)}</span>
                    </div>
                </div>
            </div>
        );
    };

    // PDF Payslip Layout Component
    const PayslipPdfLayout = () => {
        const today = new Date();
        const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        
        return (
            <div className="fixed inset-0 bg-white z-[9999] overflow-auto p-8 print:p-4" ref={pdfContentRef}>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="border-b-4 border-slate-800 pb-4 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">2026년도 급여명세서</h1>
                                <p className="text-slate-600 mt-1">서울시 사회복지시설 종사자 인건비 지급기준</p>
                            </div>
                            <div className="text-right text-sm text-slate-500">
                                <p>발행일: {dateStr}</p>
                                <p>문서번호: SAL-2026-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
                        <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                            <div className="text-sm text-slate-500 mb-1">연간 총 급여 (세전)</div>
                            <div className="text-2xl font-black text-slate-900">
                                {formatMoney(annualReport.summary.annualPreTax)}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                            <div className="text-sm text-slate-500 mb-1">연간 공제 합계</div>
                            <div className="text-2xl font-black text-red-600">
                                -{formatMoney(annualReport.months.reduce((acc, m) => acc + m.deductions.total, 0))}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                            <div className="text-sm text-blue-600 mb-1">연간 실수령액</div>
                            <div className="text-2xl font-black text-blue-700">
                                {formatMoney(annualReport.summary.annualPostTax)}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Details Table */}
                    <div className="mb-8">
                        <h2 className="text-lg font-black text-slate-800 mb-3 border-b-2 border-slate-200 pb-2">
                            월별 지급 내역
                        </h2>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-800 text-white">
                                    <th className="py-2 px-3 text-center border">월</th>
                                    <th className="py-2 px-3 text-right border">기본급</th>
                                    <th className="py-2 px-3 text-right border">제수당</th>
                                    <th className="py-2 px-3 text-right border">명절휴가비</th>
                                    <th className="py-2 px-3 text-right border bg-blue-700">지급총액</th>
                                    <th className="py-2 px-3 text-right border bg-red-700">공제총액</th>
                                    <th className="py-2 px-3 text-right border bg-yellow-600">실수령액</th>
                                </tr>
                            </thead>
                            <tbody>
                                {annualReport.months.map((row) => (
                                    <tr 
                                        key={row.month} 
                                        className={`border-b ${row.isPromotionMonth ? 'bg-yellow-50' : ''}`}
                                    >
                                        <td className="py-2 px-3 text-center border font-bold">
                                            {row.month}월
                                            {row.isPromotionMonth && <span className="ml-1">⬆</span>}
                                        </td>
                                        <td className="py-2 px-3 text-right border">{formatMoneyCompact(row.baseSalary)}</td>
                                        <td className="py-2 px-3 text-right border">
                                            {formatMoneyCompact(row.mealAllowance + row.managerAllowance + row.familyAllowance + row.corporationAllowance + row.districtAllowance)}
                                        </td>
                                        <td className={`py-2 px-3 text-right border ${row.holidayBonus > 0 ? 'text-blue-600 font-bold' : 'text-slate-300'}`}>
                                            {row.holidayBonus > 0 ? formatMoneyCompact(row.holidayBonus) : '-'}
                                        </td>
                                        <td className="py-2 px-3 text-right border font-bold text-blue-800 bg-blue-50">
                                            {formatMoneyCompact(row.monthlyTotal)}
                                        </td>
                                        <td className="py-2 px-3 text-right border text-red-600 bg-red-50">
                                            {formatMoneyCompact(row.deductions.total)}
                                        </td>
                                        <td className="py-2 px-3 text-right border font-black text-yellow-700 bg-yellow-50">
                                            {formatMoneyCompact(row.netPay)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-100 font-bold">
                                    <td className="py-3 px-3 text-center border" colSpan={2}>연간 합계</td>
                                    <td className="py-3 px-3 text-right border">
                                        {formatMoneyCompact(annualReport.months.reduce((acc, m) => 
                                            acc + m.mealAllowance + m.managerAllowance + m.familyAllowance + m.corporationAllowance + m.districtAllowance, 0
                                        ))}
                                    </td>
                                    <td className="py-3 px-3 text-right border text-blue-600">
                                        {formatMoneyCompact(annualReport.summary.annualHoliday)}
                                    </td>
                                    <td className="py-3 px-3 text-right border text-blue-800 bg-blue-100">
                                        {formatMoneyCompact(annualReport.months.reduce((acc, m) => acc + m.monthlyTotal, 0))}
                                    </td>
                                    <td className="py-3 px-3 text-right border text-red-600 bg-red-100">
                                        {formatMoneyCompact(annualReport.months.reduce((acc, m) => acc + m.deductions.total, 0))}
                                    </td>
                                    <td className="py-3 px-3 text-right border font-black text-yellow-700 bg-yellow-100">
                                        {formatMoneyCompact(annualReport.months.reduce((acc, m) => acc + m.netPay, 0))}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-bold text-slate-700 mb-2">지급 기준</h3>
                            <ul className="text-sm text-slate-600 space-y-1">
                                <li>• 명절휴가비: {holidayBonusMonths.map(m => monthNames[m-1]).join(', ')} (기본급 60%)</li>
                                <li>• 서울시 복지포인트: {formatMoney(annualReport.summary.welfarePoints)}</li>
                                {annualReport.summary.annualDistrict > 0 && (
                                    <li>• 자치구 수당: {formatMoney(annualReport.summary.annualDistrict)}</li>
                                )}
                            </ul>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-bold text-slate-700 mb-2">공제 항목 (2026년 기준)</h3>
                            <ul className="text-sm text-slate-600 space-y-1">
                                <li>• 국민연금: 4.75%</li>
                                <li>• 건강보험: 3.595%</li>
                                <li>• 장기요양보험: 건강보험의 13.14%</li>
                                <li>• 고용보험: 0.9%</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 border-slate-300 pt-4 text-center text-xs text-slate-500">
                        <p>본 문서는 참고용 시뮬레이션 결과이며, 실제 급여와 차이가 있을 수 있습니다.</p>
                        <p className="mt-1">서울시 사회복지시설 종사자 인건비 지급기준 가이드라인 2026 기준</p>
                    </div>

                    {/* Close button (print:hidden) */}
                    <button 
                        onClick={() => setIsPdfPreview(false)}
                        className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 print:hidden"
                    >
                        ✕ 닫기
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {isPdfPreview && <PayslipPdfLayout />}
            
            <div className="w-full mt-8 bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:mt-0">
                <div className="p-6 border-b border-slate-200 flex flex-wrap gap-3 justify-between items-center print:hidden">
                    <h3 className="text-xl font-black text-slate-800">📊 2026년 월별 예상 수령액 리포트</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleDownloadCSV}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 text-sm"
                        >
                            <span>📥 엑셀(CSV) 저장</span>
                        </button>
                        <button
                            onClick={handlePdfExport}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
                        >
                            <span>📄 급여명세서 PDF</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition flex items-center gap-2 text-sm"
                        >
                            <span>🖨️ 출력</span>
                        </button>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-center whitespace-nowrap" ref={tableRef}>
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-2">월</th>
                                <th className="py-3 px-2">호봉</th>
                                <th className="py-3 px-2">기본급</th>
                                <th className="py-3 px-2">명절휴가비</th>
                                <th className="py-3 px-2">기타수당</th>
                                <th className="py-3 px-2 bg-blue-50 text-blue-900 border-l border-r border-blue-100">지급총액</th>
                                <th className="py-3 px-2 text-red-600">공제총액</th>
                                <th className="py-3 px-2 bg-yellow-50 text-yellow-900 font-black border-l border-yellow-100">실수령액</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {annualReport.months.map((row) => {
                                const isPromotion = row.isPromotionMonth;
                                return (
                                    <tr 
                                        key={row.month} 
                                        className={`transition-colors ${isPromotion ? 'promotion-highlight' : 'hover:bg-slate-50'}`}
                                    >
                                        <td className="py-3 px-2 font-bold text-slate-700">
                                            {row.month}월
                                            {isPromotion && (
                                                <span className="ml-1 inline-block px-1.5 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-bold rounded">
                                                    승급
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-2 text-slate-500">{row.hobong}호봉</td>
                                        <td className="py-3 px-2 text-slate-600">{formatMoney(row.baseSalary)}</td>
                                        <td className={`py-3 px-2 font-bold ${row.holidayBonus > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                                            {row.holidayBonus > 0 ? formatMoney(row.holidayBonus) : '-'}
                                        </td>
                                        <td className="py-3 px-2 text-slate-500">
                                            {formatMoney(
                                                row.mealAllowance + row.managerAllowance + row.familyAllowance + row.corporationAllowance + row.districtAllowance
                                            )}
                                        </td>
                                        <td className="py-3 px-2 font-bold text-blue-900 bg-blue-50/30 border-l border-r border-blue-50">
                                            {formatMoney(row.monthlyTotal)}
                                        </td>
                                        <td className="py-3 px-2 text-red-600">
                                            {formatMoney(row.deductions.total)}
                                        </td>
                                        <td className="py-3 px-2 font-black text-yellow-700 bg-yellow-50/30 border-l border-yellow-50">
                                            {formatMoney(row.netPay)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                            <tr>
                                <td className="py-4 px-2" colSpan={2}>계 (합계)</td>
                                <td className="py-4 px-2">
                                    {formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.baseSalary, 0))}
                                </td>
                                <td className="py-4 px-2 text-blue-600">
                                    {formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.holidayBonus, 0))}
                                </td>
                                <td className="py-4 px-2">
                                    {formatMoney(annualReport.months.reduce((acc, cur) => acc + (cur.mealAllowance + cur.managerAllowance + cur.familyAllowance + cur.corporationAllowance + cur.districtAllowance), 0))}
                                </td>
                                <td className="py-4 px-2 text-blue-900">
                                    {formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.monthlyTotal, 0))}
                                </td>
                                <td className="py-4 px-2 text-red-600">
                                    {formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.deductions.total, 0))}
                                </td>
                                <td className="py-4 px-2 text-yellow-900 font-black text-lg">
                                    {formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.netPay, 0))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4 space-y-4">
                    {annualReport.months.map((row) => (
                        <MonthCard key={row.month} row={row} />
                    ))}
                    
                    {/* Mobile Summary Card */}
                    <div className="monthly-card bg-slate-100 border-2 border-slate-300">
                        <div className="text-center mb-4">
                            <span className="text-lg font-black text-slate-800">연간 합계</span>
                        </div>
                        <div className="space-y-2">
                            <div className="monthly-card-row">
                                <span className="text-blue-900 font-bold">지급총액</span>
                                <span className="font-black text-blue-700">{formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.monthlyTotal, 0))}</span>
                            </div>
                            <div className="monthly-card-row">
                                <span className="text-red-600">공제총액</span>
                                <span className="font-bold text-red-600">-{formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.deductions.total, 0))}</span>
                            </div>
                            <div className="h-px bg-slate-300 my-2"></div>
                            <div className="monthly-card-row">
                                <span className="text-xl font-black text-slate-900">실수령액</span>
                                <span className="text-xl font-black text-yellow-700">{formatMoney(annualReport.months.reduce((acc, cur) => acc + cur.netPay, 0))}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-indigo-50 p-4 text-xs text-indigo-800 text-center font-bold">
                    * 위 테이블은 승급월 및 명절휴가비 지급월({holidayBonusMonths.map(m => monthNames[m-1]).join(', ')})이 반영된 결과입니다. 실제 지급액과 10원 단위 차이가 있을 수 있습니다.
                </div>
            </div>
        </>
    );
}
