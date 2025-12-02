import React, { useState } from "react";
import {
  Database,
  ArrowRight,
  Copy,
  Check,
  Trash2,
  ArrowLeftRight,
  Upload,
  Download,
} from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";
import { useToolLogic } from "@/hooks/useToolLogic";

export const SqlConverter: React.FC = () => {
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

  const [mode, setMode] = useState<"sql-json" | "sql-csv">("sql-json");

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      // Rudimentary parser for INSERT INTO table (cols) VALUES (vals), (vals);
      const regex =
        /INSERT\s+INTO\s+[\w`"']+\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+);?/i;
      const match = input.match(regex);

      if (!match)
        throw new Error(
          "Could not parse SQL. Ensure it is a valid INSERT INTO statement."
        );

      const columns = match[1]
        .split(",")
        .map((c) => c.trim().replace(/[`"']/g, ""));
      const valuesStr = match[2];

      // Split by ), ( to get groups. Naive split, careful with nested parens.
      // This assumes standard SQL dump format
      const rowsStr = valuesStr.split(/\)\s*,\s*\(/);

      const data = rowsStr.map((row) => {
        // Clean start/end parens
        let cleanRow = row.replace(/^\s*\(|\)\s*$/g, "");
        // Split by comma, handling quotes roughly
        // Note: A robust SQL parser is too large for this snippet, this is a basic approximation
        const vals = cleanRow.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map((v) => {
          let val = v.trim();
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          if (val === "NULL") return null;
          if (!isNaN(Number(val)) && val !== "") return Number(val);
          return val;
        });

        const obj: any = {};
        columns.forEach((col, idx) => {
          obj[col] = vals[idx];
        });
        return obj;
      });

      if (mode === "sql-json") {
        setOutput(JSON.stringify(data, null, 2));
      } else {
        const csvRows = [columns.join(",")];
        data.forEach((row) => {
          const vals = columns.map((col) => {
            const val = row[col];
            if (val === null) return "NULL";
            if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
            return val;
          });
          csvRows.push(vals.join(","));
        });
        setOutput(csvRows.join("\n"));
      }
      setError(null);
    } catch (e) {
      setError(
        "Error parsing SQL. Supports basic 'INSERT INTO table (cols) VALUES ...' format."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Database}
          title="SQL Converter"
          description="Convert INSERT statements to JSON/CSV"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode("sql-json")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                mode === "sql-json"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              SQL to JSON
            </button>
            <button
              onClick={() => setMode("sql-csv")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                mode === "sql-csv"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              SQL to CSV
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={convert}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
            >
              <ArrowLeftRight size={16} className="mr-1.5" /> Convert
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".sql,.txt"
              onChange={(e) => handleFileUpload(e)}
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
            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input SQL"
                placeholder={`INSERT INTO users (id, name)\nVALUES (1, 'Alice'), (2, 'Bob');`}
                language="sql"
                theme="light"
              />
              {error && (
                <p className="mt-2 text-xs text-red-500 font-bold animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <CodeEditor
              value={output}
              label="Output"
              placeholder="Result will appear here..."
              readOnly
              language={mode === "sql-json" ? "json" : "text"}
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() =>
                        handleDownload(
                          mode === "sql-json" ? "data.json" : "data.csv",
                          mode === "sql-json" ? "application/json" : "text/csv"
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
