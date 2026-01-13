import { Key, RefreshCw, Copy, Check, Download } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';

export const RsaGenerator: React.FC = () => {
  const [keySize, setKeySize] = useState(2048);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const exportKey = async (key: CryptoKey, type: 'pkcs8' | 'spki') => {
    const exported = await window.crypto.subtle.exportKey(type, key);
    const exportedAsBase64 = arrayBufferToBase64(exported);
    const pemExported = `-----BEGIN ${type === 'pkcs8' ? 'PRIVATE' : 'PUBLIC'} KEY-----\n${exportedAsBase64.match(/.{1,64}/g)?.join('\n')}\n-----END ${type === 'pkcs8' ? 'PRIVATE' : 'PUBLIC'} KEY-----`;
    return pemExported;
  };

  const generateKeys = async () => {
    setLoading(true);
    // Timeout to allow UI render
    setTimeout(async () => {
      try {
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: 'RSA-OAEP',
            modulusLength: keySize,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
          },
          true,
          ['encrypt', 'decrypt']
        );

        const pub = await exportKey(keyPair.publicKey, 'spki');
        const priv = await exportKey(keyPair.privateKey, 'pkcs8');

        setPublicKey(pub);
        setPrivateKey(priv);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Key}
          title="RSA Key Generator"
          description="Generate secure Public/Private Key pairs (PEM format)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-foreground-secondary">Key Size:</span>
            <div className="flex bg-background-secondary p-1 rounded-lg">
              {[1024, 2048, 4096].map(size => (
                <button
                  key={size}
                  onClick={() => setKeySize(size)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${keySize === size ? 'bg-card text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-secondary'}`}
                >
                  {size} bits
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateKeys}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm flex items-center disabled:opacity-70 text-sm"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin mr-2" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            Generate Key Pair
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={publicKey}
              label="Public Key"
              placeholder="-----BEGIN PUBLIC KEY-----..."
              readOnly
              theme="light"
              actions={
                publicKey && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() => handleDownload(publicKey, 'public.pem')}
                      variant="secondary"
                    />
                    <ActionButton
                      icon={copied === 'pub' ? Check : Copy}
                      label={copied === 'pub' ? 'Copied' : 'Copy'}
                      onClick={() => handleCopy(publicKey, 'pub')}
                      variant={copied === 'pub' ? 'success' : 'primary'}
                    />
                  </>
                )
              }
            />

            <CodeEditor
              value={privateKey}
              label="Private Key (SECRET)"
              placeholder="-----BEGIN PRIVATE KEY-----..."
              readOnly
              theme="dark"
              actions={
                privateKey && (
                  <>
                    <ActionButton
                      icon={Download}
                      label="Download"
                      onClick={() => handleDownload(privateKey, 'private.pem')}
                      variant="secondary"
                    />
                    <ActionButton
                      icon={copied === 'priv' ? Check : Copy}
                      label={copied === 'priv' ? 'Copied' : 'Copy'}
                      onClick={() => handleCopy(privateKey, 'priv')}
                      variant={copied === 'priv' ? 'success' : 'primary'}
                    />
                  </>
                )
              }
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
