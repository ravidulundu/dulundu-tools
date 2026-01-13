import {
  FileCode,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
  Check,
  Upload,
  Download,
  AlertCircle,
} from 'lucide-react';
import React from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { useToolLogic } from '@/hooks/useToolLogic';

export const XmlFormatter: React.FC = () => {
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

  const formatXml = (xml: string) => {
    let formatted = '';
    const reg = new RegExp('(>)(<)(\\/*)', 'g');
    xml = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;

    xml.split('\r\n').forEach(node => {
      let indent = 0;
      if (node.match(new RegExp('.+<\\/\\w[^>]*>$'))) {
        indent = 0;
      } else if (node.match(new RegExp('^<\\/\\w'))) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(new RegExp('^<\\w[^>]*[^/]>.*$'))) {
        indent = 1;
      } else {
        indent = 0;
      }

      let padding = '';
      for (let i = 0; i < pad; i++) {
        padding += '  ';
      }

      formatted += padding + node + '\r\n';
      pad += indent;
    });

    return formatted.trim();
  };

  const minifyXml = (xml: string) => {
    return xml.replace(/>\s+</g, '><').trim();
  };

  const process = (mode: 'beautify' | 'minify') => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      // Simple validation check (basic)
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML Syntax');
      }

      if (mode === 'beautify') {
        setOutput(formatXml(input));
      } else {
        setOutput(minifyXml(input));
      }
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileCode}
          title="XML Formatter"
          description="Beautify and Minify XML data"
          actions={
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xml"
                className="hidden"
              />
              <ActionButton
                onClick={() => fileInputRef.current?.click()}
                icon={Upload}
                label="Upload"
                variant="secondary"
              />
              <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
            </div>
          }
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-center gap-3">
          <button
            onClick={() => process('beautify')}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-md"
          >
            <Maximize2 size={18} className="mr-2" /> Beautify
          </button>
          <button
            onClick={() => process('minify')}
            className="flex items-center px-6 py-2 bg-background-secondary text-foreground-secondary rounded-lg hover:bg-background transition-colors font-medium border border-border"
          >
            <Minimize2 size={18} className="mr-2" /> Minify
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input XML"
                placeholder="Paste XML here..."
                language="xml"
                theme="light"
              />
              {error && (
                <div className="mt-2 flex items-center text-danger text-sm font-medium bg-danger-light px-3 py-1.5 rounded-lg border border-danger/20 animate-pulse">
                  <AlertCircle size={16} className="mr-2" /> {error}
                </div>
              )}
            </div>

            <CodeEditor
              value={output}
              label="Output"
              placeholder="Result will appear here..."
              readOnly
              language="xml"
              theme="dark"
              actions={
                output && (
                  <div className="flex gap-2">
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() => handleDownload('data.xml', 'application/xml')}
                      variant="secondary"
                    />
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
                    />
                  </div>
                )
              }
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
