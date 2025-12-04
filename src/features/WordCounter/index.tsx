import { Type, Trash2, Copy, Check } from 'lucide-react';
import React, { useEffect } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

export const WordCounter: React.FC = () => {
  const {
    input,
    setInput,
    output: _output,
    setOutput,
    copied: hookCopied,
    handleCopy: hookHandleCopy,
    handleClear,
  } = useToolLogic();

  // Mapping for compatibility with existing code
  const textVal = input;
  const setTextVal = setInput;

  // Calculate stats directly during render (derived state)
  const stats = React.useMemo(() => {
    const t = textVal;
    const words = t.trim() === '' ? 0 : t.trim().split(/\s+/).length;
    const chars = t.length;
    const charsNoSpace = t.replace(/\s/g, '').length;
    const lines = t.trim() === '' ? 0 : t.split(/\n/).length;
    const paragraphs = t.trim() === '' ? 0 : t.split(/\n\s*\n/).filter(p => p.trim() !== '').length;

    return { words, chars, charsNoSpace, lines, paragraphs };
  }, [textVal]);

  // Sync output for copy functionality
  useEffect(() => {
    setOutput(textVal);
  }, [textVal, setOutput]);

  const transformText = (type: 'upper' | 'lower' | 'capital' | 'sentence') => {
    let newText = textVal;
    if (type === 'upper') newText = textVal.toUpperCase();
    if (type === 'lower') newText = textVal.toLowerCase();
    if (type === 'capital') {
      newText = textVal.replace(/\b\w/g, l => l.toUpperCase());
    }
    if (type === 'sentence') {
      newText = textVal.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    }
    setTextVal(newText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Type}
          title="Word Counter"
          description="Analyze text statistics and change case"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => transformText('upper')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transformText('lower')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              lowercase
            </button>
            <button
              onClick={() => transformText('capital')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              Capitalize Words
            </button>
            <button
              onClick={() => transformText('sentence')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              Sentence case
            </button>
          </div>

          <div className="flex space-x-2">
            <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-200 border-b border-gray-200">
          {[
            { label: 'Words', value: stats.words },
            { label: 'Characters', value: stats.chars },
            { label: 'Chars (no space)', value: stats.charsNoSpace },
            { label: 'Lines', value: stats.lines },
            { label: 'Paragraphs', value: stats.paragraphs },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-800">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <CodeEditor
            value={textVal}
            onChange={setTextVal}
            placeholder="Type or paste your text here to analyze..."
            theme="light"
            actions={
              textVal && (
                <ActionButton
                  icon={hookCopied ? Check : Copy}
                  label={hookCopied ? 'Copied' : 'Copy'}
                  onClick={hookHandleCopy}
                  variant={hookCopied ? 'success' : 'primary'}
                />
              )
            }
          />
        </div>
      </div>
    </div>
  );
};
