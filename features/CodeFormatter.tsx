
import React, { useState } from 'react';
import { Code2, Wand2, Copy, Trash2, Check, FileCode, FileJson, Braces } from 'lucide-react';

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
        .replace(/^\s+/gm, '') // reset indents handled loosely above
        .replace(/;\n\s*\}/g, ';\n}') // fix closing brace indent
        .replace(/\n\s*\n/g, '\n'); // remove double newlines
        // Note: A real CSS beautifier requires a parser. This is a basic regex approximation.
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
       // Very basic JS formatting
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

  const getIcon = () => {
      if (lang === 'html') return <Code2 size={24} />;
      if (lang === 'css') return <Braces size={24} />;
      return <FileCode size={24} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                {getIcon()}
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Code Beautifier</h1>
                <p className="text-xs md:text-sm text-slate-500">Format and indent messy code</p>
             </div>
          </div>

          <div className="flex items-center space-x-2">
             <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                <button onClick={() => setLang('html')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'html' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>HTML</button>
                <button onClick={() => setLang('css')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'css' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>CSS</button>
                <button onClick={() => setLang('js')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'js' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>JS</button>
             </div>

             <button
                onClick={format}
                disabled={!input.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
             >
                <Wand2 size={16} className="mr-1.5" />
                Beautify
             </button>

             <button onClick={() => {setInput(''); setOutput('')}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
                <Trash2 size={20} />
             </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
              {/* Input */}
              <div className="flex flex-col h-full min-h-[300px]">
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Input Code</label>
                 </div>
                 <div className="flex-1 relative rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner overflow-hidden">
                    <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-full p-4 bg-white font-mono text-xs md:text-sm text-slate-800 outline-none resize-none leading-relaxed"
                    placeholder={`Paste your messy ${lang.toUpperCase()} code here...`}
                    spellCheck={false}
                    />
                 </div>
              </div>

              {/* Output */}
              <div className="flex flex-col h-full min-h-[300px]">
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Beautified Output</label>
                    {output && (
                        <button 
                        onClick={handleCopy}
                        className={`text-xs flex items-center px-2 py-1 rounded transition-colors font-medium border ${copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-primary border-primary/20 hover:bg-blue-50'}`}
                        >
                        {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                        {copied ? 'Copied' : 'Copy'}
                        </button>
                    )}
                 </div>
                 <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md group">
                    <textarea
                      value={output}
                      readOnly
                      className="w-full h-full p-4 font-mono text-xs md:text-sm bg-[#1e293b] text-gray-50 resize-none outline-none leading-relaxed"
                      placeholder="Formatted result will appear here..."
                    />
                 </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
