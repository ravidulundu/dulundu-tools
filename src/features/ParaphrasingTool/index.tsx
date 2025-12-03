import { PenTool, RefreshCw, Copy, Check, Loader2, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { paraphraseText } from '@/services/geminiService';

export const ParaphrasingTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState('professional');
  const [copied, setCopied] = useState(false);

  const handleParaphrase = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const result = await paraphraseText(input, tone);
      setOutput(result);
    } catch (error) {
      setOutput('Error: Failed to paraphrase text. Please try again.');
    } finally {
      setLoading(false);
    }
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
          icon={PenTool}
          title="Paraphrasing Tool"
          description="Rewrite text with AI (Gemini)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg border border-gray-200">
            <span className="text-xs font-medium text-slate-500 pl-2">Tone:</span>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer p-1"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
              <option value="creative">Creative</option>
              <option value="concise">Concise</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleParaphrase}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-1.5" />
              ) : (
                <RefreshCw size={16} className="mr-1.5" />
              )}
              Paraphrase
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Original Text"
              placeholder="Paste text to rewrite..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Rewritten Output"
              placeholder="Paraphrased text will appear here..."
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
