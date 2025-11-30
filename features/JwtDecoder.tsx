import React, { useState } from "react";
import { Shield, Copy, Check, Trash2 } from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { CodeEditor } from "../components/common/CodeEditor";
import { ActionButton } from "../components/common/ActionButton";
import { useToolLogic } from "../hooks/useToolLogic";

export const JwtDecoder: React.FC = () => {
  const {
    input: token,
    setInput: setToken,
    error,
    setError,
    handleClear: hookHandleClear,
  } = useToolLogic();

  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [copied, setCopied] = useState("");

  const decode = (input: string) => {
    setToken(input);
    setError(null);
    if (!input) {
      setHeader("");
      setPayload("");
      return;
    }

    try {
      const parts = input.split(".");
      if (parts.length !== 3) {
        throw new Error(
          "Invalid JWT format. Must have 3 parts separated by dots."
        );
      }

      const decodePart = (part: string) => {
        const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        return JSON.stringify(JSON.parse(json), null, 2);
      };

      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
    } catch (e) {
      setHeader("");
      setPayload("");
      setError("Invalid JWT Token or Base64 encoding.");
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleClear = () => {
    hookHandleClear();
    setHeader("");
    setPayload("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Shield}
          title="JWT Decoder"
          description="Decode JSON Web Tokens (Header & Payload)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input */}
            <div className="flex flex-col h-full">
              <CodeEditor
                value={token}
                onChange={decode}
                label="Encoded Token"
                placeholder="Paste JWT here (eyJ...)"
                theme="light"
              />
              {error && (
                <p className="mt-2 text-xs text-red-500 font-bold">{error}</p>
              )}
            </div>

            {/* Output */}
            <div className="flex flex-col h-full gap-4">
              {/* Header */}
              <div className="flex-1 min-h-0">
                <CodeEditor
                  value={header}
                  label="Header"
                  readOnly
                  theme="dark"
                  actions={
                    header && (
                      <ActionButton
                        icon={copied === "header" ? Check : Copy}
                        label="Copy"
                        onClick={() => handleCopy(header, "header")}
                        variant={copied === "header" ? "success" : "primary"}
                        size="sm"
                      />
                    )
                  }
                />
              </div>

              {/* Payload */}
              <div className="flex-[2] min-h-0">
                <CodeEditor
                  value={payload}
                  label="Payload"
                  readOnly
                  theme="dark"
                  actions={
                    payload && (
                      <ActionButton
                        icon={copied === "payload" ? Check : Copy}
                        label="Copy"
                        onClick={() => handleCopy(payload, "payload")}
                        variant={copied === "payload" ? "success" : "primary"}
                        size="sm"
                      />
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
