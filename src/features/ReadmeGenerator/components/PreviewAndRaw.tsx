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
    <div className="w-1/2 bg-gray-50 dark:bg-slate-900 h-full flex flex-col border-l border-gray-200 dark:border-gray-800">
      {/* Header with Tabs and Download */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'raw'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
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
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
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
              className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors text-xs font-medium flex items-center gap-2"
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
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900">
        {activeTab === 'preview' ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 min-h-full">
            <div
              className="prose prose-slate max-w-none 
                prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                prose-p:text-slate-700 dark:prose-p:text-slate-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-strong:text-slate-900 dark:prose-strong:text-slate-100
                prose-code:text-slate-900 dark:prose-code:text-blue-300
                prose-code:bg-gray-100 dark:prose-code:bg-slate-900/50
                prose-pre:bg-gray-100 dark:prose-pre:bg-slate-900 
                prose-pre:text-slate-900 dark:prose-pre:text-slate-100
                prose-pre:border prose-pre:border-gray-300 dark:prose-pre:border-gray-600
                prose-li:text-slate-700 dark:prose-li:text-slate-300
                prose-table:text-slate-700 dark:prose-table:text-slate-300
                prose-th:text-slate-900 dark:prose-th:text-slate-100"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  html ||
                    '<p class="text-gray-500 dark:text-slate-400">No sections selected. Click sections on the left to add them to your README.</p>'
                ),
              }}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 min-h-full">
            <pre className="text-sm text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap break-words leading-relaxed">
              {markdown ||
                '# No sections selected\n\nClick sections on the left to add them to your README.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
