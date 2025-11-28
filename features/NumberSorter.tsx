import React, { useState } from 'react';
import { ListOrdered, ArrowDownUp, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const NumberSorter: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [delimiter, setDelimiter] = useState(',');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [copied, setCopied] = useState(false);

    const handleSort = () => {
        if (!input.trim()) { setOutput(''); return; }

        // Split by delimiter (comma, newline, space)
        let separator = delimiter;
        if (delimiter === '\\n') separator = '\n';

        // If delimiter is auto/mixed, try to detect
        let items: string[] = [];
        if (delimiter === 'auto') {
            items = input.split(/[\s,]+/);
        } else {
            items = input.split(separator);
        }

        // Filter empty and parse numbers
        const numbers = items
            .map(s => s.trim())
            .filter(s => s !== '')
            .map(s => Number(s))
            .filter(n => !isNaN(n));

        // Sort
        numbers.sort((a, b) => order === 'asc' ? a - b : b - a);

        // Join
        const joinChar = delimiter === 'auto' ? ', ' : (delimiter === '\\n' ? '\n' : delimiter + ' ');
        setOutput(numbers.join(joinChar));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                <ToolHeader
                    icon={ListOrdered}
                    title="Number Sorter"
                    description="Sort lists of numbers instantly"
                />

                {/* Toolbar */}
                <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg border border-gray-200">
                            <span className="text-xs font-medium text-slate-500 pl-2">Delimiter:</span>
                            <select
                                value={delimiter}
                                onChange={(e) => setDelimiter(e.target.value)}
                                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                            >
                                <option value="auto">Auto Detect</option>
                                <option value=",">Comma (,)</option>
                                <option value="\n">New Line</option>
                                <option value=" ">Space</option>
                            </select>
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-lg border border-gray-200">
                            <button
                                onClick={() => setOrder('asc')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${order === 'asc' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Ascending
                            </button>
                            <button
                                onClick={() => setOrder('desc')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${order === 'desc' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Descending
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSort}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
                        >
                            Sort <ArrowDownUp size={16} className="ml-1.5" />
                        </button>
                        <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
                    <div className="grid md:grid-cols-2 gap-4 h-full">
                        <CodeEditor
                            value={input}
                            onChange={setInput}
                            label="Input Numbers"
                            placeholder="Enter numbers separated by commas, spaces, or new lines...&#10;Example:&#10;10, 5, 8, 1, 3"
                            theme="light"
                        />

                        <CodeEditor
                            value={output}
                            label="Sorted Output"
                            placeholder="Sorted result will appear here..."
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
