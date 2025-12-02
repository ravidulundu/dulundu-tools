import React, { useState, useEffect } from "react";
import { Type, Trash2, Copy, Check } from "lucide-react";
import { useToolLogic } from "@/hooks/useToolLogic";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";

export const WordCounter: React.FC = () => {
  const {
    input: text,
    setInput: setText,
    copied,
    handleCopy: originalHandleCopy,
  } = useToolLogic();

  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpace: 0,
    lines: 0,
    paragraphs: 0,
  });

  // We need to override handleCopy because useToolLogic copies 'output', but here we want to copy 'input' (text)
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // We can't easily trigger the 'copied' state from the hook if we bypass its handleCopy
    // So we might need to expose setCopied from the hook or just reimplement handleCopy locally for this specific case
    // OR, we can just set output = input in the hook, but that might be confusing.
    // Let's just use the hook's state but implement the copy logic here since it's unique.
    // Actually, the hook exports 'setCopied' (wait, I need to check if I exported it).
    // I checked useToolLogic.ts earlier, I did NOT export setCopied.
    // I should probably update useToolLogic to export setCopied or make handleCopy more flexible.
    // For now, I'll just use the hook for input/output management where possible, but this component is a bit unique.
    // Actually, I can just setOutput(text) whenever text changes, then handleCopy from hook will work!
  };

  // Better approach: Update the hook to allow copying input? Or just duplicate the simple copy logic here?
  // Let's duplicate simple copy logic here to avoid over-complicating the hook for one edge case.
  // Wait, I can't use 'copied' from hook if I don't use hook's handleCopy.
  // Let's check useToolLogic again. It exports: input, setInput, output, setOutput, error, setError, copied, fileInputRef, handleCopy, handleClear, handleFileUpload, handleDownload.
  // It does NOT export setCopied.
  // So if I want to use 'copied' state, I MUST use hook's handleCopy.
  // Hook's handleCopy copies 'output'.
  // So I should keep 'output' in sync with 'text' if I want to use that.
  // OR, I can just not use the hook for this specific component if it doesn't fit well.
  // BUT, the goal is standardization.
  // Let's use the hook, and setOutput(text) in the useEffect.

  useEffect(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const lines = text.trim() === "" ? 0 : text.split(/\n/).length;
    const paragraphs =
      text.trim() === ""
        ? 0
        : text.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;

    setStats({ words, chars, charsNoSpace, lines, paragraphs });

    // Sync output for copy functionality
    // We need to cast setOutput to any or ignore ts error because useToolLogic might not be imported yet in this thought block context?
    // No, it is imported.
    // However, I can't access setOutput inside this component if I didn't destructure it.
  }, [text]);

  // Let's re-destructure to get setOutput
  const {
    input,
    setInput,
    output,
    setOutput,
    copied: hookCopied,
    handleCopy: hookHandleCopy,
    handleClear,
  } = useToolLogic();

  // Mapping for compatibility with existing code
  const textVal = input;
  const setTextVal = setInput;

  useEffect(() => {
    const t = textVal;
    const words = t.trim() === "" ? 0 : t.trim().split(/\s+/).length;
    const chars = t.length;
    const charsNoSpace = t.replace(/\s/g, "").length;
    const lines = t.trim() === "" ? 0 : t.split(/\n/).length;
    const paragraphs =
      t.trim() === ""
        ? 0
        : t.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;

    setStats({ words, chars, charsNoSpace, lines, paragraphs });
    setOutput(t); // Sync for copy
  }, [textVal, setOutput]);

  const transformText = (type: "upper" | "lower" | "capital" | "sentence") => {
    let newText = textVal;
    if (type === "upper") newText = textVal.toUpperCase();
    if (type === "lower") newText = textVal.toLowerCase();
    if (type === "capital") {
      newText = textVal.replace(/\b\w/g, (l) => l.toUpperCase());
    }
    if (type === "sentence") {
      newText = textVal
        .toLowerCase()
        .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
    }
    setTextVal(newText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Type}
          title="Word Counter"
          description="Analyze text statistics and change case"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => transformText("upper")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transformText("lower")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              lowercase
            </button>
            <button
              onClick={() => transformText("capital")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              Capitalize Words
            </button>
            <button
              onClick={() => transformText("sentence")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              Sentence case
            </button>
          </div>

          <div className="flex space-x-2">
            <ActionButton
              onClick={handleClear}
              icon={Trash2}
              label="Clear"
              variant="danger"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-200 border-b border-gray-200">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.chars },
            { label: "Chars (no space)", value: stats.charsNoSpace },
            { label: "Lines", value: stats.lines },
            { label: "Paragraphs", value: stats.paragraphs },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-800">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <CodeEditor
            value={textVal}
            onChange={setTextVal}
            placeholder="Type or paste your text here to analyze..."
            theme="light"
            actions={
              textVal && (
                <ActionButton
                  icon={hookCopied ? Check : Copy}
                  label={hookCopied ? "Copied" : "Copy"}
                  onClick={hookHandleCopy}
                  variant={hookCopied ? "success" : "primary"}
                />
              )
            }
          />
        </div>
      </div>
    </div>
  );
};
