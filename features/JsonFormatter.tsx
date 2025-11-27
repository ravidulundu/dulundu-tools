import React, { useState, useRef } from 'react';
import { Copy, Trash2, AlertCircle, FileJson, Minimize2, Maximize2, Check, FileText, Upload, Download, Wrench } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Keep output empty on error to avoid confusion
    }
  };

  // Attempt to fix common JSON errors (trailing commas, single quotes, unquoted keys)
  const fixJson = () => {
    if (!input.trim()) return;

    let fixed = input
      // Replace single quotes with double quotes
      .replace(/'/g, '"')
      // Add quotes to unquoted keys
      .replace(/(\w+):/g, '"$1":')
      // Remove trailing commas
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    try {
      const parsed = JSON.parse(fixed);
      setInput(JSON.stringify(parsed, null, 2)); // Update input with fixed version
      setOutput(JSON.stringify(parsed, null, 2)); // Update output too
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

  const handlePasteSample = () => {
    const sample = {
      "project": "Dulundu.tools",
      "version": 1.0,
      "features": ["JSON Formatter", "Base64", "UUID"],
      "settings": {
        "theme": "light",
        "notifications": true,
        "broken_comma": "oops", // Sample intentional error for testing fix would go here if we wanted
      },
      "active": true
    };
    setInput(JSON.stringify(sample));
    setError(null);
    setOutput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      // Auto-beautify on upload
      try {
        const parsed = JSON.parse(text);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch (err) {
        setError("Uploaded file contains invalid JSON");
      }
    };
    reader.readAsText(file);
    // Reset value so same file can be selected again
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/50 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-primary rounded-lg shadow-sm">
              <FileJson size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">JSON Formatter</h1>
              <p className="text-xs md:text-sm text-slate-500">Validate, Beautify, Minify & Fix</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Upload size={16} className="mr-2" /> Upload
            </button>
            <button
              onClick={handlePasteSample}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileText size={16} className="mr-2" /> Sample
            </button>
            <button
              onClick={handleClear}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
            >
              <Trash2 size={16} className="mr-2" /> Clear
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap justify-center gap-3 md:gap-4 z-10 shadow-sm">
          <button
            onClick={() => processJson('beautify')}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg transform active:scale-95 duration-100"
          >
            <Maximize2 size={18} className="mr-2" /> Beautify
          </button>
          <button
            onClick={() => processJson('minify')}
            className="flex items-center px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium border border-slate-200"
          >
            <Minimize2 size={18} className="mr-2" /> Minify
          </button>
          <button
            onClick={fixJson}
            className="flex items-center px-6 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium border border-amber-200"
            title="Attempt to fix quotes and trailing commas"
          >
            <Wrench size={18} className="mr-2" /> Fix JSON
          </button>
        </div>

        {/* Editor Area - Split View */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                <span>Input</span>
                <span className="text-xs font-normal text-slate-400">Paste or Type</span>
              </label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-900 outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Error Message Area */}
              <div className={`mt-2 min-h-[24px] transition-all duration-300 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                {error && (
                  <div className="flex items-center text-red-600 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Output Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Output</label>
                <div className="flex gap-2">
                  {output && (
                    <button
                      onClick={handleDownload}
                      className="text-xs flex items-center bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 text-slate-600 transition-colors"
                      title="Download JSON"
                    >
                      <Download size={12} className="mr-1" /> Save
                    </button>
                  )}
                  {output && (
                    <button
                      onClick={handleCopy}
                      className={`text-xs flex items-center px-2 py-1 rounded transition-colors font-medium border ${copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-primary border-primary/20 hover:bg-blue-50'}`}
                    >
                      {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md group">
                <textarea
                  readOnly
                  value={output}
                  placeholder="Result will appear here..."
                  className="w-full h-full p-4 bg-[#1e293b] text-gray-50 font-mono text-sm outline-none resize-none leading-relaxed selection:bg-blue-500/30"
                />
              </div>
              <div className="mt-2 min-h-[24px]"></div> {/* Spacer */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};