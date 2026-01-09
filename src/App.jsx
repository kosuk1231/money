import React from 'react';
import CalculatorLayout from './components/CalculatorLayout';
import './index.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <CalculatorLayout />
        </div>
    );
}

export default App;
