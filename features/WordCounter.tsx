import React, { useState, useEffect } from 'react';
import { Type, AlignLeft, Trash2, Copy, Check } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpace: 0,
    lines: 0,
    paragraphs: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const lines = text.trim() === '' ? 0 : text.split(/\n/).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== '').length;

    setStats({ words, chars, charsNoSpace, lines, paragraphs });
  }, [text]);

  const transformText = (type: 'upper' | 'lower' | 'capital' | 'sentence') => {
    let newText = text;
    if (type === 'upper') newText = text.toUpperCase();
    if (type === 'lower') newText = text.toLowerCase();
    if (type === 'capital') {
        newText = text.replace(/\b\w/g, l => l.toUpperCase());
    }
    if (type === 'sentence') {
        newText = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
    }
    setText(newText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Type size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Word Counter</h1>
                <p className="text-sm text-slate-500">Analyze text statistics and change case</p>
             </div>
           </div>
           
           <div className="flex space-x-2">
             <button onClick={() => setText('')} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear">
                <Trash2 size={20} />
             </button>
             <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Copy">
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
             </button>
           </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-200 border-b border-gray-200">
           {[
             { label: 'Words', value: stats.words },
             { label: 'Characters', value: stats.chars },
             { label: 'Characters (no space)', value: stats.charsNoSpace },
             { label: 'Lines', value: stats.lines },
             { label: 'Paragraphs', value: stats.paragraphs },
           ].map((stat) => (
             <div key={stat.label} className="bg-white p-4 text-center">
                <div className="text-2xl font-bold text-slate-800">{stat.value.toLocaleString()}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
             </div>
           ))}
        </div>

        <div className="p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-80 p-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y text-base text-slate-700 leading-relaxed shadow-sm bg-white"
            placeholder="Type or paste your text here to analyze..."
          />
          
          <div className="mt-4 flex flex-wrap gap-2">
             <button onClick={() => transformText('upper')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">UPPERCASE</button>
             <button onClick={() => transformText('lower')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">lowercase</button>
             <button onClick={() => transformText('capital')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Capitalize Words</button>
             <button onClick={() => transformText('sentence')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Sentence case</button>
          </div>
        </div>
      </div>
    </div>
  );
};