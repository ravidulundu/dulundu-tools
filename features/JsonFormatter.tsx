import React, { useState, useRef } from 'react';
import { Copy, Trash2, AlertCircle, FileJson, Check, Upload, Download, Wrench } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          try { JSON.parse(decoded); setTimeout(() => processJson('beautify'), 100); } catch (e) { }

          // Clean URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.error('Failed to parse input from URL', e);
      }
    }
  }, []);

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

    let fixed = input
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    try {
      const parsed = JSON.parse(fixed);
      setInput(JSON.stringify(parsed, null, 2));
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError("Could not auto-fix JSON. Syntax is too broken.");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      processJson('beautify');
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
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
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload JSON File"
            >
              <Upload size={20} />
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
                      onClick={handleDownload}
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