import { Lock, RefreshCw, Copy, Check } from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { PresetSelector } from '@/components/common/PresetSelector';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolPresets, Preset } from '@/hooks/useToolPresets';
import { useToolShortcuts } from '@/hooks/useToolShortcuts';

interface PasswordSettings {
  length: number;
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const { presets, addPreset, deletePreset } =
    useToolPresets<PasswordSettings>('password-generator');

  const handlePresetSelect = useCallback((preset: Preset<PasswordSettings>) => {
    setLength(preset.settings.length);
    setOptions(preset.settings.options);
  }, []);

  const handlePresetSave = useCallback(
    (name: string) => {
      addPreset(name, { length, options });
    },
    [addPreset, length, options]
  );

  const generatePassword = useCallback(() => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;

    if (!chars) {
      setPassword('');
      return;
    }

    const randomBuffer = new Uint32Array(length);
    window.crypto.getRandomValues(randomBuffer);
    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(randomBuffer[i] % chars.length);
    }
    setPassword(generated);
    setCopied(false);
  }, [length, options]);

  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = useCallback(() => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  useToolShortcuts({
    onExecute: generatePassword,
    onCopy: handleCopy,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Lock}
          title="Password Generator"
          description="Create strong, secure random passwords"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <button
            onClick={generatePassword}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm flex items-center text-sm"
          >
            <RefreshCw size={16} className="mr-1.5" />
            Generate New Password
          </button>

          <PresetSelector
            presets={presets}
            onSelect={handlePresetSelect}
            onSave={handlePresetSave}
            onDelete={deletePreset}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 flex flex-col items-center justify-center">
          <div className="max-w-3xl w-full flex flex-col gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all group-hover:blur-2xl"></div>
              <div className="relative bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm text-center">
                <div className="text-4xl md:text-5xl font-mono font-bold text-foreground break-all tracking-wider mb-2">
                  {password}
                </div>
                <p className="text-foreground-muted text-sm font-medium">Strength: Strong</p>

                <div className="absolute top-4 right-4">
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied' : 'Copy'}
                    onClick={handleCopy}
                    variant={copied ? 'success' : 'secondary'}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="password-length" className="font-bold text-foreground-secondary">
                    Password Length
                  </label>
                  <span className="text-primary font-bold bg-primary-light px-3 py-1 rounded-lg text-sm">
                    {length} characters
                  </span>
                </div>
                <input
                  id="password-length"
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={e => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-hover"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'uppercase', label: 'Uppercase', ex: 'ABC' },
                  { key: 'lowercase', label: 'Lowercase', ex: 'abc' },
                  { key: 'numbers', label: 'Numbers', ex: '123' },
                  { key: 'symbols', label: 'Symbols', ex: '@#$' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => toggleOption(opt.key as keyof typeof options)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      options[opt.key as keyof typeof options]
                        ? 'bg-primary-light border-primary/30 text-primary shadow-sm'
                        : 'bg-card border-border text-foreground-muted hover:border-border-secondary'
                    }`}
                  >
                    <span className="font-bold text-sm">{opt.label}</span>
                    <span className="text-xs opacity-60 mt-1 font-mono">({opt.ex})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
