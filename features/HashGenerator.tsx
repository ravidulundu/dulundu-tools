import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Trash2 } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHash = async (text: string, algorithm: string) => {
    if (!text) {
      setHash('');
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
    } catch (e) {
      setHash("Error: Algorithm not supported by browser environment.");
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    generateHash(val, algo);
  };

  const handleAlgoChange = (newAlgo: string) => {
    setAlgo(newAlgo);
    generateHash(input, newAlgo);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setHash('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={ShieldCheck}
          title="Hash Generator"
          description="Generate secure SHA hashes from text"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(a => (
              <button
                key={a}
                onClick={() => handleAlgoChange(a)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${algo === a
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {a}
              </button>
            ))}
          </div>

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
              label="Input Text"
              placeholder="Enter text to hash..."
              theme="light"
            />

            <CodeEditor
              value={hash}
              label="Hash Output"
              placeholder="Hash will appear here..."
              readOnly
              theme="dark"
              actions={
                hash && !hash.startsWith('Error') && (
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