
import React, { useState, useEffect } from 'react';
import { Cpu, Binary, Calculator } from 'lucide-react';

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
      zeroFillRightShift: safeA >>> 1
    });
  }, [a, b]);

  const toBin = (n: number) => (n >>> 0).toString(2).padStart(32, '0').match(/.{1,8}/g)?.join(' ');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Cpu size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Bitwise Calculator</h1>
                <p className="text-sm text-slate-500">Perform low-level bitwise operations</p>
             </div>
           </div>
        </div>

        <div className="p-8">
           <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 bg-slate-50 rounded-xl border border-gray-200">
                 <label className="block text-sm font-bold text-slate-700 mb-2">Number A</label>
                 <div className="space-y-2">
                    <input 
                      type="number" value={a} onChange={(e) => setA(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                    />
                    <div className="text-xs font-mono text-slate-500 bg-white p-2 rounded border border-gray-200">
                       Bin: {toBin(a)}
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-gray-200">
                 <label className="block text-sm font-bold text-slate-700 mb-2">Number B</label>
                 <div className="space-y-2">
                    <input 
                      type="number" value={b} onChange={(e) => setB(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                    />
                    <div className="text-xs font-mono text-slate-500 bg-white p-2 rounded border border-gray-200">
                       Bin: {toBin(b)}
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid gap-4">
              <h3 className="font-bold text-slate-800">Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {[
                   { label: 'A & B (AND)', val: results.and, icon: Binary },
                   { label: 'A | B (OR)', val: results.or, icon: Binary },
                   { label: 'A ^ B (XOR)', val: results.xor, icon: Binary },
                   { label: '~A (NOT)', val: results.notA, icon: Calculator },
                   { label: 'A << 1 (L. Shift)', val: results.leftShift, icon: Calculator },
                   { label: 'A >> 1 (R. Shift)', val: results.rightShift, icon: Calculator },
                 ].map((op) => (
                    <div key={op.label} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-primary/50 transition-colors">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-600">{op.label}</span>
                          <op.icon size={16} className="text-slate-300" />
                       </div>
                       <div className="text-xl font-bold text-slate-800 mb-1">{op.val}</div>
                       <div className="text-[10px] font-mono text-slate-500 break-all">{toBin(op.val)}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
