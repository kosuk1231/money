import React, { useState, useEffect } from 'react';
import { SALARY_TABLE, calculateSalary } from '../data/salaryData';
import SalaryResult from './SalaryResult';

const GRADES = Object.keys(SALARY_TABLE);

export default function CalculatorLayout() {
    const [formData, setFormData] = useState({
        grade: '4급',
        hobong: 1,
        isManager: false,
        hasSpouse: false,
        numChildren: 0,
        numOthers: 0,
        corporationAllowance: 0,
        districtAllowance: 0
    });

    const [salaryResult, setSalaryResult] = useState(null);

    // Auto-calculate on change
    useEffect(() => {
        const result = calculateSalary(formData.grade, parseInt(formData.hobong), {
            isManager: formData.isManager,
            hasSpouse: formData.hasSpouse,
            numChildren: parseInt(formData.numChildren),
            numOthers: parseInt(formData.numOthers),
            additionalAllowances: {
                corporation: parseInt(formData.corporationAllowance || 0),
                district: parseInt(formData.districtAllowance || 0)
            }
        });
        setSalaryResult(result);
    }, [formData]);

    const BrickSection = ({ title, children, className = "" }) => (
        <div className={`bg-white border-4 border-slate-800 rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] ${className}`}>
            <h3 className="text-xl font-black text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
                {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-[1400px]">
                <header className="mb-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        서울시 사회복지 종사자 <span className="text-blue-600">임금계산기</span>
                    </h1>
                    <p className="text-lg font-bold text-slate-500">2025년 기준 (단일임금체계)</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* LEFT COLUMN: INPUTS (4 cols) - Flex col to stretch */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* 1. Class & Hobong */}
                        <BrickSection title="1. 직급 및 호봉" className="shrink-0">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-lg font-bold text-slate-700 mb-2">직급</label>
                                    <select
                                        className="w-full bg-slate-50 border-2 border-slate-300 rounded-lg p-3 text-lg font-bold focus:border-blue-500 focus:outline-none cursor-pointer hover:bg-white transition-colors"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    >
                                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-slate-700 mb-2">호봉</label>
                                    <select
                                        className="w-full bg-slate-50 border-2 border-slate-300 rounded-lg p-3 text-lg font-bold focus:border-blue-500 focus:outline-none cursor-pointer hover:bg-white transition-colors"
                                        value={formData.hobong}
                                        onChange={(e) => setFormData({ ...formData, hobong: e.target.value })}
                                    >
                                        {[...Array(31).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>{i + 1} 호봉</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </BrickSection>

                        {/* 2. Allowance Info */}
                        <BrickSection title="2. 수당 정보" className="shrink-0">
                            <div className="space-y-6">
                                <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                        checked={formData.isManager}
                                        onChange={(e) => setFormData({ ...formData, isManager: e.target.checked })}
                                    />
                                    <span className="ml-3 text-lg font-bold text-slate-700">관리자 수당 포함</span>
                                </label>

                                <div className="pt-6 border-t-2 border-dashed border-slate-300">
                                    <div className="text-base font-black text-slate-400 mb-4">가족수당</div>

                                    <label className="flex items-center mb-6 p-2 cursor-pointer hover:bg-slate-50 rounded -ml-2">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                            checked={formData.hasSpouse}
                                            onChange={(e) => setFormData({ ...formData, hasSpouse: e.target.checked })}
                                        />
                                        <span className="ml-3 text-lg font-bold text-slate-700">배우자 있음</span>
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-base font-bold text-slate-600 mb-2">자녀 수</label>
                                            <input
                                                type="number" min="0" placeholder="0"
                                                className="w-full border-2 border-slate-300 rounded-lg p-2 text-lg font-bold focus:border-blue-500 outline-none"
                                                value={formData.numChildren}
                                                onChange={(e) => setFormData({ ...formData, numChildren: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-base font-bold text-slate-600 mb-2">기타부양</label>
                                            <input
                                                type="number" min="0" placeholder="0"
                                                className="w-full border-2 border-slate-300 rounded-lg p-2 text-lg font-bold focus:border-blue-500 outline-none"
                                                value={formData.numOthers}
                                                onChange={(e) => setFormData({ ...formData, numOthers: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BrickSection>

                        {/* 3. Additional Custom Allowances - Flex 1 to fill space */}
                        <BrickSection title="3. 추가 수당" className="flex-1 flex flex-col">
                            <div className="flex-1 flex flex-col justify-center space-y-6">
                                <div>
                                    <label className="block text-base font-bold text-slate-600 mb-2">법인 수당</label>
                                    <div className="relative">
                                        <input
                                            type="number" min="0" placeholder="0"
                                            className="w-full border-2 border-slate-300 rounded-lg p-3 text-lg font-bold focus:border-blue-500 outline-none pr-8"
                                            value={formData.corporationAllowance === 0 ? '' : formData.corporationAllowance}
                                            onChange={(e) => setFormData({ ...formData, corporationAllowance: e.target.value })}
                                        />
                                        <span className="absolute right-3 top-3.5 text-slate-400 font-bold">원</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-base font-bold text-slate-600 mb-2">자치구 복지포인트/수당</label>
                                    <div className="relative">
                                        <input
                                            type="number" min="0" placeholder="0"
                                            className="w-full border-2 border-slate-300 rounded-lg p-3 text-lg font-bold focus:border-blue-500 outline-none pr-8"
                                            value={formData.districtAllowance === 0 ? '' : formData.districtAllowance}
                                            onChange={(e) => setFormData({ ...formData, districtAllowance: e.target.value })}
                                        />
                                        <span className="absolute right-3 top-3.5 text-slate-400 font-bold">원</span>
                                    </div>
                                </div>
                            </div>
                        </BrickSection>

                    </div>

                    {/* RIGHT AREA: RESULTS (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col h-full">
                        {salaryResult && <SalaryResult result={salaryResult} grade={formData.grade} hobong={formData.hobong} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
