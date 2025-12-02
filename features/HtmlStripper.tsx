import React, { useState } from "react";
import {
  Code,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  Upload,
  Download,
} from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { CodeEditor } from "../components/common/CodeEditor";
import { ActionButton } from "../components/common/ActionButton";
import { useToolLogic } from "../hooks/useToolLogic";

type Mode = "strip" | "escape" | "unescape";

export const HtmlStripper: React.FC = () => {
  const {
    input,
    setInput,
    output,
    setOutput,
    copied,
    fileInputRef,
    handleCopy,
    handleClear,
    handleFileUpload,
    handleDownload,
  } = useToolLogic({ initialInput: "<p>Hello <strong>World</strong>!</p>" });

  const [mode, setMode] = useState<Mode>("strip");

  const process = () => {
    if (!input) {
      setOutput("");
      return;
    }

    if (mode === "strip") {
      const doc = new DOMParser().parseFromString(input, "text/html");
      setOutput(doc.body.textContent || "");
    } else if (mode === "escape") {
      setOutput(
        input
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
      );
    } else if (mode === "unescape") {
      const doc = new DOMParser().parseFromString(input, "text/html");
      setOutput(doc.documentElement.textContent || "");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Code}
          title="HTML Tools"
          description="Strip Tags, Escape, and Unescape HTML entities"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setMode("strip")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "strip"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Strip Tags
            </button>
            <button
              onClick={() => setMode("escape")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "escape"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Escape
            </button>
            <button
              onClick={() => setMode("unescape")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "unescape"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Unescape
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={process}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md text-sm"
            >
              Process <ArrowRight size={16} className="ml-2" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload File"
            >
              <Upload size={20} />
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
              label="Input HTML"
              placeholder="Paste HTML here..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Result"
              placeholder="Result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() => handleDownload("result.txt", "text/plain")}
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
