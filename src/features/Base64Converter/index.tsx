import React, { useState } from "react";
import { ArrowLeftRight, Binary, Copy, Check, Trash2 } from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";
import { useToolLogic } from "@/hooks/useToolLogic";

export const Base64Converter: React.FC = () => {
  const {
    input,
    setInput,
    output,
    setOutput,
    copied,
    handleCopy,
    handleClear,
  } = useToolLogic();
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  // Check for input in URL hash (from extension)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("input=")) {
      try {
        const params = new URLSearchParams(hash.substring(1));
        const inputParam = params.get("input");
        if (inputParam) {
          const decoded = decodeURIComponent(inputParam);
          // Auto-detect: if it looks like base64, we probably want to decode it
          // But the extension sends the raw text.
          // If the raw text IS base64, we want to decode it.
          setInput(decoded);
          setMode("decode");
          process(decoded, "decode");

          window.history.replaceState(null, "", window.location.pathname);
        }
      } catch (e) {}
    }
  }, [setInput]);

  const process = (text: string, currentMode: "encode" | "decode") => {
    try {
      if (!text) {
        setOutput("");
        return;
      }
      if (currentMode === "encode") {
        setOutput(btoa(text));
      } else {
        setOutput(atob(text));
      }
    } catch (e) {
      setOutput("Error: Invalid input for decoding");
    }
  };

  const handleInputChange = (newVal: string) => {
    setInput(newVal);
    process(newVal, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Binary}
          title="Base64 Converter"
          description="Encode and decode text to Base64 format"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center">
          <button
            onClick={toggleMode}
            className="flex items-center space-x-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-medium transition-colors border border-slate-200"
          >
            <span className={mode === "encode" ? "text-primary font-bold" : ""}>
              Encode
            </span>
            <ArrowLeftRight size={16} className="text-slate-400" />
            <span className={mode === "decode" ? "text-primary font-bold" : ""}>
              Decode
            </span>
          </button>

          <ActionButton
            onClick={handleClear}
            icon={Trash2}
            label="Clear"
            variant="danger"
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={handleInputChange}
              label={mode === "encode" ? "Text Source" : "Base64 String"}
              placeholder={
                mode === "encode"
                  ? "Type text here to encode..."
                  : "Paste Base64 string here to decode..."
              }
              theme="light"
            />

            <CodeEditor
              value={output}
              label={mode === "encode" ? "Base64 Result" : "Decoded Text"}
              placeholder="Result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? "Copied" : "Copy"}
                    onClick={handleCopy}
                    variant={copied ? "success" : "primary"}
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
