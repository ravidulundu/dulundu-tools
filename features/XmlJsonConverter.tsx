import React, { useState } from 'react';
import { ArrowRightLeft, FileJson, FileCode, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

type Mode = 'xml-json' | 'json-xml';

export const XmlJsonConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('xml-json');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // XML to JSON Logic
  const xmlToJson = (xml: Node): any => {
    let obj: any = {};

    if (xml.nodeType === 1) { // element
      // do attributes
      if ((xml as Element).attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < (xml as Element).attributes.length; j++) {
          const attribute = (xml as Element).attributes.item(j);
          if (attribute) {
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      }
    } else if (xml.nodeType === 3) { // text
      return xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;

        if (nodeName === "#text") {
          const val = item.nodeValue?.trim();
          if (val) return val; // Only return text if simple content
          continue;
        }

        if (typeof (obj[nodeName]) === "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof (obj[nodeName].push) === "undefined") {
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

  // JSON to XML Logic
  const jsonToXml = (json: any): string => {
    let xml = '';
    if (typeof json === 'object' && json !== null) {
      if (Array.isArray(json)) {
        json.forEach(item => {
          xml += `<item>${jsonToXml(item)}</item>`;
        });
      } else {
        Object.keys(json).forEach(key => {
          if (key === '@attributes') {
            // Skip attributes in body generation, simplified
            return;
          }
          xml += `<${key}>${jsonToXml(json[key])}</${key}>`;
        });
      }
    } else {
      xml += json;
    }
    return xml;
  };

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    setError(null);

    try {
      if (mode === 'xml-json') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, "text/xml");
        const err = xmlDoc.querySelector("parsererror");
        if (err) throw new Error("Invalid XML Format");

        const json = xmlToJson(xmlDoc.documentElement);
        // Wrapper for root element name
        const rootName = xmlDoc.documentElement.nodeName;
        const finalObj = { [rootName]: json };

        setOutput(JSON.stringify(finalObj, null, 2));
      } else {
        const parsed = JSON.parse(input);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(parsed)}\n</root>`;
        // Basic beautify
        const formatted = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
        setOutput(formatted);
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <ToolHeader
          icon={ArrowRightLeft}
          title="XML Converter"
          description="Convert XML to JSON and vice versa"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('xml-json')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'xml-json' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileCode size={14} className="mr-1.5" /> XML to JSON
            </button>
            <button
              onClick={() => setMode('json-xml')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'json-xml' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileJson size={14} className="mr-1.5" /> JSON to XML
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={convert}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
            >
              <ArrowRight size={16} className="mr-1.5" /> Convert
            </button>
            <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
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
                label={`Input ${mode === 'xml-json' ? 'XML' : 'JSON'}`}
                placeholder={mode === 'xml-json' ? '<root><item>Value</item></root>' : '{"root": {"item": "Value"}}'}
                language={mode === 'xml-json' ? 'xml' : 'json'}
                theme="light"
              />
              {error && <p className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100 animate-pulse">{error}</p>}
            </div>

            <CodeEditor
              value={output}
              label={`Output ${mode === 'xml-json' ? 'JSON' : 'XML'}`}
              placeholder="Result will appear here..."
              readOnly
              language={mode === 'xml-json' ? 'json' : 'xml'}
              theme="dark"
              actions={
                output && (
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied' : 'Copy'}
                    onClick={handleCopy}
                    variant={copied ? 'success' : 'primary'}
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
