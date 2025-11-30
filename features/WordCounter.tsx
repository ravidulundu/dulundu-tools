import React, { useState, useEffect } from "react";
import { Type, Trash2, Copy, Check } from "lucide-react";
import { useToolLogic } from "../hooks/useToolLogic";

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <Type size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Word Counter
              </h1>
              <p className="text-sm text-slate-500">
                Analyze text statistics and change case
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleClear}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={hookHandleCopy}
              className="p-2 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
              title="Copy"
            >
              {hookCopied ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-200 border-b border-gray-200">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.chars },
            { label: "Characters (no space)", value: stats.charsNoSpace },
            { label: "Lines", value: stats.lines },
            { label: "Paragraphs", value: stats.paragraphs },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6">
          <textarea
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            className="w-full h-80 p-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y text-base text-slate-700 leading-relaxed shadow-sm bg-white"
            placeholder="Type or paste your text here to analyze..."
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => transformText("upper")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transformText("lower")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              lowercase
            </button>
            <button
              onClick={() => transformText("capital")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Capitalize Words
            </button>
            <button
              onClick={() => transformText("sentence")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Sentence case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
