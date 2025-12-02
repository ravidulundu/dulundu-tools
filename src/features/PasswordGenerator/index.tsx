import React, { useState } from 'react';
import { Lock, RefreshCw, Copy, Check } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ActionButton } from '@/components/common/ActionButton';

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
  }, [length, options]);

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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={Lock}
          title="Password Generator"
          description="Create strong, secure random passwords"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <button
            onClick={generatePassword}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
          >
            <RefreshCw size={16} className="mr-1.5" />
            Generate New Password
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex flex-col items-center justify-center">
          <div className="max-w-3xl w-full flex flex-col gap-8">

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all group-hover:blur-2xl"></div>
              <div className="relative bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="text-4xl md:text-5xl font-mono font-bold text-slate-800 break-all tracking-wider mb-2">{password}</div>
                <p className="text-slate-400 text-sm font-medium">Strength: Strong</p>

                <div className="absolute top-4 right-4">
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied' : 'Copy'}
                    onClick={handleCopy}
                    variant={copied ? 'success' : 'secondary'}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-bold text-slate-700">Password Length</label>
                  <span className="text-primary font-bold bg-blue-50 px-3 py-1 rounded-lg text-sm">{length} characters</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'uppercase', label: 'Uppercase', ex: 'ABC' },
                  { key: 'lowercase', label: 'Lowercase', ex: 'abc' },
                  { key: 'numbers', label: 'Numbers', ex: '123' },
                  { key: 'symbols', label: 'Symbols', ex: '@#$' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => toggleOption(opt.key as any)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${options[opt.key as keyof typeof options]
                      ? 'bg-blue-50 border-primary/30 text-primary shadow-sm'
                      : 'bg-white border-gray-100 text-slate-400 hover:border-gray-200'
                      }`}
                  >
                    <span className="font-bold text-sm">{opt.label}</span>
                    <span className="text-xs opacity-60 mt-1 font-mono">({opt.ex})</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};