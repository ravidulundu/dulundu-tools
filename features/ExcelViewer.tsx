import React, { useState } from "react";
import { FileSpreadsheet, Trash2, Table } from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { CodeEditor } from "../components/common/CodeEditor";
import { ActionButton } from "../components/common/ActionButton";
import { Button } from "../components/common/Button";

export const ExcelViewer: React.FC = () => {
  const [data, setData] = useState<string[][]>([]);
  const [input, setInput] = useState("");

  const parseCSV = (text: string) => {
    // Simple CSV parser handling quotes
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
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
      } else if (char === "," && !inQuotes) {
        currentRow.push(currentCell);
        currentCell = "";
      } else if ((char === "\r" || char === "\n") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
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
    setInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileSpreadsheet}
          title="Excel / CSV Viewer"
          description="View CSV data in a table format"
        />
        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <Button
            onClick={handleLoad}
            disabled={!input.trim()}
            variant="primary"
            icon={Table}
          >
            Load Table
          </Button>

          <ActionButton
            onClick={handleClear}
            variant="danger"
            label="Clear"
            icon={Trash2}
          />
        </div>
        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
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
                <h3 className="font-bold text-slate-700">
                  Table View ({data.length} rows)
                </h3>
              </div>
              <div className="flex-1 overflow-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-10">
                    <tr>
                      {data[0]?.map((header, i) => (
                        <th
                          key={i}
                          className="px-6 py-3 border-b border-gray-200 whitespace-nowrap bg-slate-50"
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
                        className="bg-white border-b border-gray-100 hover:bg-slate-50 transition-colors"
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
