
import React, { useState } from 'react';
import { ShieldCheck, Play, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export const JsValidator: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{valid: boolean, message: string} | null>(null);

  const validate = () => {
    if (!code.trim()) {
       setResult(null);
       return;
    }

    try {
       // Using Function constructor to parse code. This catches syntax errors.
       // It does NOT execute the code, but merely compiles it.
       new Function(code);
       setResult({ valid: true, message: "Valid JavaScript syntax!" });
    } catch (e) {
       setResult({ valid: false, message: (e as Error).toString() });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">JS Validator</h1>
                <p className="text-sm text-slate-500">Check JavaScript syntax correctness</p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
             <button
               onClick={validate}
               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
             >
               <Play size={16} className="mr-1.5" /> Validate
             </button>
             <button onClick={() => {setCode(''); setResult(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={20} />
             </button>
           </div>
        </div>

        <div className="flex-1 p-6 flex flex-col min-h-0">
           <div className="flex-1 rounded-xl border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm bg-slate-50 text-slate-800 resize-none outline-none"
                placeholder="Paste your JavaScript code here..."
                spellCheck={false}
              />
           </div>

           {result && (
              <div className={`mt-6 p-4 rounded-xl border flex items-start ${result.valid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                 <div className={`p-2 rounded-full mr-3 ${result.valid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {result.valid ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">{result.valid ? 'Syntax Valid' : 'Syntax Error'}</h3>
                    <p className="font-mono text-sm mt-1">{result.message}</p>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
