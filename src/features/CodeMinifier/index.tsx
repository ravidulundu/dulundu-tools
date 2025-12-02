import React, { useState } from "react";
import { Minimize2, Copy, Trash2, Check, Upload, Download } from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";
import { useToolLogic } from "@/hooks/useToolLogic";

type Lang = "html" | "css" | "js";

export const CodeMinifier: React.FC = () => {
  const {
    input,
    setInput,
    output,
    setOutput,
    copied,
    fileInputRef,
    handleCopy,
    handleClear: hookHandleClear,
    handleFileUpload,
    handleDownload,
  } = useToolLogic();

  const [lang, setLang] = useState<Lang>("css");
  const [stats, setStats] = useState<{
    original: number;
    minified: number;
    savings: string;
  } | null>(null);

  const minify = () => {
    let result = input;

    if (lang === "css") {
      // Basic CSS Minification
      result = result
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, "$1") // Remove space around separators
        .replace(/;}/g, "}") // Remove last semicolon
        .trim();
    } else if (lang === "html") {
      // Basic HTML Minification
      result = result
        .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/>\s+</g, "><") // Remove space between tags
        .trim();
    } else if (lang === "js") {
      // Very Safe/Basic JS Minification
      result = result
        .replace(/\/\*[\s\S]*?\*\//g, "") // Block comments
        .replace(/^\s*\/\/.*/gm, "") // Line comments
        .replace(/([;{}])\s+/g, "$1") // Space after semi/brackets
        .replace(/\s+([;{}])/g, "$1") // Space before semi/brackets
        .replace(/\s+/g, " ")
        .trim();
    }

    setOutput(result);

    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([result]).size;
    const savings =
      originalSize > 0
        ? ((1 - minifiedSize / originalSize) * 100).toFixed(2) + "%"
        : "0%";

    setStats({ original: originalSize, minified: minifiedSize, savings });
  };

  const handleClear = () => {
    hookHandleClear();
    setStats(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Minimize2}
          title="HTML/CSS/JS Minifier"
          description="Compress HTML, CSS, and JavaScript code to reduce file size"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setLang("html")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                lang === "html"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              HTML
            </button>
            <button
              onClick={() => setLang("css")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                lang === "css"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              CSS
            </button>
            <button
              onClick={() => setLang("js")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                lang === "js"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              JS
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={minify}
              disabled={!input.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
            >
              <Minimize2 size={16} className="mr-1.5" />
              Minify
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.css,.js"
              onChange={handleFileUpload}
              className="hidden"
            />
            <ActionButton
              onClick={() => fileInputRef.current?.click()}
              icon={Upload}
              label="Upload"
              variant="secondary"
            />

            <ActionButton
              onClick={handleClear}
              icon={Trash2}
              label="Clear"
              variant="danger"
            />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input Code"
              placeholder={`Paste your ${lang.toUpperCase()} code here...`}
              theme="light"
            />

            <CodeEditor
              value={output}
              label={
                <div className="flex items-center gap-2">
                  <span>Minified Output</span>
                  {stats && (
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">
                      Saved {stats.savings}
                    </span>
                  )}
                </div>
              }
              placeholder="Minified result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() =>
                        handleDownload(
                          `minified.${lang}`,
                          lang === "js" ? "text/javascript" : `text/${lang}`
                        )
                      }
                      variant="secondary"
                    />
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? "Copied" : "Copy"}
                      onClick={handleCopy}
                      variant={copied ? "success" : "primary"}
                    />
                  </>
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
