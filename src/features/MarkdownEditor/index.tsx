import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { FileText, Eye, Code, Copy, Check, Download } from "lucide-react";
import { marked } from "marked";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";

export const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState(
    '# Hello World\n\nThis is a **Markdown** editor.\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log("Code block");\n```'
  );
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileText}
          title="Markdown Editor"
          description="Write Markdown and see live HTML preview"
        />

        {/* Editor Split View */}
        <div className="flex-1 overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Markdown Input */}
          <div className="flex flex-col h-full min-h-[300px] bg-slate-50 p-4 md:p-0 relative">
            <div className="absolute top-2 right-6 z-10">
              <ActionButton
                icon={Download}
                label="MD"
                onClick={() =>
                  handleDownload(markdown, "document.md", "text/markdown")
                }
                variant="secondary"
                size="sm"
              />
            </div>
            <CodeEditor
              value={markdown}
              onChange={setMarkdown}
              label="Markdown Input"
              placeholder="# Type markdown here..."
              language="markdown"
              theme="light"
              className="h-full border-none"
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col h-full min-h-[300px] bg-white">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider bg-white">
              <div className="flex items-center">
                <Eye size={14} className="mr-2" /> Live Preview
              </div>
              <div className="flex gap-2">
                <ActionButton
                  icon={Download}
                  label="HTML"
                  onClick={() =>
                    handleDownload(html, "document.html", "text/html")
                  }
                  variant="secondary"
                  size="sm"
                />
                <ActionButton
                  icon={copied ? Check : Copy}
                  label={copied ? "Copied HTML" : "Copy HTML"}
                  onClick={handleCopy}
                  variant={copied ? "success" : "secondary"}
                  size="sm"
                />
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto prose prose-slate prose-sm max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
