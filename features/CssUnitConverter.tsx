
import React, { useState, useEffect } from 'react';
import { Ruler, RefreshCw } from 'lucide-react';

export const CssUnitConverter: React.FC = () => {
  const [base, setBase] = useState<number>(16);
  const [px, setPx] = useState<string>('16');
  const [rem, setRem] = useState<string>('1');
  const [em, setEm] = useState<string>('1');
  const [percent, setPercent] = useState<string>('100');

  const updateFromPx = (val: string) => {
    setPx(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRem((num / base).toFixed(4).replace(/\.?0+$/, ''));
      setEm((num / base).toFixed(4).replace(/\.?0+$/, ''));
      setPercent(((num / base) * 100).toFixed(2).replace(/\.?0+$/, ''));
    } else {
      setRem(''); setEm(''); setPercent('');
    }
  };

  const updateFromRem = (val: string) => {
    setRem(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPx((num * base).toFixed(2).replace(/\.?0+$/, ''));
      setEm(val);
      setPercent((num * 100).toFixed(2).replace(/\.?0+$/, ''));
    }
  };

  const updateFromPercent = (val: string) => {
    setPercent(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPx(((num / 100) * base).toFixed(2).replace(/\.?0+$/, ''));
      setRem((num / 100).toFixed(4).replace(/\.?0+$/, ''));
      setEm((num / 100).toFixed(4).replace(/\.?0+$/, ''));
    }
  };

  // Re-calculate when base changes, keeping PX as source of truth
  useEffect(() => {
    updateFromPx(px);
  }, [base]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Ruler size={24} />
           </div>
           <div>
                <h1 className="text-2xl font-bold text-slate-800">CSS Unit Converter</h1>
                <p className="text-sm text-slate-500">Convert between PX, REM, EM, and Percentage</p>
           </div>
        </div>

        <div className="p-8">
           <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 mb-8 flex items-center justify-between">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Base Font Size</label>
                  <p className="text-xs text-slate-500">Usually 16px in most browsers</p>
              </div>
              <div className="flex items-center">
                  <input 
                    type="number" 
                    value={base} 
                    onChange={(e) => setBase(Math.max(1, parseFloat(e.target.value) || 16))}
                    className="w-24 p-2 border border-gray-300 rounded-lg text-center font-bold text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="ml-2 text-slate-500 font-medium">px</span>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              {[
                  { label: 'Pixels (px)', val: px, fn: updateFromPx, step: 1 },
                  { label: 'Root EM (rem)', val: rem, fn: updateFromRem, step: 0.125 },
                  { label: 'EM (em)', val: em, fn: (v:string) => { setEm(v); updateFromRem(v); }, step: 0.125 }, // EM behaves like REM in this context
                  { label: 'Percentage (%)', val: percent, fn: updateFromPercent, step: 10 }
              ].map((unit) => (
                  <div key={unit.label} className="relative group">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{unit.label}</label>
                      <input 
                        type="number" 
                        value={unit.val}
                        onChange={(e) => unit.fn(e.target.value)}
                        step={unit.step}
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl font-mono text-lg text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      />
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
