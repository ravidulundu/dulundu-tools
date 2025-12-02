import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { FileText, Eye, Check, Copy, Download } from "lucide-react";
import { marked } from "marked";
import Editor, { OnMount } from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ToolHeader } from "@/components/common/ToolHeader";
import { ActionButton } from "@/components/common/ActionButton";
import { useTheme } from "@/contexts/ThemeContext";

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
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  // Refs for sync scrolling
  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    try {
      const rawHtml = marked.parse(markdown);
      if (typeof rawHtml === "string") {
        setHtml(rawHtml);
      } else {
        (rawHtml as Promise<string>).then((res) => setHtml(res));
      }
    } catch (e) {
      // Ignore parsing errors while typing
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
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidScrollChange((e) => {
      if (!isScrolling.current && previewRef.current) {
        isScrolling.current = true;
        const editorScrollHeight =
          editor.getScrollHeight() - editor.getLayoutInfo().height;
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
      const previewScrollHeight =
        previewRef.current.scrollHeight - previewRef.current.clientHeight;
      const editorScrollHeight =
        editorRef.current.getScrollHeight() -
        editorRef.current.getLayoutInfo().height;
      const ratio = previewRef.current.scrollTop / previewScrollHeight;
      editorRef.current.setScrollTop(ratio * editorScrollHeight);
      setTimeout(() => (isScrolling.current = false), 10);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-white dark:bg-[#0d1117]">
      {/* Toolbar matching theme colors */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm border-b border-gray-200 dark:border-slate-800 shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-800 dark:text-white">
            Markdown Live Preview
          </span>
          <button
            onClick={() =>
              setMarkdown(
                "# Markdown syntax guide\n\n## Headers\n\n# This is a Heading h1\n## This is a Heading h2\n###### This is a Heading h6\n\n## Emphasis\n\n*This text will be italic*\n_This will also be italic_\n\n**This text will be bold**\n__This will also be bold__\n\n_You **can** combine them_\n\n## Lists\n\n### Unordered\n\n* Item 1\n* Item 2\n* Item 2a\n* Item 2b\n    * Item 3a\n    * Item 3b\n\n### Ordered\n\n1. Item 1\n2. Item 2\n3. Item 3\n    1. Item 3a\n    2. Item 3b\n\n## Images\n\n![Dulundu Tools Logo](/favicon.svg \"Dulundu Tools Logo\")\n\n## Links\n\nYou may be using [Dulundu Tools](https://dulundu.tools/).\n\n## Blockquotes\n\n> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.\n>\n>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.\n\n## Tables\n\n| Left columns  | Right columns |\n| ------------- |:-------------:|\n| left foo      | right foo     |\n| left bar      | right bar     |\n| left baz      | right baz     |\n\n## Blocks of code\n\n```\nlet message = 'Hello world';\nalert(message);\n```\n\n## Inline code\n\nThis web site is using `markedjs/marked`."
              )
            }
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleCopy}
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-primary dark:hover:text-white transition-colors">
            <input
              type="checkbox"
              defaultChecked={true}
              onChange={(e) => {
                isScrolling.current = !e.target.checked;
              }}
              className="rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-800 text-primary focus:ring-offset-white dark:focus:ring-offset-slate-900"
            />
            Sync scroll
          </label>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
          <button
            onClick={() =>
              handleDownload(markdown, "document.md", "text/markdown")
            }
            className="hover:text-primary dark:hover:text-white transition-colors"
            title="Download Markdown"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => handleDownload(html, "document.html", "text/html")}
            className="hover:text-primary dark:hover:text-white transition-colors"
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
                onChange={(value) => setMarkdown(value || "")}
                onMount={handleEditorDidMount}
                theme={theme === "dark" ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                  lineNumbers: "on",
                  renderLineHighlight: "all",
                }}
              />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 transition-colors cursor-col-resize" />

          {/* Preview */}
          <Panel defaultSize={50} minSize={20}>
            <div className="flex flex-col h-full bg-white dark:bg-[#0d1117] overflow-hidden">
              <div
                ref={previewRef}
                onScroll={handlePreviewScroll}
                className="flex-1 p-8 overflow-y-auto prose prose-slate dark:prose-invert max-w-none 
                  prose-headings:font-semibold prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-800 prose-headings:pb-2 prose-headings:mt-6 prose-headings:mb-4
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-code:text-slate-800 dark:prose-code:text-slate-200 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-slate-100 dark:prose-pre:bg-[#161b22] prose-pre:text-slate-900 dark:prose-pre:text-slate-100 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:pl-4 prose-blockquote:italic"
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
