import { Database, Copy, Check, Trash2, Play, Upload, Download } from 'lucide-react';
import React from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

export const SqlFormatter: React.FC = () => {
  const {
    input,
    setInput,
    output,
    setOutput,
    copied,
    handleCopy,
    handleClear,
    fileInputRef,
    handleFileUpload,
    handleDownload,
  } = useToolLogic();

  const formatSql = React.useCallback(
    (textOverride?: string) => {
      const textToFormat = typeof textOverride === 'string' ? textOverride : input;

      if (!textToFormat.trim()) {
        setOutput('');
        return;
      }

      // Basic SQL formatting logic (Regex based)
      let sql = textToFormat.replace(/\s+/g, ' ').replace(/"/g, '""'); // basic cleanup

      const keywords = [
        'SELECT',
        'FROM',
        'WHERE',
        'AND',
        'OR',
        'GROUP BY',
        'ORDER BY',
        'HAVING',
        'LIMIT',
        'INSERT INTO',
        'VALUES',
        'UPDATE',
        'SET',
        'DELETE FROM',
        'JOIN',
        'LEFT JOIN',
        'RIGHT JOIN',
        'INNER JOIN',
        'UNION',
        'UNION ALL',
        'CREATE TABLE',
        'DROP TABLE',
        'ALTER TABLE',
      ];

      // Simple indentation
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        sql = sql.replace(regex, `\n${kw}`);
      });

      // Fix first line newline
      sql = sql.replace(/^\n/, '');

      // Indent sub-parts (like after SELECT)
      sql = sql.replace(/,/g, ',\n  ');

      // Parentheses indentation
      sql = sql.replace(/\(/g, '(\n  ').replace(/\)/g, '\n)');

      setOutput(sql);
    },
    [input, setOutput]
  );

  // Check for input in URL hash (from extension)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('input=')) {
      try {
        const params = new URLSearchParams(hash.substring(1));
        const inputParam = params.get('input');
        if (inputParam) {
          const decoded = decodeURIComponent(inputParam);
          setInput(decoded);
          formatSql(decoded);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (_e) {
        // Ignore parsing errors
      }
    }
  }, [setInput, formatSql]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Database}
          title="SQL Formatter"
          description="Beautify complex SQL queries"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".sql,.txt"
            onChange={e => handleFileUpload(e)}
            className="hidden"
          />
          <ActionButton
            onClick={() => fileInputRef.current?.click()}
            icon={Upload}
            label="Upload"
            variant="secondary"
          />

          <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
          <button
            onClick={() => formatSql()}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center"
          >
            <Play size={16} className="md:mr-2" /> <span className="hidden md:inline">Format</span>
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input Query"
              placeholder="SELECT * FROM users WHERE id = 1..."
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Formatted Result"
              placeholder="Formatted SQL will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() => handleDownload('formatted.sql', 'text/plain')}
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
