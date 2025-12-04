import { Table, Copy, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const HtmlTableGenerator: React.FC = () => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [header, setHeader] = useState(true);
  const [border, setBorder] = useState(true);
  const [width, setWidth] = useState(100);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateTable = () => {
      let html = `<table style="width: ${width}%; border-collapse: collapse;${border ? ' border: 1px solid #ccc;' : ''}">\n`;

      // Header
      if (header) {
        html += `  <thead>\n    <tr>\n`;
        for (let i = 0; i < cols; i++) {
          html += `      <th style="${border ? 'border: 1px solid #ccc; ' : ''}padding: 8px;">Header ${i + 1}</th>\n`;
        }
        html += `    </tr>\n  </thead>\n`;
      }

      // Body
      html += `  <tbody>\n`;
      for (let r = 0; r < rows; r++) {
        html += `    <tr>\n`;
        for (let c = 0; c < cols; c++) {
          html += `      <td style="${border ? 'border: 1px solid #ccc; ' : ''}padding: 8px;">Row ${r + 1} Col ${c + 1}</td>\n`;
        }
        html += `    </tr>\n`;
      }
      html += `  </tbody>\n</table>`;

      setOutput(html);
    };

    generateTable();
  }, [rows, cols, header, border, width]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Table}
          title="HTML Table Generator"
          description="Quickly generate HTML table tags and styles"
        />

        <div className="flex-1 overflow-hidden grid md:grid-cols-[300px,1fr]">
          {/* Controls - Sidebar */}
          <div className="p-6 bg-slate-50 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-8">
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Rows</span>
                  <span className="text-primary">{rows}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={rows}
                  onChange={e => setRows(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Columns</span>
                  <span className="text-primary">{cols}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={cols}
                  onChange={e => setCols(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Width</span>
                  <span className="text-primary">{width}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={width}
                  onChange={e => setWidth(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={header}
                    onChange={e => setHeader(e.target.checked)}
                    className="w-5 h-5 text-primary rounded focus:ring-primary/50 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-slate-700 font-medium">Include Header</span>
                </label>
                <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={border}
                    onChange={e => setBorder(e.target.checked)}
                    className="w-5 h-5 text-primary rounded focus:ring-primary/50 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-slate-700 font-medium">Add Borders</span>
                </label>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="p-4 md:p-6 flex flex-col h-full bg-white overflow-hidden">
            <CodeEditor
              value={output}
              label="Generated Code"
              readOnly
              theme="dark"
              actions={
                <ActionButton
                  icon={copied ? Check : Copy}
                  label={copied ? 'Copied' : 'Copy HTML'}
                  onClick={handleCopy}
                  variant={copied ? 'success' : 'primary'}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
