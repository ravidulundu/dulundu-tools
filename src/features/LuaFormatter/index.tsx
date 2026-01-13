import { Check, Code2, Copy, Download, Minimize2, Trash2, Upload, Wand2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

type FormatMode = 'beautify' | 'minify';

export const LuaFormatter: React.FC = () => {
  const [mode, setMode] = useState<FormatMode>('beautify');

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
    initialInput:
      'function factorial(n) if n==0 then return 1 else return n*factorial(n-1) end end',
  });

  const beautifyLua = useCallback((code: string): string => {
    let formatted = code;

    // Normalize spaces
    formatted = formatted.replace(/\s+/g, ' ');

    // Add newlines around keywords
    formatted = formatted.replace(/\s(then|do|repeat)\s/g, ' $1\n');
    formatted = formatted.replace(/\s(end|until|else|elseif)\s/g, '\n$1\n');
    formatted = formatted.replace(/\s(function)\s/g, '\n$1 ');

    // Split lines
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentChar = '    ';

    const result = lines
      .map(line => {
        line = line.trim();
        if (!line) return '';

        // Decrease indent for closing blocks
        if (line.match(/^(end|until|else|elseif)/)) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = indentChar.repeat(indentLevel) + line;

        // Increase indent for opening blocks
        if (line.match(/^(function|if|while|repeat|for|else|elseif|do)/) && !line.match(/\send$/)) {
          if (!line.includes('end')) {
            indentLevel++;
          }
        }

        return indentedLine;
      })
      .join('\n');

    return result.trim();
  }, []);

  const minifyLua = useCallback((code: string): string => {
    let minified = code;

    // Remove comments
    minified = minified.replace(/--.*$/gm, '');
    minified = minified.replace(/--\[\[[\s\S]*?\]\]/g, '');

    // Remove whitespace
    minified = minified
      .split('\n')
      .map(l => l.trim())
      .filter(l => l)
      .join(' ');

    // Remove spaces around symbols
    minified = minified.replace(/\s*([=+\-*/%^#<>~,(){}])\s*/g, '$1');

    return minified.trim();
  }, []);

  const handleFormat = useCallback(() => {
    if (mode === 'beautify') {
      setOutput(beautifyLua(input));
    } else {
      setOutput(minifyLua(input));
    }
  }, [mode, input, beautifyLua, minifyLua, setOutput]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Code2}
          title="Lua Formatter"
          description="Beautify or minify Lua code with proper formatting"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2 items-center">
            {/* Mode Toggle */}
            <div className="flex bg-background-secondary rounded-lg p-1 border border-border">
              <button
                onClick={() => {
                  setMode('beautify');
                  setOutput('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mode === 'beautify'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <Wand2 size={14} />
                Beautify
              </button>
              <button
                onClick={() => {
                  setMode('minify');
                  setOutput('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mode === 'minify'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <Minimize2 size={14} />
                Minify
              </button>
            </div>

            <button
              onClick={handleFormat}
              className="px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              {mode === 'beautify' ? 'Format' : 'Compress'}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".lua"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-foreground-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              title="Upload Lua File"
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
              label="Lua Input"
              placeholder="Paste Lua code here..."
              language="lua"
              theme="light"
            />

            <CodeEditor
              value={output}
              label={mode === 'beautify' ? 'Formatted Output' : 'Minified Output'}
              placeholder="Result will appear here..."
              readOnly
              language="lua"
              theme="dark"
              actions={
                output && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Save"
                      onClick={() =>
                        handleDownload(
                          mode === 'beautify' ? 'formatted.lua' : 'minified.lua',
                          'text/x-lua'
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
