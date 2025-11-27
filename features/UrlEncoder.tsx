import React, { useState } from 'react';
import { ArrowLeftRight, Link as LinkIcon, Copy, Check, Trash2 } from 'lucide-react';

export const UrlEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = (text: string, currentMode: 'encode' | 'decode') => {
    try {
      if (!text) {
        setOutput('');
        return;
      }
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
    } catch (e) {
      setOutput('Error: Invalid URL format for decoding');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInput(newVal);
    process(newVal, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput(input); 
  };

  const handleCopy = () => {
    if (!output) return;
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
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <LinkIcon size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">URL Encoder / Decoder</h1>
                <p className="text-xs md:text-sm text-slate-500">Encode special characters or decode URL entities</p>
             </div>
           </div>
           
           <div className="flex items-center space-x-2">
              <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
                  <Trash2 size={20} />
              </button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-center">
            <button
              onClick={toggleMode}
              className="flex items-center space-x-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-medium transition-colors border border-slate-200"
            >
              <span className={mode === 'encode' ? 'text-primary font-bold' : ''}>Encode</span>
              <ArrowLeftRight size={16} className="text-slate-400" />
              <span className={mode === 'decode' ? 'text-primary font-bold' : ''}>Decode</span>
            </button>
        </div>

        {/* Editor Area - Split View */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {mode === 'encode' ? 'Decoded URL' : 'Encoded URL'}
              </label>
              <div className="flex-1 relative rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner overflow-hidden">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder={mode === 'encode' ? "Paste URL here to encode..." : "Paste encoded URL here to decode..."}
                />
              </div>
            </div>

            {/* Output Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">
                    {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
                 </label>
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