import { DollarSign } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';

export const GstCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('1000');
  const [rate, setRate] = useState<number>(18);
  const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const [result, setResult] = useState({
    net: 0,
    gst: 0,
    total: 0,
  });

  useEffect(() => {
    calculate();
  }, [amount, rate, type]);

  const calculate = () => {
    const amt = parseFloat(amount) || 0;

    if (type === 'exclusive') {
      // Add GST
      const gstAmt = (amt * rate) / 100;
      const totalAmt = amt + gstAmt;
      setResult({
        net: amt,
        gst: gstAmt,
        total: totalAmt,
      });
    } else {
      // Remove GST (Inclusive)
      const gstAmt = amt - amt * (100 / (100 + rate));
      const netAmt = amt - gstAmt;
      setResult({
        net: netAmt,
        gst: gstAmt,
        total: amt,
      });
    }
  };

  const fmt = (num: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={DollarSign}
          title="GST Calculator"
          description="Calculate GST Inclusive and Exclusive amounts"
        />

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Initial Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 p-4 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-bold text-slate-800 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">GST Rate (%)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[5, 12, 18, 28].map(r => (
                    <button
                      key={r}
                      onClick={() => setRate(r)}
                      className={`py-2 rounded-lg text-sm font-bold transition-all ${rate === r ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-gray-200'}`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(parseFloat(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-800 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Calculation Type
                </label>
                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setType('exclusive')}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${type === 'exclusive' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Add GST (Exclusive)
                  </button>
                  <button
                    onClick={() => setType('inclusive')}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${type === 'inclusive' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Remove GST (Inclusive)
                  </button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center space-y-6 h-full">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-slate-500 font-medium">Net Amount</span>
                <span className="text-lg font-bold text-slate-700">{fmt(result.net)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-slate-500 font-medium">GST Amount ({rate}%)</span>
                <span className="text-lg font-bold text-primary">{fmt(result.gst)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-700 font-bold text-lg">Total Amount</span>
                <span className="text-3xl font-extrabold text-slate-900">{fmt(result.total)}</span>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-auto">
                <p className="text-xs text-blue-600 leading-relaxed">
                  {type === 'exclusive'
                    ? `To calculate GST, multiply ${fmt(parseFloat(amount))} by ${rate}%. Add the result to the original amount.`
                    : `To remove GST, divide ${fmt(parseFloat(amount))} by (1 + ${rate / 100}). The difference is the GST component.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
