import React, { useState } from 'react';
import { Table, FileSpreadsheet, Upload, Trash2 } from 'lucide-react';

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

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-primary rounded-lg">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Excel / CSV Viewer</h1>
                            <p className="text-sm text-slate-500">View CSV data in a table format</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {data.length === 0 ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Paste CSV Data</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-48 p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900"
                                placeholder="id,name,email&#10;1,John Doe,john@example.com&#10;2,Jane Smith,jane@example.com"
                            />
                            <button
                                onClick={handleLoad}
                                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md"
                            >
                                Load Table
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-700">Table View ({data.length} rows)</h3>
                                <button
                                    onClick={() => { setData([]); setInput('') }}
                                    className="text-sm text-red-500 hover:text-red-600 flex items-center"
                                >
                                    <Trash2 size={14} className="mr-1" /> Clear
                                </button>
                            </div>
                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                        <tr>
                                            {data[0]?.map((header, i) => (
                                                <th key={i} className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.slice(1).map((row, i) => (
                                            <tr key={i} className="bg-white border-b border-gray-100 hover:bg-slate-50">
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
