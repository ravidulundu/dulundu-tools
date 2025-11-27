
import React, { useState, useEffect } from 'react';
import { FileJson, FileText, ArrowRightLeft, Copy, Check, Trash2, FileCode } from 'lucide-react';
import { load, dump } from 'js-yaml';

type Mode = 'json-yaml' | 'yaml-json' | 'xml-yaml' | 'yaml-xml';

export const YamlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('json-yaml');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // XML Helpers (Duplicated for standalone robustness)
  const xmlToJson = (xml: Node): any => {
    let obj: any = {};
    if (xml.nodeType === 1) {
      if ((xml as Element).attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < (xml as Element).attributes.length; j++) {
          const attribute = (xml as Element).attributes.item(j);
          if (attribute) obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) return xml.nodeValue;

    if (xml.hasChildNodes()) {
      for(let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (nodeName === "#text") {
           const val = item.nodeValue?.trim();
           if (val) return val;
           continue;
        }
        if (typeof(obj[nodeName]) === "undefined") obj[nodeName] = xmlToJson(item);
        else {
          if (typeof(obj[nodeName].push) === "undefined") {
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
     let xml = '';
     if (typeof json === 'object' && json !== null) {
        if (Array.isArray(json)) {
            json.forEach(item => { xml += `<item>${jsonToXml(item)}</item>`; });
        } else {
            Object.keys(json).forEach(key => {
                if (key === '@attributes') return;
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
      if (mode === 'json-yaml') {
        const obj = JSON.parse(input);
        setOutput(dump(obj));
      } else if (mode === 'yaml-json') {
        const obj = load(input);
        setOutput(JSON.stringify(obj, null, 2));
      } else if (mode === 'xml-yaml') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, "text/xml");
        if (xmlDoc.querySelector("parsererror")) throw new Error("Invalid XML");
        const json = xmlToJson(xmlDoc.documentElement);
        const rootName = xmlDoc.documentElement.nodeName;
        const finalObj = { [rootName]: json };
        setOutput(dump(finalObj));
      } else if (mode === 'yaml-xml') {
        const obj = load(input);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(obj)}\n</root>`;
        setOutput(xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3'));
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <ArrowRightLeft size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">YAML Converter</h1>
                <p className="text-xs md:text-sm text-slate-500">Convert between YAML, JSON, and XML</p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
             <button
               onClick={convert}
               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
             >
               Convert <ArrowRightLeft size={16} className="ml-1.5" />
             </button>
             <button onClick={() => {setInput(''); setOutput(''); setError(null)}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={20} />
             </button>
           </div>
        </div>

        <div className="p-3 bg-white border-b border-gray-100 flex flex-wrap justify-center gap-2">
           {[
             { id: 'json-yaml', label: 'JSON to YAML' },
             { id: 'yaml-json', label: 'YAML to JSON' },
             { id: 'xml-yaml', label: 'XML to YAML' },
             { id: 'yaml-xml', label: 'YAML to XML' },
           ].map(opt => (
             <button 
               key={opt.id}
               onClick={() => setMode(opt.id as Mode)}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${mode === opt.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-gray-200 hover:border-primary'}`}
             >
                {opt.label}
             </button>
           ))}
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full min-h-[300px]">
              <label className="block text-sm font-bold text-slate-700 mb-2">Input</label>
              <div className={`flex-1 relative rounded-xl border transition-all shadow-inner overflow-hidden ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full p-4 bg-white font-mono text-sm text-slate-800 outline-none resize-none leading-relaxed"
                  placeholder="Paste your code here..."
                  spellCheck={false}
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">{error}</p>}
            </div>

            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">Output</label>
                 {output && (
                    <button 
                    onClick={handleCopy}
                    className={`text-xs flex items-center px-2 py-1 rounded transition-colors font-medium border ${copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-primary border-primary/20 hover:bg-blue-50'}`}
                    >
                    {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                    </button>
                 )}
              </div>
              <div className="flex-1 rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                 <textarea
                   readOnly
                   value={output}
                   placeholder="Result will appear here..."
                   className="w-full h-full p-4 bg-[#1e293b] text-gray-50 font-mono text-sm outline-none resize-none leading-relaxed"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
