import { Copy, Check } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: React.ReactNode;
  readOnly?: boolean;
  theme?: 'light' | 'dark';
  actions?: React.ReactNode;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  showStats?: boolean;
  showCopyButton?: boolean;
  enableSyntaxHighlighting?: boolean;
  bottomIcon?: React.ReactNode;
  disabled?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text here...',
  label,
  readOnly = false,
  theme = readOnly ? 'dark' : 'light',
  actions,
  language,

  showLineNumbers = false,
  showStats = false,
  showCopyButton = false,
  enableSyntaxHighlighting = false,
  bottomIcon,
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const themeClasses =
    theme === 'dark'
      ? 'border-border-secondary bg-code-bg text-code-fg'
      : disabled
        ? 'border-border bg-background-secondary text-foreground-subtle cursor-not-allowed'
        : 'border-primary/30 bg-card text-foreground focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary';

  // Calculate stats
  const charCount = value.length;
  const byteCount = new Blob([value]).size;
  const lineCount = value ? value.split('\n').length : 0;

  // Render syntax highlighted code for readOnly mode
  const renderContent = () => {
    if (readOnly && enableSyntaxHighlighting && language && value) {
      return (
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? atomOneDark : atomOneLight}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            height: '100%',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      );
    }

    // Default textarea with optional line numbers
    if (showLineNumbers && value) {
      const lines = value.split('\n');
      return (
        <div className="flex h-full">
          {/* Line numbers */}
          <div
            className={`select-none py-4 px-2 text-right border-r ${
              theme === 'dark'
                ? 'border-border-secondary text-foreground-subtle bg-background-tertiary'
                : 'border-border text-foreground-subtle bg-background-secondary'
            }`}
            style={{
              minWidth: '3rem',
              fontSize: '0.875rem',
              lineHeight: '1.625',
            }}
          >
            {lines.map((_, i) => (
              <div key={i} className="font-mono">
                {i + 1}
              </div>
            ))}
          </div>
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            className={`flex-1 p-4 font-mono text-sm outline-none resize-none leading-relaxed ${
              theme === 'dark'
                ? 'bg-code-bg text-code-fg selection:bg-primary/30'
                : 'bg-transparent text-inherit'
            }`}
          />
        </div>
      );
    }

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full h-full p-4 font-mono text-sm outline-none resize-none leading-relaxed ${
          theme === 'dark'
            ? 'bg-code-bg text-code-fg selection:bg-primary/30'
            : 'bg-transparent text-inherit'
        }`}
      />
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      {(label || actions || showCopyButton) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className="block text-sm font-bold text-foreground-secondary">{label}</label>
          )}
          <div className="flex gap-2">
            {showCopyButton && value && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-background-secondary hover:bg-background-tertiary text-foreground-secondary"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
        </div>
      )}
      <div
        className={`flex-1 relative rounded-xl border transition-all overflow-hidden ${
          theme === 'dark' ? 'shadow-md' : 'shadow-inner'
        } ${themeClasses}`}
      >
        {renderContent()}
        {bottomIcon && <div className="absolute bottom-3 left-3">{bottomIcon}</div>}
      </div>
      {showStats && value && (
        <div
          className={`mt-2 text-xs ${
            theme === 'dark' ? 'text-foreground-subtle' : 'text-foreground-muted'
          } flex gap-4`}
        >
          <span>Characters: {charCount.toLocaleString()}</span>
          <span>Bytes: {byteCount.toLocaleString()}</span>
          <span>Lines: {lineCount.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};
