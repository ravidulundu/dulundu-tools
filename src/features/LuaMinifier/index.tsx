import React from "react";
import {
  Minimize2,
  ArrowRight,
  Copy,
  Check,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";
import { useToolLogic } from "@/hooks/useToolLogic";

export const LuaMinifier: React.FC = () => {
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
  } = useToolLogic({
    initialInput:
      "-- Example Lua Code\nfunction factorial(n)\n    if n == 0 then\n        return 1\n    else\n        return n * factorial(n - 1)\n    end\nend\n\nprint(factorial(5))",
  });

  const minifyLua = (code: string) => {
    let minified = code;

    // Reset
    minified = code;
    minified = minified.replace(/--.*$/gm, ""); // Comments
    minified = minified.replace(/--\[\[[\s\S]*?\]\]/g, ""); // Block comments

    // Tokenize roughly by splitting by whitespace and operators, but that's hard.
    // Simple approach: Remove leading/trailing whitespace per line, join with space.
    minified = minified
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l)
      .join(" ");

    // Aggressive: remove spaces around symbols
    minified = minified.replace(/\s*([=+\-*/%^#<>~,(){}])\s*/g, "$1");

    return minified.trim();
  };

  const handleMinify = () => {
    setOutput(minifyLua(input));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Minimize2}
          title="Lua Minifier"
          description="Compress Lua scripts to reduce size"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleMinify}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              Minify <ArrowRight size={16} className="ml-1.5" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".lua"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload Lua File"
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
              label="Lua Input"
              placeholder="Paste Lua code here..."
              language="lua"
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Minified Output"
              placeholder="Result will appear here..."
              readOnly
              language="lua"
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() =>
                        handleDownload("minified.lua", "text/x-lua")
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
