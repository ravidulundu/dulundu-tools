import React, { useState, useRef } from "react";
import { FileText, Code, Copy, Check, Trash2 } from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";

export const WordToHtml: React.FC = () => {
  const [html, setHtml] = useState("");
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ToolHeader
          icon={FileText}
          title="Word to HTML"
          description="Paste Word document content to get clean HTML"
        />
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Visual Editor (Paste here)
              </label>
              <button
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.innerHTML = "";
                    setHtml("");
                  }
                }}
                className="text-xs text-red-500 hover:text-red-600 flex items-center"
              >
                <Trash2 size={12} className="mr-1" /> Clear
              </button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              className="flex-1 w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all overflow-y-auto min-h-[400px] prose max-w-none"
              data-placeholder="Paste your Word content here..."
            />
          </div>

          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              HTML Output
            </label>
            <div className="relative flex-1">
              <textarea
                readOnly
                value={html}
                className="w-full h-full p-4 font-mono text-sm bg-[#1e293b] text-gray-50 border border-slate-700 rounded-xl resize-none outline-none min-h-[400px]"
                placeholder="HTML code will appear here..."
              />
              {html && (
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
