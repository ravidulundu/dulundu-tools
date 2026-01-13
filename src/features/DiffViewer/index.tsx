import { ArrowRightLeft, Trash2, Upload } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { Button } from '@/components/common/Button';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';

export const DiffViewer: React.FC = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diff, setDiff] = useState<React.ReactNode[] | null>(null);

  const oldFileRef = useRef<HTMLInputElement>(null);
  const newFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setText: (text: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  // Simple line-by-line diff
  const computeDiff = () => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const maxLines = Math.max(oldLines.length, newLines.length);
    const result = [];

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';

      if (oldLine === newLine) {
        result.push(
          <div key={i} className="flex border-b border-border hover:bg-background-secondary group">
            <div className="w-12 p-1 text-right text-foreground-muted text-xs select-none border-r border-border bg-background-secondary font-mono pr-2">
              {i + 1}
            </div>
            <div className="flex-1 p-1 pl-4 font-mono text-sm text-foreground-secondary overflow-x-auto whitespace-pre">
              {oldLine}
            </div>
          </div>
        );
      } else {
        if (oldLine) {
          result.push(
            <div
              key={`d-${i}`}
              className="flex bg-danger-light/50 border-b border-border hover:bg-danger-light transition-colors"
            >
              <div className="w-12 p-1 text-right text-danger text-xs select-none border-r border-border bg-danger-light font-mono pr-2">
                -
              </div>
              <div className="flex-1 p-1 pl-4 font-mono text-sm text-danger overflow-x-auto whitespace-pre">
                {oldLine}
              </div>
            </div>
          );
        }
        if (newLine) {
          result.push(
            <div
              key={`a-${i}`}
              className="flex bg-success-light/50 border-b border-border hover:bg-success-light transition-colors"
            >
              <div className="w-12 p-1 text-right text-success text-xs select-none border-r border-border bg-success-light font-mono pr-2">
                +
              </div>
              <div className="flex-1 p-1 pl-4 font-mono text-sm text-success overflow-x-auto whitespace-pre">
                {newLine}
              </div>
            </div>
          );
        }
      }
    }
    setDiff(result);
  };

  const handleClear = () => {
    setOldText('');
    setNewText('');
    setDiff(null);
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col h-full">
        <ToolHeader
          icon={ArrowRightLeft}
          title="Diff Viewer"
          description="Compare text files line by line"
        />

        {/* Toolbar */}
        <div className="p-3 border-b border-border flex justify-end space-x-2">
          {diff && (
            <ActionButton
              onClick={() => setDiff(null)}
              label="Edit"
              variant="secondary"
              icon={ArrowRightLeft}
            />
          )}
          {!diff && (
            <>
              <input
                ref={oldFileRef}
                type="file"
                onChange={e => handleFileUpload(e, setOldText)}
                className="hidden"
              />
              <ActionButton
                onClick={() => oldFileRef.current?.click()}
                variant="secondary"
                label="Upload Original"
                icon={Upload}
              />

              <input
                ref={newFileRef}
                type="file"
                onChange={e => handleFileUpload(e, setNewText)}
                className="hidden"
              />
              <ActionButton
                onClick={() => newFileRef.current?.click()}
                variant="secondary"
                label="Upload Modified"
                icon={Upload}
              />
            </>
          )}
          <ActionButton onClick={handleClear} variant="danger" label="Clear" icon={Trash2} />
          {!diff && (
            <Button onClick={computeDiff} variant="primary" size="sm" className="font-bold">
              Compare Texts
            </Button>
          )}
        </div>

        {/* Input Area - Only show if no diff computed yet */}
        {!diff ? (
          <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
            <div className="grid md:grid-cols-2 gap-4 h-full">
              <CodeEditor
                value={oldText}
                onChange={setOldText}
                label="Original Text"
                placeholder="Paste original text here..."
                theme="light"
              />

              <CodeEditor
                value={newText}
                onChange={setNewText}
                label="Modified Text"
                placeholder="Paste modified text here..."
                theme="light"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-card">
            <div className="p-2 bg-background-secondary border-b border-border flex justify-between items-center px-4">
              <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                Comparison Result
              </span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">{diff}</div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};
