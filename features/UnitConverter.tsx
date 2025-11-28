import React, { useState } from 'react';
import { Ruler, Calculator, Thermometer, ArrowRight } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';

type UnitType = 'length' | 'weight' | 'temp';

const FACTORS: any = {
  length: {
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    mi: 0.000621371,
    yd: 1.09361,
    ft: 3.28084,
    in: 39.3701
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274
  }
  // Temp is handled specially via formula
};

const LABELS: any = {
  m: 'Meters', km: 'Kilometers', cm: 'Centimeters', mm: 'Millimeters',
  mi: 'Miles', yd: 'Yards', ft: 'Feet', in: 'Inches',
  kg: 'Kilograms', g: 'Grams', mg: 'Milligrams', lb: 'Pounds', oz: 'Ounces',
  c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin'
};

export const UnitConverter: React.FC = () => {
  const [type, setType] = useState<UnitType>('length');
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<string>('m');
  const [to, setTo] = useState<string>('ft');

  // Reset defaults when type changes
  const handleTypeChange = (newType: UnitType) => {
    setType(newType);
    if (newType === 'length') { setFrom('m'); setTo('ft'); }
    if (newType === 'weight') { setFrom('kg'); setTo('lb'); }
    if (newType === 'temp') { setFrom('c'); setTo('f'); }
  };

  const convert = (): number => {
    if (type === 'temp') {
      let celsius = amount;
      if (from === 'f') celsius = (amount - 32) * 5 / 9;
      if (from === 'k') celsius = amount - 273.15;

      if (to === 'c') return celsius;
      if (to === 'f') return (celsius * 9 / 5) + 32;
      if (to === 'k') return celsius + 273.15;
      return 0;
    } else {
      // Base unit conversion (to meters or kg) then to target
      const inBase = amount / FACTORS[type][from];
      return inBase * FACTORS[type][to];
    }
  };

  const units = type === 'temp' ? ['c', 'f', 'k'] : Object.keys(FACTORS[type]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={Calculator}
          title="Unit Converter"
          description="Convert between common physical units"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-center">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => handleTypeChange('length')}
              className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'length' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Ruler size={16} className="mr-2" /> Length
            </button>
            <button
              onClick={() => handleTypeChange('weight')}
              className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'weight' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Calculator size={16} className="mr-2" /> Weight
            </button>
            <button
              onClick={() => handleTypeChange('temp')}
              className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'temp' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Thermometer size={16} className="mr-2" /> Temp
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex items-center justify-center">
          <div className="max-w-4xl w-full grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
            {/* From */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">From</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-4xl font-bold bg-transparent border-b-2 border-slate-200 focus:border-primary outline-none py-2 text-slate-900 mb-6 transition-colors"
              />
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                {units.map(u => <option key={u} value={u}>{LABELS[u]}</option>)}
              </select>
            </div>

            <div className="flex justify-center text-slate-300">
              <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100">
                <ArrowRight size={24} />
              </div>
            </div>

            {/* To */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">To</label>
              <div className="w-full text-4xl font-bold py-2 text-primary mb-6 truncate border-b-2 border-transparent">
                {Number.isInteger(convert()) ? convert() : convert().toFixed(4)}
              </div>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                {units.map(u => <option key={u} value={u}>{LABELS[u]}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};