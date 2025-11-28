import React, { useState, useEffect } from 'react';
import { Eraser, ArrowRight, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const RemovePunctuation: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'all' | 'special'>('all');

    const handleProcess = () => {
        if (!input) {
            setOutput('');
            return;
        }

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

    const handleClear = () => {
        setInput('');
        setOutput('');
        setCopied(false);
    };

    // Auto-process when input or mode changes
    useEffect(() => {
        handleProcess();
    }, [input, mode]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                <ToolHeader
                    icon={Eraser}
                    title="Remove Punctuation"
                    description="Clean text by removing symbols and punctuation"
                />

                {/* Toolbar */}
                <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setMode('all')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'all' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Remove All Symbols
                        </button>
                        <button
                            onClick={() => setMode('special')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'special' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Keep Sentence Marks (.,?!)
                        </button>
                    </div>

                    <button
                        onClick={handleClear}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear All"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
                    <div className="grid md:grid-cols-2 gap-4 h-full">

                        <CodeEditor
                            value={input}
                            onChange={setInput}
                            label="Input Text"
                            placeholder="Paste your text here..."
                            theme="light"
                        />

                        <CodeEditor
                            value={output}
                            label="Cleaned Output"
                            placeholder="Result will appear here..."
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
