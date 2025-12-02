import React, { useState } from "react";
import { ShieldCheck, Copy, Check, Trash2 } from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { CodeEditor } from "../components/common/CodeEditor";
import { ActionButton } from "../components/common/ActionButton";
import { md5 } from "../utils/md5";

export const HashGenerator: React.FC = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [algo, setAlgo] = useState("SHA-256");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const generateHash = async (
    text: string,
    fileInput: File | null,
    algorithm: string
  ) => {
    if (!text && !fileInput) {
      setHash("");
      return;
    }

    setLoading(true);
    setHash("");

    try {
      if (fileInput) {
        if (algorithm === "MD5") {
          setHash(
            "MD5 not supported for files (Browser limitation). Use SHA algorithms."
          );
          setLoading(false);
          return;
        }

        const buffer = await fileInput.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        setHash(hashHex);
      } else {
        if (algorithm === "MD5") {
          setHash(md5(text));
        } else {
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          const hashBuffer = await crypto.subtle.digest(algorithm, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          setHash(hashHex);
        }
      }
    } catch (e) {
      setHash("Error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    setFile(null); // Clear file if text is typed
    if (fileInputRef.current) fileInputRef.current.value = "";
    generateHash(val, null, algo);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInput(""); // Clear text input
      generateHash("", selectedFile, algo);
    }
  };

  const handleAlgoChange = (newAlgo: string) => {
    setAlgo(newAlgo);
    generateHash(input, file, newAlgo);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setFile(null);
    setHash("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={ShieldCheck}
          title="Hash Generator"
          description="Generate secure SHA and MD5 hashes from text or files"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            {["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((a) => (
              <button
                key={a}
                onClick={() => handleAlgoChange(a)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  algo === a
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

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
            <div className="flex flex-col h-full gap-4">
              <CodeEditor
                value={input}
                onChange={handleInputChange}
                label="Input Text"
                placeholder="Enter text to hash..."
                theme="light"
                disabled={!!file}
              />

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                  Or Upload File
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    file
                      ? "border-primary bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {file ? (
                    <div className="text-sm">
                      <p className="font-bold text-slate-800">{file.name}</p>
                      <p className="text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <p className="text-primary mt-2">Click to change</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 font-medium">
                      Click to select a file
                    </p>
                  )}
                </div>
              </div>
            </div>

            <CodeEditor
              value={loading ? "Calculating..." : hash}
              label="Hash Output"
              placeholder="Hash will appear here..."
              readOnly
              theme="dark"
              actions={
                hash &&
                !hash.startsWith("Error") &&
                !hash.startsWith("MD5") && (
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
