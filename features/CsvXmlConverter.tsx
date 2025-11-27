
import React, { useState } from 'react';
import { Table, ArrowRight, Copy, Check, Trash2, FileCode } from 'lucide-react';

export const CsvXmlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
      if (!input.trim()) {
          setOutput('');
          return;
      }
      
      try {
          const lines = input.trim().split('\n');
          if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row");
          
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').replace(/\s+/g, '_')); // Sanitize tag names
          
          let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';

          for (let i = 1; i < lines.length; i++) {
              const currentline = lines[i].split(',');
              xml += '  <row>\n';
              for (let j = 0; j < headers.length; j++) {
                  let val = currentline[j]?.trim() || '';
                  val = val.replace(/^"|"$/g, '');
                  // Escape XML special chars
                  val = val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                  xml += `    <${headers[j]}>${val}</${headers[j]}>\n`;
              }
              xml += '  </row>\n';
          }
          xml += '</root>';
          
          setOutput(xml);
          setError(null);
      } catch (e) {
          setError("Error parsing CSV. Ensure format is correct.");
      }
  };

  const handleCopy = () => {
    if (!output) return;
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
                <FileCode size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">CSV to XML Converter</h1>
                <p className="text-xs md:text-sm text-slate-500">Convert Comma Separated Values to XML format</p>
             </div>
           </div>
           
           <button onClick={() => {setInput(''); setOutput(''); setError(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={20} />
           </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-center">
            <button 
                onClick={convert}
                className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
            >
                Convert <ArrowRight size={18} className="ml-2" />
            </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input CSV</label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder={`id,name,age\n1,John Doe,30\n2,Jane Smith,25`}
                  spellCheck={false}
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-500 font-bold">{error}</p>}
            </div>

            {/* Output */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">XML Output</label>
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
              <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md group">
                 <textarea
                   readOnly
                   value={output}
                   placeholder="XML result will appear here..."
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
