import React from "react";
import {
  FileCode,
  ArrowRight,
  Copy,
  Check,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { CodeEditor } from "../components/common/CodeEditor";
import { ActionButton } from "../components/common/ActionButton";
import { useToolLogic } from "../hooks/useToolLogic";

export const CsvXmlConverter: React.FC = () => {
  const {
    input,
    setInput,
    output,
    setOutput,
    error,
    setError,
    copied,
    fileInputRef,
    handleCopy,
    handleClear,
    handleFileUpload,
    handleDownload,
  } = useToolLogic();

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      const lines = input.trim().split("\n");
      if (lines.length < 2)
        throw new Error("CSV must have at least a header row and one data row");

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/^"|"$/g, "").replace(/\s+/g, "_")); // Sanitize tag names

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';

      for (let i = 1; i < lines.length; i++) {
        const currentline = lines[i].split(",");
        xml += "  <row>\n";
        for (let j = 0; j < headers.length; j++) {
          let val = currentline[j]?.trim() || "";
          val = val.replace(/^"|"$/g, "");
          // Escape XML special chars
          val = val
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          xml += `    <${headers[j]}>${val}</${headers[j]}>\n`;
        }
        xml += "  </row>\n";
      }
      xml += "</root>";

      setOutput(xml);
      setError(null);
    } catch (e) {
      setError("Error parsing CSV. Ensure format is correct.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileCode}
          title="CSV to XML Converter"
          description="Convert Comma Separated Values to XML format"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={convert}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md text-sm"
            >
              Convert <ArrowRight size={16} className="ml-2" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload CSV File"
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
              label="Input CSV"
              placeholder={`id,name,age\n1,John Doe,30\n2,Jane Smith,25`}
              theme="light"
            />

            <CodeEditor
              value={output}
              label="XML Output"
              placeholder="XML result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() =>
                        handleDownload("converted.xml", "text/xml")
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
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-bottom-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
