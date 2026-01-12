import { Table, ArrowRight, Copy, Check, Trash2, Download, Upload } from 'lucide-react';
import React from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { Button } from '@/components/common/Button';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

export const CsvConverter: React.FC = () => {
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
    handleDownload,
    handleFileUpload,
  } = useToolLogic();

  const convertToJson = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const obj: Record<string, string> = {};
        const currentline = lines[i].split(','); // Simple split, doesn't handle commas in quotes yet for simplicity

        for (let j = 0; j < headers.length; j++) {
          let val = currentline[j]?.trim();
          if (val) val = val.replace(/^"|"$/g, '');
          obj[headers[j]] = val || '';
        }
        result.push(obj);
      }

      setOutput(JSON.stringify(result, null, 2));
      setError(null);
    } catch (_e) {
      setError('Error parsing CSV. Ensure format is correct.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Table}
          title="CSV to JSON"
          description="Convert Comma Separated Values to JSON array"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <Button onClick={convertToJson} variant="primary" className="shadow-md">
              Convert <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
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
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input CSV"
              placeholder={`id,name,age\n1,John Doe,30\n2,Jane Smith,25`}
              theme="light"
            />

            <CodeEditor
              value={output}
              label="JSON Output"
              placeholder="JSON result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <div className="flex items-center gap-2">
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() => handleDownload('converted.json', 'application/json')}
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
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-bottom-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
