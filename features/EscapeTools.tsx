import React, { useState } from 'react';
import { Code, ArrowLeftRight, Copy, Check, Trash2 } from 'lucide-react';

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
       switch(currentMode) {
          case 'html-escape':
             result = text.replace(/[&<>"']/g, function(m) {
                switch(m) {
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
    } catch(e) {
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
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Code size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Escape / Unescape Tools</h1>
                <p className="text-xs md:text-sm text-slate-500">Handle special characters for HTML, JSON, and URLs</p>
             </div>
           </div>
           
           <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
              <Trash2 size={20} />
           </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap gap-2 justify-center">
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
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    mode === opt.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-slate-50 border border-gray-200 text-slate-600 hover:border-primary hover:text-primary'
                }`}
                >
                {opt.label}
                </button>
            ))}
        </div>

        {/* Editor Area - Split View */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input String</label>
              <div className="flex-1 relative rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder="Paste your text here..."
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Output Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">Result</label>
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
              <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                 <textarea
                   readOnly
                   value={output}
                   placeholder="Result will appear here..."
                   className="w-full h-full p-4 bg-[#1e293b] text-gray-50 font-mono text-sm outline-none resize-none leading-relaxed"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};