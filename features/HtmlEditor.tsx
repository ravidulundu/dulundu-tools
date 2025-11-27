import React, { useState, useEffect } from 'react';
import { Code, Eye, Copy, Check, RotateCcw } from 'lucide-react';

export const HtmlEditor: React.FC = () => {
    const [html, setHtml] = useState('<div class="card">\n  <h1>Hello World</h1>\n  <p>Start editing to see changes instantly!</p>\n  <button>Click Me</button>\n</div>');
    const [css, setCss] = useState('.card {\n  padding: 20px;\n  background: #f0f9ff;\n  border-radius: 12px;\n  font-family: sans-serif;\n  text-align: center;\n}\n\nh1 {\n  color: #0ea5e9;\n}\n\nbutton {\n  background: #0ea5e9;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}');
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
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="bg-slate-50/50 border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-primary rounded-lg shadow-sm">
                        <Code size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Real-time HTML Editor</h1>
                        <p className="text-xs text-slate-500">Live preview for HTML & CSS</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 h-full overflow-hidden">
                {/* Editors */}
                <div className="flex flex-col border-r border-gray-200 bg-slate-50">
                    <div className="flex-1 flex flex-col min-h-0 border-b border-gray-200">
                        <div className="px-4 py-2 bg-slate-100 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase flex justify-between items-center">
                            <span>HTML</span>
                            <button onClick={() => setHtml('')} title="Clear HTML"><RotateCcw size={12} /></button>
                        </div>
                        <textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            className="flex-1 p-4 font-mono text-sm bg-white outline-none resize-none text-slate-900"
                            spellCheck={false}
                        />
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="px-4 py-2 bg-slate-100 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase flex justify-between items-center">
                            <span>CSS</span>
                            <button onClick={() => setCss('')} title="Clear CSS"><RotateCcw size={12} /></button>
                        </div>
                        <textarea
                            value={css}
                            onChange={(e) => setCss(e.target.value)}
                            className="flex-1 p-4 font-mono text-sm bg-white outline-none resize-none text-slate-900"
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="flex flex-col bg-white">
                    <div className="px-4 py-2 bg-slate-100 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase flex items-center">
                        <Eye size={14} className="mr-2" /> Preview
                    </div>
                    <div className="flex-1 bg-white relative">
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
    );
};
