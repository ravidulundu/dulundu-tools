import { BrainCircuit, Send, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import React, { useState } from 'react';

import { generateCodeHelp } from '@/services/geminiService';

export const AiAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult('');

    const response = await generateCodeHelp(prompt);
    setResult(response);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center space-x-3 bg-background-secondary/50">
          <div className="p-2 bg-blue-100 text-primary rounded-lg">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Code Assistant</h1>
            <p className="text-sm text-foreground-muted">
              Powered by Google Gemini - Ask anything about code
            </p>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-background-secondary to-primary-light/30">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g., Write a Python script to scrape a website, or Explain how React useEffect works..."
              className="w-full p-4 pr-14 min-h-[120px] rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none shadow-sm text-base bg-card text-foreground"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
            {['Regex for email', 'React fetch hook', 'Center a div CSS', 'SQL Join types'].map(
              suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-3 py-1.5 bg-card border border-border rounded-full text-xs font-medium text-foreground-secondary hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        {result && (
          <div className="border-t border-border">
            <div className="flex justify-between items-center px-6 py-3 bg-background-secondary/50 border-b border-border">
              <div className="flex items-center space-x-2 text-primary font-medium text-sm">
                <Sparkles size={16} />
                <span>AI Response</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-foreground-muted hover:text-foreground text-xs font-medium transition-colors"
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 overflow-x-auto bg-[#0d1117] text-foreground">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{result}</pre>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="p-12 text-center text-foreground-muted">
            <p>Ask a question to generate code snippets, explanations, or debug help.</p>
          </div>
        )}

        {loading && !result && (
          <div className="p-12 text-center">
            <div className="inline-block p-4 rounded-full bg-primary-light mb-4 animate-pulse">
              <BrainCircuit size={32} className="text-primary" />
            </div>
            <p className="text-foreground-muted">Thinking...</p>
          </div>
        )}
      </div>
    </div>
  );
};
