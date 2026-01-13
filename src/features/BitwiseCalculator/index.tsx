import { Cpu, Binary, Calculator, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { ToolHeader } from '@/components/common/ToolHeader';

export const BitwiseCalculator: React.FC = () => {
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);

  const safeA = a || 0;
  const safeB = b || 0;

  const results = {
    and: safeA & safeB,
    or: safeA | safeB,
    xor: safeA ^ safeB,
    notA: ~safeA,
    leftShift: safeA << 1,
    rightShift: safeA >> 1,
    zeroFillRightShift: safeA >>> 1,
  };

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
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Cpu}
          title="Bitwise Calculator"
          description="Perform low-level bitwise operations"
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-end">
          <ActionButton onClick={handleReset} icon={RefreshCw} label="Reset" variant="secondary" />
        </div>
        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                <label
                  htmlFor="input-a"
                  className="block text-xs font-bold text-foreground-muted uppercase mb-2 tracking-wide"
                >
                  Number A
                </label>
                <div className="space-y-3">
                  <input
                    id="input-a"
                    type="number"
                    value={a}
                    onChange={e => setA(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-background-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg"
                  />
                  <div className="text-xs font-mono text-foreground-muted bg-background-secondary p-2 rounded border border-border break-all">
                    Bin: {toBin(a)}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                <label
                  htmlFor="input-b"
                  className="block text-xs font-bold text-foreground-muted uppercase mb-2 tracking-wide"
                >
                  Number B
                </label>
                <div className="space-y-3">
                  <input
                    id="input-b"
                    type="number"
                    value={b}
                    onChange={e => setB(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-background-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg"
                  />
                  <div className="text-xs font-mono text-foreground-muted bg-background-secondary p-2 rounded border border-border break-all">
                    Bin: {toBin(b)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wide border-b border-border pb-2">
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
                    className="p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-foreground-muted uppercase">
                        {op.label}
                      </span>
                      <op.icon size={16} className="text-foreground-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2 font-mono">
                      {op.val}
                    </div>
                    <div className="text-[10px] font-mono text-foreground-secondary break-all bg-background-secondary p-1.5 rounded">
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
