
import React, { useState } from 'react';
import { Shield, Lock, Copy, Check, Trash2, Key } from 'lucide-react';

export const JwtDecoder: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState('');

  const decode = (input: string) => {
    setToken(input);
    setError(null);
    if (!input) {
      setHeader('');
      setPayload('');
      return;
    }

    try {
      const parts = input.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Must have 3 parts separated by dots.");
      }

      const decodePart = (part: string) => {
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.stringify(JSON.parse(json), null, 2);
      };

      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
    } catch (e) {
      // Don't clear output immediately while typing, just show error if it's clearly broken
      // or maybe only show error
      setHeader('');
      setPayload('');
      setError("Invalid JWT Token or Base64 encoding.");
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Shield size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">JWT Decoder</h1>
                <p className="text-xs md:text-sm text-slate-500">Decode JSON Web Tokens (Header & Payload)</p>
             </div>
           </div>
           
           <button onClick={() => decode('')} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={20} />
           </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Encoded Token</label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500'}`}>
                <textarea
                  value={token}
                  onChange={(e) => decode(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed break-all"
                  placeholder="Paste JWT here (eyJ...)"
                  spellCheck={false}
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-500 font-bold">{error}</p>}
            </div>

            {/* Output */}
            <div className="flex flex-col h-full min-h-[300px] overflow-hidden gap-4">
               {/* Header */}
               <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-1">
                     <label className="block text-xs font-bold text-slate-500 uppercase">Header</label>
                     <button onClick={() => handleCopy(header, 'header')} className="text-xs text-purple-600 hover:text-purple-800 flex items-center">
                        {copied === 'header' ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />} Copy
                     </button>
                  </div>
                  <div className="flex-1 relative rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                     <textarea readOnly value={header} className="w-full h-full p-3 font-mono text-xs text-purple-700 resize-none outline-none" />
                  </div>
               </div>
               
               {/* Payload */}
               <div className="flex-[2] flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-1">
                     <label className="block text-xs font-bold text-slate-500 uppercase">Payload</label>
                     <button onClick={() => handleCopy(payload, 'payload')} className="text-xs text-purple-600 hover:text-purple-800 flex items-center">
                        {copied === 'payload' ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />} Copy
                     </button>
                  </div>
                  <div className="flex-1 relative rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                     <textarea readOnly value={payload} className="w-full h-full p-3 font-mono text-xs text-blue-700 resize-none outline-none" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
