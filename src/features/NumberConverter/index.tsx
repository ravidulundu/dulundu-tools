import { Binary, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { ToolHeader } from '@/components/common/ToolHeader';

export const NumberConverter: React.FC = () => {
  const [dec, setDec] = useState<string>('0');
  const [bin, setBin] = useState<string>('0');
  const [hex, setHex] = useState<string>('0');
  const [oct, setOct] = useState<string>('0');

  const update = (val: string, type: 'dec' | 'bin' | 'hex' | 'oct') => {
    let decimalValue = 0;

    try {
      if (val === '') {
        setDec('');
        setBin('');
        setHex('');
        setOct('');
        return;
      }

      if (type === 'dec') {
        decimalValue = parseInt(val, 10);
        setDec(val);
      } else if (type === 'bin') {
        decimalValue = parseInt(val, 2);
        setBin(val);
      } else if (type === 'hex') {
        decimalValue = parseInt(val, 16);
        setHex(val);
      } else if (type === 'oct') {
        decimalValue = parseInt(val, 8);
        setOct(val);
      }

      if (!isNaN(decimalValue)) {
        if (type !== 'dec') setDec(decimalValue.toString(10));
        if (type !== 'bin') setBin(decimalValue.toString(2));
        if (type !== 'hex') setHex(decimalValue.toString(16).toUpperCase());
        if (type !== 'oct') setOct(decimalValue.toString(8));
      }
    } catch (e) {
      // Ignore errors for invalid intermediate inputs
    }
  };

  const handleClear = () => {
    setDec('');
    setBin('');
    setHex('');
    setOct('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Binary}
          title="Number Base Converter"
          description="Real-time conversion between Decimal, Binary, Hex, and Octal"
        />
        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
        </div>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50/30 flex flex-col items-center justify-center">
          <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 grid gap-6">
            {[
              { label: 'Decimal', val: dec, type: 'dec', ph: '10' },
              { label: 'Binary', val: bin, type: 'bin', ph: '1010' },
              { label: 'Hexadecimal', val: hex, type: 'hex', ph: 'A' },
              { label: 'Octal', val: oct, type: 'oct', ph: '12' },
            ].map(item => (
              <div
                key={item.label}
                className="flex flex-col md:flex-row md:items-center group gap-2 md:gap-0"
              >
                <div className="w-32 font-semibold text-slate-600 group-hover:text-primary transition-colors">
                  {item.label}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={item.val}
                    onChange={e => update(e.target.value, item.type as any)}
                    className="w-full p-4 bg-white text-slate-900 border border-gray-200 rounded-xl font-mono outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                    placeholder={item.ph}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                    Base{' '}
                    {item.type === 'dec'
                      ? 10
                      : item.type === 'bin'
                        ? 2
                        : item.type === 'hex'
                          ? 16
                          : 8}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
