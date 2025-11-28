import React, { useState } from 'react';
import { Code, Trash2, Copy, Check, ArrowRight } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const HtmlStripper: React.FC = () => {
  const [input, setInput] = useState('<p>Hello <strong>World</strong>!</p>');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const stripHtml = () => {
    // Basic stripping using DOMParser to handle entities correctly
    const doc = new DOMParser().parseFromString(input, 'text/html');
    setOutput(doc.body.textContent || "");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={Code}
          title="HTML Stripper"
          description="Remove HTML tags and extract plain text"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <button
            onClick={stripHtml}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
          >
            Strip Tags <ArrowRight size={18} className="ml-2" />
          </button>

          <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">

            <CodeEditor
              value={input}
              onChange={setInput}
              label="HTML Input"
              placeholder="Paste HTML here..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Plain Text Result"
              placeholder="Stripped text will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
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
