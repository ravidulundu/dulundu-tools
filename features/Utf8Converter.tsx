import React, { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

export const Utf8Converter: React.FC = () => {
  const [input, setInput] = useState('Hello World 🌍');
  const [outputHex, setOutputHex] = useState('');
  const [outputBin, setOutputBin] = useState('');
  const [outputDec, setOutputDec] = useState('');
  const [copied, setCopied] = useState('');

  const convert = (text: string) => {
    setInput(text);
    if (!text) {
      setOutputHex(''); setOutputBin(''); setOutputDec('');
      return;
    }

    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);

    // Hex
    let hex = '';
    bytes.forEach(b => hex += `\\x${b.toString(16).padStart(2, '0').toUpperCase()}`);
    setOutputHex(hex);

    // Bin
    let bin = '';
    bytes.forEach(b => bin += `${b.toString(2).padStart(8, '0')} `);
    setOutputBin(bin.trim());

    // Dec
    let dec = '';
    bytes.forEach(b => dec += `${b} `);
    setOutputDec(dec.trim());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  React.useEffect(() => {
    convert(input);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={Type}
          title="UTF-8 Converter"
          description="Convert text to Hex, Binary, and Decimal bytes"
        />

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex flex-col">
          <div className="mb-6">
            <CodeEditor
              value={input}
              onChange={convert}
              label="Input Text"
              placeholder="Type here..."
              theme="light"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid gap-6 pb-4">
              {[
                { id: 'hex', label: 'Hexadecimal (\\x)', val: outputHex },
                { id: 'bin', label: 'Binary', val: outputBin },
                { id: 'dec', label: 'Decimal', val: outputDec },
              ].map(item => (
                <CodeEditor
                  key={item.id}
                  value={item.val}
                  label={item.label}
                  readOnly
                  theme="dark"
                  actions={
                    item.val && (
                      <ActionButton
                        icon={copied === item.id ? Check : Copy}
                        label={copied === item.id ? 'Copied' : 'Copy'}
                        onClick={() => handleCopy(item.val, item.id)}
                        variant={copied === item.id ? 'success' : 'primary'}
                      />
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
