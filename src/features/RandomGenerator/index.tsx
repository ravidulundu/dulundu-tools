import React, { useState } from 'react';
import { Shuffle, RefreshCw, Copy, Check } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ActionButton } from '@/components/common/ActionButton';

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
         for (let i = 0; i < count; i++) {
            const rand = Math.floor(Math.random() * (max - min + 1)) + min;
            result.push(rand.toString());
         }
      } else {
         const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
         for (let i = 0; i < count; i++) {
            let str = '';
            for (let j = 0; j < strLength; j++) {
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
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={Shuffle}
               title="Random Generator"
               description="Generate random numbers or strings"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex justify-center">
               <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                     onClick={() => setMode('number')}
                     className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'number' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     Numbers
                  </button>
                  <button
                     onClick={() => setMode('string')}
                     className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'string' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     Strings
                  </button>
               </div>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
               <div className="grid md:grid-cols-2 gap-6 h-full">
                  {/* Controls */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                     <div className="space-y-6">
                        {mode === 'number' ? (
                           <>
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Min Value</label>
                                    <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Max Value</label>
                                    <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                 </div>
                              </div>
                           </>
                        ) : (
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">String Length</label>
                              <input type="number" value={strLength} onChange={(e) => setStrLength(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                           </div>
                        )}

                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Quantity to Generate</label>
                           <input type="number" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value))))} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                        </div>

                        <button
                           onClick={generate}
                           className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md flex items-center justify-center"
                        >
                           <RefreshCw size={18} className="mr-2" /> Generate
                        </button>
                     </div>
                  </div>

                  {/* Output */}
                  <CodeEditor
                     value={output.join('\n')}
                     label="Results"
                     placeholder="Generated values will appear here..."
                     readOnly
                     theme="dark"
                     actions={
                        output.length > 0 && (
                           <ActionButton
                              icon={copied ? Check : Copy}
                              label={copied ? 'Copied' : 'Copy All'}
                              onClick={handleCopy}
                              variant={copied ? 'success' : 'primary'}
                           />
                        )
                     }
                  />
               </div>
            </div>
         </div>
      </div>
   );
};
