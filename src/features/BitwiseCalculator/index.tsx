import { Cpu, Binary, Calculator, RefreshCw } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { ToolHeader } from '@/components/common/ToolHeader';

export const BitwiseCalculator: React.FC = () => {
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    const safeA = a || 0;
    const safeB = b || 0;
    setResults({
      and: safeA & safeB,
      or: safeA | safeB,
      xor: safeA ^ safeB,
      notA: ~safeA,
      leftShift: safeA << 1,
      rightShift: safeA >> 1,
      zeroFillRightShift: safeA >>> 1,
    });
  }, [a, b]);

  const toBin = (n: number) =>
    (n >>> 0)
      .toString(2)
      .padStart(32, '0')
      .match(/.{1,8}/g)
      ?.join(' ');

  const handleReset = () => {
    setA(0);
    setB(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Cpu}
          title="Bitwise Calculator"
          description="Perform low-level bitwise operations"
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <ActionButton onClick={handleReset} icon={RefreshCw} label="Reset" variant="secondary" />
        </div>
        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">
                  Number A
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={a}
                    onChange={e => setA(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg"
                  />
                  <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-gray-100 break-all">
                    Bin: {toBin(a)}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">
                  Number B
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={b}
                    onChange={e => setB(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg"
                  />
                  <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-gray-100 break-all">
                    Bin: {toBin(b)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                Results
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'A & B (AND)', val: results.and, icon: Binary },
                  { label: 'A | B (OR)', val: results.or, icon: Binary },
                  { label: 'A ^ B (XOR)', val: results.xor, icon: Binary },
                  { label: '~A (NOT)', val: results.notA, icon: Calculator },
                  {
                    label: 'A << 1 (L. Shift)',
                    val: results.leftShift,
                    icon: Calculator,
                  },
                  {
                    label: 'A >> 1 (R. Shift)',
                    val: results.rightShift,
                    icon: Calculator,
                  },
                ].map(op => (
                  <div
                    key={op.label}
                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase">{op.label}</span>
                      <op.icon size={16} className="text-slate-300" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 mb-2 font-mono">{op.val}</div>
                    <div className="text-[10px] font-mono text-slate-400 break-all bg-slate-50 p-1.5 rounded">
                      {toBin(op.val)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
