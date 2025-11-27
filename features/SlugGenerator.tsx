
import React, { useState } from 'react';
import { Link, Copy, Check, ArrowDown } from 'lucide-react';

export const SlugGenerator: React.FC = () => {
  const [input, setInput] = useState('Hello World! This is a Title.');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
     generateSlug(input);
  }, [input]);

  const generateSlug = (val: string) => {
    const res = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Link size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Slug Generator</h1>
                <p className="text-sm text-slate-500">Create SEO-friendly URL slugs</p>
             </div>
           </div>
        </div>

        <div className="p-8 space-y-8">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Input String</label>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg"
                placeholder="e.g. My New Blog Post"
              />
           </div>

           <div className="flex justify-center text-slate-300">
              <ArrowDown size={32} />
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Generated Slug</label>
              <div className="relative group">
                 <input 
                   type="text" 
                   readOnly
                   value={slug}
                   className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-primary font-bold text-lg"
                 />
                 <button 
                    onClick={handleCopy}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-slate-500 hover:text-primary rounded-lg border border-gray-200 shadow-sm transition-all"
                 >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
