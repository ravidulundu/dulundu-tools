import React, { useState } from 'react';
import { PenTool, RefreshCw, Copy, Check, Loader2 } from 'lucide-react';
import { paraphraseText } from '../services/geminiService';

export const ParaphrasingTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState('professional');
    const [copied, setCopied] = useState(false);

    const handleParaphrase = async () => {
        if (!input.trim()) return;

        setLoading(true);
        const result = await paraphraseText(input, tone);
        setOutput(result);
        setLoading(false);
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
                            <PenTool size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Paraphrasing Tool</h1>
                            <p className="text-sm text-slate-500">Rewrite text with AI (Gemini)</p>
                        </div>
                    </div>

                    <button
                        onClick={handleParaphrase}
                        disabled={loading || !input.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium shadow-md flex items-center"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <RefreshCw size={16} className="mr-2" />}
                        Paraphrase
                    </button>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">Original Text</label>
                            <button
                                onClick={() => setInput('')}
                                className="text-xs text-red-500 hover:text-red-600 font-medium"
                            >
                                Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900 min-h-[300px]"
                            placeholder="Paste text to rewrite..."
                        />

                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                            >
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="academic">Academic</option>
                                <option value="creative">Creative</option>
                                <option value="concise">Concise</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rewritten Output</label>
                        <div className="relative flex-1">
                            <textarea
                                readOnly
                                value={output}
                                className="w-full h-full p-4 font-mono text-sm bg-[#1e293b] text-gray-50 border border-slate-700 rounded-xl resize-none outline-none min-h-[300px]"
                                placeholder="Paraphrased text will appear here..."
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
