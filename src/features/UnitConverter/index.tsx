import { Ruler, Calculator, Thermometer, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';

type UnitType = 'length' | 'weight' | 'temp';

const FACTORS: Record<string, Record<string, number>> = {
  length: {
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    mi: 0.000621371,
    yd: 1.09361,
    ft: 3.28084,
    in: 39.3701,
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274,
  },
  // Temp is handled specially via formula
};

const LABELS: Record<string, string> = {
  m: 'Meters',
  km: 'Kilometers',
  cm: 'Centimeters',
  mm: 'Millimeters',
  mi: 'Miles',
  yd: 'Yards',
  ft: 'Feet',
  in: 'Inches',
  kg: 'Kilograms',
  g: 'Grams',
  mg: 'Milligrams',
  lb: 'Pounds',
  oz: 'Ounces',
  c: 'Celsius',
  f: 'Fahrenheit',
  k: 'Kelvin',
};

export const UnitConverter: React.FC = () => {
  const [type, setType] = useState<UnitType>('length');
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<string>('m');
  const [to, setTo] = useState<string>('ft');

  // Reset defaults when type changes
  const handleTypeChange = (newType: UnitType) => {
    setType(newType);
    if (newType === 'length') {
      setFrom('m');
      setTo('ft');
    }
    if (newType === 'weight') {
      setFrom('kg');
      setTo('lb');
    }
    if (newType === 'temp') {
      setFrom('c');
      setTo('f');
    }
  };

  const convert = (): number => {
    if (type === 'temp') {
      let celsius = amount;
      if (from === 'f') celsius = ((amount - 32) * 5) / 9;
      if (from === 'k') celsius = amount - 273.15;

      if (to === 'c') return celsius;
      if (to === 'f') return (celsius * 9) / 5 + 32;
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
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Calculator}
          title="Unit Converter"
          description="Convert between common physical units"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-center">
          <div className="flex bg-background-secondary p-1 rounded-lg">
            <button
              onClick={() => handleTypeChange('length')}
              className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'length' ? 'bg-card text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-secondary'}`}
            >
              <Ruler size={16} className="mr-2" /> Length
            </button>
            <button
              onClick={() => handleTypeChange('weight')}
              className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'weight' ? 'bg-card text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-secondary'}`}
            >
              <Calculator size={16} className="mr-2" /> Weight
            </button>
            <button
              onClick={() => handleTypeChange('temp')}
              className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'temp' ? 'bg-card text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-secondary'}`}
            >
              <Thermometer size={16} className="mr-2" /> Temp
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 flex items-center justify-center">
          <div className="max-w-4xl w-full grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
            {/* From */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <label
                htmlFor="from-amount"
                className="block text-xs font-bold text-foreground-muted uppercase tracking-wide mb-3"
              >
                From
              </label>
              <input
                id="from-amount"
                type="number"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-4xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 text-foreground mb-6 transition-colors"
              />
              <select
                id="from-unit"
                aria-label="From Unit"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full p-3 bg-background-secondary border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 font-medium text-foreground-secondary cursor-pointer hover:bg-background-secondary transition-colors"
              >
                {units.map(u => (
                  <option key={u} value={u}>
                    {LABELS[u]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center text-foreground-muted">
              <div className="p-3 bg-card rounded-full shadow-sm border border-border">
                <ArrowRight size={24} />
              </div>
            </div>

            {/* To */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <label
                htmlFor="to-unit"
                className="block text-xs font-bold text-foreground-muted uppercase tracking-wide mb-3"
              >
                To
              </label>
              <div className="w-full text-4xl font-bold py-2 text-primary mb-6 truncate border-b-2 border-transparent">
                {Number.isInteger(convert()) ? convert() : convert().toFixed(4)}
              </div>
              <select
                id="to-unit"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full p-3 bg-background-secondary border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 font-medium text-foreground-secondary cursor-pointer hover:bg-background-secondary transition-colors"
              >
                {units.map(u => (
                  <option key={u} value={u}>
                    {LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
