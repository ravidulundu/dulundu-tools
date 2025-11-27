import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Hash } from 'lucide-react';

export const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHash = async (text: string, algorithm: string) => {
    if (!text) {
        setHash('');
        return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    try {
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
    } catch (e) {
        setHash("Error: Algorithm not supported by browser environment.");
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    generateHash(val, algo);
  };

  const handleAlgoChange = (newAlgo: string) => {
    setAlgo(newAlgo);
    generateHash(input, newAlgo);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Hash Generator</h1>
              <p className="text-sm text-slate-500">Generate secure SHA hashes from text</p>
           </div>
        </div>

        <div className="p-8">
           {/* Algorithm Selector */}
           <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(a => (
                <button
                  key={a}
                  onClick={() => handleAlgoChange(a)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                    algo === a 
                    ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                    : 'bg-white text-slate-600 border-gray-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {a}
                </button>
              ))}
           </div>

           <div className="space-y-8">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Input Text</label>
               <textarea
                 value={input}
                 onChange={(e) => handleInputChange(e.target.value)}
                 className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-mono text-sm bg-white shadow-inner text-slate-900"
                 placeholder="Type something here to hash it immediately..."
               />
             </div>

             <div className="relative">
               <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <Hash size={16} className="mr-1 text-primary" />
                  {algo} Output
               </label>
               <div className="relative group">
                 <input
                   type="text"
                   value={hash}
                   readOnly
                   className="w-full p-5 pr-14 bg-[#1e293b] border border-gray-800 rounded-xl font-mono text-sm text-gray-50 outline-none shadow-lg"
                   placeholder="Generated hash will appear here..."
                 />
                 <button 
                   onClick={handleCopy}
                   disabled={!hash}
                   className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600 transition-colors disabled:opacity-50"
                   title="Copy Hash"
                 >
                   {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                 </button>
               </div>
               <p className="mt-3 text-xs text-slate-400 text-center">
                  Note: Web Browsers do not support MD5 via the native Crypto API. Only secure SHA variants are available.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};