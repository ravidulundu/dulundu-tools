
import React, { useState, useEffect } from 'react';
import { Shield, Key, Copy, Check } from 'lucide-react';

export const HmacGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('secret_key');
  const [algo, setAlgo] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateHmac();
  }, [input, secret, algo]);

  const generateHmac = async () => {
    if (!input || !secret) {
        setHash('');
        return;
    }
    
    try {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const msgData = encoder.encode(input);

        const key = await crypto.subtle.importKey(
            "raw", 
            keyData, 
            { name: "HMAC", hash: { name: algo } }, 
            false, 
            ["sign"]
        );

        const signature = await crypto.subtle.sign("HMAC", key, msgData);
        const hashArray = Array.from(new Uint8Array(signature));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        setHash(hashHex);
    } catch (e) {
        console.error(e);
        setHash("Error generating HMAC");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Shield size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">HMAC Generator</h1>
                <p className="text-sm text-slate-500">Hash-based Message Authentication Code</p>
             </div>
           </div>
        </div>

        <div className="p-8 space-y-6">
           {/* Controls */}
           <div className="flex justify-center mb-6">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                 {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(a => (
                    <button 
                      key={a}
                      onClick={() => setAlgo(a)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${algo === a ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                       {a}
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Secret Key</label>
              <div className="relative">
                 <input 
                   type="text" 
                   value={secret}
                   onChange={(e) => setSecret(e.target.value)}
                   className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                   placeholder="Enter secret key..."
                 />
                 <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Input Message</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px]"
                placeholder="Enter message to hash..."
              />
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">HMAC Output</label>
              <div className="relative group">
                 <textarea 
                   readOnly
                   value={hash}
                   className="w-full p-4 bg-slate-900 text-green-400 font-mono text-sm rounded-xl outline-none resize-none"
                 />
                 {hash && (
                     <button 
                        onClick={handleCopy}
                        className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                     >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                     </button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
