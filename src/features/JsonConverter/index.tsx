import React, { useState } from "react";
import {
  ArrowRightLeft,
  FileJson,
  Copy,
  Check,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";
import { Button } from "@/components/common/Button";
import { useToolLogic } from "@/hooks/useToolLogic";

type Mode = "json-xml" | "json-csv";

export const JsonConverter: React.FC = () => {
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
  const [mode, setMode] = useState<Mode>("json-xml");

  // Helper: JSON to XML
  const jsonToXml = (json: unknown): string => {
    let xml = "";
    if (typeof json === "object" && json !== null) {
      if (Array.isArray(json)) {
        json.forEach((item) => {
          xml += `<item>${jsonToXml(item)}</item>`;
        });
      } else {
        Object.keys(json as Record<string, unknown>).forEach((key) => {
          xml += `<${key}>${jsonToXml(
            (json as Record<string, unknown>)[key]
          )}</${key}>`;
        });
      }
    } else {
      xml += String(json);
    }
    return xml;
  };

  // Helper: JSON to CSV
  const jsonToCsv = (json: Record<string, unknown>[]): string => {
    if (!Array.isArray(json) || json.length === 0)
      throw new Error("JSON must be a non-empty array of objects");
    const headers = Object.keys(json[0]);
    const csvRows = [headers.join(",")];

    for (const row of json) {
      const values = headers.map((header) => {
        const val = row[header];
        const escaped = ("" + (val ?? "")).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setError(null);

    try {
      const parsed = JSON.parse(input);

      if (mode === "json-xml") {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(
          parsed
        )}\n</root>`;
        // Basic pretty print via regex
        const formatted = xml.replace(/(>)(<)(\/*)/g, "$1\r\n$2$3");
        setOutput(formatted);
      } else {
        // Ensure array for CSV
        const data = Array.isArray(parsed) ? parsed : [parsed];
        setOutput(jsonToCsv(data as Record<string, unknown>[]));
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileJson}
          title="JSON Converter"
          description="Convert JSON to XML or CSV format"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => setMode("json-xml")}
              variant={mode === "json-xml" ? "primary" : "outline"}
              size="sm"
            >
              JSON to XML
            </Button>
            <Button
              onClick={() => setMode("json-csv")}
              variant={mode === "json-csv" ? "primary" : "outline"}
              size="sm"
            >
              JSON to CSV
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={convert} variant="primary" className="shadow-sm">
              Convert <ArrowRightLeft size={16} className="ml-1.5" />
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              onChange={(e) => handleFileUpload(e)}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              size="sm"
              title="Upload File"
              icon={Upload}
            />

            <Button
              onClick={handleClear}
              variant="danger"
              size="sm"
              title="Clear All"
              icon={Trash2}
            />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input JSON"
                placeholder='[{"id": 1, "name": "Test"}]'
                theme="light"
              />
              {error && (
                <p className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">
                  {error}
                </p>
              )}
            </div>

            <CodeEditor
              value={output}
              label={mode === "json-xml" ? "XML Output" : "CSV Output"}
              placeholder="Result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() =>
                        handleDownload(
                          mode === "json-xml" ? "data.xml" : "data.csv",
                          mode === "json-xml" ? "text/xml" : "text/csv"
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
