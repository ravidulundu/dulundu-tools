import React, { useState } from 'react';
import { ArrowLeftRight, Link as LinkIcon, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const UrlEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = (text: string, currentMode: 'encode' | 'decode') => {
    try {
      if (!text) {
        setOutput('');
        return;
      }
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
    } catch (e) {
      setOutput('Error: Invalid URL format for decoding');
    }
  };

  const handleInputChange = (newVal: string) => {
    setInput(newVal);
    process(newVal, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput(input);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={LinkIcon}
          title="URL Encoder / Decoder"
          description="Encode special characters or decode URL entities"
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center">
          <button
            onClick={toggleMode}
            className="flex items-center space-x-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-medium transition-colors border border-slate-200"
          >
            <span className={mode === 'encode' ? 'text-primary font-bold' : ''}>Encode</span>
            <ArrowLeftRight size={16} className="text-slate-400" />
            <span className={mode === 'decode' ? 'text-primary font-bold' : ''}>Decode</span>
          </button>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">

            <CodeEditor
              value={input}
              onChange={handleInputChange}
              label={mode === 'encode' ? 'Decoded URL' : 'Encoded URL'}
              placeholder={mode === 'encode' ? 'Paste URL here to encode...' : 'Paste encoded URL here to decode...'}
              theme="light"
            />

            <CodeEditor
              value={output}
              label={mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
              placeholder="Result will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied' : 'Copy'}
                    onClick={handleCopy}
                    variant={copied ? 'success' : 'primary'}
                  />
                )
              }
            />

          </div>
        </div>
      </div>
    </div>
  );
};