import { FileText, ArrowLeftRight, Copy, Check, Code, Trash2 } from 'lucide-react';
import { marked } from 'marked';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

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
        if (typeof html === 'string') {
          setOutput(html);
        } else {
          (html as Promise<string>).then(res => setOutput(res));
        }
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
    setMode(prev => (prev === 'md-to-html' ? 'html-to-md' : 'md-to-html'));
    setInput(output); // Swap input/output for convenience
    setOutput('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileText}
          title="Markdown Converter"
          description="Convert between Markdown and HTML"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              <ArrowLeftRight size={16} className="mr-2" />
              {mode === 'md-to-html' ? 'Markdown → HTML' : 'HTML → Markdown'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleConvert}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              Convert <Code size={16} className="ml-2" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear All"
            >
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
              label={mode === 'md-to-html' ? 'Markdown Input' : 'HTML Input'}
              placeholder={
                mode === 'md-to-html' ? '# Type markdown here...' : '<div>Type HTML here...</div>'
              }
              language={mode === 'md-to-html' ? 'markdown' : 'html'}
              theme="light"
            />

            <CodeEditor
              value={output}
              label={mode === 'md-to-html' ? 'HTML Output' : 'Markdown Output'}
              placeholder="Result will appear here..."
              readOnly
              language={mode === 'md-to-html' ? 'html' : 'markdown'}
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
