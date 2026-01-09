// ... imports
import MonthlyDetailModal from './MonthlyDetailModal';

export default function CalculatorLayout() {
    // ... existing state
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // ... existing logic

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-[1400px]">
                {/* Header ... */}

                {/* Main Grid ... */}

                {/* Add Button underneath the grid or somewhere prominent */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setIsDetailModalOpen(true)}
                        className="bg-indigo-600 text-white text-xl font-black py-4 px-10 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <span>📅 월별 급여 상세 시뮬레이션</span>
                    </button>
                </div>

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
                        }
                    }}
                />
            </div>
        </div>
    );
}
