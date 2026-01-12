import { FileSpreadsheet, Trash2, Table } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { Button } from '@/components/common/Button';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const ExcelViewer: React.FC = () => {
  const [data, setData] = useState<string[][]>([]);
  const [input, setInput] = useState('');

  const parseCSV = (text: string) => {
    // Simple CSV parser handling quotes
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentCell);
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell);
      rows.push(currentRow);
    }
    return rows;
  };

  const handleLoad = () => {
    const parsed = parseCSV(input);
    setData(parsed);
  };

  const handleClear = () => {
    setData([]);
    setInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileSpreadsheet}
          title="Excel / CSV Viewer"
          description="View CSV data in a table format"
        />
        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <Button onClick={handleLoad} disabled={!input.trim()} variant="primary" icon={Table}>
            Load Table
          </Button>

          <ActionButton onClick={handleClear} variant="danger" label="Clear" icon={Trash2} />
        </div>
        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          {data.length === 0 ? (
            <div className="h-full flex flex-col">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Paste CSV Data"
                placeholder={`id,name,email\n1,John Doe,john@example.com\n2,Jane Smith,jane@example.com`}
                theme="light"
              />
            </div>
          ) : (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-foreground-secondary">Table View ({data.length} rows)</h3>
              </div>
              <div className="flex-1 overflow-auto border border-border rounded-xl bg-card shadow-sm">
                <table className="w-full text-sm text-left text-foreground-secondary">
                  <thead className="text-xs text-foreground-secondary uppercase bg-background-secondary sticky top-0 z-10">
                    <tr>
                      {data[0]?.map((header, i) => (
                        <th
                          key={i}
                          className="px-6 py-3 border-b border-border whitespace-nowrap bg-background-secondary"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(1).map((row, i) => (
                      <tr
                        key={i}
                        className="bg-card border-b border-border hover:bg-background-secondary transition-colors"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="px-6 py-4 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
