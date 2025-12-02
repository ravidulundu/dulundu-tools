import React from "react";
import {
  Wand2,
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

export const LuaBeautifier: React.FC = () => {
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
      "function factorial(n) if n==0 then return 1 else return n*factorial(n-1) end end",
  });

  const beautifyLua = (code: string) => {
    let formatted = code;

    // Very basic indentation logic
    // 1. Add newlines after 'then', 'do', 'repeat', 'else'
    // 2. Add newlines before 'end', 'until', 'else', 'elseif'

    // Normalize spaces
    formatted = formatted.replace(/\s+/g, " ");

    // Add newlines around keywords
    formatted = formatted.replace(/\s(then|do|repeat)\s/g, " $1\n");
    formatted = formatted.replace(/\s(end|until|else|elseif)\s/g, "\n$1\n");
    formatted = formatted.replace(/\s(function)\s/g, "\n$1 ");

    // Split lines
    const lines = formatted.split("\n");
    let indentLevel = 0;
    const indentChar = "    ";

    const result = lines
      .map((line) => {
        line = line.trim();
        if (!line) return "";

        // Decrease indent for closing blocks
        if (line.match(/^(end|until|else|elseif)/)) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = indentChar.repeat(indentLevel) + line;

        // Increase indent for opening blocks
        if (
          line.match(/^(function|if|while|repeat|for|else|elseif|do)/) &&
          !line.match(/\send$/)
        ) {
          // Check if it's not a single line function/if (heuristic)
          if (!line.includes("end")) {
            indentLevel++;
          }
        }

        return indentedLine;
      })
      .join("\n");

    return result.trim();
  };

  const handleFormat = () => {
    setOutput(beautifyLua(input));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Wand2}
          title="Lua Beautifier"
          description="Format Lua code with proper indentation"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleFormat}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              Beautify <ArrowRight size={16} className="ml-1.5" />
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

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Lua Input"
              placeholder="Paste Lua code here..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Formatted Output"
              placeholder="Result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() =>
                        handleDownload("formatted.lua", "text/x-lua")
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
