import React, { useState, useEffect } from 'react';
import { SALARY_TABLE, calculateSalary, generateAnnualReport } from '../data/salaryData';
import SalaryResult from './SalaryResult';
import AnnualReportTable from './AnnualReportTable';
import MonthlyDetailModal from './MonthlyDetailModal';

export default function CalculatorLayout() {
    const [formData, setFormData] = useState({
        grade: '4급',
        hobong: 5,
        promotionMonth: '', 
        isManager: false,
        hasSpouse: false,
        numChildren: 0,
        numOthers: 0,
        corporationAllowance: 0,
        corporationType: 'monthly', 
        districtType: 'none',   // none | point | allowance
        districtAmount: 0, 
        districtFrequency: 'monthly' // monthly | yearly (only for allowance)
    });

    const [salaryResult, setSalaryResult] = useState(null);
    const [annualReport, setAnnualReport] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        // Prepare District Data Object
        const districtData = {
            type: formData.districtType,
            amount: parseInt(formData.districtAmount || 0),
            frequency: formData.districtFrequency
        };

        // Calculate Monthly Estimate (Normal Month)
        const result = calculateSalary(formData.grade, parseInt(formData.hobong), {
            isManager: formData.isManager,
            hasSpouse: formData.hasSpouse,
            numChildren: parseInt(formData.numChildren),
            numOthers: parseInt(formData.numOthers),
            additionalAllowances: {
                corporation: {
                    amount: parseInt(formData.corporationAllowance || 0),
                    type: formData.corporationType
                },
                district: districtData
            }
        });
        setSalaryResult(result);

        // Calculate Annual Report
        const report = generateAnnualReport(formData.grade, parseInt(formData.hobong), parseInt(formData.promotionMonth) || null, {
            isManager: formData.isManager,
            hasSpouse: formData.hasSpouse,
            numChildren: parseInt(formData.numChildren),
            numOthers: parseInt(formData.numOthers),
            additionalAllowances: {
                corporation: {
                    amount: parseInt(formData.corporationAllowance || 0),
                    type: formData.corporationType
                },
                district: districtData
            }
        });
        setAnnualReport(report);

    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 font-sans">
            <div className="w-full max-w-[1400px]">
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                        💰 2026 사회복지사 급여 계산기
                    </h1>
                    <p className="text-slate-500 font-bold">
                        서울시 사회복지시설 종사자 인건비 지급기준 가이드라인 적용
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* INPUT SECTION (Left Side) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* 1. Basic Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📝</span> 기본 정보 입력
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">직급 (급수)</label>
                                    <select
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        className="w-full p-3 rounded-lg border-2 border-slate-200 font-bold text-slate-700 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                                        style={{backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto'}}
                                    >
                                        {Object.keys(SALARY_TABLE).map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1">호봉</label>
                                        <select
                                            name="hobong"
                                            value={formData.hobong}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-lg border-2 border-slate-200 font-bold text-slate-700 focus:border-blue-500 outline-none"
                                        >
                                            {Array.from({length: 31}, (_, i) => i + 1).map(h => (
                                                <option key={h} value={h}>{h}호봉</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-blue-600 mb-1">승급월</label>
                                        <select
                                            name="promotionMonth"
                                            value={formData.promotionMonth}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-lg border-2 border-blue-200 font-bold text-blue-700 focus:border-blue-500 outline-none bg-blue-50"
                                        >
                                            <option value="">없음</option>
                                            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m}>{m}월</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                                        <input
                                            type="checkbox"
                                            name="isManager"
                                            checked={formData.isManager}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                        />
                                        <span className="ml-3 font-bold text-slate-700">시설장/관리자 수당 대상</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 2. Family & Allowances */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">👨‍👩‍👧‍👦</span> 수당 및 공제 설정
                            </h2>
                            
                            <div className="space-y-4">
                                {/* Family */}
                                <div className="space-y-3 pb-4 border-b border-slate-100">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="hasSpouse"
                                            checked={formData.hasSpouse}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600 rounded"
                                        />
                                        <span className="ml-2 text-sm font-bold text-slate-600">배우자 있음</span>
                                    </label>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">자녀 수</label>
                                            <input
                                                type="number" min="0"
                                                name="numChildren"
                                                value={formData.numChildren}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-slate-300 rounded font-bold text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">기타 부양</label>
                                            <input
                                                type="number" min="0"
                                                name="numOthers"
                                                value={formData.numOthers}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-slate-300 rounded font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Allowance */}
                                <div className="pt-2">
                                    <label className="block text-sm font-bold text-slate-600 mb-1">법인/직책 수당 (선택)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number" min="0"
                                            name="corporationAllowance"
                                            value={formData.corporationAllowance}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-slate-300 rounded font-bold text-sm"
                                            placeholder="금액 입력"
                                        />
                                        <select
                                            name="corporationType"
                                            value={formData.corporationType}
                                            onChange={handleInputChange}
                                            className="p-2 border border-slate-300 rounded font-bold text-sm bg-slate-50"
                                        >
                                            <option value="monthly">매월</option>
                                            <option value="yearly">연1회</option>
                                        </select>
                                    </div>
                                </div>

                                {/* District Allowance Section */}
                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    <h3 className="text-md font-black text-slate-800 mb-3 flex items-center gap-2">
                                        <span className="text-xl">🎁</span> 자치구 추가 혜택
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {/* Type Selector (Radio) */}
                                        <div className="flex flex-col gap-2">
                                            {['none', 'point', 'allowance'].map((typeOption) => (
                                                <label key={typeOption} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="districtType"
                                                        value={typeOption}
                                                        checked={formData.districtType === typeOption}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="ml-2 text-sm font-bold text-slate-700">
                                                        {typeOption === 'none' && '없음'}
                                                        {typeOption === 'point' && '자치구 복지포인트'}
                                                        {typeOption === 'allowance' && '자치구 수당'}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* Dynamic Inputs based on selection */}
                                        {formData.districtType !== 'none' && (
                                            <div className="animate-fadeIn p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                                                
                                                {/* Welfare Point Logic */}
                                                {formData.districtType === 'point' && (
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">
                                                            연간 복지포인트 총액 (원)
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number" min="0"
                                                                name="districtAmount"
                                                                value={formData.districtAmount}
                                                                onChange={handleInputChange}
                                                                className="w-full p-2 border border-slate-300 rounded font-bold text-sm"
                                                                placeholder="예: 1200000"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-blue-600 mt-1 font-medium">
                                                            * 6월, 12월에 각각 50%씩 배분됩니다.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Allowance Logic */}
                                                {formData.districtType === 'allowance' && (
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">
                                                            수당 금액 (원)
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="number" min="0"
                                                                name="districtAmount"
                                                                value={formData.districtAmount}
                                                                onChange={handleInputChange}
                                                                className="w-full p-2 border border-slate-300 rounded font-bold text-sm"
                                                                placeholder="금액 입력"
                                                            />
                                                            <select
                                                                name="districtFrequency"
                                                                value={formData.districtFrequency}
                                                                onChange={handleInputChange}
                                                                className="p-2 border border-slate-300 rounded font-bold text-sm bg-white"
                                                            >
                                                                <option value="monthly">매월</option>
                                                                <option value="yearly">매년</option>
                                                            </select>
                                                        </div>
                                                        {formData.districtFrequency === 'yearly' && (
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                * 연간 금액을 12개월로 나누어 계산합니다.
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RESULT SECTION (Right Side) */}
                    <div className="lg:col-span-8 flex flex-col h-full">
                        {/* Summary Cards */}
                        <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-6 min-h-[500px]">
                           {salaryResult && (
                               <SalaryResult 
                                    result={salaryResult} 
                                    grade={formData.grade} 
                                    hobong={formData.promotionMonth && (new Date().getMonth() + 1) >= parseInt(formData.promotionMonth) ? parseInt(formData.hobong) + 1 : formData.hobong} 
                               />
                           )}
                        </div>

                        {/* Detail Simulation Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setIsDetailModalOpen(true)}
                                className="bg-white border-2 border-indigo-600 text-indigo-700 text-lg font-black py-3 px-8 rounded-full shadow-sm hover:bg-indigo-50 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <span>🔍 시간외근무(OT) 포함 월별 시뮬레이션</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ANNUAL REPORT TABLE */}
                <AnnualReportTable annualReport={annualReport} />

                {/* MODAL */}
                <MonthlyDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    baseData={{
                        grade: formData.grade,
                        hobong: parseInt(formData.hobong),
                        isManager: formData.isManager,
                        hasSpouse: formData.hasSpouse,
                        numChildren: parseInt(formData.numChildren),
                        numOthers: parseInt(formData.numOthers),
                        additionalAllowances: {
                            corporation: {
                                amount: parseInt(formData.corporationAllowance || 0),
                                type: formData.corporationType
                            },
                            district: districtData
                        },
                    }}
                />
            </div>
        </div>
    );
}
