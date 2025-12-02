import React, { useState } from 'react';
import { Code, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ActionButton } from '@/components/common/ActionButton';

type Mode = 'html-escape' | 'html-unescape' | 'json-escape' | 'json-unescape' | 'url-escape' | 'url-unescape';

export const EscapeTools: React.FC = () => {
   const [input, setInput] = useState('');
   const [output, setOutput] = useState('');
   const [mode, setMode] = useState<Mode>('html-escape');
   const [copied, setCopied] = useState(false);

   const process = (text: string, currentMode: Mode) => {
      try {
         if (!text) { setOutput(''); return; }

         let result = '';
         switch (currentMode) {
            case 'html-escape':
               result = text.replace(/[&<>"']/g, function (m) {
                  switch (m) {
                     case '&': return '&amp;';
                     case '<': return '&lt;';
                     case '>': return '&gt;';
                     case '"': return '&quot;';
                     case "'": return '&#039;';
                     default: return m;
                  }
               });
               break;
            case 'html-unescape':
               const doc = new DOMParser().parseFromString(text, "text/html");
               result = doc.documentElement.textContent || "";
               break;
            case 'json-escape':
               result = JSON.stringify(text).slice(1, -1);
               break;
            case 'json-unescape':
               result = JSON.parse(`"${text}"`);
               break;
            case 'url-escape':
               result = encodeURIComponent(text);
               break;
            case 'url-unescape':
               result = decodeURIComponent(text);
               break;
         }
         setOutput(result);
      } catch (e) {
         setOutput("Error: Invalid input for this operation.");
      }
   };

   const handleInputChange = (val: string) => {
      setInput(val);
      process(val, mode);
   };

   const handleModeChange = (newMode: Mode) => {
      setMode(newMode);
      process(input, newMode);
   };

   const handleCopy = () => {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const handleClear = () => {
      setInput('');
      setOutput('');
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={Code}
               title="String Escaper & Encoder"
               description="Handle special characters for HTML, JSON, and URLs"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap gap-2 justify-between items-center">
               <div className="flex flex-wrap gap-2">
                  {[
                     { id: 'html-escape', label: 'HTML Escape' },
                     { id: 'html-unescape', label: 'HTML Unescape' },
                     { id: 'json-escape', label: 'JSON Escape' },
                     { id: 'json-unescape', label: 'JSON Unescape' },
                     { id: 'url-escape', label: 'URL Encode' },
                     { id: 'url-unescape', label: 'URL Decode' },
                  ].map(opt => (
                     <button
                        key={opt.id}
                        onClick={() => handleModeChange(opt.id as Mode)}
                        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${mode === opt.id
                           ? 'bg-primary text-white shadow-md'
                           : 'bg-slate-50 border border-gray-200 text-slate-600 hover:border-primary hover:text-primary'
                           }`}
                     >
                        {opt.label}
                     </button>
                  ))}
               </div>

               <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
                  <Trash2 size={20} />
               </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
               <div className="grid md:grid-cols-2 gap-4 h-full">

                  <CodeEditor
                     value={input}
                     onChange={handleInputChange}
                     label="Input String"
                     placeholder="Paste your text here..."
                     theme="light"
                  />

                  <CodeEditor
                     value={output}
                     label="Result"
                     placeholder="Result will appear here..."
                     readOnly
                     theme="dark"
                     actions={
                        output && (
                           <ActionButton
                              icon={copied ? Check : Copy}
                              label={copied ? 'Copied' : 'Copy'}
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