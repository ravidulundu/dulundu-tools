import React, { useState } from 'react';
import { Wand2, ArrowRight, Copy, Check, Trash2 } from 'lucide-react';

export const LuaBeautifier: React.FC = () => {
    const [input, setInput] = useState('function factorial(n) if n==0 then return 1 else return n*factorial(n-1) end end');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const beautifyLua = (code: string) => {
        let formatted = code;

        // Very basic indentation logic
        // 1. Add newlines after 'then', 'do', 'repeat', 'else'
        // 2. Add newlines before 'end', 'until', 'else', 'elseif'

        // Normalize spaces
        formatted = formatted.replace(/\s+/g, ' ');

        // Add newlines around keywords
        formatted = formatted.replace(/\s(then|do|repeat)\s/g, ' $1\n');
        formatted = formatted.replace(/\s(end|until|else|elseif)\s/g, '\n$1\n');
        formatted = formatted.replace(/\s(function)\s/g, '\n$1 ');

        // Split lines
        const lines = formatted.split('\n');
        let indentLevel = 0;
        const indentChar = '    ';

        const result = lines.map(line => {
            line = line.trim();
            if (!line) return '';

            // Decrease indent for closing blocks
            if (line.match(/^(end|until|else|elseif)/)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            const indentedLine = indentChar.repeat(indentLevel) + line;

            // Increase indent for opening blocks
            if (line.match(/^(function|if|while|repeat|for|else|elseif|do)/) && !line.match(/\send$/)) {
                // Check if it's not a single line function/if (heuristic)
                if (!line.includes('end')) {
                    indentLevel++;
                }
            }

            return indentedLine;
        }).join('\n');

        return result.trim();
    };

    const handleFormat = () => {
        setOutput(beautifyLua(input));
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
                            <Wand2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Lua Beautifier</h1>
                            <p className="text-sm text-slate-500">Format Lua code with proper indentation</p>
                        </div>
                    </div>

                    <button
                        onClick={handleFormat}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md flex items-center"
                    >
                        Beautify <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Lua Input</label>
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
                            placeholder="Paste Lua code here..."
                        />
                    </div>

                    <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Formatted Output</label>
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
