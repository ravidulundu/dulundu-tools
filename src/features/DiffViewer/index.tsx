import React, { useState, useRef } from "react";
import { ArrowRightLeft, Trash2, Upload } from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { Button } from "@/components/common/Button";
import { ActionButton } from "@/components/common/ActionButton";

export const DiffViewer: React.FC = () => {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [diff, setDiff] = useState<React.ReactNode[] | null>(null);

  const oldFileRef = useRef<HTMLInputElement>(null);
  const newFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setText: (text: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  // Simple line-by-line diff
  const computeDiff = () => {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");

    const maxLines = Math.max(oldLines.length, newLines.length);
    const result = [];

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || "";
      const newLine = newLines[i] || "";

      if (oldLine === newLine) {
        result.push(
          <div
            key={i}
            className="flex border-b border-gray-100 hover:bg-gray-50 group"
          >
            <div className="w-12 p-1 text-right text-gray-400 text-xs select-none border-r border-gray-200 bg-gray-50 font-mono pr-2">
              {i + 1}
            </div>
            <div className="flex-1 p-1 pl-4 font-mono text-sm text-slate-600 overflow-x-auto whitespace-pre">
              {oldLine}
            </div>
          </div>
        );
      } else {
        if (oldLine) {
          result.push(
            <div
              key={`d-${i}`}
              className="flex bg-red-50/50 border-b border-red-100 hover:bg-red-50 transition-colors"
            >
              <div className="w-12 p-1 text-right text-red-400 text-xs select-none border-r border-red-200 bg-red-50 font-mono pr-2">
                -
              </div>
              <div className="flex-1 p-1 pl-4 font-mono text-sm text-red-700 overflow-x-auto whitespace-pre">
                {oldLine}
              </div>
            </div>
          );
        }
        if (newLine) {
          result.push(
            <div
              key={`a-${i}`}
              className="flex bg-green-50/50 border-b border-green-100 hover:bg-green-50 transition-colors"
            >
              <div className="w-12 p-1 text-right text-green-400 text-xs select-none border-r border-green-200 bg-green-50 font-mono pr-2">
                +
              </div>
              <div className="flex-1 p-1 pl-4 font-mono text-sm text-green-700 overflow-x-auto whitespace-pre">
                {newLine}
              </div>
            </div>
          );
        }
      }
    }
    setDiff(result);
  };

  const handleClear = () => {
    setOldText("");
    setNewText("");
    setDiff(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
        <ToolHeader
          icon={ArrowRightLeft}
          title="Diff Viewer"
          description="Compare text files line by line"
        />

        {/* Toolbar */}
        <div className="p-3 border-b border-gray-100 flex justify-end space-x-2">
          {diff && (
            <ActionButton
              onClick={() => setDiff(null)}
              label="Edit"
              variant="secondary"
              icon={ArrowRightLeft}
            />
          )}
          {!diff && (
            <>
              <input
                ref={oldFileRef}
                type="file"
                onChange={(e) => handleFileUpload(e, setOldText)}
                className="hidden"
              />
              <ActionButton
                onClick={() => oldFileRef.current?.click()}
                variant="secondary"
                label="Upload Original"
                icon={Upload}
              />

              <input
                ref={newFileRef}
                type="file"
                onChange={(e) => handleFileUpload(e, setNewText)}
                className="hidden"
              />
              <ActionButton
                onClick={() => newFileRef.current?.click()}
                variant="secondary"
                label="Upload Modified"
                icon={Upload}
              />
            </>
          )}
          <ActionButton
            onClick={handleClear}
            variant="danger"
            label="Clear"
            icon={Trash2}
          />
          {!diff && (
            <Button
              onClick={computeDiff}
              variant="primary"
              size="sm"
              className="font-bold"
            >
              Compare Texts
            </Button>
          )}
        </div>

        {/* Input Area - Only show if no diff computed yet */}
        {!diff ? (
          <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
            <div className="grid md:grid-cols-2 gap-4 h-full">
              <CodeEditor
                value={oldText}
                onChange={setOldText}
                label="Original Text"
                placeholder="Paste original text here..."
                theme="light"
              />

              <CodeEditor
                value={newText}
                onChange={setNewText}
                label="Modified Text"
                placeholder="Paste modified text here..."
                theme="light"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="p-2 bg-slate-100 border-b border-gray-200 flex justify-between items-center px-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Comparison Result
              </span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {diff}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
