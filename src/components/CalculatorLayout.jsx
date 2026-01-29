import React, { useState, useEffect } from 'react';
import { SALARY_TABLE, calculateSalary, generateAnnualReport, calculate2025AnnualSalary, getTotalChildren } from '../data/salaryData';
import SalaryResult from './SalaryResult';
import AnnualReportTable from './AnnualReportTable';
import MonthlyDetailModal from './MonthlyDetailModal';
import Tooltip, { InfoIcon } from './Tooltip';

export default function CalculatorLayout() {
    const [formData, setFormData] = useState({
        grade: '4급',
        hobong: 5,
        promotionMonth: '', 
        isManager: false,
        hasSpouse: false,
        // New detailed children format
        childFirst: false,
        childFirstUnder6: false,
        childSecond: false,
        childSecondUnder6: false,
        childThirdPlus: 0,
        childThirdPlusUnder6: 0,
        numOthers: 0,
        corporationAllowance: 0,
        corporationType: 'monthly', 
        districtType: 'none',   // none | point | allowance
        districtAmount: 0, 
        districtFrequency: 'monthly', // monthly | yearly (only for allowance)
        // Holiday Bonus Months setting
        holidayBonusMonths: [2, 9], // Default: Feb & Sep
        // 선택적 공제 항목
        includeMealDeduction: false,
        mealDeductionAmount: 0,
        includeMutualAid: false,
        mutualAidAmount: 0,
        // 공제 기준 금액 (수동 입력)
        standardMonthlyIncome: '', // 국민연금 기준소득월액
        monthlyRemuneration: ''     // 건강/고용보험 보수월액
    });

    const [salaryResult, setSalaryResult] = useState(null);
    const [annualReport, setAnnualReport] = useState(null);
    const [salary2025, setSalary2025] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Convert detailed children format to object for calculations
    const getChildrenObject = () => ({
        first: formData.childFirst ? 1 : 0,
        firstUnder6: formData.childFirst && formData.childFirstUnder6,
        second: formData.childSecond ? 1 : 0,
        secondUnder6: formData.childSecond && formData.childSecondUnder6,
        thirdPlus: parseInt(formData.childThirdPlus) || 0,
        thirdPlusUnder6: Math.min(parseInt(formData.childThirdPlusUnder6) || 0, parseInt(formData.childThirdPlus) || 0)
    });

    useEffect(() => {
        // Prepare District Data Object
        const districtData = {
            type: formData.districtType,
            amount: parseInt(formData.districtAmount || 0),
            frequency: formData.districtFrequency
        };

        const childrenData = getChildrenObject();

        // Calculate Monthly Estimate (Normal Month)
        const result = calculateSalary(formData.grade, parseInt(formData.hobong), {
            isManager: formData.isManager,
            hasSpouse: formData.hasSpouse,
            numChildren: childrenData,
            numOthers: parseInt(formData.numOthers),
            additionalAllowances: {
                corporation: {
                    amount: parseInt(formData.corporationAllowance || 0),
                    type: formData.corporationType
                },
                district: districtData
            },
            // 공제 기준 금액 (수동 입력 시 사용)
            standardMonthlyIncome: parseInt(formData.standardMonthlyIncome) || null,
            monthlyRemuneration: parseInt(formData.monthlyRemuneration) || null
        });
        setSalaryResult(result);

        // Calculate Annual Report
        const report = generateAnnualReport(formData.grade, parseInt(formData.hobong), parseInt(formData.promotionMonth) || null, {
            isManager: formData.isManager,
            hasSpouse: formData.hasSpouse,
            numChildren: childrenData,
            numOthers: parseInt(formData.numOthers),
            holidayBonusMonths: formData.holidayBonusMonths,
            additionalAllowances: {
                corporation: {
                    amount: parseInt(formData.corporationAllowance || 0),
                    type: formData.corporationType
                },
                district: districtData
            },
            // 공제 기준 금액 (수동 입력 시 사용)
            standardMonthlyIncome: parseInt(formData.standardMonthlyIncome) || null,
            monthlyRemuneration: parseInt(formData.monthlyRemuneration) || null
        });
        setAnnualReport(report);

        // Calculate 2025 comparison
        const salary2025Data = calculate2025AnnualSalary(formData.grade, parseInt(formData.hobong), {
            isManager: formData.isManager,
            hasSpouse: formData.hasSpouse,
            numChildren: childrenData,
            numOthers: parseInt(formData.numOthers)
        });
        setSalary2025(salary2025Data);

    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleHolidayBonusChange = (month) => {
        setFormData(prev => {
            const currentMonths = [...prev.holidayBonusMonths];
            if (currentMonths.includes(month)) {
                // Remove month if already selected (but keep at least one)
                if (currentMonths.length > 1) {
                    return { ...prev, holidayBonusMonths: currentMonths.filter(m => m !== month) };
                }
                return prev;
            } else {
                // Add month (max 2 holidays per year is typical)
                if (currentMonths.length < 2) {
                    return { ...prev, holidayBonusMonths: [...currentMonths, month].sort((a, b) => a - b) };
                } else {
                    // Replace the second one
                    return { ...prev, holidayBonusMonths: [currentMonths[0], month].sort((a, b) => a - b) };
                }
            }
        });
    };

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 font-sans">
            <div className="w-full max-w-[1400px]">
                {/* Creator Credit */}
                <div className="text-center mb-4">
                    <span className="text-sm text-slate-500 font-medium">
                        제작자: 고석우 (<a href="https://www.facebook.com/carpediemkosuk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">@carpediemkosuk</a>)
                    </span>
                </div>

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
                                        <Tooltip content="배우자가 있는 경우 월 40,000원의 가족수당이 지급됩니다.">
                                            <InfoIcon className="ml-1" />
                                        </Tooltip>
                                    </label>
                                    
                                    {/* Detailed Children Selection */}
                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs font-bold text-slate-500">자녀 수당 상세</span>
                                            <Tooltip content="첫째 자녀: 월 50,000원 / 둘째 자녀: 월 80,000원 / 셋째 이상: 1인당 월 120,000원">
                                                <InfoIcon />
                                            </Tooltip>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="childFirst"
                                                        checked={formData.childFirst}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-slate-600">첫째 자녀 (₩50,000)</span>
                                                </label>
                                                {formData.childFirst && (
                                                    <label className="flex items-center gap-1 text-xs bg-green-50 px-2 py-1 rounded border border-green-200 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="childFirstUnder6"
                                                            checked={formData.childFirstUnder6}
                                                            onChange={handleInputChange}
                                                            className="w-3 h-3 text-green-600 rounded"
                                                        />
                                                        <span className="text-green-700 font-medium">만6세↓</span>
                                                    </label>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="childSecond"
                                                        checked={formData.childSecond}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                        disabled={!formData.childFirst}
                                                    />
                                                    <span className={`ml-2 text-sm font-medium ${formData.childFirst ? 'text-slate-600' : 'text-slate-400'}`}>
                                                        둘째 자녀 (₩80,000)
                                                    </span>
                                                </label>
                                                {formData.childSecond && (
                                                    <label className="flex items-center gap-1 text-xs bg-green-50 px-2 py-1 rounded border border-green-200 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="childSecondUnder6"
                                                            checked={formData.childSecondUnder6}
                                                            onChange={handleInputChange}
                                                            className="w-3 h-3 text-green-600 rounded"
                                                        />
                                                        <span className="text-green-700 font-medium">만6세↓</span>
                                                    </label>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-600">셋째 이상</span>
                                                    <select
                                                        name="childThirdPlus"
                                                        value={formData.childThirdPlus}
                                                        onChange={handleInputChange}
                                                        disabled={!formData.childSecond}
                                                        className={`p-1.5 border border-slate-300 rounded font-bold text-sm w-20 ${!formData.childSecond ? 'bg-slate-100 text-slate-400' : ''}`}
                                                    >
                                                        <option value="0">0명</option>
                                                        <option value="1">1명</option>
                                                        <option value="2">2명</option>
                                                        <option value="3">3명</option>
                                                        <option value="4">4명</option>
                                                        <option value="5">5명</option>
                                                    </select>
                                                    <span className="text-xs text-slate-400">(1인당 ₩120,000)</span>
                                                </div>
                                                {parseInt(formData.childThirdPlus) > 0 && (
                                                    <div className="flex items-center gap-2 pl-4">
                                                        <span className="text-xs text-green-700">만6세↓</span>
                                                        <select
                                                            name="childThirdPlusUnder6"
                                                            value={formData.childThirdPlusUnder6}
                                                            onChange={handleInputChange}
                                                            className="p-1 border border-green-300 rounded font-bold text-xs w-16 bg-green-50 text-green-700"
                                                        >
                                                            {Array.from({length: parseInt(formData.childThirdPlus) + 1}, (_, i) => (
                                                                <option key={i} value={i}>{i}명</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">
                                            기타 부양가족
                                            <Tooltip content="부모님, 조부모님 등 기타 부양가족 1인당 월 20,000원">
                                                <InfoIcon className="ml-1 inline-block" />
                                            </Tooltip>
                                        </label>
                                        <input
                                            type="number" min="0"
                                            name="numOthers"
                                            value={formData.numOthers}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-slate-300 rounded font-bold text-sm"
                                        />
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

                                {/* Settings Toggle */}
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
                                    >
                                        <span>⚙️</span>
                                        <span>고급 설정</span>
                                        <span className={`transition-transform ${showSettings ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                    
                                    {showSettings && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fadeIn">
                                            <div className="space-y-4">
                                                {/* Holiday Bonus Months Setting */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-600 mb-2">
                                                        명절휴가비 지급월
                                                        <Tooltip content="명절휴가비(기본급의 60%)가 지급되는 월을 선택하세요. 기본값은 설날(2월)과 추석(9월)입니다.">
                                                            <InfoIcon className="ml-1 inline-block" />
                                                        </Tooltip>
                                                    </label>
                                                    <div className="grid grid-cols-6 gap-1">
                                                        {monthNames.map((name, idx) => {
                                                            const month = idx + 1;
                                                            const isSelected = formData.holidayBonusMonths.includes(month);
                                                            return (
                                                                <button
                                                                    key={month}
                                                                    onClick={() => handleHolidayBonusChange(month)}
                                                                    className={`p-2 text-xs font-bold rounded transition-all ${
                                                                        isSelected 
                                                                            ? 'bg-blue-600 text-white shadow-sm' 
                                                                            : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                                                                    }`}
                                                                >
                                                                    {name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-2">
                                                        * 선택된 월: {formData.holidayBonusMonths.map(m => monthNames[m-1]).join(', ')}
                                                    </p>
                                                </div>

                                                {/* 공제 기준 금액 설정 */}
                                                <div className="mt-4 pt-4 border-t border-slate-200">
                                                    <label className="block text-sm font-bold text-slate-600 mb-2">
                                                        공제 기준 금액 설정
                                                        <Tooltip content="6월까지는 전년도 과세소득 기준으로 보험료가 산정됩니다. 급여명세서의 실제 기준 금액을 입력하면 정확한 공제액을 계산할 수 있습니다.">
                                                            <InfoIcon className="ml-1 inline-block" />
                                                        </Tooltip>
                                                    </label>
                                                    
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                                                국민연금 기준소득월액
                                                                <Tooltip content="전년도 과세소득 총액 ÷ 근무일수 × 30일 (1,000원 미만 절사). 급여명세서에서 확인 가능합니다.">
                                                                    <InfoIcon className="ml-1 inline-block" />
                                                                </Tooltip>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1000"
                                                                name="standardMonthlyIncome"
                                                                value={formData.standardMonthlyIncome}
                                                                onChange={handleInputChange}
                                                                placeholder="미입력 시 자동 계산"
                                                                className="w-full p-2 border border-slate-300 rounded font-bold text-sm text-right placeholder:text-slate-400 placeholder:font-normal focus:border-blue-500 outline-none"
                                                            />
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                                                건강/고용보험 보수월액
                                                                <Tooltip content="건강보험공단에서 결정한 보수월액. 급여명세서에서 확인 가능합니다.">
                                                                    <InfoIcon className="ml-1 inline-block" />
                                                                </Tooltip>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1000"
                                                                name="monthlyRemuneration"
                                                                value={formData.monthlyRemuneration}
                                                                onChange={handleInputChange}
                                                                placeholder="미입력 시 자동 계산"
                                                                className="w-full p-2 border border-slate-300 rounded font-bold text-sm text-right placeholder:text-slate-400 placeholder:font-normal focus:border-blue-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-xs text-blue-600 mt-2">
                                                        * 비워두면 현재 월급 기준으로 자동 계산됩니다.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 선택적 공제 항목 */}
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h3 className="text-md font-black text-red-800 mb-3 flex items-center gap-2">
                                <span className="text-xl">💸</span> 선택적 공제 항목
                            </h3>
                            
                            <div className="space-y-3">
                                {/* 식대 공제 */}
                                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="includeMealDeduction"
                                            checked={formData.includeMealDeduction}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                        />
                                        <span className="ml-2 font-bold text-slate-700 text-sm">식대 공제</span>
                                    </label>
                                    {formData.includeMealDeduction && (
                                        <div className="mt-2 animate-fadeIn">
                                            <input
                                                type="number"
                                                min="0"
                                                name="mealDeductionAmount"
                                                value={formData.mealDeductionAmount || ''}
                                                onChange={handleInputChange}
                                                placeholder="금액 입력"
                                                className="w-full p-2 border border-red-200 rounded font-bold text-right focus:border-red-500 outline-none placeholder:text-slate-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 상조회비 */}
                                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="includeMutualAid"
                                            checked={formData.includeMutualAid}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                        />
                                        <span className="ml-2 font-bold text-slate-700 text-sm">상조회비</span>
                                    </label>
                                    {formData.includeMutualAid && (
                                        <div className="mt-2 animate-fadeIn">
                                            <input
                                                type="number"
                                                min="0"
                                                name="mutualAidAmount"
                                                value={formData.mutualAidAmount || ''}
                                                onChange={handleInputChange}
                                                placeholder="금액 입력"
                                                className="w-full p-2 border border-red-200 rounded font-bold text-right focus:border-red-500 outline-none placeholder:text-slate-300"
                                            />
                                        </div>
                                    )}
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
                                    salary2025={salary2025}
                                    reportSummary={annualReport?.summary}
                                    optionalDeductions={{
                                        includeMealDeduction: formData.includeMealDeduction,
                                        mealDeductionAmount: parseInt(formData.mealDeductionAmount) || 0,
                                        includeMutualAid: formData.includeMutualAid,
                                        mutualAidAmount: parseInt(formData.mutualAidAmount) || 0
                                    }}
                                    deductionBases={{
                                        standardMonthlyIncome: formData.standardMonthlyIncome,
                                        monthlyRemuneration: formData.monthlyRemuneration
                                    }}
                                    onOptionalDeductionChange={(field, value) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            [field]: typeof value === 'boolean' ? value : parseInt(value) || 0
                                        }));
                                    }}
                                    onDeductionBaseChange={(field, value) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            [field]: value
                                        }));
                                    }}
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
                <AnnualReportTable 
                    annualReport={annualReport} 
                    promotionMonth={parseInt(formData.promotionMonth) || null}
                    holidayBonusMonths={formData.holidayBonusMonths}
                    optionalDeductions={{
                        mealDeduction: formData.includeMealDeduction ? (parseInt(formData.mealDeductionAmount) || 0) : 0,
                        mutualAid: formData.includeMutualAid ? (parseInt(formData.mutualAidAmount) || 0) : 0
                    }}
                />

                {/* MODAL */}
                <MonthlyDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    baseData={{
                        grade: formData.grade,
                        hobong: parseInt(formData.hobong),
                        promotionMonth: parseInt(formData.promotionMonth) || null,
                        holidayBonusMonths: formData.holidayBonusMonths,
                        isManager: formData.isManager,
                        hasSpouse: formData.hasSpouse,
                        numChildren: getChildrenObject(),
                        numOthers: parseInt(formData.numOthers),
                        additionalAllowances: {
                            corporation: {
                                amount: parseInt(formData.corporationAllowance || 0),
                                type: formData.corporationType
                            },
                            district: {
                                type: formData.districtType,
                                amount: parseInt(formData.districtAmount || 0),
                                frequency: formData.districtFrequency
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
}
