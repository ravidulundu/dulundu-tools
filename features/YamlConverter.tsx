import React, { useState } from "react";
import { ArrowRightLeft, Copy, Check, Trash2, ArrowRight } from "lucide-react";
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
    handleCopy,
    handleClear,
  } = useToolLogic();

  const [mode, setMode] = useState<Mode>("json-yaml");

  // XML Helpers (Duplicated for standalone robustness)
  const xmlToJson = (xml: Node): any => {
    let obj: any = {};
    if (xml.nodeType === 1) {
      if ((xml as Element).attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < (xml as Element).attributes.length; j++) {
          const attribute = (xml as Element).attributes.item(j);
          if (attribute)
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) return xml.nodeValue;

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (nodeName === "#text") {
          const val = item.nodeValue?.trim();
          if (val) return val;
          continue;
        }
        if (typeof obj[nodeName] === "undefined")
          obj[nodeName] = xmlToJson(item);
        else {
          if (typeof obj[nodeName].push === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  const jsonToXml = (json: any): string => {
    let xml = "";
    if (typeof json === "object" && json !== null) {
      if (Array.isArray(json)) {
        json.forEach((item) => {
          xml += `<item>${jsonToXml(item)}</item>`;
        });
      } else {
        Object.keys(json).forEach((key) => {
          if (key === "@attributes") return;
          xml += `<${key}>${jsonToXml(json[key])}</${key}>`;
        });
      }
    } else {
      xml += json;
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
        const obj = load(input);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(
          obj
        )}\n</root>`;
        setOutput(xml.replace(/(>)(<)(\/*)/g, "$1\r\n$2$3"));
      }
    } catch (e) {
      setError((e as Error).message);
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
