import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, Calendar, TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';

interface AmortizationYear {
    year: number;
    interest: number;
    principal: number;
    balance: number;
}

export const LoanCalculator: React.FC = () => {
    const [amount, setAmount] = useState(100000);
    const [rate, setRate] = useState(5.0);
    const [term, setTerm] = useState(30);

    const [monthly, setMonthly] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [schedule, setSchedule] = useState<AmortizationYear[]>([]);

    useEffect(() => {
        calculate();
    }, [amount, rate, term]);

    const calculate = () => {
        const principal = amount;
        const calculateInterest = rate / 100 / 12;
        const calculatePayments = term * 12;

        const x = Math.pow(1 + calculateInterest, calculatePayments);
        const monthlyVal = (principal * x * calculateInterest) / (x - 1);

        if (isFinite(monthlyVal)) {
            setMonthly(monthlyVal);
            setTotalPayment(monthlyVal * calculatePayments);
            const interestTotal = (monthlyVal * calculatePayments) - principal;
            setTotalInterest(interestTotal);

            // Generate Yearly Schedule
            let balance = principal;
            const yearlyData: AmortizationYear[] = [];
            let currentYearInterest = 0;
            let currentYearPrincipal = 0;

            for (let i = 1; i <= calculatePayments; i++) {
                const interestPayment = balance * calculateInterest;
                const principalPayment = monthlyVal - interestPayment;
                balance -= principalPayment;
                if (balance < 0) balance = 0;

                currentYearInterest += interestPayment;
                currentYearPrincipal += principalPayment;

                if (i % 12 === 0) {
                    yearlyData.push({
                        year: i / 12,
                        interest: currentYearInterest,
                        principal: currentYearPrincipal,
                        balance: balance
                    });
                    currentYearInterest = 0;
                    currentYearPrincipal = 0;
                }
            }
            setSchedule(yearlyData);
        }
    };

    const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    // Format currency
    const fmt = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                <ToolHeader
                    icon={DollarSign}
                    title="Loan Calculator"
                    description="Professional Mortgage & Amortization Calculator"
                />

                <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 md:gap-12">

                        {/* LEFT: Inputs */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                <div>
                                    <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                        <span>Loan Amount</span>
                                        <span className="text-primary">{fmt(amount)}</span>
                                    </label>
                                    <input
                                        type="range" min="5000" max="1000000" step="5000"
                                        value={amount} onChange={e => setAmount(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mb-3"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input
                                            type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                                            className="w-full pl-8 p-3 bg-white text-slate-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                        <span>Interest Rate</span>
                                        <span className="text-primary">{rate}%</span>
                                    </label>
                                    <input
                                        type="range" min="0.1" max="20" step="0.1"
                                        value={rate} onChange={e => setRate(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mb-3"
                                    />
                                    <div className="relative">
                                        <input
                                            type="number" value={rate} onChange={e => setRate(Number(e.target.value))}
                                            className="w-full p-3 bg-white text-slate-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold shadow-sm"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                        <span>Loan Term</span>
                                        <span className="text-primary">{term} Years</span>
                                    </label>
                                    <input
                                        type="range" min="1" max="50" step="1"
                                        value={term} onChange={e => setTerm(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mb-3"
                                    />
                                    <div className="relative">
                                        <input
                                            type="number" value={term} onChange={e => setTerm(Number(e.target.value))}
                                            className="w-full p-3 bg-white text-slate-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold shadow-sm"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Years</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CENTER: Dashboard & Visuals */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Hero Stats */}
                            <div className="grid md:grid-cols-2 gap-6 items-center">
                                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-center h-full">
                                    <span className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-2">Monthly Payment</span>
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-4xl lg:text-5xl font-extrabold text-primary">${monthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">Principal & Interest only</p>
                                </div>

                                {/* Donut Chart Visualization */}
                                <div className="flex items-center justify-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                    {/* Conic Gradient: Primary (Blue) for Principal, Slate-200 (Light Gray) for Interest */}
                                    <div className="relative w-40 h-40 rounded-full flex items-center justify-center"
                                        style={{ background: `conic-gradient(#3b82f6 ${100 - interestPercentage}%, #cbd5e1 0)` }}>
                                        <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                                            <PieChart className="text-slate-300 mb-1" size={24} />
                                            <span className="text-xs font-bold text-slate-400">Ratio</span>
                                        </div>
                                    </div>
                                    <div className="ml-6 space-y-3">
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                                            <div>
                                                <p className="text-xs text-slate-500">Principal</p>
                                                <p className="font-bold text-slate-800">{fmt(amount)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-slate-300 mr-2"></span>
                                            <div>
                                                <p className="text-xs text-slate-500">Interest</p>
                                                <p className="font-bold text-slate-800">{fmt(totalInterest)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Breakdown Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                                    <div className="p-2 bg-blue-50 text-primary rounded-lg mb-2"><CircleDollarSign size={20} /></div>
                                    <p className="text-xs text-slate-500 font-medium">Total Cost</p>
                                    <p className="text-lg font-bold text-slate-800">{fmt(totalPayment)}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                                    <div className="p-2 bg-blue-50 text-primary rounded-lg mb-2"><TrendingDown size={20} /></div>
                                    <p className="text-xs text-slate-500 font-medium">Principal Paid</p>
                                    <p className="text-lg font-bold text-slate-800">{fmt(amount)}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                                    <div className="p-2 bg-blue-50 text-primary rounded-lg mb-2"><TrendingUp size={20} /></div>
                                    <p className="text-xs text-slate-500 font-medium">Interest Paid</p>
                                    <p className="text-lg font-bold text-slate-800">{fmt(totalInterest)}</p>
                                </div>
                            </div>

                            {/* Amortization Table */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-700 flex items-center">
                                        <Calendar size={18} className="mr-2 text-primary" />
                                        Yearly Amortization Schedule
                                    </h3>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Year</th>
                                                <th className="px-4 py-3 font-medium text-right">Interest</th>
                                                <th className="px-4 py-3 font-medium text-right">Principal</th>
                                                <th className="px-4 py-3 font-medium text-right">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {schedule.map((row) => (
                                                <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-slate-700">Year {row.year}</td>
                                                    <td className="px-4 py-3 text-right text-slate-500">{fmt(row.interest)}</td>
                                                    <td className="px-4 py-3 text-right text-slate-500">{fmt(row.principal)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-800">{fmt(row.balance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};