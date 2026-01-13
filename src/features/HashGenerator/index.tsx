import { ShieldCheck, Key, Copy, Check, Trash2, Hash, Shield } from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { useToolShortcuts } from '@/hooks/useToolShortcuts';
import { md5 } from '@/utils/md5';

type HashMode = 'hash' | 'hmac';

export const HashGenerator: React.FC = () => {
  const [mode, setMode] = useState<HashMode>('hash');
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('secret_key');
  const [file, setFile] = useState<File | null>(null);
  const [algo, setAlgo] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [hash]);

  const handleClear = useCallback(() => {
    setInput('');
    setFile(null);
    setHash('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  useToolShortcuts({
    onClear: handleClear,
    onCopy: handleCopy,
  });

  // Regular Hash generation
  const generateHash = useCallback(
    async (text: string, fileInput: File | null, algorithm: string) => {
      if (!text && !fileInput) {
        setHash('');
        return;
      }

      setLoading(true);
      setHash('');

      try {
        if (fileInput) {
          if (algorithm === 'MD5') {
            setHash('MD5 not supported for files. Use SHA algorithms.');
            setLoading(false);
            return;
          }

          const buffer = await fileInput.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          setHash(hashHex);
        } else {
          if (algorithm === 'MD5') {
            setHash(md5(text));
          } else {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest(algorithm, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setHash(hashHex);
          }
        }
      } catch (e) {
        setHash('Error: ' + (e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // HMAC generation
  const generateHmac = useCallback(async (text: string, secretKey: string, algorithm: string) => {
    if (!text || !secretKey) {
      setHash('');
      return;
    }

    setLoading(true);
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const msgData = encoder.encode(text);

      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: algorithm } },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', key, msgData);
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setHash(hashHex);
    } catch (e) {
      console.error(e);
      setHash('Error generating HMAC');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-generate on input changes
  useEffect(() => {
    if (mode === 'hash') {
      generateHash(input, file, algo);
    } else {
      generateHmac(input, secret, algo);
    }
  }, [mode, input, file, secret, algo, generateHash, generateHmac]);

  const handleInputChange = (val: string) => {
    setInput(val);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInput('');
    }
  };

  const handleModeChange = (newMode: HashMode) => {
    setMode(newMode);
    setHash('');
    // Reset to SHA-256 when switching to HMAC (MD5 not supported)
    if (newMode === 'hmac' && algo === 'MD5') {
      setAlgo('SHA-256');
    }
  };

  const algorithms =
    mode === 'hash'
      ? ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
      : ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={ShieldCheck}
          title="Hash & HMAC Generator"
          description="Generate secure hashes (MD5, SHA) and HMAC signatures"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-3 items-center flex-wrap">
            {/* Mode Toggle */}
            <div className="flex bg-background-secondary rounded-lg p-1 border border-border">
              <button
                onClick={() => handleModeChange('hash')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mode === 'hash'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <Hash size={14} />
                Hash
              </button>
              <button
                onClick={() => handleModeChange('hmac')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mode === 'hmac'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <Shield size={14} />
                HMAC
              </button>
            </div>

            {/* Algorithm Selector */}
            <div className="flex bg-card border border-border p-1 rounded-lg shadow-sm">
              {algorithms.map(a => (
                <button
                  key={a}
                  onClick={() => setAlgo(a)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    algo === a
                      ? 'bg-success text-white shadow-sm'
                      : 'text-foreground-muted hover:text-foreground-secondary'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col h-full gap-4">
              {/* HMAC Secret Key Input */}
              {mode === 'hmac' && (
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                  <label
                    htmlFor="secret-key"
                    className="block text-xs font-bold text-foreground-muted uppercase mb-2"
                  >
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      id="secret-key"
                      type="text"
                      value={secret}
                      onChange={e => setSecret(e.target.value)}
                      className="w-full p-3 pl-10 bg-background-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      placeholder="Enter secret key..."
                    />
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                      size={16}
                    />
                  </div>
                </div>
              )}

              <CodeEditor
                value={input}
                onChange={handleInputChange}
                label="Input Text"
                placeholder={mode === 'hash' ? 'Enter text to hash...' : 'Enter message to sign...'}
                theme="light"
                disabled={!!file}
              />

              {/* File Upload - Only for Hash mode */}
              {mode === 'hash' && (
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                  <label
                    htmlFor="file-upload"
                    className="block text-xs font-bold text-foreground-muted uppercase mb-3"
                  >
                    Or Upload File
                  </label>
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                      file
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:bg-background-secondary'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      id="file-upload"
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {file ? (
                      <div className="text-sm">
                        <p className="font-bold text-foreground">{file.name}</p>
                        <p className="text-foreground-muted">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground-muted font-medium">
                        Click to select a file
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <CodeEditor
              value={loading ? 'Calculating...' : hash}
              label={mode === 'hash' ? `${algo} Hash` : `HMAC-${algo}`}
              placeholder={
                mode === 'hash' ? 'Hash will appear here...' : 'HMAC signature will appear here...'
              }
              readOnly
              theme="dark"
              actions={
                hash &&
                !hash.startsWith('Error') &&
                !hash.startsWith('MD5 not') && (
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
    </ToolPageLayout>
  );
};
