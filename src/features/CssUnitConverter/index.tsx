import { Ruler, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { ToolHeader } from '@/components/common/ToolHeader';

export const CssUnitConverter: React.FC = () => {
  const [base, setBase] = useState<number>(16);
  const [viewportWidth, setViewportWidth] = useState<number>(1920);
  const [viewportHeight, setViewportHeight] = useState<number>(1080);

  const [px, setPx] = useState<string>('16');
  const [rem, setRem] = useState<string>('1');
  const [em, setEm] = useState<string>('1');
  const [percent, setPercent] = useState<string>('100');
  const [vw, setVw] = useState<string>('0.83');
  const [vh, setVh] = useState<string>('1.48');
  const [vmin, setVmin] = useState<string>('1.48');
  const [vmax, setVmax] = useState<string>('0.83');

  const format = (num: number) => num.toFixed(2).replace(/\.?0+$/, '');

  const clearAll = () => {
    setPx('');
    setRem('');
    setEm('');
    setPercent('');
    setVw('');
    setVh('');
    setVmin('');
    setVmax('');
  };

  const calculateFromPx = React.useCallback(
    (val: string) => {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        setRem(format(num / base));
        setEm(format(num / base));
        setPercent(format((num / base) * 100));
        setVw(format((num / viewportWidth) * 100));
        setVh(format((num / viewportHeight) * 100));
        setVmin(format((num / Math.min(viewportWidth, viewportHeight)) * 100));
        setVmax(format((num / Math.max(viewportWidth, viewportHeight)) * 100));
      } else {
        clearAll();
      }
    },
    [base, viewportWidth, viewportHeight]
  );

  const updateFromPx = (val: string) => {
    setPx(val);
    calculateFromPx(val);
  };

  const updateFromRem = (val: string) => {
    setRem(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const pxVal = num * base;
      setPx(format(pxVal));
      setEm(val);
      setPercent(format(num * 100));
      setVw(format((pxVal / viewportWidth) * 100));
      setVh(format((pxVal / viewportHeight) * 100));
      setVmin(format((pxVal / Math.min(viewportWidth, viewportHeight)) * 100));
      setVmax(format((pxVal / Math.max(viewportWidth, viewportHeight)) * 100));
    }
  };

  const updateFromPercent = (val: string) => {
    setPercent(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const pxVal = (num / 100) * base;
      setPx(format(pxVal));
      setRem(format(num / 100));
      setEm(format(num / 100));
      setVw(format((pxVal / viewportWidth) * 100));
      setVh(format((pxVal / viewportHeight) * 100));
      setVmin(format((pxVal / Math.min(viewportWidth, viewportHeight)) * 100));
      setVmax(format((pxVal / Math.max(viewportWidth, viewportHeight)) * 100));
    }
  };

  const updateFromVw = (val: string) => {
    setVw(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const pxVal = (num / 100) * viewportWidth;
      updateFromPx(format(pxVal));
      setVw(val); // Restore input value to avoid jumping
    }
  };

  const updateFromVh = (val: string) => {
    setVh(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const pxVal = (num / 100) * viewportHeight;
      updateFromPx(format(pxVal));
      setVh(val);
    }
  };

  const updateFromVmin = (val: string) => {
    setVmin(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const pxVal = (num / 100) * Math.min(viewportWidth, viewportHeight);
      updateFromPx(format(pxVal));
      setVmin(val);
    }
  };

  const updateFromVmax = (val: string) => {
    setVmax(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const pxVal = (num / 100) * Math.max(viewportWidth, viewportHeight);
      updateFromPx(format(pxVal));
      setVmax(val);
    }
  };

  const handleClear = () => {
    clearAll();
  };

  const handleBaseChange = (val: string) => {
    const newBase = Math.max(1, parseFloat(val) || 16);
    setBase(newBase);
    // Recalculate from current px
    const num = parseFloat(px);
    if (!isNaN(num)) {
      setRem(format(num / newBase));
      setEm(format(num / newBase));
      setPercent(format((num / newBase) * 100));
    }
  };

  const handleViewportWidthChange = (val: string) => {
    const newWidth = Math.max(1, parseFloat(val) || 1920);
    setViewportWidth(newWidth);
    const num = parseFloat(px);
    if (!isNaN(num)) {
      setVw(format((num / newWidth) * 100));
      setVmin(format((num / Math.min(newWidth, viewportHeight)) * 100));
      setVmax(format((num / Math.max(newWidth, viewportHeight)) * 100));
    }
  };

  const handleViewportHeightChange = (val: string) => {
    const newHeight = Math.max(1, parseFloat(val) || 1080);
    setViewportHeight(newHeight);
    const num = parseFloat(px);
    if (!isNaN(num)) {
      setVh(format((num / newHeight) * 100));
      setVmin(format((num / Math.min(viewportWidth, newHeight)) * 100));
      setVmax(format((num / Math.max(viewportWidth, newHeight)) * 100));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Ruler}
          title="CSS Unit Converter"
          description="Convert between PX, REM, EM, %, VH, VW, VMIN, VMAX"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Base Size */}
            <div className="flex items-center gap-2">
              <label htmlFor="base-size" className="text-sm font-medium text-foreground-secondary whitespace-nowrap">
                Base:
              </label>
              <div className="relative">
                <input
                  id="base-size"
                  type="number"
                  value={base}
                  onChange={e => handleBaseChange(e.target.value)}
                  className="w-20 px-3 py-1.5 pr-8 bg-background-secondary border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-muted">px</span>
              </div>
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Viewport */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground-secondary whitespace-nowrap">
                Viewport:
              </label>
              <input
                id="viewport-width"
                type="number"
                value={viewportWidth}
                onChange={e => handleViewportWidthChange(e.target.value)}
                aria-label="Viewport Width"
                className="w-20 px-3 py-1.5 bg-background-secondary border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <span className="text-foreground-muted text-sm">×</span>
              <input
                id="viewport-height"
                type="number"
                value={viewportHeight}
                onChange={e => handleViewportHeightChange(e.target.value)}
                aria-label="Viewport Height"
                className="w-20 px-3 py-1.5 bg-background-secondary border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background-secondary/30">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                label: 'Pixels (px)',
                val: px,
                fn: updateFromPx,
                step: 1,
                colSpan: 'col-span-2 md:col-span-1',
              },
              {
                label: 'Root EM (rem)',
                val: rem,
                fn: updateFromRem,
                step: 0.125,
                colSpan: 'col-span-2 md:col-span-1',
              },
              {
                label: 'EM (em)',
                val: em,
                fn: (v: string) => {
                  setEm(v);
                  updateFromRem(v);
                },
                step: 0.125,
                colSpan: 'col-span-2 md:col-span-1',
              },
              {
                label: 'Percentage (%)',
                val: percent,
                fn: updateFromPercent,
                step: 10,
                colSpan: 'col-span-2 md:col-span-1',
              },

              {
                label: 'Viewport Width (vw)',
                val: vw,
                fn: updateFromVw,
                step: 1,
                colSpan: 'col-span-1',
              },
              {
                label: 'Viewport Height (vh)',
                val: vh,
                fn: updateFromVh,
                step: 1,
                colSpan: 'col-span-1',
              },
              {
                label: 'Viewport Min (vmin)',
                val: vmin,
                fn: updateFromVmin,
                step: 1,
                colSpan: 'col-span-1',
              },
              {
                label: 'Viewport Max (vmax)',
                val: vmax,
                fn: updateFromVmax,
                step: 1,
                colSpan: 'col-span-1',
              },
            ].map(unit => (
              <div
                key={unit.label}
                className={`bg-card p-4 md:p-6 rounded-xl border border-border shadow-sm transition-all hover:shadow-md ${unit.colSpan}`}
              >
                <label className="block text-xs font-bold text-foreground-muted uppercase mb-3 tracking-wide">
                  {unit.label}
                </label>
                <input
                  type="number"
                  value={unit.val}
                  onChange={e => unit.fn(e.target.value)}
                  step={unit.step}
                  className="w-full text-2xl md:text-3xl font-bold text-foreground outline-none border-b-2 border-border focus:border-primary py-2 bg-transparent transition-colors placeholder-foreground-muted"
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
