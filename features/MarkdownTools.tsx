import React, { useState } from 'react';
import { FileText, ArrowLeftRight, Copy, Check, Code } from 'lucide-react';
import { marked } from 'marked';

export const MarkdownTools: React.FC = () => {
  const [input, setInput] = useState('# Hello World\n\nThis is **Markdown** text.');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'md-to-html' | 'html-to-md'>('md-to-html');
  const [copied, setCopied] = useState(false);

  // Basic HTML to Markdown implementation
  const convertToMarkdown = (html: string) => {
    let md = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gim, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gim, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gim, '### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gim, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gim, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gim, '*$1*')
      .replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gim, '[$2]($1)')
      .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gim, '$1')
      .replace(/<li[^>]*>(.*?)<\/li>/gim, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gim, '$1\n\n')
      .replace(/<br\s*\/?>/gim, '\n')
      .replace(/<[^>]+>/gim, '') // Remove remaining tags
      .trim();

    // Decode entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = md;
    md = textarea.value;

    return md;
  };

  const handleConvert = () => {
    if (mode === 'md-to-html') {
      try {
        const html = marked.parse(input);
        // marked.parse can return a Promise in some versions, but usually string in sync mode
        setOutput(html as string);
      } catch (e) {
        setOutput('Error converting Markdown');
      }
    } else {
      setOutput(convertToMarkdown(input));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'md-to-html' ? 'html-to-md' : 'md-to-html');
    setInput(output); // Swap input/output for convenience
    setOutput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Markdown Converter</h1>
              <p className="text-sm text-slate-500">Convert between Markdown and HTML</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMode}
              className="text-sm text-slate-600 hover:text-primary font-medium flex items-center px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeftRight size={14} className="mr-2" />
              Switch Mode
            </button>
            <button
              onClick={handleConvert}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md flex items-center"
            >
              Convert <Code size={16} className="ml-2" />
            </button>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {mode === 'md-to-html' ? 'Markdown Input' : 'HTML Input'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[500px] p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900"
              placeholder={mode === 'md-to-html' ? "# Type markdown here..." : "<div>Type HTML here...</div>"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {mode === 'md-to-html' ? 'HTML Output' : 'Markdown Output'}
            </label>
            <div className="relative h-[500px]">
              <textarea
                readOnly
                value={output}
                className="w-full h-full p-4 font-mono text-sm bg-[#1e293b] text-gray-50 border border-slate-700 rounded-xl resize-none outline-none"
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