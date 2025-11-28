import React, { useState } from 'react';
import { ArrowRightLeft, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';

export const DiffViewer: React.FC = () => {
    const [oldText, setOldText] = useState('');
    const [newText, setNewText] = useState('');
    const [diff, setDiff] = useState<React.ReactNode[] | null>(null);

    // Simple line-by-line diff
    const computeDiff = () => {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');

        const maxLines = Math.max(oldLines.length, newLines.length);
        const result = [];

        for (let i = 0; i < maxLines; i++) {
            const oldLine = oldLines[i] || '';
            const newLine = newLines[i] || '';

            if (oldLine === newLine) {
                result.push(
                    <div key={i} className="flex border-b border-gray-100 hover:bg-gray-50 group">
                        <div className="w-12 p-1 text-right text-gray-400 text-xs select-none border-r border-gray-200 bg-gray-50 font-mono pr-2">{i + 1}</div>
                        <div className="flex-1 p-1 pl-4 font-mono text-sm text-slate-600 overflow-x-auto whitespace-pre">{oldLine}</div>
                    </div>
                );
            } else {
                if (oldLine) {
                    result.push(
                        <div key={`d-${i}`} className="flex bg-red-50/50 border-b border-red-100 hover:bg-red-50 transition-colors">
                            <div className="w-12 p-1 text-right text-red-400 text-xs select-none border-r border-red-200 bg-red-50 font-mono pr-2">-</div>
                            <div className="flex-1 p-1 pl-4 font-mono text-sm text-red-700 overflow-x-auto whitespace-pre">{oldLine}</div>
                        </div>
                    );
                }
                if (newLine) {
                    result.push(
                        <div key={`a-${i}`} className="flex bg-green-50/50 border-b border-green-100 hover:bg-green-50 transition-colors">
                            <div className="w-12 p-1 text-right text-green-400 text-xs select-none border-r border-green-200 bg-green-50 font-mono pr-2">+</div>
                            <div className="flex-1 p-1 pl-4 font-mono text-sm text-green-700 overflow-x-auto whitespace-pre">{newLine}</div>
                        </div>
                    );
                }
            }
        }
        setDiff(result);
    };

    const handleClear = () => {
        setOldText('');
        setNewText('');
        setDiff(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">

                <ToolHeader
                    icon={ArrowRightLeft}
                    title="Diff Viewer"
                    description="Compare text files line by line"
                />

                {/* Toolbar */}
                <div className="p-3 border-b border-gray-100 flex justify-end space-x-2">
                    {diff && (
                        <button
                            onClick={() => setDiff(null)}
                            className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={handleClear}
                        className="px-3 py-2 bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm shadow-sm"
                        title="Clear All"
                    >
                        <Trash2 size={16} />
                    </button>
                    {!diff && (
                        <button
                            onClick={computeDiff}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold shadow-md text-sm"
                        >
                            Compare Texts
                        </button>
                    )}
                </div>

                {/* Input Area - Only show if no diff computed yet */}
                {!diff ? (
                    <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
                        <div className="grid md:grid-cols-2 gap-4 h-full">

                            <CodeEditor
                                value={oldText}
                                onChange={setOldText}
                                label="Original Text"
                                placeholder="Paste original text here..."
                                theme="light"
                            />

                            <CodeEditor
                                value={newText}
                                onChange={setNewText}
                                label="Modified Text"
                                placeholder="Paste modified text here..."
                                theme="light"
                            />

                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0 bg-white">
                        <div className="p-2 bg-slate-100 border-b border-gray-200 flex justify-between items-center px-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comparison Result</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {diff}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};