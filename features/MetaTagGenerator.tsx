import React, { useState } from 'react';
import { FileSearch, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const MetaTagGenerator: React.FC = () => {
   const [title, setTitle] = useState('Dulundu.tools - Developer Utilities');
   const [description, setDescription] = useState('');
   const [keywords, setKeywords] = useState('');
   const [author, setAuthor] = useState('');
   const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
   const [robots, setRobots] = useState('index, follow');
   const [copied, setCopied] = useState(false);

   const code = `
<!-- Primary Meta Tags -->
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
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={FileSearch}
               title="Meta Tag Generator"
               description="Create SEO friendly meta tags for your website"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
               <button
                  onClick={fillExample}
                  className="text-sm text-primary font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center"
               >
                  <RefreshCw size={14} className="mr-1.5" /> Load Example
               </button>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
               <div className="grid md:grid-cols-2 gap-4 h-full">

                  {/* Form Area - Scrollable */}
                  <div className="overflow-y-auto pr-2 space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Page Title</label>
                        <input
                           type="text"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                           placeholder="e.g. My Awesome Website"
                        />
                        <p className="text-xs text-slate-400 mt-1 flex justify-between">
                           <span>Recommended length: 60 chars</span>
                           <span className={title.length > 60 ? 'text-red-500' : ''}>{title.length}/60</span>
                        </p>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           className="w-full p-3 h-24 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                           placeholder="Brief summary of your page content..."
                        />
                        <p className="text-xs text-slate-400 mt-1 flex justify-between">
                           <span>Recommended length: 160 chars</span>
                           <span className={description.length > 160 ? 'text-red-500' : ''}>{description.length}/160</span>
                        </p>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Keywords</label>
                        <input
                           type="text"
                           value={keywords}
                           onChange={(e) => setKeywords(e.target.value)}
                           className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                           placeholder="comma, separated, keywords"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Author</label>
                           <input
                              type="text"
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Robots</label>
                           <select
                              value={robots}
                              onChange={(e) => setRobots(e.target.value)}
                              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                           >
                              <option value="index, follow">Index, Follow</option>
                              <option value="noindex, follow">No Index, Follow</option>
                              <option value="index, nofollow">Index, No Follow</option>
                              <option value="noindex, nofollow">No Index, No Follow</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Output Area */}
                  <CodeEditor
                     value={code}
                     label="Generated HTML Meta Tags"
                     placeholder="Result will appear here..."
                     readOnly
                     language="html"
                     theme="dark"
                     actions={
                        code && (
                           <ActionButton
                              icon={copied ? Check : Copy}
                              label={copied ? 'Copied' : 'Copy Code'}
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
   );
};
