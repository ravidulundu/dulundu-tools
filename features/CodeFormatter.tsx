import React, { useState } from 'react';
import { Code2, Wand2, Copy, Trash2, Check, FileCode, Braces } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

type Lang = 'html' | 'css' | 'js';

export const CodeFormatter: React.FC = () => {
   const [input, setInput] = useState('');
   const [output, setOutput] = useState('');
   const [lang, setLang] = useState<Lang>('html');
   const [copied, setCopied] = useState(false);

   const format = () => {
      let result = input;

      if (lang === 'css') {
         result = result
            .replace(/\s*\{\s*/g, ' {\n  ')
            .replace(/;\s*/g, ';\n  ')
            .replace(/,\s*/g, ', ')
            .replace(/\s*\}\s*/g, '\n}\n')
            .replace(/^\s+/gm, '')
            .replace(/;\n\s*\}/g, ';\n}')
            .replace(/\n\s*\n/g, '\n');
      } else if (lang === 'html') {
         let pad = 0;
         result = result
            .replace(/>\s*</g, '><')
            .replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');

         let formatted = '';
         result.split('\r\n').forEach((node) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) indent = 0;
            else if (node.match(/^<\/\w/)) {
               if (pad !== 0) pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1;
            else indent = 0;

            formatted += '  '.repeat(pad) + node + '\r\n';
            pad += indent;
         });
         result = formatted.trim();
      } else if (lang === 'js') {
         result = result
            .replace(/;\s*/g, ';\n')
            .replace(/\{\s*/g, ' {\n  ')
            .replace(/\}\s*/g, '\n}\n');
      }

      setOutput(result);
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

   const getIcon = () => {
      if (lang === 'html') return Code2;
      if (lang === 'css') return Braces;
      return FileCode;
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={getIcon()}
               title="Code Beautifier"
               description="Format and indent messy code"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
               <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                  <button
                     onClick={() => setLang('html')}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'html' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     HTML
                  </button>
                  <button
                     onClick={() => setLang('css')}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'css' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     CSS
                  </button>
                  <button
                     onClick={() => setLang('js')}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'js' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     JS
                  </button>
               </div>

               <div className="flex gap-2">
                  <button
                     onClick={format}
                     disabled={!input.trim()}
                     className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                  >
                     <Wand2 size={16} className="mr-1.5" />
                     Beautify
                  </button>

                  <button
                     onClick={handleClear}
                     className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     title="Clear All"
                  >
                     <Trash2 size={20} />
                  </button>
               </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
               <div className="grid md:grid-cols-2 gap-4 h-full">

                  <CodeEditor
                     value={input}
                     onChange={setInput}
                     label="Input Code"
                     placeholder={`Paste your messy ${lang.toUpperCase()} code here...`}
                     theme="light"
                  />

                  <CodeEditor
                     value={output}
                     label="Beautified Output"
                     placeholder="Formatted result will appear here..."
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
