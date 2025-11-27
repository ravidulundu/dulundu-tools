
import React, { useState } from 'react';
import { Database, ArrowRight, Copy, Check, Trash2 } from 'lucide-react';

export const SqlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'sql-json' | 'sql-csv'>('sql-json');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
      if (!input.trim()) { setOutput(''); return; }
      
      try {
          // Rudimentary parser for INSERT INTO table (cols) VALUES (vals), (vals);
          const regex = /INSERT\s+INTO\s+[\w`"']+\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+);?/i;
          const match = input.match(regex);
          
          if (!match) throw new Error("Could not parse SQL. Ensure it is a valid INSERT INTO statement.");
          
          const columns = match[1].split(',').map(c => c.trim().replace(/[`"']/g, ''));
          const valuesStr = match[2];
          
          // Split by ), ( to get groups. Naive split, careful with nested parens.
          // This assumes standard SQL dump format
          const rowsStr = valuesStr.split(/\)\s*,\s*\(/);
          
          const data = rowsStr.map(row => {
             // Clean start/end parens
             let cleanRow = row.replace(/^\s*\(|\)\s*$/g, '');
             // Split by comma, handling quotes roughly
             // Note: A robust SQL parser is too large for this snippet, this is a basic approximation
             const vals = cleanRow.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map(v => {
                 let val = v.trim();
                 if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
                 if (val === 'NULL') return null;
                 if (!isNaN(Number(val)) && val !== '') return Number(val);
                 return val;
             });
             
             const obj: any = {};
             columns.forEach((col, idx) => {
                 obj[col] = vals[idx];
             });
             return obj;
          });

          if (mode === 'sql-json') {
             setOutput(JSON.stringify(data, null, 2));
          } else {
             const csvRows = [columns.join(',')];
             data.forEach(row => {
                const vals = columns.map(col => {
                    const val = row[col];
                    if (val === null) return 'NULL';
                    if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
                    return val;
                });
                csvRows.push(vals.join(','));
             });
             setOutput(csvRows.join('\n'));
          }
          setError(null);

      } catch (e) {
          setError("Error parsing SQL. Supports basic 'INSERT INTO table (cols) VALUES ...' format.");
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
                <Database size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">SQL Converter</h1>
                <p className="text-xs md:text-sm text-slate-500">Convert INSERT statements to JSON/CSV</p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
             <button
               onClick={convert}
               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
             >
               Convert <ArrowRight size={16} className="ml-1.5" />
             </button>
             <button onClick={() => {setInput(''); setOutput(''); setError(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={20} />
             </button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-center gap-4">
             <button 
               onClick={() => setMode('sql-json')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${mode === 'sql-json' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-gray-200 hover:border-primary'}`}
             >
                SQL to JSON
             </button>
             <button 
               onClick={() => setMode('sql-csv')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${mode === 'sql-csv' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-gray-200 hover:border-primary'}`}
             >
                SQL to CSV
             </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input SQL</label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder={`INSERT INTO users (id, name)\nVALUES (1, 'Alice'), (2, 'Bob');`}
                  spellCheck={false}
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-500 font-bold">{error}</p>}
            </div>

            {/* Output */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">Output</label>
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
