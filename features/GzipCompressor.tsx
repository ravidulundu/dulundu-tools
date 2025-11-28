import React, { useState } from 'react';
import { Archive, Minimize2, Maximize2, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const GzipCompressor: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ orig: number, res: number } | null>(null);

  const bufferToBase64 = (buffer: Uint8Array): string => {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
  };

  const base64ToBuffer = (base64: string): Uint8Array => {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  const process = async () => {
    if (!input) { setOutput(''); return; }
    setLoading(true);
    setError(null);
    setStats(null);

    try {
      if (mode === 'compress') {
        // Encode text to stream
        const stream = new Blob([input]).stream();
        // Compress stream
        const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
        // Read stream
        const response = new Response(compressedStream);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        const base64 = bufferToBase64(new Uint8Array(buffer));

        setOutput(base64);
        setStats({ orig: input.length, res: base64.length });
      } else {
        // Decompress
        const buffer = base64ToBuffer(input);
        const stream = new Blob([buffer as any]).stream();
        const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
        const response = new Response(decompressedStream);
        const text = await response.text();

        setOutput(text);
        setStats({ orig: input.length, res: text.length });
      }
    } catch (e) {
      setError("Operation failed. Ensure input is valid.");
      console.error(e);
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
    setError(null);
    setStats(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={Archive}
          title="GZip Compressor"
          description="Compress text to Base64 GZip and back"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => { setMode('compress'); setInput(output); setOutput(''); setStats(null); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'compress' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Minimize2 size={16} className="mr-2" /> Compress
            </button>
            <button
              onClick={() => { setMode('decompress'); setInput(output); setOutput(''); setStats(null); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decompress' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Maximize2 size={16} className="mr-2" /> Decompress
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={process}
              disabled={loading || !input}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm disabled:opacity-50"
            >
              {loading ? 'Processing...' : (
                <>
                  {mode === 'compress' ? 'Compress' : 'Decompress'} <ArrowRight size={16} className="ml-1.5" />
                </>
              )}
            </button>

            <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
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
              label={`Input ${mode === 'compress' ? 'Text' : 'Base64 GZip'}`}
              placeholder={mode === 'compress' ? "Type text to compress..." : "Paste Base64 encoded GZip string..."}
              theme="light"
            />

            <CodeEditor
              value={output}
              label={
                <div className="flex items-center gap-2">
                  <span>{mode === 'compress' ? 'Compressed (Base64)' : 'Decompressed Text'}</span>
                  {stats && (
                    <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 rounded text-gray-700">
                      {mode === 'compress'
                        ? `${((1 - stats.res / stats.orig) * 100).toFixed(1)}% saved`
                        : `${stats.res} bytes`}
                    </span>
                  )}
                </div>
              }
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
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-bottom-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
