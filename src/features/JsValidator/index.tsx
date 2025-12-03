import { ShieldCheck, Play, Trash2, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

type Lang = 'js' | 'jsx' | 'ts' | 'tsx';

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
  } | null>(null);
  const [lang, setLang] = useState<Lang>('js');

  const validate = () => {
    if (!code.trim()) {
      setResult(null);
      return;
    }

    try {
      // Note: This only validates standard JS syntax.
      // For TS/JSX, we would need a heavier parser like Babel in the browser.
      // For now, we just check if it compiles as JS, which covers a lot of basic syntax errors.
      // We might want to add a disclaimer for TS/JSX.
      new Function(code);
      setResult({ valid: true, message: 'Valid JavaScript syntax!' });
    } catch (e) {
      setResult({ valid: false, message: (e as Error).toString() });
    }
  };

  const handleClear = () => {
    hookHandleClear();
    setResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={ShieldCheck}
          title="JS Validator"
          description="Check JavaScript syntax correctness"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['js', 'jsx', 'ts', 'tsx'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all uppercase ${
                  lang === l
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={validate}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center text-sm"
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
              className="p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload File"
            >
              <Upload size={20} />
            </button>

            <button
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex flex-col">
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              label={`${lang.toUpperCase()} Code`}
              placeholder={`Paste your ${lang.toUpperCase()} code here...`}
              language={lang === 'js' || lang === 'jsx' ? 'javascript' : 'typescript'}
              theme="light"
            />
          </div>

          {result && (
            <div
              className={`mt-6 p-4 rounded-xl border flex items-start animate-in fade-in slide-in-from-bottom-2 ${
                result.valid
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div
                className={`p-2 rounded-full mr-3 ${
                  result.valid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {result.valid ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {result.valid ? 'Syntax Valid' : 'Syntax Error'}
                </h3>
                <p className="font-mono text-sm mt-1">{result.message}</p>
                {(lang === 'ts' || lang === 'tsx' || lang === 'jsx') && (
                  <p className="text-xs mt-2 opacity-75">
                    Note: Validation is limited to standard JS syntax. TS/JSX specific syntax might
                    show as errors.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
