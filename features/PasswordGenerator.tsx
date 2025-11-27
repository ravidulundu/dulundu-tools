import React, { useState } from 'react';
import { Lock, RefreshCw, Copy, Check } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;

    if (!chars) {
      setPassword('');
      return;
    }

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setCopied(false);
  };

  React.useEffect(() => {
    generatePassword();
  }, []);

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
          <div className="p-2 bg-blue-100 text-primary rounded-lg">
            <Lock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Password Generator</h1>
            <p className="text-sm text-slate-500">Create strong, secure random passwords</p>
          </div>
        </div>

        <div className="p-8">
          <div className="relative mb-8">
            <input
              type="text"
              value={password}
              readOnly
              className="w-full p-6 pr-20 bg-white border-2 border-slate-200 rounded-2xl text-2xl font-mono text-center text-slate-800 outline-none focus:border-primary/50 transition-all tracking-wider shadow-sm"
            />
            <button
              onClick={handleCopy}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
              title="Copy Password"
            >
              {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-gray-100">
             <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                   <label className="font-semibold text-slate-700">Password Length</label>
                   <span className="text-primary font-bold bg-blue-50 px-2 py-0.5 rounded text-sm">{length} characters</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="64" 
                  value={length} 
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { key: 'uppercase', label: 'Uppercase', ex: 'ABC' },
                  { key: 'lowercase', label: 'Lowercase', ex: 'abc' },
                  { key: 'numbers', label: 'Numbers', ex: '123' },
                  { key: 'symbols', label: 'Symbols', ex: '@#$' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => toggleOption(opt.key as any)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      options[opt.key as keyof typeof options] 
                      ? 'bg-blue-50 border-blue-200 text-primary' 
                      : 'bg-white border-gray-200 text-slate-400'
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className="text-xs opacity-70 mt-1">({opt.ex})</span>
                  </button>
                ))}
             </div>

             <button
               onClick={generatePassword}
               className="w-full py-4 bg-primary text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center"
             >
               <RefreshCw size={24} className="mr-2" />
               Generate New Password
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};