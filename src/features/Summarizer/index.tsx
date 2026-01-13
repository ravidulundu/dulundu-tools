import { AlignLeft, Check, Copy, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { summarizeText } from '@/services/aiService';
import { SUMMARY_LENGTH_OPTIONS } from '@/shared/aiConstants';

export const Summarizer: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const result = await summarizeText(input, length);
      setOutput(result);
    } catch (error) {
      console.error('Failed to summarize text:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to summarize text. Please try again.';
      setOutput(`Error: ${message}`);
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
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={AlignLeft}
          title="AI Text Summarizer"
          description="Condense long texts into key points"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center space-x-2 bg-background-secondary p-1 rounded-lg border border-border">
            <span className="text-xs font-medium text-foreground-muted pl-2">Length:</span>
            <select
              value={length}
              onChange={e => setLength(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer p-1"
            >
              {SUMMARY_LENGTH_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSummarize}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-1.5" />
              ) : (
                <RefreshCw size={16} className="mr-1.5" />
              )}
              Summarize
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Original Content"
              placeholder="Paste article, essay or report here..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Summary"
              placeholder="Summary will appear here..."
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
    </ToolPageLayout>
  );
};
