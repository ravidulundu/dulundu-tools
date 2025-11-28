
import React, { useState, useEffect } from 'react';
import { Shield, Key, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

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

   const handleClear = () => {
      setInput('');
      setHash('');
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={Shield}
               title="HMAC Generator"
               description="Hash-based Message Authentication Code"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
               <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                  {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(a => (
                     <button
                        key={a}
                        onClick={() => setAlgo(a)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${algo === a ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        {a}
                     </button>
                  ))}
               </div>

               <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
                  <Trash2 size={20} />
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
               <div className="max-w-4xl mx-auto space-y-6">

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <label className="block text-sm font-bold text-slate-700 mb-2">Secret Key</label>
                     <div className="relative">
                        <input
                           type="text"
                           value={secret}
                           onChange={(e) => setSecret(e.target.value)}
                           className="w-full p-3 pl-10 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                           placeholder="Enter secret key..."
                        />
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <CodeEditor
                        value={input}
                        onChange={setInput}
                        label="Input Message"
                        placeholder="Enter message to hash..."
                        theme="light"
                     />

                     <CodeEditor
                        value={hash}
                        label="HMAC Output"
                        placeholder="HMAC will appear here..."
                        readOnly
                        theme="dark"
                        actions={
                           hash && !hash.startsWith('Error') && (
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
      </div>
   );
};
