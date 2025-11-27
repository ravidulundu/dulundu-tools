
import React, { useState } from 'react';
import { FileSearch, Copy, Check, RefreshCw } from 'lucide-react';

export const MetaTagGenerator: React.FC = () => {
   const [title, setTitle] = useState('Dulundu.tools - Developer Utilities');
   const [description, setDescription] = useState('');
   const [keywords, setKeywords] = useState('');
   const [author, setAuthor] = useState('');
   const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
   const [robots, setRobots] = useState('index, follow');
   const [copied, setCopied] = useState(false);

   const code = `
   < !--Primary Meta Tags-- >
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<meta name="keywords" content="${keywords}" />
<meta name="author" content="${author}" />
<meta name="viewport" content="${viewport}" />
<meta name="robots" content="${robots}" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />
`.trim();

   const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const fillExample = () => {
      setTitle('Dulundu.tools - Ultimate Developer Utilities');
      setDescription('Free online tools for developers including formatters, converters, and generators.');
      setKeywords('developer tools, json formatter, base64 converter, sql beautifier');
      setAuthor('Dulundu Team');
   };

   return (
      <div className="max-w-6xl mx-auto px-4 py-8">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                     <FileSearch size={24} />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-slate-800">Meta Tag Generator</h1>
                     <p className="text-sm text-slate-500">Create SEO friendly meta tags for your website</p>
                  </div>
               </div>
               <button onClick={fillExample} className="text-sm text-primary font-medium hover:underline flex items-center">
                  <RefreshCw size={14} className="mr-1" /> Load Example
               </button>
            </div>

            <div className="grid md:grid-cols-2">
               <div className="p-8 space-y-6 border-r border-gray-100">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Page Title</label>
                     <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. My Awesome Website" />
                     <p className="text-xs text-slate-400 mt-1">{title.length}/60 recommended</p>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                     <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 h-24 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Brief summary of your page content..." />
                     <p className="text-xs text-slate-400 mt-1">{description.length}/160 recommended</p>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Keywords</label>
                     <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="comma, separated, keywords" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Author</label>
                        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Robots</label>
                        <select value={robots} onChange={(e) => setRobots(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                           <option value="index, follow">Index, Follow</option>
                           <option value="noindex, follow">No Index, Follow</option>
                           <option value="index, nofollow">Index, No Follow</option>
                           <option value="noindex, nofollow">No Index, No Follow</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider">Generated HTML</h3>
                     <button
                        onClick={handleCopy}
                        className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-600 hover:text-primary hover:border-primary transition-colors"
                     >
                        {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                        {copied ? 'Copied' : 'Copy Code'}
                     </button>
                  </div>
                  <div className="flex-1 relative rounded-xl border border-gray-200 bg-white shadow-inner overflow-hidden">
                     <textarea
                        readOnly
                        value={code}
                        className="w-full h-full p-4 font-mono text-sm text-blue-700 resize-none outline-none leading-relaxed"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
