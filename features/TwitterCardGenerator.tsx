
import React, { useState } from 'react';
import { Twitter, Copy, Check, Eye } from 'lucide-react';

export const TwitterCardGenerator: React.FC = () => {
   const [type, setType] = useState('summary_large_image');
   const [site, setSite] = useState('@dulundutools');
   const [title, setTitle] = useState('Amazing Developer Tools');
   const [desc, setDesc] = useState('Free online utilities for developers. Format JSON, convert images, generate UUIDs and more.');
   const [image, setImage] = useState('https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80');
   const [copied, setCopied] = useState(false);

   const metaTags = `<!-- Twitter Card data -->
<meta name="twitter:card" content="${type}">
<meta name="twitter:site" content="${site}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">

<!-- Open Graph data -->
<meta property="og:title" content="${title}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="http://www.example.com/" />
<meta property="og:image" content="${image}" />
<meta property="og:description" content="${desc}" />`;

   const handleCopy = () => {
      navigator.clipboard.writeText(metaTags);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div className="max-w-6xl mx-auto px-4 py-8">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
               <div className="p-2 bg-blue-100 text-primary rounded-lg">
                  <Twitter size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-slate-800">Twitter Card Generator</h1>
                  <p className="text-sm text-slate-500">Create meta tags for social media previews</p>
               </div>
            </div>

            <div className="grid lg:grid-cols-2">
               {/* Form */}
               <div className="p-6 space-y-6 border-r border-gray-100">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Card Type</label>
                     <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                     >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                        <option value="app">App</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Site Username</label>
                     <input
                        type="text" value={site} onChange={(e) => setSite(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                     <input
                        type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                     <textarea
                        value={desc} onChange={(e) => setDesc(e.target.value)}
                        className="w-full p-3 h-24 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        maxLength={200}
                     />
                     <p className="text-xs text-right text-slate-400 mt-1">{desc.length}/200</p>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                     <input
                        type="text" value={image} onChange={(e) => setImage(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                     />
                  </div>
               </div>

               {/* Preview & Code */}
               <div className="bg-slate-50 p-6 flex flex-col gap-8">

                  <div>
                     <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center">
                        <Eye size={16} className="mr-2" /> Live Preview
                     </h3>

                     {/* Card Preview Container */}
                     <div className="max-w-md mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        {type === 'summary_large_image' && (
                           <div className="h-48 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
                        )}
                        <div className={`p-4 ${type === 'summary' ? 'flex items-start' : ''}`}>
                           {type === 'summary' && (
                              <div className="w-24 h-24 bg-gray-100 rounded-lg bg-cover bg-center mr-4 flex-shrink-0" style={{ backgroundImage: `url(${image})` }}></div>
                           )}
                           <div>
                              <h4 className="font-bold text-slate-900 leading-tight mb-1">{title}</h4>
                              <p className="text-sm text-slate-600 line-clamp-2 mb-2">{desc}</p>
                              <p className="text-xs text-slate-400">{site.replace('@', '')}.com</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Generated Meta Tags</h3>
                        <button
                           onClick={handleCopy}
                           className="text-xs flex items-center px-2 py-1 rounded bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors font-medium"
                        >
                           {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                           {copied ? 'Copied' : 'Copy Code'}
                        </button>
                     </div>
                     <div className="flex-1 relative rounded-xl border border-gray-300 bg-white overflow-hidden shadow-inner">
                        <textarea
                           readOnly
                           value={metaTags}
                           className="w-full h-full p-4 font-mono text-xs text-slate-600 resize-none outline-none leading-relaxed"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
