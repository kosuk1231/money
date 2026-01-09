import React, { useRef } from 'react';

export default function AnnualReportTable({ annualReport }) {
    const tableRef = useRef(null);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
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

    if (!annualReport) return null;

    return (
        <div className="w-full mt-8 bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:mt-0">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center print:hidden">
                <h3 className="text-xl font-black text-slate-800">📊 2026년 월별 예상 수령액 리포트</h3>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 text-sm"
                    >
                        <span>📥 엑셀(CSV) 저장</span>
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition flex items-center gap-2 text-sm"
                    >
                        <span>🖨️ 출력/PDF 저장</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
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
                        {annualReport.months.map((row) => (
                            <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-2 font-bold text-slate-700">{row.month}월</td>
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
                        ))}
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
            
            <div className="bg-indigo-50 p-4 text-xs text-indigo-800 text-center font-bold">
                * 위 테이블은 승급월 및 명절휴가비 지급월(2월, 9월)이 반영된 결과입니다. 실제 지급액과 10원 단위 차이가 있을 수 있습니다.
            </div>
        </div>
    );
}
