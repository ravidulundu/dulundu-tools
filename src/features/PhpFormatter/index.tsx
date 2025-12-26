import { Code2, Copy, Check, Trash2, Wand2, Upload, Download } from 'lucide-react';
import React from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

export const PhpFormatter: React.FC = () => {
  const {
    input,
    setInput,
    output,
    setOutput,
    copied,
    fileInputRef,
    handleCopy,
    handleClear,
    handleFileUpload,
    handleDownload,
  } = useToolLogic({
    initialInput: '<?php function test($a){if($a){return true;}else{return false;}} ?>',
  });

  const formatPhp = (code: string) => {
    // Basic PHP formatting logic (Regex based)
    // Real PHP parsing requires a parser, this is a best-effort beautifier

    let formatted = code;

    // Normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ');

    // Add newlines around braces
    formatted = formatted.replace(/\{/g, ' {\n');
    formatted = formatted.replace(/\}/g, '\n}\n');
    formatted = formatted.replace(/;/g, ';\n');

    // Fix PHP tags
    formatted = formatted.replace(/<\?php/g, '<?php\n');
    formatted = formatted.replace(/\?>/g, '\n?>');

    // Indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentChar = '    ';

    const result = lines
      .map(line => {
        line = line.trim();
        if (!line) return '';

        if (line.includes('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = indentChar.repeat(indentLevel) + line;

        if (line.includes('{')) {
          indentLevel++;
        }

        return indentedLine;
      })
      .join('\n');

    return result.trim();
  };

  const handleFormat = () => {
    setOutput(formatPhp(input));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Code2}
          title="PHP Formatter"
          description="Beautify and format messy PHP code"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleFormat}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              <Wand2 size={16} className="mr-1.5" /> Format
            </button>
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".php"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-foreground-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              title="Upload PHP File"
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
            <CodeEditor
              value={input}
              onChange={setInput}
              label="PHP Input"
              placeholder="Paste PHP code here..."
              language="php"
              theme="light"
            />

            <CodeEditor
              value={output}
              label="Formatted Output"
              placeholder="Result will appear here..."
              readOnly
              language="php"
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() => handleDownload('formatted.php', 'text/x-php')}
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
