import { Eraser, Copy, Check, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const RemovePunctuation: React.FC = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'all' | 'special'>('all');

  const output = useMemo(() => {
    if (!input) return '';

    let result = input;
    if (mode === 'all') {
      // Remove all punctuation
      // Using new RegExp to avoid eslint no-useless-escape on forward slash
      const regex = new RegExp('[.,/#!$%^&*;:{}=_`~()?"\'[\\]<>|@+\\\\-]', 'g');
      result = result.replace(regex, '');
      // Replace multiple spaces with single space
      result = result.replace(/\s{2,}/g, ' ');
    } else {
      // Keep basic sentence structure (.,?!) but remove others
      const regex = new RegExp('[/#$%^&*;:{}=_`~()"\'[\\]<>|@+\\\\-]', 'g');
      result = result.replace(regex, '');
    }
    return result;
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setCopied(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Eraser}
          title="Remove Punctuation"
          description="Clean text by removing symbols and punctuation"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-background-secondary p-1 rounded-lg">
            <button
              onClick={() => setMode('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'all' ? 'bg-card shadow-sm text-primary' : 'text-foreground-muted hover:text-foreground-secondary'}`}
            >
              Remove All Symbols
            </button>
            <button
              onClick={() => setMode('special')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'special' ? 'bg-card shadow-sm text-primary' : 'text-foreground-muted hover:text-foreground-secondary'}`}
            >
              Keep Sentence Marks (.,?!)
            </button>
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-foreground-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input Text"
              placeholder="Paste your text here..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Cleaned Output"
              placeholder="Result will appear here..."
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
