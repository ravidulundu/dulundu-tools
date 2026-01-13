import { FileText, Copy, Check, Trash2 } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';

export const WordToHtml: React.FC = () => {
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      setHtml(editorRef.current.innerHTML);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <ToolHeader
          icon={FileText}
          title="Word to HTML"
          description="Paste Word document content to get clean HTML"
        />
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="block text-sm font-medium text-foreground-secondary">
                Visual Editor (Paste here)
              </div>
              <button
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                    setHtml('');
                  }
                }}
                className="text-xs text-danger hover:text-danger/80 flex items-center"
              >
                <Trash2 size={12} className="mr-1" /> Clear
              </button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              className="flex-1 w-full p-4 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all overflow-y-auto min-h-[400px] prose max-w-none"
              data-placeholder="Paste your Word content here..."
            />
          </div>

          <div className="flex flex-col h-full">
            <label
              htmlFor="html-output"
              className="block text-sm font-medium text-foreground-secondary mb-2"
            >
              HTML Output
            </label>
            <div className="relative flex-1">
              <textarea
                id="html-output"
                readOnly
                value={html}
                className="w-full h-full p-4 font-mono text-sm bg-background-dark text-foreground-inverse border border-border rounded-xl resize-none outline-none min-h-[400px]"
                placeholder="HTML code will appear here..."
              />
              {html && (
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 bg-background-secondary border border-border rounded-lg text-foreground-muted hover:text-foreground transition-colors"
                  title="Copy"
                >
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
