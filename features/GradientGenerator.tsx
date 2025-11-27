import React, { useState } from 'react';
import { Palette, Copy, Check, RotateCcw } from 'lucide-react';

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
    setColor1('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
    setColor2('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Palette size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">CSS Gradient Generator</h1>
                <p className="text-sm text-slate-500">Create beautiful linear gradients</p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
             <button onClick={handleRandom} className="p-2 bg-white border border-gray-300 rounded-lg text-slate-600 hover:text-primary hover:border-primary transition-colors" title="Randomize">
                <RotateCcw size={20} />
             </button>
             <button
               onClick={handleCopy}
               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
             >
               {copied ? <Check size={16} className="mr-1.5" /> : <Copy size={16} className="mr-1.5" />}
               {copied ? 'Copied' : 'Copy CSS'}
             </button>
           </div>
        </div>

        <div className="p-8">
           {/* Preview Box */}
           <div 
             className="w-full h-64 rounded-2xl shadow-inner mb-8 transition-all duration-300 border border-gray-100"
             style={{ background: gradient }}
           ></div>

           <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Controls */}
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color 1</label>
                    <div className="flex items-center space-x-3">
                       <input 
                         type="color" 
                         value={color1} 
                         onChange={(e) => setColor1(e.target.value)}
                         className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                       />
                       <input 
                         type="text" 
                         value={color1}
                         onChange={(e) => setColor1(e.target.value)}
                         className="flex-1 p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-primary/50 text-slate-800"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color 2</label>
                    <div className="flex items-center space-x-3">
                       <input 
                         type="color" 
                         value={color2} 
                         onChange={(e) => setColor2(e.target.value)}
                         className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                       />
                       <input 
                         type="text" 
                         value={color2}
                         onChange={(e) => setColor2(e.target.value)}
                         className="flex-1 p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-primary/50 text-slate-800"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Angle ({angle}°)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      value={angle} 
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                 </div>
              </div>

              {/* Output */}
              <div className="flex flex-col">
                 <label className="block text-sm font-medium text-slate-700 mb-2">CSS Code</label>
                 <div className="flex-1">
                    <textarea
                      readOnly
                      value={code}
                      className="w-full h-full min-h-[160px] p-4 bg-[#1e293b] text-gray-50 rounded-xl font-mono text-sm resize-none outline-none border border-slate-700"
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};