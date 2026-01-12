import { Table, Copy, Check, Trash2, ArrowLeftRight, Upload, Download } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

export const TsvConverter: React.FC = () => {
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

  const [mode, setMode] = useState<'tsv-json' | 'tsv-csv'>('tsv-json');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) throw new Error('TSV must have at least a header row and one data row');

      const headers = lines[0].split('\t').map(h => h.trim().replace(/^"|"$/g, ''));

      if (mode === 'tsv-json') {
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          const obj: Record<string, string> = {};
          const currentline = lines[i].split('\t');
          for (let j = 0; j < headers.length; j++) {
            let val = currentline[j]?.trim();
            if (val) val = val.replace(/^"|"$/g, '');
            obj[headers[j]] = val;
          }
          result.push(obj);
        }
        setOutput(JSON.stringify(result, null, 2));
      } else {
        // TSV to CSV
        const csvRows = [headers.join(',')];
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split('\t').map(v => {
            const val = v.trim().replace(/^"|"$/g, '');
            return `"${val}"`;
          });
          csvRows.push(vals.join(','));
        }
        setOutput(csvRows.join('\n'));
      }
      setError(null);
    } catch (_e) {
      setError('Error parsing TSV. Ensure format is correct (tab separated).');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Table}
          title="TSV Converter"
          description="Convert Tab Separated Values to JSON or CSV"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex flex-wrap gap-4 items-center justify-between">
          <div className="flex bg-background-secondary p-1 rounded-lg">
            <button
              onClick={() => setMode('tsv-json')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                mode === 'tsv-json'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-foreground-muted hover:text-foreground-secondary'
              }`}
            >
              TSV to JSON
            </button>
            <button
              onClick={() => setMode('tsv-csv')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                mode === 'tsv-csv'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-foreground-muted hover:text-foreground-secondary'
              }`}
            >
              TSV to CSV
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={convert}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium flex items-center text-sm"
            >
              <ArrowLeftRight size={16} className="mr-1.5" /> Convert
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".tsv,.txt"
              onChange={e => handleFileUpload(e)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-foreground-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              title="Upload File"
            >
              <Upload size={20} />
            </button>

            <button
              onClick={handleClear}
              className="p-2 text-foreground-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full">
              <CodeEditor
                value={input}
                onChange={setInput}
                label="Input TSV"
                placeholder={`id\tname\tage\n1\tJohn\t30\n2\tJane\t25`}
                theme="light"
              />
              {error && (
                <p className="mt-2 text-xs text-red-500 font-bold animate-pulse">{error}</p>
              )}
            </div>

            <CodeEditor
              value={output}
              label="Output"
              placeholder="Result will appear here..."
              readOnly
              language={mode === 'tsv-json' ? 'json' : 'text'}
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() =>
                        handleDownload(
                          mode === 'tsv-json' ? 'data.json' : 'data.csv',
                          mode === 'tsv-json' ? 'application/json' : 'text/csv'
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
