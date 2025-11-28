import React, { useState } from 'react';
import { Table, ArrowRight, Copy, Check, Trash2, Download } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const CsvConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToJson = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row");

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const obj: any = {};
        const currentline = lines[i].split(','); // Simple split, doesn't handle commas in quotes yet for simplicity

        for (let j = 0; j < headers.length; j++) {
          let val = currentline[j]?.trim();
          if (val) val = val.replace(/^"|"$/g, '');
          obj[headers[j]] = val;
        }
        result.push(obj);
      }

      setOutput(JSON.stringify(result, null, 2));
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

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={Table}
          title="CSV to JSON"
          description="Convert Comma Separated Values to JSON array"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <button
            onClick={convertToJson}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md text-sm"
          >
            Convert <ArrowRight size={16} className="ml-2" />
          </button>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">

            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input CSV"
              placeholder={`id,name,age\n1,John Doe,30\n2,Jane Smith,25`}
              theme="light"
            />

            <CodeEditor
              value={output}
              label="JSON Output"
              placeholder="JSON result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <div className="flex items-center gap-2">
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
                  </div>
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