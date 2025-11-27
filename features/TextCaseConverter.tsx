
import React, { useState } from 'react';
import { Type, ArrowRight, Copy, Check } from 'lucide-react';

export const TextCaseConverter: React.FC = () => {
  const [input, setInput] = useState('hello world_this-is a test');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (type: string) => {
     let words: string[] = input.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
     words = words.map(x => x.toLowerCase());
     
     let res = '';
     switch(type) {
        case 'camel':
           res = words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
           break;
        case 'pascal':
           res = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
           break;
        case 'snake':
           res = words.join('_');
           break;
        case 'kebab':
           res = words.join('-');
           break;
        case 'constant':
           res = words.join('_').toUpperCase();
           break;
        case 'title':
           res = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
           break;
        case 'sentence':
           res = words.join(' ');
           res = res.charAt(0).toUpperCase() + res.slice(1);
           break;
        case 'dot':
           res = words.join('.');
           break;
     }
     setOutput(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <Type size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Text Case Converter</h1>
              <p className="text-sm text-slate-500">Convert between camelCase, snake_case, PascalCase, etc.</p>
           </div>
        </div>

        <div className="p-8 space-y-8">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Input Text</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none shadow-sm"
                placeholder="Type your text here..."
              />
           </div>

           <div className="flex flex-wrap gap-3 justify-center">
              {[
                  { id: 'camel', label: 'camelCase' },
                  { id: 'pascal', label: 'PascalCase' },
                  { id: 'snake', label: 'snake_case' },
                  { id: 'constant', label: 'CONSTANT_CASE' },
                  { id: 'kebab', label: 'kebab-case' },
                  { id: 'title', label: 'Title Case' },
                  { id: 'sentence', label: 'Sentence case' },
                  { id: 'dot', label: 'dot.case' },
              ].map(btn => (
                 <button 
                   key={btn.id}
                   onClick={() => convert(btn.id)}
                   className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 font-medium hover:border-primary hover:text-primary hover:shadow-sm transition-all text-sm"
                 >
                    {btn.label}
                 </button>
              ))}
           </div>

           <div className="relative">
               <label className="block text-sm font-bold text-slate-700 mb-2">Converted Result</label>
               <div className="relative group">
                  <textarea 
                    readOnly
                    value={output}
                    className="w-full h-32 p-4 bg-slate-900 text-white rounded-xl outline-none resize-none shadow-inner"
                    placeholder="Result will appear here..."
                  />
                  {output && (
                    <button 
                        onClick={handleCopy}
                        className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
