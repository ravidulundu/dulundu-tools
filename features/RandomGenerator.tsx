
import React, { useState } from 'react';
import { Shuffle, RefreshCw, Copy, Check } from 'lucide-react';

export const RandomGenerator: React.FC = () => {
  const [mode, setMode] = useState<'number' | 'string'>('number');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [strLength, setStrLength] = useState(10);
  
  const [output, setOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
     let result: string[] = [];
     
     if (mode === 'number') {
        for(let i=0; i<count; i++) {
           const rand = Math.floor(Math.random() * (max - min + 1)) + min;
           result.push(rand.toString());
        }
     } else {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        for(let i=0; i<count; i++) {
           let str = '';
           for(let j=0; j<strLength; j++) {
              str += chars.charAt(Math.floor(Math.random() * chars.length));
           }
           result.push(str);
        }
     }
     setOutput(result);
  };

  const handleCopy = () => {
     navigator.clipboard.writeText(output.join('\n'));
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <Shuffle size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Random Generator</h1>
              <p className="text-sm text-slate-500">Generate random numbers or strings</p>
           </div>
        </div>

        <div className="p-8">
           {/* Tabs */}
           <div className="flex justify-center mb-8">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                 <button 
                    onClick={() => setMode('number')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'number' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                 >
                    Numbers
                 </button>
                 <button 
                    onClick={() => setMode('string')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'string' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                 >
                    Strings
                 </button>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                 {mode === 'number' ? (
                   <>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Min Value</label>
                           <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value))} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Max Value</label>
                           <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value))} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                     </div>
                   </>
                 ) : (
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">String Length</label>
                      <input type="number" value={strLength} onChange={(e) => setStrLength(parseInt(e.target.value))} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
                   </div>
                 )}

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity to Generate</label>
                    <input type="number" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value))))} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
                 </div>

                 <button 
                    onClick={generate}
                    className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md flex items-center justify-center"
                 >
                    <RefreshCw size={18} className="mr-2" /> Generate
                 </button>
              </div>

              {/* Output */}
              <div className="flex flex-col h-full">
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">Results</label>
                    {output.length > 0 && (
                        <button 
                        onClick={handleCopy}
                        className={`text-xs flex items-center px-2 py-1 rounded transition-colors font-medium border ${copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-primary border-primary/20 hover:bg-blue-50'}`}
                        >
                        {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                        {copied ? 'Copied' : 'Copy All'}
                        </button>
                    )}
                 </div>
                 <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                    <textarea 
                       readOnly 
                       value={output.join('\n')} 
                       className="w-full h-full min-h-[200px] p-4 bg-[#1e293b] text-gray-50 font-mono text-sm resize-none outline-none leading-relaxed"
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
