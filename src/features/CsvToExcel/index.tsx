import React, { useState } from 'react';
import { FileSpreadsheet, Download, Trash2 } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';
import { CodeEditor } from '@/components/common/CodeEditor';

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

    const handleClear = () => {
        setInput('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                <ToolHeader
                    icon={FileSpreadsheet}
                    title="CSV to Excel"
                    description="Convert and download CSV data for Excel"
                />

                {/* Toolbar */}
                <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                    <button
                        onClick={downloadCSV}
                        disabled={!input.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Download .CSV <Download size={16} className="ml-2" />
                    </button>

                    <button
                        onClick={handleClear}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear All"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
                    <div className="h-full flex flex-col">
                        <CodeEditor
                            value={input}
                            onChange={setInput}
                            label="CSV Input"
                            placeholder="Paste your CSV data here..."
                            theme="light"
                        />
                        <p className="mt-4 text-xs text-slate-500 text-center">
                            Note: Excel can open .csv files directly. This tool ensures your data is ready for download as a compatible CSV file.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
