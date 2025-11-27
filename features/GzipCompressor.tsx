
import React, { useState } from 'react';
import { Archive, Minimize2, Maximize2, Copy, Check, Trash2, ArrowRight } from 'lucide-react';

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
              const stream = new Blob([buffer]).stream();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Archive size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">GZip Compressor</h1>
                <p className="text-xs md:text-sm text-slate-500">Compress text to Base64 GZip and back</p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
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
             <button onClick={() => {setInput(''); setOutput(''); setError(null); setStats(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={20} />
             </button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-center gap-4">
             <button 
               onClick={() => {setMode('compress'); setInput(output); setOutput(''); setStats(null);}}
               className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all border ${mode === 'compress' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-gray-200 hover:border-primary'}`}
             >
                <Minimize2 size={16} className="mr-2" /> Compress
             </button>
             <button 
               onClick={() => {setMode('decompress'); setInput(output); setOutput(''); setStats(null);}}
               className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all border ${mode === 'decompress' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-gray-200 hover:border-primary'}`}
             >
                <Maximize2 size={16} className="mr-2" /> Decompress
             </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                 Input {mode === 'compress' ? 'Text' : 'Base64 GZip'}
              </label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder={mode === 'compress' ? "Type text to compress..." : "Paste Base64 encoded GZip string..."}
                  spellCheck={false}
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-500 font-bold">{error}</p>}
            </div>

            {/* Output */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center space-x-2">
                     <label className="block text-sm font-bold text-slate-700">
                        {mode === 'compress' ? 'Compressed (Base64)' : 'Decompressed Text'}
                     </label>
                     {stats && (
                        <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 rounded text-gray-700">
                            {mode === 'compress' 
                             ? `${((1 - stats.res/stats.orig)*100).toFixed(1)}% saved` 
                             : `${stats.res} bytes`}
                        </span>
                     )}
                 </div>
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
              <div className="flex-1 rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                 <textarea
                   readOnly
                   value={output}
                   placeholder="Result will appear here..."
                   className="w-full h-full p-4 bg-[#1e293b] text-gray-50 font-mono text-sm outline-none resize-none leading-relaxed"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
