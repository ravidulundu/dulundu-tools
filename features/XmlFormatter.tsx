import React, { useState, useRef } from 'react';
import { FileCode, Maximize2, Minimize2, Copy, Trash2, Check, Upload, Download, AlertCircle } from 'lucide-react';

export const XmlFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatXml = (xml: string) => {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    
    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      let padding = '';
      for (let i = 0; i < pad; i++) {
        padding += '  ';
      }

      formatted += padding + node + '\r\n';
      pad += indent;
    });

    return formatted.trim();
  };

  const minifyXml = (xml: string) => {
      return xml.replace(/>\s+</g, "><").trim();
  };

  const process = (mode: 'beautify' | 'minify') => {
      if (!input.trim()) { setOutput(''); return; }
      
      try {
          // Simple validation check (basic)
          const parser = new DOMParser();
          const doc = parser.parseFromString(input, "application/xml");
          const parserError = doc.querySelector("parsererror");
          if (parserError) {
              throw new Error("Invalid XML Syntax");
          }

          if (mode === 'beautify') {
              setOutput(formatXml(input));
          } else {
              setOutput(minifyXml(input));
          }
          setError(null);
      } catch (e) {
          setError((e as Error).message);
      }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      try {
          setOutput(formatXml(text));
          setError(null);
      } catch (e) {
          setError("Invalid XML in file");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownload = () => {
      if (!output) return;
      const blob = new Blob([output], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <FileCode size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">XML Formatter</h1>
                <p className="text-xs md:text-sm text-slate-500">Beautify and Minify XML data</p>
             </div>
           </div>
           
           <div className="flex items-center space-x-2">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xml" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="hidden md:flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                  <Upload size={16} className="mr-2" /> Upload
              </button>
              <button onClick={() => {setInput(''); setOutput(''); setError(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
              </button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-center gap-3">
            <button 
                onClick={() => process('beautify')} 
                className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
            >
                <Maximize2 size={18} className="mr-2" /> Beautify
            </button>
            <button 
                onClick={() => process('minify')} 
                className="flex items-center px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium border border-slate-200"
            >
                <Minimize2 size={18} className="mr-2" /> Minify
            </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input XML</label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-900 outline-none resize-none leading-relaxed"
                  placeholder="Paste XML here..."
                  spellCheck={false}
                />
              </div>
              {error && (
                <div className="mt-2 flex items-center text-red-600 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                    <AlertCircle size={16} className="mr-2" /> {error}
                </div>
              )}
            </div>

            {/* Output */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">Output</label>
                 <div className="flex gap-2">
                    {output && (
                        <button 
                            onClick={handleDownload}
                            className="text-xs flex items-center bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 text-slate-600 transition-colors"
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
              <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
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