import React, { useState } from 'react';
import { ListOrdered, ArrowDownUp, Copy, Check, Trash2 } from 'lucide-react';

export const NumberSorter: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [delimiter, setDelimiter] = useState(',');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [copied, setCopied] = useState(false);

    const handleSort = () => {
        if (!input.trim()) return;

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

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-primary rounded-lg">
                            <ListOrdered size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Number Sorter</h1>
                            <p className="text-sm text-slate-500">Sort lists of numbers instantly</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSort}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md flex items-center"
                    >
                        Sort Numbers <ArrowDownUp size={16} className="ml-2" />
                    </button>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Input Numbers</label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setInput('10, 5, 8, 1, 3, 99, 24, 7')}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sample
                                </button>
                                <button
                                    onClick={() => setInput('')}
                                    className="text-xs text-red-500 hover:text-red-600 flex items-center"
                                >
                                    <Trash2 size={12} className="mr-1" /> Clear
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900 min-h-[300px]"
                            placeholder="Enter numbers separated by commas, spaces, or new lines...&#10;Example:&#10;10, 5, 8, 1, 3"
                        />

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Delimiter</label>
                                <select
                                    value={delimiter}
                                    onChange={(e) => setDelimiter(e.target.value)}
                                    className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                                >
                                    <option value="auto">Auto Detect</option>
                                    <option value=",">Comma (,)</option>
                                    <option value="\n">New Line</option>
                                    <option value=" ">Space</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Order</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setOrder('asc')}
                                        className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${order === 'asc' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Ascending
                                    </button>
                                    <button
                                        onClick={() => setOrder('desc')}
                                        className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${order === 'desc' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Descending
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sorted Output</label>
                        <div className="relative flex-1">
                            <textarea
                                readOnly
                                value={output}
                                className="w-full h-full p-4 font-mono text-sm bg-[#1e293b] text-gray-50 border border-slate-700 rounded-xl resize-none outline-none min-h-[300px]"
                                placeholder="Sorted result will appear here..."
                            />
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-4 right-4 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    title="Copy"
                                >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
