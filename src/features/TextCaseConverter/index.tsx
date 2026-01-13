import { Type, Copy, Check, Trash2 } from 'lucide-react';
import React from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { useToolLogic } from '@/hooks/useToolLogic';

export const TextCaseConverter: React.FC = () => {
  const { input, setInput, output, setOutput, copied, handleCopy, handleClear } = useToolLogic({
    initialInput: 'hello world_this-is a test',
  });

  const convert = (type: string) => {
    let words: string[] =
      input.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
    words = words.map(x => x.toLowerCase());

    let res = '';
    switch (type) {
      case 'camel':
        res = words.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join('');
        break;
      case 'pascal':
        res = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        break;
      case 'snake':
        res = words.join('_');
        break;
      case 'kebab':
        res = words.join('-');
        break;
      case 'constant':
        res = words.join('_').toUpperCase();
        break;
      case 'title':
        res = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      case 'sentence':
        res = words.join(' ');
        res = res.charAt(0).toUpperCase() + res.slice(1);
        break;
      case 'dot':
        res = words.join('.');
        break;
    }
    setOutput(res);
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Type}
          title="Text Case Converter"
          description="Convert between camelCase, snake_case, PascalCase, etc."
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex flex-wrap gap-2 justify-center">
          {[
            { id: 'camel', label: 'camelCase' },
            { id: 'pascal', label: 'PascalCase' },
            { id: 'snake', label: 'snake_case' },
            { id: 'constant', label: 'CONSTANT_CASE' },
            { id: 'kebab', label: 'kebab-case' },
            { id: 'title', label: 'Title Case' },
            { id: 'sentence', label: 'Sentence case' },
            { id: 'dot', label: 'dot.case' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => convert(btn.id)}
              className="px-3 py-1.5 bg-card border border-border rounded-lg text-foreground-secondary font-medium hover:border-primary hover:text-primary hover:shadow-sm transition-all text-xs"
            >
              {btn.label}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-2 hidden md:block"></div>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-danger hover:bg-danger-light rounded-lg transition-colors text-xs font-medium flex items-center"
          >
            <Trash2 size={14} className="mr-1" /> Clear
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input Text"
              placeholder="Type your text here..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Converted Result"
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
    </ToolPageLayout>
  );
};
