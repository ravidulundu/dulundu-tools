import React, { useState } from 'react';
import { ArrowRightLeft, FileJson, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

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

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={FileJson}
          title="JSON Converter"
          description="Convert JSON to XML or CSV format"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
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

          <div className="flex gap-2">
            <button
              onClick={convert}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
            >
              Convert <ArrowRightLeft size={16} className="ml-1.5" />
            </button>
            <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">

            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input JSON"
                placeholder='[{"id": 1, "name": "Test"}]'
                theme="light"
              />
              {error && <p className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">{error}</p>}
            </div>

            <CodeEditor
              value={output}
              label={mode === 'json-xml' ? 'XML Output' : 'CSV Output'}
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
        </div>
      </div>
    </div>
  );
};
