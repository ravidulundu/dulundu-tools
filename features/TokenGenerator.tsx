
import React, { useState } from 'react';
import { Key, RefreshCw, Copy, Check } from 'lucide-react';

export const TokenGenerator: React.FC = () => {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(5);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
    hex: false
  });
  const [tokens, setTokens] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = '';
    if (options.hex) {
        charset = '0123456789abcdef';
    } else {
        if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.numbers) charset += '0123456789';
        if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (!charset) return;

    const result = [];
    const randomBuffer = new Uint32Array(length);

    for (let i = 0; i < count; i++) {
        let token = '';
        window.crypto.getRandomValues(randomBuffer);
        for (let j = 0; j < length; j++) {
            token += charset[randomBuffer[j] % charset.length];
        }
        result.push(token);
    }
    setTokens(result);
  };

  React.useEffect(() => {
    generate();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(tokens.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof typeof options) => {
     setOptions(prev => {
         const next = { ...prev, [key]: !prev[key] };
         if (key === 'hex' && !prev.hex) {
             // If Hex enabled, disable others to show clear UI state (logic handles it anyway)
             return { lowercase: false, uppercase: false, numbers: false, symbols: false, hex: true };
         }
         if (key !== 'hex' && next[key]) {
             // If other enabled, disable hex
             return { ...next, hex: false };
         }
         return next;
     });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Key size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Token Generator</h1>
              <p className="text-sm text-slate-500">Generate random API keys, secrets, and tokens</p>
           </div>
        </div>

        <div className="p-8">
           <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 mb-8">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Length ({length})</label>
                    <input type="range" min="8" max="128" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity ({count})</label>
                    <input type="range" min="1" max="20" value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                 </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                 {[
                     { id: 'lowercase', label: 'a-z' },
                     { id: 'uppercase', label: 'A-Z' },
                     { id: 'numbers', label: '0-9' },
                     { id: 'symbols', label: '!@#' },
                     { id: 'hex', label: 'Hex (0-f)' },
                 ].map(opt => (
                     <button
                       key={opt.id}
                       onClick={() => toggleOption(opt.id as any)}
                       className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                           options[opt.id as keyof typeof options]
                           ? 'bg-white border-primary text-primary shadow-sm'
                           : 'bg-transparent border-gray-300 text-slate-400 hover:border-gray-400'
                       }`}
                     >
                        {opt.label}
                     </button>
                 ))}
              </div>
              
              <button onClick={generate} className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 font-bold shadow-md flex items-center justify-center">
                  <RefreshCw size={18} className="mr-2" /> Generate Tokens
              </button>
           </div>

           <div className="relative group">
               <div className="absolute top-4 right-4 z-10">
                   <button 
                     onClick={handleCopy} 
                     className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
                   >
                     {copied ? <Check size={14} /> : <Copy size={14} />}
                     <span>{copied ? 'Copied' : 'Copy All'}</span>
                   </button>
               </div>
               <div className="bg-slate-900 rounded-xl p-6 shadow-inner min-h-[200px] font-mono text-sm text-emerald-400 break-all leading-loose">
                   {tokens.map((t, i) => (
                       <div key={i} className="border-b border-slate-800 last:border-0 pb-2 mb-2 last:mb-0 last:pb-0">
                           {t}
                       </div>
                   ))}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
