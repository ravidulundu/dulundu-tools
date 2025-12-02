import React, { useState, useEffect } from "react";
import {
  Image,
  Upload,
  Download,
  Copy,
  Check,
  Trash2,
  Zap,
  Maximize2,
} from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { ActionButton } from "../components/common/ActionButton";
import { CodeEditor } from "../components/common/CodeEditor";
import { useToolLogic } from "../hooks/useToolLogic";

export const SvgViewer: React.FC = () => {
  const {
    input,
    setInput,
    fileInputRef,
    handleFileUpload,
    handleCopy,
    copied,
    handleClear,
    handleDownload,
  } = useToolLogic();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [fileSize, setFileSize] = useState(0);

  useEffect(() => {
    if (!input.trim()) {
      setPreviewUrl(null);
      setDimensions({ width: 0, height: 0 });
      setFileSize(0);
      return;
    }

    // Basic validation to check if it looks like SVG
    if (!input.includes("<svg")) {
      return;
    }

    const blob = new Blob([input], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setFileSize(blob.size);

    // Get dimensions
    const img = document.createElement("img");
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [input]);

  const optimizeSvg = () => {
    if (!input) return;

    // Simple optimization: remove comments, newlines, and extra spaces
    let optimized = input
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .replace(/>\s+</g, "><") // Remove spaces between tags
      .trim();

    setInput(optimized);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 min-h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full">
        <ToolHeader
          icon={Image}
          title="SVG Viewer & Optimizer"
          description="View, inspect, and optimize SVG vector graphics"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              onChange={(e) => handleFileUpload(e)}
              className="hidden"
            />
            <ActionButton
              onClick={() => fileInputRef.current?.click()}
              icon={Upload}
              label="Upload SVG"
              variant="secondary"
            />
            <ActionButton
              onClick={optimizeSvg}
              icon={Zap}
              label="Optimize"
              variant="primary"
              title="Remove whitespace and comments"
              disabled={!input}
            />
          </div>

          <div className="flex gap-2">
            <ActionButton
              onClick={() => handleDownload("image.svg", "image/svg+xml")}
              icon={Download}
              label="Download"
              variant="secondary"
              disabled={!input}
            />
            <ActionButton
              onClick={handleClear}
              icon={Trash2}
              label="Clear"
              variant="danger"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-6 h-full">
            {/* Editor */}
            <div className="flex flex-col h-[500px] md:h-auto">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="SVG Code"
                language="xml"
                placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>'
                theme="light"
                actions={
                  input && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mr-2">
                      <span>{formatSize(fileSize)}</span>
                      <span className="w-px h-3 bg-slate-300 mx-1"></span>
                      <ActionButton
                        onClick={handleCopy}
                        icon={copied ? Check : Copy}
                        variant="ghost"
                        className={
                          copied
                            ? "text-green-500"
                            : "text-slate-400 hover:text-primary"
                        }
                        title="Copy Code"
                      />
                    </div>
                  )
                }
              />
            </div>

            {/* Preview */}
            <div className="flex flex-col h-[500px] md:h-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Preview
                </span>
                {dimensions.width > 0 && (
                  <span className="text-xs font-mono text-slate-500">
                    {dimensions.width} x {dimensions.height}
                  </span>
                )}
              </div>
              <div className="flex-1 p-8 flex items-center justify-center overflow-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2YxZjVZjkiIGQ9Ik0wIDBoMTB2MTBIMHptMTAgMTBoMTB2MTBIMTB6Ii8+PC9zdmc+')]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="SVG Preview"
                    className="max-w-full max-h-full shadow-lg"
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <Image size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No SVG loaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgViewer;
