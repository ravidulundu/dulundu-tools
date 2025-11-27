
import React, { useState } from 'react';
import { ArrowRightLeft, FileJson, Copy, Check, Trash2, ArrowDown } from 'lucide-react';

type Mode = 'json-xml' | 'json-csv';

export const JsonConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('json-xml');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper: JSON to XML
  const jsonToXml = (json: any): string => {
     let xml = '';
     if (typeof json === 'object' && json !== null) {
        if (Array.isArray(json)) {
            json.forEach(item => {
                xml += `<item>${jsonToXml(item)}</item>`;
            });
        } else {
            Object.keys(json).forEach(key => {
                xml += `<${key}>${jsonToXml(json[key])}</${key}>`;
            });
        }
     } else {
        xml += json;
     }
     return xml;
  };

  // Helper: JSON to CSV
  const jsonToCsv = (json: any[]): string => {
     if (!Array.isArray(json) || json.length === 0) throw new Error("JSON must be a non-empty array of objects");
     const headers = Object.keys(json[0]);
     const csvRows = [headers.join(',')];
     
     for (const row of json) {
         const values = headers.map(header => {
             const escaped = ('' + row[header]).replace(/"/g, '\\"');
             return `"${escaped}"`;
         });
         csvRows.push(values.join(','));
     }
     return csvRows.join('\n');
  };

  const convert = () => {
      if (!input.trim()) { setOutput(''); return; }
      setError(null);
      
      try {
          const parsed = JSON.parse(input);
          
          if (mode === 'json-xml') {
              const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(parsed)}\n</root>`;
              // Basic pretty print via regex
              const formatted = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3'); 
              setOutput(formatted);
          } else {
              // Ensure array for CSV
              const data = Array.isArray(parsed) ? parsed : [parsed];
              setOutput(jsonToCsv(data));
          }
      } catch (e) {
          setError((e as Error).message);
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
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <FileJson size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">JSON Converter</h1>
                <p className="text-xs md:text-sm text-slate-500">Convert JSON to XML or CSV format</p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
             <button
               onClick={convert}
               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
             >
               Convert <ArrowRightLeft size={16} className="ml-1.5" />
             </button>
             <button onClick={() => {setInput(''); setOutput(''); setError(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={20} />
             </button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-center gap-4">
             <button 
               onClick={() => setMode('json-xml')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${mode === 'json-xml' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-gray-200 hover:border-primary'}`}
             >
                JSON to XML
             </button>
             <button 
               onClick={() => setMode('json-csv')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${mode === 'json-csv' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-gray-200 hover:border-primary'}`}
             >
                JSON to CSV
             </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input JSON</label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder='[{"id": 1, "name": "Test"}]'
                  spellCheck={false}
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">{error}</p>}
            </div>

            {/* Middle Action (Mobile only) */}
            <div className="md:hidden flex justify-center">
                <button onClick={convert} className="p-3 bg-primary text-white rounded-full shadow-lg">
                    <ArrowDown size={24} />
                </button>
            </div>

            {/* Output */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">
                    {mode === 'json-xml' ? 'XML Output' : 'CSV Output'}
                 </label>
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
