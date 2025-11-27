import React, { useState } from 'react';
import { Minimize2, Copy, Trash2, Check } from 'lucide-react';

type Lang = 'html' | 'css' | 'js';

export const CodeMinifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [lang, setLang] = useState<Lang>('css');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{original: number, minified: number, savings: string} | null>(null);

  const minify = () => {
    let result = input;
    
    if (lang === 'css') {
      // Basic CSS Minification
      result = result
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, "$1") // Remove space around separators
        .replace(/;}/g, "}") // Remove last semicolon
        .trim();
    } else if (lang === 'html') {
      // Basic HTML Minification
      result = result
        .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/>\s+</g, "><") // Remove space between tags
        .trim();
    } else if (lang === 'js') {
      // Very Safe/Basic JS Minification
      result = result
        .replace(/\/\*[\s\S]*?\*\//g, "") // Block comments
        .replace(/^\s*\/\/.*/gm, "") // Line comments
        .replace(/([;{}])\s+/g, "$1") // Space after semi/brackets
        .replace(/\s+([;{}])/g, "$1") // Space before semi/brackets
        .replace(/\s+/g, " ")
        .trim();
    }

    setOutput(result);
    
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([result]).size;
    const savings = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(2) + '%' : '0%';
    
    setStats({ original: originalSize, minified: minifiedSize, savings });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
      setInput(''); 
      setOutput(''); 
      setStats(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Minimize2 size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Code Minifier</h1>
                <p className="text-xs md:text-sm text-slate-500">Compress HTML, CSS, and JS</p>
             </div>
          </div>

          <div className="flex items-center space-x-2">
             <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                <button onClick={() => setLang('html')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'html' ? 'bg-blue-50 text-primary' : 'text-slate-500 hover:text-slate-700'}`}>HTML</button>
                <button onClick={() => setLang('css')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'css' ? 'bg-blue-50 text-primary' : 'text-slate-500 hover:text-slate-700'}`}>CSS</button>
                <button onClick={() => setLang('js')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'js' ? 'bg-blue-50 text-primary' : 'text-slate-500 hover:text-slate-700'}`}>JS</button>
             </div>

             <button
                onClick={minify}
                disabled={!input.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
             >
                <Minimize2 size={16} className="mr-1.5" />
                Minify
             </button>

             <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
                <Trash2 size={20} />
             </button>
          </div>
        </div>

        {/* Editor Area - Split View */}
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
                    className="w-full h-full p-4 bg-white font-mono text-xs text-slate-800 outline-none resize-none leading-relaxed"
                    placeholder={`Paste your ${lang.toUpperCase()} code here...`}
                    spellCheck={false}
                    />
                 </div>
              </div>

              {/* Output */}
              <div className="flex flex-col h-full min-h-[300px]">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-bold text-slate-700">Minified Output</label>
                        {stats && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">
                            Saved {stats.savings}
                        </span>
                        )}
                    </div>
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
                      className="w-full h-full p-4 font-mono text-xs bg-[#1e293b] text-gray-50 resize-none outline-none leading-relaxed"
                      placeholder="Minified result will appear here..."
                    />
                 </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};