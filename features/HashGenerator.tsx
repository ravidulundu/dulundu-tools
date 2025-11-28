import React, { useState } from 'react';
import { ShieldCheck, Copy, Check } from 'lucide-react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <ToolHeader
          icon={ShieldCheck}
          title="Hash Generator"
          description="Generate secure SHA hashes from text"
        />

        <div className="p-8">
          {/* Algorithm Selector */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(a => (
              <button
                key={a}
                onClick={() => handleAlgoChange(a)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${algo === a
                    ? 'bg-primary text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="mb-6">
            <CodeEditor
              value={input}
              onChange={handleInputChange}
              label="Input Text"
              placeholder="Enter text to hash..."
              theme="light"
            />
          </div>

          {/* Output */}
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
  );
};