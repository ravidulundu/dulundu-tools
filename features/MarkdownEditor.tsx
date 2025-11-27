
import React, { useState, useEffect } from 'react';
import { FileText, Eye, Code, Copy, Check } from 'lucide-react';
import { marked } from 'marked';

export const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is a **Markdown** editor.\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log("Code block");\n```');
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const rawHtml = marked.parse(markdown);
      // marked.parse can return a Promise in some versions/configs, check if it's a string
      if (typeof rawHtml === 'string') {
        setHtml(rawHtml);
      } else {
        (rawHtml as Promise<string>).then(res => setHtml(res));
      }
    } catch (e) {
      // Ignore parsing errors while typing
    }
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-slate-800 text-white rounded-lg">
                <FileText size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Markdown Editor</h1>
                <p className="text-xs md:text-sm text-slate-500">Write Markdown and see live HTML preview</p>
             </div>
           </div>
           
           <button 
             onClick={handleCopy}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center border ${copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-slate-600 border-gray-200 hover:border-primary hover:text-primary'}`}
           >
              {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
              Copy HTML
           </button>
        </div>

        {/* Editor Split View */}
        <div className="flex-1 overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
           {/* Markdown Input */}
           <div className="flex flex-col h-full min-h-[300px] bg-slate-50">
              <div className="p-3 border-b border-gray-200 flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-100">
                 <Code size={14} className="mr-2" /> Markdown Input
              </div>
              <textarea 
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full p-6 bg-slate-50 text-slate-800 font-mono text-sm outline-none resize-none leading-relaxed"
                placeholder="# Type markdown here..."
              />
           </div>

           {/* Preview */}
           <div className="flex flex-col h-full min-h-[300px] bg-white">
              <div className="p-3 border-b border-gray-200 flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider bg-white">
                 <Eye size={14} className="mr-2" /> Live Preview
              </div>
              <div className="flex-1 p-6 overflow-y-auto prose prose-slate prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
