import * as acorn from 'acorn';
import jsx from 'acorn-jsx';
import { AlertCircle, CheckCircle, Play, ShieldCheck, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';

import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { useToolLogic } from '@/hooks/useToolLogic';

type Lang = 'js' | 'jsx' | 'ts' | 'tsx';

type AcornError = Error & {
  loc?: { line: number; column: number };
};

export const JsValidator: React.FC = () => {
  const {
    input: code,
    setInput: setCode,
    fileInputRef,
    handleFileUpload,
    handleClear: hookHandleClear,
  } = useToolLogic();

  const [result, setResult] = useState<{
    valid: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [lang, setLang] = useState<Lang>('js');

  const validate = () => {
    if (!code.trim()) {
      setResult(null);
      return;
    }

    try {
      // Create parser with JSX support for .jsx files
      const useJsx = lang === 'jsx' || lang === 'tsx';
      const Parser = useJsx ? acorn.Parser.extend(jsx()) : acorn.Parser;

      // Use acorn parser for static analysis (SAFE: No code execution)
      Parser.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module', // Allows import/export
      });

      const langLabel = useJsx ? 'JavaScript/JSX' : 'JavaScript';
      setResult({ valid: true, message: `Valid ${langLabel} syntax!` });
    } catch (error) {
      const e = error as AcornError;
      // Acorn throws nice syntax errors with location
      const message = e.message.replace(/\s*\(\d+:\d+\)/, ''); // Clean up position for main message
      const loc = e.loc ? `Line ${e.loc.line}, Column ${e.loc.column}` : '';
      setResult({
        valid: false,
        message: message,
        details: loc,
      });
    }
  };

  const handleClear = () => {
    hookHandleClear();
    setResult(null);
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={ShieldCheck}
          title="JS Validator"
          description="Check JavaScript syntax correctness (Secure Static Analysis)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-background-secondary p-1 rounded-lg">
            {(['js', 'jsx', 'ts', 'tsx'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all uppercase ${
                  lang === l
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-foreground-muted hover:text-foreground-secondary'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={validate}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium flex items-center text-sm"
            >
              <Play size={16} className="mr-1.5" /> Validate
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".js,.jsx,.ts,.tsx,.txt"
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
              className="p-2 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 flex flex-col">
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              label={`${lang.toUpperCase()} Code`}
              placeholder={`Paste your ${lang.toUpperCase()} code here...`}
              language={lang === 'js' || lang === 'jsx' ? 'javascript' : 'typescript'}
              theme="light"
              showLineNumbers={true}
            />
          </div>

          {result && (
            <div
              className={`mt-6 p-4 rounded-xl border flex items-start animate-in fade-in slide-in-from-bottom-2 ${
                result.valid
                  ? 'bg-success-light border-success text-success'
                  : 'bg-danger-light border-danger text-danger'
              }`}
            >
              <div
                className={`p-2 rounded-full mr-3 ${
                  result.valid ? 'bg-success-light text-success' : 'bg-danger-light text-danger'
                }`}
              >
                {result.valid ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {result.valid ? 'Syntax Valid' : 'Syntax Error'}
                </h3>
                <p className="font-medium text-sm mt-1">{result.message}</p>
                {result.details && (
                  <p className="font-mono text-xs mt-1 opacity-75 bg-black/5 inline-block px-1.5 py-0.5 rounded">
                    {result.details}
                  </p>
                )}

                {(lang === 'ts' || lang === 'tsx') && (
                  <p className="text-xs mt-2 opacity-75">
                    Note: TypeScript type annotations are not supported. Only JavaScript/JSX syntax
                    is validated.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
};
