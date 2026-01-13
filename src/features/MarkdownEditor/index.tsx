import Editor, { OnMount } from '@monaco-editor/react';
import DOMPurify from 'dompurify';
import { FileText, Download } from 'lucide-react';
import { marked } from 'marked';
import { editor } from 'monaco-editor';
import React, { useState, useRef, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { useTheme } from '@/hooks/useTheme';

export const MarkdownEditor: React.FC = () => {
  const { theme } = useTheme();
  const [markdown, setMarkdown] = useState(`# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![Dulundu Tools Logo](/favicon.svg "Dulundu Tools Logo")

## Links

You may be using [Dulundu Tools](https://dulundu.tools/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

\`\`\`
let message = 'Hello world';
alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs/marked\`.`);

  const [copied, setCopied] = useState(false);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const html = useMemo(() => {
    try {
      const rawHtml = marked.parse(markdown);
      if (typeof rawHtml === 'string') {
        return rawHtml;
      }
      return ''; // Handle promise case if needed, but marked is sync by default
    } catch (_e) {
      return '';
    }
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditorDidMount: OnMount = editor => {
    editorRef.current = editor;
    editor.onDidScrollChange(e => {
      if (!isScrolling.current && previewRef.current) {
        isScrolling.current = true;
        const editorScrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height;
        const previewScrollHeight =
          previewRef.current.scrollHeight - previewRef.current.clientHeight;
        const ratio = e.scrollTop / editorScrollHeight;
        previewRef.current.scrollTop = ratio * previewScrollHeight;
        setTimeout(() => (isScrolling.current = false), 10);
      }
    });
  };

  const handlePreviewScroll = () => {
    if (!isScrolling.current && editorRef.current && previewRef.current) {
      isScrolling.current = true;
      const previewScrollHeight = previewRef.current.scrollHeight - previewRef.current.clientHeight;
      const editorScrollHeight =
        editorRef.current.getScrollHeight() - editorRef.current.getLayoutInfo().height;
      const ratio = previewRef.current.scrollTop / previewScrollHeight;
      editorRef.current.setScrollTop(ratio * editorScrollHeight);
      setTimeout(() => (isScrolling.current = false), 10);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-card">
      {/* Toolbar matching theme colors */}
      <div className="flex items-center justify-between px-4 py-2 bg-card text-foreground-secondary text-sm border-b border-border shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <span className="font-bold text-foreground">Markdown Live Preview</span>
          <button
            onClick={() =>
              setMarkdown(
                '# Markdown syntax guide\n\n## Headers\n\n# This is a Heading h1\n## This is a Heading h2\n###### This is a Heading h6\n\n## Emphasis\n\n*This text will be italic*\n_This will also be italic_\n\n**This text will be bold**\n__This will also be bold__\n\n_You **can** combine them_\n\n## Lists\n\n### Unordered\n\n* Item 1\n* Item 2\n* Item 2a\n* Item 2b\n    * Item 3a\n    * Item 3b\n\n### Ordered\n\n1. Item 1\n2. Item 2\n3. Item 3\n    1. Item 3a\n    2. Item 3b\n\n## Images\n\n![Dulundu Tools Logo](/favicon.svg "Dulundu Tools Logo")\n\n## Links\n\nYou may be using [Dulundu Tools](https://dulundu.tools/).\n\n## Blockquotes\n\n> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.\n>\n>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.\n\n## Tables\n\n| Left columns  | Right columns |\n| ------------- |:-------------:|\n| left foo      | right foo     |\n| left bar      | right bar     |\n| left baz      | right baz     |\n\n## Blocks of code\n\n```\nlet message = \'Hello world\';\nalert(message);\n```\n\n## Inline code\n\nThis web site is using `markedjs/marked`.'
              )
            }
            className="hover:text-primary transition-colors"
          >
            Reset
          </button>
          <button onClick={handleCopy} className="hover:text-primary transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-primary transition-colors">
            <input
              type="checkbox"
              defaultChecked={true}
              onChange={e => {
                isScrolling.current = !e.target.checked;
              }}
              className="rounded border-border bg-background-secondary text-primary focus:ring-offset-background"
            />
            Sync scroll
          </label>
          <div className="h-4 w-px bg-border mx-2" />
          <button
            onClick={() => handleDownload(markdown, 'document.md', 'text/markdown')}
            className="hover:text-primary transition-colors"
            title="Download Markdown"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => handleDownload(html, 'document.html', 'text/html')}
            className="hover:text-primary transition-colors"
            title="Download HTML"
          >
            <FileText size={16} />
          </button>
        </div>
      </div>

      {/* Editor Split View - Full Height */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Markdown Input */}
          <Panel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col">
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={markdown}
                onChange={value => setMarkdown(value || '')}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                }}
              />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize" />

          {/* Preview */}
          <Panel defaultSize={50} minSize={20}>
            <div className="flex flex-col h-full bg-card overflow-hidden">
              <div
                ref={previewRef}
                onScroll={handlePreviewScroll}
                className="flex-1 p-8 overflow-y-auto prose max-w-none
                  prose-headings:font-semibold prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mt-6 prose-headings:mb-4
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-code:text-foreground prose-code:bg-background-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-background-secondary prose-pre:text-foreground prose-pre:border prose-pre:border-border
                  prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:text-foreground-secondary prose-blockquote:pl-4 prose-blockquote:italic"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(html),
                  }}
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};
