
import React, { useState } from 'react';
import { Type, ArrowRightLeft, Copy, Check } from 'lucide-react';

export const Utf8Converter: React.FC = () => {
  const [input, setInput] = useState('Hello World 🌍');
  const [outputHex, setOutputHex] = useState('');
  const [outputBin, setOutputBin] = useState('');
  const [outputDec, setOutputDec] = useState('');
  const [copied, setCopied] = useState('');

  const convert = (text: string) => {
    setInput(text);
    if (!text) {
        setOutputHex(''); setOutputBin(''); setOutputDec('');
        return;
    }
    
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    
    // Hex
    let hex = '';
    bytes.forEach(b => hex += `\\x${b.toString(16).padStart(2, '0').toUpperCase()}`);
    setOutputHex(hex);

    // Bin
    let bin = '';
    bytes.forEach(b => bin += `${b.toString(2).padStart(8, '0')} `);
    setOutputBin(bin.trim());

    // Dec
    let dec = '';
    bytes.forEach(b => dec += `${b} `);
    setOutputDec(dec.trim());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  React.useEffect(() => {
    convert(input);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Type size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">UTF-8 Converter</h1>
                <p className="text-sm text-slate-500">Convert text to Hex, Binary, and Decimal bytes</p>
             </div>
           </div>
        </div>

        <div className="p-8 grid gap-8">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Input Text</label>
              <textarea 
                value={input}
                onChange={(e) => convert(e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px]"
                placeholder="Type here..."
              />
           </div>

           <div className="grid gap-6">
              {[
                 { id: 'hex', label: 'Hexadecimal (\\x)', val: outputHex },
                 { id: 'bin', label: 'Binary', val: outputBin },
                 { id: 'dec', label: 'Decimal', val: outputDec },
              ].map(item => (
                 <div key={item.id} className="relative group">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{item.label}</label>
                    <div className="relative">
                        <textarea 
                            readOnly
                            value={item.val}
                            className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl font-mono text-sm text-slate-600 outline-none"
                            rows={3}
                        />
                        <button 
                            onClick={() => handleCopy(item.val, item.id)}
                            className="absolute right-4 top-4 p-2 bg-white border border-gray-200 rounded-lg text-slate-400 hover:text-primary transition-colors shadow-sm"
                        >
                            {copied === item.id ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
