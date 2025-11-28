import React, { useState, useEffect } from 'react';
import { Ruler, RefreshCw, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';

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

  const handleClear = () => {
    setPx('');
    setRem('');
    setEm('');
    setPercent('');
  };

  // Re-calculate when base changes, keeping PX as source of truth
  useEffect(() => {
    if (px) updateFromPx(px);
  }, [base]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={Ruler}
          title="CSS Unit Converter"
          description="Convert between PX, REM, EM, and Percentage"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-slate-600">Base Size:</label>
            <div className="flex items-center">
              <input
                type="number"
                value={base}
                onChange={(e) => setBase(Math.max(1, parseFloat(e.target.value) || 16))}
                className="w-16 bg-transparent font-bold text-slate-800 outline-none text-center border-b border-slate-300 focus:border-primary"
              />
              <span className="ml-1 text-xs text-slate-500 font-bold">px</span>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex items-center justify-center">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
            {[
              { label: 'Pixels (px)', val: px, fn: updateFromPx, step: 1 },
              { label: 'Root EM (rem)', val: rem, fn: updateFromRem, step: 0.125 },
              { label: 'EM (em)', val: em, fn: (v: string) => { setEm(v); updateFromRem(v); }, step: 0.125 }, // EM behaves like REM in this context
              { label: 'Percentage (%)', val: percent, fn: updateFromPercent, step: 10 }
            ].map((unit) => (
              <div key={unit.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-wide">{unit.label}</label>
                <input
                  type="number"
                  value={unit.val}
                  onChange={(e) => unit.fn(e.target.value)}
                  step={unit.step}
                  className="w-full text-3xl font-bold text-slate-800 outline-none border-b-2 border-slate-100 focus:border-primary py-2 bg-transparent transition-colors placeholder-slate-200"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
