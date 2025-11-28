import React, { useState } from 'react';
import { ShieldCheck, Play, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const JsValidator: React.FC = () => {
   const [code, setCode] = useState('');
   const [result, setResult] = useState<{ valid: boolean, message: string } | null>(null);

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

   const handleClear = () => {
      setCode('');
      setResult(null);
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={ShieldCheck}
               title="JS Validator"
               description="Check JavaScript syntax correctness"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex justify-end gap-2">
               <button
                  onClick={validate}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
               >
                  <Play size={16} className="mr-1.5" /> Validate
               </button>
               <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
                  <Trash2 size={20} />
               </button>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex flex-col">
               <div className="flex-1 min-h-0">
                  <CodeEditor
                     value={code}
                     onChange={setCode}
                     label="JavaScript Code"
                     placeholder="Paste your JavaScript code here..."
                     theme="light"
                  />
               </div>

               {result && (
                  <div className={`mt-6 p-4 rounded-xl border flex items-start animate-in fade-in slide-in-from-bottom-2 ${result.valid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
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
