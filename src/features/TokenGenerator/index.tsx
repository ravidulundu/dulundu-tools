import { Key, RefreshCw, Copy, Check } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const TokenGenerator: React.FC = () => {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(5);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
    hex: false,
  });
  const [tokens, setTokens] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = React.useCallback(() => {
    let charset = '';
    if (options.hex) {
      charset = '0123456789abcdef';
    } else {
      if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (options.numbers) charset += '0123456789';
      if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (!charset) return;

    const result = [];
    const randomBuffer = new Uint32Array(length);

    for (let i = 0; i < count; i++) {
      let token = '';
      window.crypto.getRandomValues(randomBuffer);
      for (let j = 0; j < length; j++) {
        token += charset[randomBuffer[j] % charset.length];
      }
      result.push(token);
    }
    setTokens(result);
  }, [count, length, options]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tokens.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === 'hex' && !prev.hex) {
        // If Hex enabled, disable others to show clear UI state (logic handles it anyway)
        return { lowercase: false, uppercase: false, numbers: false, symbols: false, hex: true };
      }
      if (key !== 'hex' && next[key]) {
        // If other enabled, disable hex
        return { ...next, hex: false };
      }
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Key}
          title="Token Generator"
          description="Generate random API keys, secrets, and tokens"
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-6 h-full">
            {/* Controls */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground-secondary mb-2">
                      Length ({length})
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="128"
                      value={length}
                      onChange={e => setLength(parseInt(e.target.value))}
                      className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground-secondary mb-2">
                      Quantity ({count})
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={count}
                      onChange={e => setCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-bold text-foreground-secondary mb-3">
                    Character Sets
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'lowercase', label: 'a-z' },
                      { id: 'uppercase', label: 'A-Z' },
                      { id: 'numbers', label: '0-9' },
                      { id: 'symbols', label: '!@#' },
                      { id: 'hex', label: 'Hex (0-f)' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(opt.id as keyof typeof options)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                          options[opt.id as keyof typeof options]
                            ? 'bg-success-light border-success/30 text-success shadow-sm'
                            : 'bg-card border-border text-foreground-muted hover:border-foreground-muted'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generate}
                  className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-bold shadow-md flex items-center justify-center"
                >
                  <RefreshCw size={18} className="mr-2" /> Generate Tokens
                </button>
              </div>
            </div>

            {/* Output */}
            <CodeEditor
              value={tokens.join('\n')}
              label="Generated Tokens"
              placeholder="Tokens will appear here..."
              readOnly
              theme="dark"
              actions={
                tokens.length > 0 && (
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied' : 'Copy All'}
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
