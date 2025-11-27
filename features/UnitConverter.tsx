import React, { useState } from 'react';
import { Ruler, Calculator, Thermometer } from 'lucide-react';

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
      if (from === 'f') celsius = (amount - 32) * 5/9;
      if (from === 'k') celsius = amount - 273.15;
      
      if (to === 'c') return celsius;
      if (to === 'f') return (celsius * 9/5) + 32;
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <Calculator size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Unit Converter</h1>
              <p className="text-sm text-slate-500">Convert between common physical units</p>
           </div>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-slate-100 p-1.5 rounded-xl">
               <button 
                 onClick={() => handleTypeChange('length')}
                 className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === 'length' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
               >
                 <Ruler size={16} className="mr-2" /> Length
               </button>
               <button 
                 onClick={() => handleTypeChange('weight')}
                 className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === 'weight' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
               >
                 <Calculator size={16} className="mr-2" /> Weight
               </button>
               <button 
                 onClick={() => handleTypeChange('temp')}
                 className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === 'temp' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
               >
                 <Thermometer size={16} className="mr-2" /> Temp
               </button>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
             {/* From */}
             <div className="bg-slate-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">From</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-3xl font-bold bg-white border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none p-2 text-slate-900 mb-4 shadow-sm"
                />
                <select 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {units.map(u => <option key={u} value={u}>{LABELS[u]}</option>)}
                </select>
             </div>

             <div className="flex justify-center text-slate-400">
               <div className="p-2 bg-slate-100 rounded-full">=</div>
             </div>

             {/* To */}
             <div className="bg-slate-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">To</label>
                <div className="w-full text-3xl font-bold py-2 text-primary mb-4 truncate">
                   {Number.isInteger(convert()) ? convert() : convert().toFixed(4)}
                </div>
                <select 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
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