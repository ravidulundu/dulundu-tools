import React, { useState } from 'react';
import { FileSpreadsheet, Download, ArrowRight, Trash2 } from 'lucide-react';

export const CsvToExcel: React.FC = () => {
    const [input, setInput] = useState('');

    const downloadCSV = () => {
        if (!input) return;

        // Create a blob and download
        const blob = new Blob([input], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-primary rounded-lg">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">CSV to Excel</h1>
                            <p className="text-sm text-slate-500">Convert and download CSV data for Excel</p>
                        </div>
                    </div>

                    <button
                        onClick={downloadCSV}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md flex items-center"
                    >
                        Download .CSV <Download size={16} className="ml-2" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">CSV Input</label>
                            <button
                                onClick={() => setInput('')}
                                className="text-xs text-red-500 hover:text-red-600 flex items-center"
                            >
                                <Trash2 size={12} className="mr-1" /> Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-[400px] p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900"
                            placeholder="Paste your CSV data here..."
                        />
                        <p className="mt-4 text-sm text-slate-500">
                            Note: Excel can open .csv files directly. This tool ensures your data is ready for download as a compatible CSV file.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
