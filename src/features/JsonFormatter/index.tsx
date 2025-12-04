import { Copy, Trash2, AlertCircle, FileJson, Check, Upload, Download, Wrench } from 'lucide-react';
import React from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

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

  const processJson = (mode: 'beautify' | 'minify') => {
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
  };

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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileJson}
          title="JSON Formatter"
          description="Beautify, minify, and validate JSON data"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => processJson('beautify')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              Beautify
            </button>
            <button
              onClick={() => processJson('minify')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              Minify
            </button>
            <button
              onClick={fixJson}
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
            <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
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
                <div className="mt-2 flex items-center text-red-600 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
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
                    />
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
                    />
                  </>
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
