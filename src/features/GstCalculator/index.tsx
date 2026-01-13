import { DollarSign } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';

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
    calculate();
  }, [amount, rate, type]);

  const fmt = (num: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={DollarSign}
          title="GST Calculator"
          description="Calculate GST Inclusive and Exclusive amounts"
        />

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 overflow-y-auto">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
              <div>
                <label
                  htmlFor="initial-amount"
                  className="block text-sm font-bold text-foreground-secondary mb-2"
                >
                  Initial Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted font-bold">
                    $
                  </span>
                  <input
                    id="initial-amount"
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 p-4 bg-background-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-bold text-foreground transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="gst-rate"
                  className="block text-sm font-bold text-foreground-secondary mb-2"
                >
                  GST Rate (%)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[5, 12, 18, 28].map(r => (
                    <button
                      key={r}
                      onClick={() => setRate(r)}
                      className={`py-2 rounded-lg text-sm font-bold transition-all ${rate === r ? 'bg-primary text-white shadow-md' : 'bg-background-secondary text-foreground-secondary hover:bg-background-secondary border border-border'}`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    id="gst-rate"
                    type="number"
                    value={rate}
                    onChange={e => setRate(parseFloat(e.target.value))}
                    className="w-full p-3 bg-background-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-foreground transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted font-bold">
                    %
                  </span>
                </div>
              </div>

              <div>
                <span
                  id="calc-type-label"
                  className="block text-sm font-bold text-foreground-secondary mb-2"
                >
                  Calculation Type
                </span>
                <div
                  role="group"
                  aria-labelledby="calc-type-label"
                  className="grid grid-cols-2 bg-background-secondary p-1 rounded-xl"
                >
                  <button
                    onClick={() => setType('exclusive')}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${type === 'exclusive' ? 'bg-card text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-secondary'}`}
                  >
                    Add GST (Exclusive)
                  </button>
                  <button
                    onClick={() => setType('inclusive')}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${type === 'inclusive' ? 'bg-card text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-secondary'}`}
                  >
                    Remove GST (Inclusive)
                  </button>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-center space-y-6 h-full">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-foreground-muted font-medium">Net Amount</span>
                <span className="text-lg font-bold text-foreground-secondary">
                  {fmt(result.net)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-foreground-muted font-medium">GST Amount ({rate}%)</span>
                <span className="text-lg font-bold text-primary">{fmt(result.gst)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-foreground-secondary font-bold text-lg">Total Amount</span>
                <span className="text-3xl font-extrabold text-foreground">{fmt(result.total)}</span>
              </div>

              <div className="bg-primary-light p-4 rounded-xl border border-border mt-auto">
                <p className="text-xs text-primary leading-relaxed">
                  {type === 'exclusive'
                    ? `To calculate GST, multiply ${fmt(parseFloat(amount))} by ${rate}%. Add the result to the original amount.`
                    : `To remove GST, divide ${fmt(parseFloat(amount))} by (1 + ${rate / 100}). The difference is the GST component.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
