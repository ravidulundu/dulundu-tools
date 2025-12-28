import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { useState, useEffect } from 'react';

interface PreviewAndRawProps {
  markdown: string;
}

export const PreviewAndRaw: React.FC<PreviewAndRawProps> = ({ markdown }) => {
  const [html, setHtml] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const parseMarkdown = async () => {
      const parsed = await marked.parse(markdown, { gfm: true, breaks: true });
      setHtml(parsed);
    };
    parseMarkdown();
  }, [markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-1/2 bg-background-secondary h-full flex flex-col border-l border-border">
      {/* Header with Tabs and Download */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'raw'
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
              }`}
            >
              Raw
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium flex items-center gap-2 ${
                copySuccess
                  ? 'bg-success/10 text-success'
                  : 'bg-background-secondary text-foreground-secondary hover:bg-background-secondary/80'
              }`}
            >
              {copySuccess ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-xs font-medium flex items-center gap-2"
            >
              <span>Download</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-background-secondary">
        {activeTab === 'preview' ? (
          <div className="bg-card rounded-lg border border-border p-4 min-h-full">
            <div
              className="prose prose-slate max-w-none
                prose-headings:text-foreground
                prose-p:text-foreground-secondary
                prose-a:text-primary
                prose-strong:text-foreground
                prose-code:text-foreground
                prose-code:bg-background-secondary
                prose-pre:bg-background-secondary
                prose-pre:text-foreground
                prose-pre:border prose-pre:border-border
                prose-li:text-foreground-secondary
                prose-table:text-foreground-secondary
                prose-th:text-foreground"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  html ||
                    '<p class="text-foreground-muted">No sections selected. Click sections on the left to add them to your README.</p>'
                ),
              }}
            />
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-4 min-h-full">
            <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-words leading-relaxed">
              {markdown ||
                '# No sections selected\n\nClick sections on the left to add them to your README.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
