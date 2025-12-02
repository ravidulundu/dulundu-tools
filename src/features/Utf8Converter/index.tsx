import React, { useState, useEffect } from "react";
import { Type, Copy, Check, ArrowRightLeft } from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { ActionButton } from "@/components/common/ActionButton";

type Format = "text" | "hex" | "bin" | "dec";

export const Utf8Converter: React.FC = () => {
  const [input, setInput] = useState("Hello World 🌍");
  const [inputFormat, setInputFormat] = useState<Format>("text");

  const [text, setText] = useState("");
  const [hex, setHex] = useState("");
  const [bin, setBin] = useState("");
  const [dec, setDec] = useState("");

  const [copied, setCopied] = useState("");

  const convert = (val: string, format: Format) => {
    setInput(val);
    if (!val.trim()) {
      setText("");
      setHex("");
      setBin("");
      setDec("");
      return;
    }

    try {
      let bytes: Uint8Array | null = null;

      if (format === "text") {
        const encoder = new TextEncoder();
        bytes = encoder.encode(val);
      } else if (format === "hex") {
        // Remove spaces and \x prefix
        const clean = val.replace(/[\s\\x]/g, "");
        if (clean.length % 2 !== 0) throw new Error("Invalid Hex");
        const arr = [];
        for (let i = 0; i < clean.length; i += 2) {
          arr.push(parseInt(clean.substr(i, 2), 16));
        }
        bytes = new Uint8Array(arr);
      } else if (format === "bin") {
        const clean = val.replace(/\s/g, "");
        if (clean.length % 8 !== 0) throw new Error("Invalid Binary");
        const arr = [];
        for (let i = 0; i < clean.length; i += 8) {
          arr.push(parseInt(clean.substr(i, 8), 2));
        }
        bytes = new Uint8Array(arr);
      } else if (format === "dec") {
        const arr = val
          .trim()
          .split(/\s+/)
          .map((n) => parseInt(n, 10));
        bytes = new Uint8Array(arr);
      }

      if (bytes) {
        const decoder = new TextDecoder();

        // Update all fields except the input one to avoid cursor jumping/formatting issues
        if (format !== "text") setText(decoder.decode(bytes));

        if (format !== "hex") {
          let h = "";
          bytes.forEach(
            (b) => (h += `\\x${b.toString(16).padStart(2, "0").toUpperCase()}`)
          );
          setHex(h);
        }

        if (format !== "bin") {
          let b = "";
          bytes.forEach(
            (byte) => (b += `${byte.toString(2).padStart(8, "0")} `)
          );
          setBin(b.trim());
        }

        if (format !== "dec") {
          let d = "";
          bytes.forEach((byte) => (d += `${byte} `));
          setDec(d.trim());
        }
      }
    } catch (e) {
      // Invalid input, just clear other fields or show error state
      // For now, we keep previous valid values or clear if empty
    }
  };

  // Initial conversion
  useEffect(() => {
    convert(input, "text");
  }, []);

  const handleInputChange = (val: string) => {
    setInput(val);
    convert(val, inputFormat);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Type}
          title="UTF-8 Converter"
          description="Convert between Text, Hex, Binary, and Decimal bytes"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">
            Input Format:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(["text", "hex", "bin", "dec"] as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setInputFormat(f);
                  // When switching format, try to use the current corresponding output as new input
                  if (f === "text") {
                    setInput(text);
                    convert(text, "text");
                  } else if (f === "hex") {
                    setInput(hex);
                    convert(hex, "hex");
                  } else if (f === "bin") {
                    setInput(bin);
                    convert(bin, "bin");
                  } else if (f === "dec") {
                    setInput(dec);
                    convert(dec, "dec");
                  }
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                  inputFormat === f
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === "bin" ? "Binary" : f === "dec" ? "Decimal" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex flex-col">
          <div className="mb-6">
            <CodeEditor
              value={input}
              onChange={handleInputChange}
              label={`Input (${
                inputFormat === "bin"
                  ? "Binary"
                  : inputFormat === "dec"
                  ? "Decimal"
                  : inputFormat === "hex"
                  ? "Hexadecimal"
                  : "Text"
              })`}
              placeholder={`Enter ${inputFormat} here...`}
              theme="light"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid gap-6 pb-4">
              {inputFormat !== "text" && (
                <CodeEditor
                  value={text}
                  label="Text Result"
                  readOnly
                  theme="dark"
                  actions={
                    text && (
                      <ActionButton
                        icon={copied === "text" ? Check : Copy}
                        label={copied === "text" ? "Copied" : "Copy"}
                        onClick={() => handleCopy(text, "text")}
                        variant={copied === "text" ? "success" : "primary"}
                      />
                    )
                  }
                />
              )}
              {inputFormat !== "hex" && (
                <CodeEditor
                  value={hex}
                  label="Hexadecimal Result"
                  readOnly
                  theme="dark"
                  actions={
                    hex && (
                      <ActionButton
                        icon={copied === "hex" ? Check : Copy}
                        label={copied === "hex" ? "Copied" : "Copy"}
                        onClick={() => handleCopy(hex, "hex")}
                        variant={copied === "hex" ? "success" : "primary"}
                      />
                    )
                  }
                />
              )}
              {inputFormat !== "bin" && (
                <CodeEditor
                  value={bin}
                  label="Binary Result"
                  readOnly
                  theme="dark"
                  actions={
                    bin && (
                      <ActionButton
                        icon={copied === "bin" ? Check : Copy}
                        label={copied === "bin" ? "Copied" : "Copy"}
                        onClick={() => handleCopy(bin, "bin")}
                        variant={copied === "bin" ? "success" : "primary"}
                      />
                    )
                  }
                />
              )}
              {inputFormat !== "dec" && (
                <CodeEditor
                  value={dec}
                  label="Decimal Result"
                  readOnly
                  theme="dark"
                  actions={
                    dec && (
                      <ActionButton
                        icon={copied === "dec" ? Check : Copy}
                        label={copied === "dec" ? "Copied" : "Copy"}
                        onClick={() => handleCopy(dec, "dec")}
                        variant={copied === "dec" ? "success" : "primary"}
                      />
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
