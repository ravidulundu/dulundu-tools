import React, { useState } from 'react';
import { Eraser, ArrowRight, Copy, Check, Trash2 } from 'lucide-react';

export const RemovePunctuation: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'all' | 'special'>('all');

    const handleProcess = () => {
        if (!input) return;

        let result = input;
        if (mode === 'all') {
            // Remove all punctuation
            result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\[\]<>|@\+\\]/g, "");
            // Replace multiple spaces with single space
            result = result.replace(/\s{2,}/g, " ");
        } else {
            // Keep basic sentence structure (.,?!) but remove others
            result = result.replace(/[\/#$%\^&\*;:{}=\-_`~()"'\[\]<>|@\+\\]/g, "");
        }

        setOutput(result);
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
                            <Eraser size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Remove Punctuation</h1>
                            <p className="text-sm text-slate-500">Clean text by removing symbols and punctuation</p>
                        </div>
                    </div>

                    <button
                        onClick={handleProcess}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md flex items-center"
                    >
                        Clean Text <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Input Text</label>
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
                            className="flex-1 w-full p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900 min-h-[300px]"
                            placeholder="Paste your text here..."
                        />

                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mode</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setMode('all')}
                                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${mode === 'all' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Remove All Symbols
                                </button>
                                <button
                                    onClick={() => setMode('special')}
                                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${mode === 'special' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Keep Sentence Marks (.,?!)
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Cleaned Output</label>
                        <div className="relative flex-1">
                            <textarea
                                readOnly
                                value={output}
                                className="w-full h-full p-4 font-mono text-sm bg-[#1e293b] text-gray-50 border border-slate-700 rounded-xl resize-none outline-none min-h-[300px]"
                                placeholder="Result will appear here..."
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
