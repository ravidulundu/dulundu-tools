import React, { useState } from 'react';
import { Database, Copy, Check, Trash2, Play, Eraser } from 'lucide-react';

export const SqlFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const formatSql = () => {
    if (!input.trim()) {
        setOutput('');
        return;
    }

    // Basic SQL formatting logic (Regex based)
    let sql = input
      .replace(/\s+/g, ' ')
      .replace(/"/g, '""'); // basic cleanup
    
    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", 
      "HAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", 
      "DELETE FROM", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
      "UNION", "UNION ALL", "CREATE TABLE", "DROP TABLE", "ALTER TABLE"
    ];

    // Simple indentation
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        sql = sql.replace(regex, `\n${kw}`);
    });

    // Fix first line newline
    sql = sql.replace(/^\n/, '');
    
    // Indent sub-parts (like after SELECT)
    sql = sql.replace(/,/g, ',\n  ');
    
    // Parentheses indentation
    sql = sql.replace(/\(/g, '(\n  ').replace(/\)/g, '\n)');

    setOutput(sql);
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Database size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">SQL Formatter</h1>
                <p className="text-xs md:text-sm text-slate-500">Beautify complex SQL queries</p>
             </div>
           </div>
           
           <div className="flex space-x-2">
             <button onClick={handleClear} className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center shadow-sm">
               <Trash2 size={16} className="md:mr-2" /> <span className="hidden md:inline">Clear</span>
             </button>
             <button onClick={formatSql} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center">
               <Play size={16} className="md:mr-2" /> <span className="hidden md:inline">Format</span>
             </button>
           </div>
        </div>

        {/* Editor Area - Split View */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input Query</label>
              <div className="flex-1 relative rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder="SELECT * FROM users WHERE id = 1..."
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Output Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">Formatted Result</label>
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
              <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                 <textarea
                   readOnly
                   value={output}
                   placeholder="Formatted SQL will appear here..."
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