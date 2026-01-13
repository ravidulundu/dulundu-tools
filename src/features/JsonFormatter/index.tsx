import { Copy, Trash2, AlertCircle, FileJson, Check, Upload, Download, Wrench } from 'lucide-react';
import React, { useCallback } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { useToolLogic } from '@/hooks/useToolLogic';
import { useToolShortcuts } from '@/hooks/useToolShortcuts';

export const JsonFormatter: React.FC = () => {
  const {
    input,
    setInput,
    output,
    setOutput,
    error,
    setError,
    copied,
    fileInputRef,
    handleCopy,
    handleClear,
    handleFileUpload,
    handleDownload,
  } = useToolLogic();

  // Check for input in URL hash (from extension)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('input=')) {
      try {
        const params = new URLSearchParams(hash.substring(1)); // remove #
        const inputParam = params.get('input');
        if (inputParam) {
          const decoded = decodeURIComponent(inputParam);
          setInput(decoded);
          // Optional: Auto-process if valid
          try {
            const parsed = JSON.parse(decoded);
            setTimeout(() => {
              setOutput(JSON.stringify(parsed, null, 2));
              setError(null);
            }, 100);
          } catch (_e) {
            // Ignore parse error
          }

          // Clean URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.error('Failed to parse input from URL', e);
      }
    }
  }, [setInput, setOutput, setError]);

  const processJson = useCallback(
    (mode: 'beautify' | 'minify') => {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      try {
        const parsed = JSON.parse(input);
        if (mode === 'beautify') {
          setOutput(JSON.stringify(parsed, null, 2));
        } else {
          setOutput(JSON.stringify(parsed));
        }
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [input, setOutput, setError]
  );

  // Keyboard shortcuts: Ctrl+Enter to beautify, Ctrl+L to clear, etc.
  useToolShortcuts({
    onExecute: () => processJson('beautify'),
    onClear: handleClear,
    onCopy: handleCopy,
    onDownload: () => handleDownload('formatted.json', 'application/json'),
  });

  const fixJson = () => {
    if (!input.trim()) return;

    const fixed = input
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    try {
      const parsed = JSON.parse(fixed);
      setInput(JSON.stringify(parsed, null, 2));
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (_e) {
      setError('Could not auto-fix JSON. Syntax is too broken.');
    }
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, content => {
      try {
        const parsed = JSON.parse(content);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileJson}
          title="JSON Formatter"
          description="Beautify, minify, and validate JSON data"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => processJson('beautify')}
              title="Beautify (Ctrl+Enter)"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm"
            >
              Beautify
            </button>
            <button
              onClick={() => processJson('minify')}
              title="Minify"
              className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground-secondary transition-colors font-medium text-sm"
            >
              Minify
            </button>
            <button
              onClick={fixJson}
              title="Auto-Fix broken JSON"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm flex items-center"
            >
              <Wrench size={16} className="mr-1" /> Auto-Fix
            </button>
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onFileUpload}
              className="hidden"
            />
            <ActionButton
              onClick={() => fileInputRef.current?.click()}
              icon={Upload}
              label="Upload"
              variant="secondary"
            />
            <ActionButton
              onClick={handleClear}
              icon={Trash2}
              label="Clear"
              variant="danger"
              shortcut="mod+l"
            />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input JSON"
                placeholder='{"key": "value"}'
                theme="light"
              />
              {error && (
                <div className="mt-2 flex items-center text-danger text-sm font-medium bg-danger-light px-3 py-1.5 rounded-lg border border-danger/20">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{error}</span>
                </div>
              )}
            </div>

            <CodeEditor
              value={output}
              label="Output"
              placeholder="Result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() => handleDownload('formatted.json', 'application/json')}
                      variant="secondary"
                      shortcut="mod+s"
                    />
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
                      shortcut="mod+shift+c"
                    />
                  </>
                )
              }
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
