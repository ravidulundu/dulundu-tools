import React, { useState } from 'react';
import { Link, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ActionButton } from '@/components/common/ActionButton';

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

   const handleClear = () => {
      setInput('');
      setSlug('');
      setCopied(false);
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={Link}
               title="Slug Generator"
               description="Create SEO-friendly URL slugs"
               iconBgColor="bg-green-100"
               iconColor="text-green-600"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex justify-end items-center">
               <button
                  onClick={handleClear}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear All"
               >
                  <Trash2 size={20} />
               </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
               <div className="grid md:grid-cols-2 gap-4 h-full">

                  <CodeEditor
                     value={input}
                     onChange={setInput}
                     label="Input String"
                     placeholder="e.g. My New Blog Post"
                     theme="light"
                  />

                  <CodeEditor
                     value={slug}
                     label="Generated Slug"
                     placeholder="slug-will-appear-here"
                     readOnly
                     theme="dark"
                     actions={
                        slug && (
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
   );
};
