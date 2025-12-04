import {
  ArrowRightLeft,
  FileJson,
  FileCode,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  Upload,
  Download,
} from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { Button } from '@/components/common/Button';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

type Mode = 'xml-json' | 'json-xml';

export const XmlJsonConverter: React.FC = () => {
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

  const [mode, setMode] = useState<Mode>('xml-json');

  // XML to JSON Logic
  const xmlToJson = (xml: Node): unknown => {
    const obj: Record<string, unknown> = {};

    if (xml.nodeType === 1) {
      // element
      // do attributes
      if ((xml as Element).attributes.length > 0) {
        obj['@attributes'] = {} as Record<string, unknown>;
        for (let j = 0; j < (xml as Element).attributes.length; j++) {
          const attribute = (xml as Element).attributes.item(j);
          if (attribute) {
            (obj['@attributes'] as Record<string, unknown>)[attribute.nodeName] =
              attribute.nodeValue;
          }
        }
      }
    } else if (xml.nodeType === 3) {
      // text
      return xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;

        if (nodeName === '#text') {
          const val = item.nodeValue?.trim();
          if (val) return val; // Only return text if simple content
          continue;
        }

        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof (obj[nodeName] as unknown[]).push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            (obj[nodeName] as unknown[]).push(old);
          }
          (obj[nodeName] as unknown[]).push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  // JSON to XML Logic
  const jsonToXml = (json: unknown): string => {
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
      xml += String(json);
    }
    return xml;
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setError(null);

    try {
      if (mode === 'xml-json') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, 'text/xml');
        const err = xmlDoc.querySelector('parsererror');
        if (err) throw new Error('Invalid XML Format');

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
            <Button
              onClick={() => setMode('xml-json')}
              variant="ghost"
              size="sm"
              icon={FileCode}
              className={
                mode === 'xml-json'
                  ? 'bg-white text-primary shadow-sm hover:bg-white'
                  : 'text-slate-600 hover:text-slate-900'
              }
            >
              XML to JSON
            </Button>
            <Button
              onClick={() => setMode('json-xml')}
              variant="ghost"
              size="sm"
              icon={FileJson}
              className={
                mode === 'json-xml'
                  ? 'bg-white text-primary shadow-sm hover:bg-white'
                  : 'text-slate-600 hover:text-slate-900'
              }
            >
              JSON to XML
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={convert} variant="primary">
              <ArrowRight size={16} className="mr-1.5" /> Convert
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,.json,.txt"
              onChange={e => handleFileUpload(e)}
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
                label={`Input ${mode === 'xml-json' ? 'XML' : 'JSON'}`}
                placeholder={
                  mode === 'xml-json'
                    ? '<root><item>Value</item></root>'
                    : '{"root": {"item": "Value"}}'
                }
                language={mode === 'xml-json' ? 'xml' : 'json'}
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
              label={`Output ${mode === 'xml-json' ? 'JSON' : 'XML'}`}
              placeholder="Result will appear here..."
              readOnly
              language={mode === 'xml-json' ? 'json' : 'xml'}
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() =>
                        handleDownload(
                          mode === 'xml-json' ? 'data.json' : 'data.xml',
                          mode === 'xml-json' ? 'application/json' : 'text/xml'
                        )
                      }
                      variant="secondary"
                    />
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
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
