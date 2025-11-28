import React, { useState } from 'react';
import { Database, Copy, Check, Trash2, Play } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

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

        <ToolHeader
          icon={Database}
          title="SQL Formatter"
          description="Beautify complex SQL queries"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end space-x-2">
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center shadow-sm"
          >
            <Trash2 size={16} className="md:mr-2" /> <span className="hidden md:inline">Clear</span>
          </button>
          <button
            onClick={formatSql}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center"
          >
            <Play size={16} className="md:mr-2" /> <span className="hidden md:inline">Format</span>
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">

            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input Query"
              placeholder="SELECT * FROM users WHERE id = 1..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Formatted Result"
              placeholder="Formatted SQL will appear here..."
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
        </div>
      </div>
    </div>
  );
};