import { Shuffle, RefreshCw, Copy, Check, Trash2, Download } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const generateUUID = () => {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Secure fallback using crypto.getRandomValues()
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
      const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));
      return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
    } catch (_e) {
      return 'Error generating UUID';
    }
  };

  const handleGenerate = React.useCallback(() => {
    const newUuids = Array(count)
      .fill(null)
      .map(() => generateUUID());
    setUuids(newUuids);
    setCopied(false);
  }, [count]);

  const handleCopy = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setUuids([]);
    setCopied(false);
  };

  // Generate on first load
  React.useEffect(() => {
    if (uuids.length === 0) handleGenerate();
  }, [handleGenerate, uuids.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Shuffle}
          title="UUID Generator"
          description="Generate Version 4 UUIDs (Universally Unique Identifiers)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-background-secondary border border-border rounded-lg px-3 py-1">
              <span className="text-sm text-foreground-muted font-medium mr-2">Count:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-16 bg-transparent font-bold text-foreground outline-none text-center"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              <RefreshCw size={16} className="mr-1.5" />
              Generate
            </button>
          </div>

          <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="h-full">
            <CodeEditor
              value={uuids.join('\n')}
              label={`Generated UUIDs (${uuids.length})`}
              placeholder="UUIDs will appear here..."
              readOnly
              theme="dark"
              actions={
                uuids.length > 0 && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() => {
                        const blob = new Blob([uuids.join('\n')], {
                          type: 'text/plain',
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'uuids.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      variant="secondary"
                    />
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy All'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
                    />
                  </>
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
