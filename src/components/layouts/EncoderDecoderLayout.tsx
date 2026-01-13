import { ArrowLeftRight, Check, Copy, LucideIcon, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';
import { useToolShortcuts } from '@/hooks/useToolShortcuts';

export interface EncoderDecoderConfig {
  /** Tool icon */
  icon: LucideIcon;
  /** Tool title */
  title: string;
  /** Tool description */
  description: string;
  /** Optional icon background color */
  iconBgColor?: string;
  /** Optional icon color */
  iconColor?: string;
  /** Labels for encode mode */
  encodeLabels: {
    inputLabel: string;
    outputLabel: string;
    inputPlaceholder: string;
  };
  /** Labels for decode mode */
  decodeLabels: {
    inputLabel: string;
    outputLabel: string;
    inputPlaceholder: string;
  };
  /** Encode function */
  encode: (text: string) => string;
  /** Decode function */
  decode: (text: string) => string;
  /** Error message for decode failures */
  decodeErrorMessage: string;
  /** Optional: detect if input should be decoded (for hash parsing) */
  shouldDecodeOnHashInput?: (input: string) => boolean;
}

interface EncoderDecoderLayoutProps {
  config: EncoderDecoderConfig;
}

export const EncoderDecoderLayout: React.FC<EncoderDecoderLayoutProps> = ({ config }) => {
  const { input, setInput, output, setOutput, copied, handleCopy, handleClear } = useToolLogic();

  // Parse hash input on mount (lazy initial state pattern)
  const getInitialMode = (): 'encode' | 'decode' => {
    if (typeof window === 'undefined') return 'encode';
    const hash = window.location.hash;
    if (hash.includes('input=')) {
      try {
        const params = new URLSearchParams(hash.substring(1));
        const inputParam = params.get('input');
        if (inputParam) {
          const decoded = decodeURIComponent(inputParam);
          return config.shouldDecodeOnHashInput?.(decoded) ? 'decode' : 'encode';
        }
      } catch (e) {
        console.warn('Failed to parse hash for initial mode:', e);
      }
    }
    return 'encode';
  };

  const [mode, setMode] = useState<'encode' | 'decode'>(getInitialMode);
  const hasInitialized = React.useRef(false);

  useToolShortcuts({
    onClear: handleClear,
    onCopy: handleCopy,
  });

  const process = useCallback(
    (text: string, currentMode: 'encode' | 'decode') => {
      try {
        if (!text) {
          setOutput('');
          return;
        }
        if (currentMode === 'encode') {
          setOutput(config.encode(text));
        } else {
          setOutput(config.decode(text));
        }
      } catch (e) {
        console.warn(`Error during ${currentMode}:`, e);
        setOutput(config.decodeErrorMessage);
      }
    },
    [setOutput, config]
  );

  // Check for input in URL hash (from extension) - only set input, mode is already set
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const hash = window.location.hash;
    if (hash.includes('input=')) {
      try {
        const params = new URLSearchParams(hash.substring(1));
        const inputParam = params.get('input');
        if (inputParam) {
          const decoded = decodeURIComponent(inputParam);
          setInput(decoded);
          process(decoded, mode);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.warn('Failed to parse hash input:', e);
      }
    }
  }, [setInput, process, mode]);

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

  const labels = mode === 'encode' ? config.encodeLabels : config.decodeLabels;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={config.icon}
          title={config.title}
          description={config.description}
          iconBgColor={config.iconBgColor}
          iconColor={config.iconColor}
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center">
          <button
            onClick={toggleMode}
            className="flex items-center space-x-2 px-6 py-2 bg-background-secondary hover:bg-background-tertiary rounded-full text-foreground-secondary font-medium transition-colors border border-border"
          >
            <span className={mode === 'encode' ? 'text-primary font-bold' : ''}>Encode</span>
            <ArrowLeftRight size={16} className="text-foreground-muted" />
            <span className={mode === 'decode' ? 'text-primary font-bold' : ''}>Decode</span>
          </button>

          <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={handleInputChange}
              label={labels.inputLabel}
              placeholder={labels.inputPlaceholder}
              theme="light"
            />

            <CodeEditor
              value={output}
              label={labels.outputLabel}
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
