import React, { useState } from "react";
import {
  ArrowRightLeft,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  Upload,
  Download,
} from "lucide-react";
import { load, dump } from "js-yaml";
import { ToolHeader } from "../components/common/ToolHeader";
import { CodeEditor } from "../components/common/CodeEditor";
import { ActionButton } from "../components/common/ActionButton";
import { useToolLogic } from "../hooks/useToolLogic";

type Mode = "json-yaml" | "yaml-json" | "xml-yaml" | "yaml-xml";

export const YamlConverter: React.FC = () => {
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

  const [mode, setMode] = useState<Mode>("json-yaml");

  type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
  interface JsonObject {
    [key: string]: JsonValue;
  }

  // XML Helpers (Duplicated for standalone robustness)
  const xmlToJson = (xml: Node): JsonValue => {
    if (xml.nodeType === 1) {
      const obj: JsonObject = {};
      if ((xml as Element).attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < (xml as Element).attributes.length; j++) {
          const attribute = (xml as Element).attributes.item(j);
          if (attribute)
            (obj["@attributes"] as JsonObject)[attribute.nodeName] =
              attribute.nodeValue;
        }
      }

      if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
          const item = xml.childNodes.item(i);
          const nodeName = item.nodeName;
          if (nodeName === "#text") {
            // If it's just text content and we already have attributes, we might need a special key like #text
            // But for simplicity in this converter, if it's mixed content, it gets complex.
            // This logic follows the original implementation's structure but adds types.
            const val = item.nodeValue?.trim();
            if (val) return val;
            continue;
          }

          const childValue = xmlToJson(item);

          if (typeof obj[nodeName] === "undefined") {
            obj[nodeName] = childValue;
          } else {
            if (!Array.isArray(obj[nodeName])) {
              const old = obj[nodeName];
              obj[nodeName] = [old];
            }
            (obj[nodeName] as JsonValue[]).push(childValue);
          }
        }
      }
      return obj;
    } else if (xml.nodeType === 3) {
      return xml.nodeValue || null;
    }
    return null;
  };

  const jsonToXml = (json: JsonValue): string => {
    let xml = "";
    if (typeof json === "object" && json !== null) {
      if (Array.isArray(json)) {
        json.forEach((item) => {
          xml += `<item>${jsonToXml(item)}</item>`;
        });
      } else {
        Object.keys(json).forEach((key) => {
          if (key === "@attributes") return;
          xml += `<${key}>${jsonToXml((json as JsonObject)[key])}</${key}>`;
        });
      }
    } else {
      xml += String(json);
    }
    return xml;
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setError(null);

    try {
      if (mode === "json-yaml") {
        const obj = JSON.parse(input);
        setOutput(dump(obj));
      } else if (mode === "yaml-json") {
        const obj = load(input);
        setOutput(JSON.stringify(obj, null, 2));
      } else if (mode === "xml-yaml") {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, "text/xml");
        if (xmlDoc.querySelector("parsererror")) throw new Error("Invalid XML");
        const json = xmlToJson(xmlDoc.documentElement);
        const rootName = xmlDoc.documentElement.nodeName;
        const finalObj = { [rootName]: json };
        setOutput(dump(finalObj));
      } else if (mode === "yaml-xml") {
        const obj = load(input) as JsonValue;
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(
          obj
        )}\n</root>`;
        setOutput(xml.replace(/(>)(<)(\/*)/g, "$1\r\n$2$3"));
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const getDownloadOptions = () => {
    switch (mode) {
      case "json-yaml":
      case "xml-yaml":
        return { filename: "data.yaml", type: "text/yaml" };
      case "yaml-json":
        return { filename: "data.json", type: "application/json" };
      case "yaml-xml":
        return { filename: "data.xml", type: "text/xml" };
      default:
        return { filename: "data.txt", type: "text/plain" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={ArrowRightLeft}
          title="YAML Converter"
          description="Convert between YAML, JSON, and XML"
        />

        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg flex-wrap">
            {[
              { id: "json-yaml", label: "JSON to YAML" },
              { id: "yaml-json", label: "YAML to JSON" },
              { id: "xml-yaml", label: "XML to YAML" },
              { id: "yaml-xml", label: "YAML to XML" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id as Mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  mode === opt.id
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={convert}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
            >
              <ArrowRight size={16} className="mr-1.5" /> Convert
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml,.json,.xml,.txt"
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

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input"
                placeholder="Paste your code here..."
                theme="light"
              />
              {error && (
                <p className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100 animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <CodeEditor
              value={output}
              label="Output"
              placeholder="Result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() => {
                        const { filename, type } = getDownloadOptions();
                        handleDownload(filename, type);
                      }}
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
