
import React, { useState } from 'react';
import { Lock, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import bcrypt from 'bcryptjs';

export const BcryptGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const generateHash = () => {
    if (!password) return;
    setLoading(true);
    // Use timeout to allow UI update before blocking sync operation
    setTimeout(() => {
        try {
            const salt = bcrypt.genSaltSync(rounds);
            const h = bcrypt.hashSync(password, salt);
            setHash(h);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, 50);
  };

  const checkMatch = () => {
      if (!password || !compareHash) {
          setMatchResult(null);
          return;
      }
      const isMatch = bcrypt.compareSync(password, compareHash);
      setMatchResult(isMatch);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Lock size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Bcrypt Generator</h1>
                <p className="text-sm text-slate-500">Hash and verify passwords securely</p>
             </div>
           </div>
        </div>

        <div className="p-8 space-y-8">
           {/* Generator */}
           <div className="bg-slate-50 p-6 rounded-xl border border-gray-200">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                   <RefreshCw size={18} className="mr-2 text-primary" /> Generate Hash
               </h3>
               <div className="grid md:grid-cols-[1fr,150px] gap-4 mb-4">
                   <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                       <input 
                         type="text" 
                         value={password} 
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                         placeholder="Enter plaintext password..."
                       />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Salt Rounds</label>
                       <input 
                         type="number" 
                         min="4" max="15"
                         value={rounds} 
                         onChange={(e) => setRounds(parseInt(e.target.value))}
                         className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                       />
                   </div>
               </div>
               
               <button 
                 onClick={generateHash}
                 disabled={loading || !password}
                 className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-bold disabled:opacity-50 mb-6"
               >
                 {loading ? 'Hashing...' : 'Hash Password'}
               </button>

               {hash && (
                   <div className="bg-white p-4 rounded-lg border border-gray-200 break-all font-mono text-sm text-slate-700 shadow-inner">
                       {hash}
                   </div>
               )}
           </div>

           {/* Verifier */}
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                   <Check size={18} className="mr-2 text-green-600" /> Verify Hash
               </h3>
               <div className="space-y-4">
                   <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hash to check</label>
                       <input 
                         type="text" 
                         value={compareHash} 
                         onChange={(e) => setCompareHash(e.target.value)}
                         className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                         placeholder="$2a$10$..."
                       />
                   </div>
                   
                   <button 
                     onClick={checkMatch}
                     disabled={!password || !compareHash}
                     className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold disabled:opacity-50"
                   >
                     Compare with Password
                   </button>

                   {matchResult !== null && (
                       <div className={`mt-4 p-4 rounded-lg flex items-center font-bold ${matchResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {matchResult ? <Check size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
                           {matchResult ? 'Match! The password is correct.' : 'Do not match.'}
                       </div>
                   )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
