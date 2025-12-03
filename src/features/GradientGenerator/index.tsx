import { Palette, Copy, Check, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const GradientGenerator: React.FC = () => {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#0f172a');
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  const code = `background: ${gradient};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandom = () => {
    setColor1(
      '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')
    );
    setColor2(
      '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')
    );
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Palette}
          title="CSS Gradient Generator"
          description="Create beautiful linear gradients"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <button
            onClick={handleRandom}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <RotateCcw size={16} /> <span>Randomize</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Preview Box */}
            <div
              className="w-full h-48 md:h-64 rounded-2xl shadow-inner transition-all duration-300 border border-gray-200"
              style={{ background: gradient }}
            ></div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color 1</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={color1}
                      onChange={e => setColor1(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={color1}
                      onChange={e => setColor1(e.target.value)}
                      className="flex-1 p-3 bg-slate-50 border border-gray-200 rounded-lg font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-primary/50 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color 2</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={color2}
                      onChange={e => setColor2(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={color2}
                      onChange={e => setColor2(e.target.value)}
                      className="flex-1 p-3 bg-slate-50 border border-gray-200 rounded-lg font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-primary/50 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Angle ({angle}°)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={e => setAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="h-full">
                <CodeEditor
                  value={code}
                  label="CSS Code"
                  readOnly
                  theme="dark"
                  actions={
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy CSS'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
