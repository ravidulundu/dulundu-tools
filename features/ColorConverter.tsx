import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';

export const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState('rgb(59, 130, 246)');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const newRgb = hexToRgb(val);
      if (newRgb) setRgb(newRgb);
    }
  };

  const handleRgbChange = (val: string) => {
    setRgb(val);
    const match = val.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (match) {
      setHex(rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3])));
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
          <div className="p-2 bg-blue-100 text-primary rounded-lg">
            <Palette size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Color Converter</h1>
            <p className="text-sm text-slate-500">Convert between HEX and RGB formats</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Color Preview */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div 
                className="w-48 h-48 rounded-full shadow-inner border-4 border-white ring-1 ring-gray-200"
                style={{ backgroundColor: hex }}
              ></div>
              <p className="font-mono text-slate-500 text-sm">Preview</p>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">HEX Color</label>
                <div className="relative">
                  <input
                    type="text"
                    value={hex}
                    onChange={handleHexChange}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase bg-white text-slate-800"
                    maxLength={7}
                  />
                  <div 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: hex }}
                  ></div>
                  <button 
                    onClick={() => copyToClipboard(hex, 'hex')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {copied === 'hex' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">RGB Color</label>
                <div className="relative">
                  <input
                    type="text"
                    value={rgb}
                    onChange={(e) => handleRgbChange(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-slate-800"
                    placeholder="rgb(0, 0, 0)"
                  />
                  <button 
                    onClick={() => copyToClipboard(rgb, 'rgb')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {copied === 'rgb' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};