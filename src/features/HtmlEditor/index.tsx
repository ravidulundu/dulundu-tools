import { Code, Eye, RotateCcw, Download } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const HtmlEditor: React.FC = () => {
  const [html, setHtml] = useState(
    '<div class="card">\n  <h1>Hello World</h1>\n  <p>Start editing to see changes instantly!</p>\n  <button>Click Me</button>\n</div>'
  );
  const [css, setCss] = useState(
    '.card {\n  padding: 20px;\n  background: #f0f9ff;\n  border-radius: 12px;\n  font-family: sans-serif;\n  text-align: center;\n}\n\nh1 {\n  color: #0ea5e9;\n}\n\nbutton {\n  background: #0ea5e9;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}'
  );
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>${html}</body>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Code}
          title="Real-time HTML Editor"
          description="Live preview for HTML & CSS"
        />

        <div className="flex-1 grid md:grid-cols-2 h-full overflow-hidden">
          {/* Editors */}
          <div className="flex flex-col border-r border-border bg-background-secondary h-full overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 border-b border-border">
              <CodeEditor
                value={html}
                onChange={setHtml}
                label="HTML"
                placeholder="Enter HTML..."
                theme="light"
                actions={
                  <ActionButton
                    icon={RotateCcw}
                    label="Clear"
                    onClick={() => setHtml('')}
                    variant="secondary"
                    size="sm"
                  />
                }
              />
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <CodeEditor
                value={css}
                onChange={setCss}
                label="CSS"
                placeholder="Enter CSS..."
                theme="light"
                actions={
                  <ActionButton
                    icon={RotateCcw}
                    label="Clear"
                    onClick={() => setCss('')}
                    variant="secondary"
                    size="sm"
                  />
                }
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col bg-card h-full overflow-hidden">
            <div className="px-4 py-2 bg-background-secondary border-b border-border text-xs font-bold text-foreground-muted uppercase flex items-center justify-between">
              <div className="flex items-center">
                <Eye size={14} className="mr-2" /> Preview
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([srcDoc], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'index.html';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="text-foreground-muted hover:text-primary transition-colors"
                title="Download Result"
              >
                <Download size={14} />
              </button>
            </div>
            <div className="flex-1 bg-card relative">
              <iframe
                srcDoc={srcDoc}
                title="preview"
                sandbox="allow-scripts"
                className="absolute inset-0 w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
