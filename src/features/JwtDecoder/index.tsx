import { Shield, Copy, Check, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { useToolLogic } from '@/hooks/useToolLogic';

export const JwtDecoder: React.FC = () => {
  const {
    input: token,
    setInput: setToken,
    error,
    setError,
    handleClear: hookHandleClear,
  } = useToolLogic();

  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [secret, setSecret] = useState('');
  const [encodedToken, setEncodedToken] = useState('');
  const [copied, setCopied] = useState('');

  // Decode Logic
  const decode = (input: string) => {
    setToken(input);
    setError(null);
    if (!input) {
      setHeader('');
      setPayload('');
      return;
    }

    try {
      const parts = input.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Must have 3 parts separated by dots.');
      }

      const decodePart = (part: string) => {
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        return JSON.stringify(JSON.parse(json), null, 2);
      };

      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
    } catch (_e) {
      setHeader('');
      setPayload('');
      setError('Invalid JWT Token or Base64 encoding.');
    }
  };

  // Encode Logic
  const base64UrlEncode = (str: string) => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const encode = async () => {
    try {
      setError(null);
      const headerObj = JSON.parse(header || '{"alg": "HS256", "typ": "JWT"}');
      const payloadObj = JSON.parse(payload || '{}');

      const headerStr = base64UrlEncode(JSON.stringify(headerObj));
      const payloadStr = base64UrlEncode(JSON.stringify(payloadObj));

      const data = `${headerStr}.${payloadStr}`;

      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await window.crypto.subtle.sign('HMAC', key, encoder.encode(data));

      const signatureStr = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));

      setEncodedToken(`${data}.${signatureStr}`);
    } catch (e) {
      setError('Error encoding JWT: ' + (e as Error).message);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleClear = () => {
    hookHandleClear();
    setHeader('');
    setPayload('');
    setSecret('');
    setEncodedToken('');
    setError(null);
  };

  // Set default values when switching to encode
  React.useEffect(() => {
    if (mode === 'encode' && !header) {
      setHeader('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
      setPayload('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
    }
  }, [mode, header]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Shield}
          title="JWT Debugger"
          description="Decode and Encode JSON Web Tokens"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center">
          <div className="flex bg-background-secondary p-1 rounded-lg">
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                mode === 'decode'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-foreground-muted hover:text-foreground-secondary'
              }`}
            >
              Decode
            </button>
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                mode === 'encode'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-foreground-muted hover:text-foreground-secondary'
              }`}
            >
              Encode
            </button>
          </div>

          <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          {mode === 'decode' ? (
            <div className="grid md:grid-cols-2 gap-4 h-full">
              {/* Input */}
              <div className="flex flex-col h-full">
                <CodeEditor
                  value={token}
                  onChange={decode}
                  label="Encoded Token"
                  placeholder="Paste JWT here (eyJ...)"
                  theme="light"
                />
                {error && <p className="mt-2 text-xs text-danger font-bold">{error}</p>}
              </div>

              {/* Output */}
              <div className="flex flex-col h-full gap-4">
                {/* Header */}
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    value={header}
                    label="Header"
                    readOnly
                    theme="dark"
                    actions={
                      header && (
                        <ActionButton
                          icon={copied === 'header' ? Check : Copy}
                          label="Copy"
                          onClick={() => handleCopy(header, 'header')}
                          variant={copied === 'header' ? 'success' : 'primary'}
                          size="sm"
                        />
                      )
                    }
                  />
                </div>

                {/* Payload */}
                <div className="flex-[2] min-h-0">
                  <CodeEditor
                    value={payload}
                    label="Payload"
                    readOnly
                    theme="dark"
                    actions={
                      payload && (
                        <ActionButton
                          icon={copied === 'payload' ? Check : Copy}
                          label="Copy"
                          onClick={() => handleCopy(payload, 'payload')}
                          variant={copied === 'payload' ? 'success' : 'primary'}
                          size="sm"
                        />
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 h-full">
              {/* Inputs */}
              <div className="flex flex-col h-full gap-4">
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    value={header}
                    onChange={setHeader}
                    label="Header (JSON)"
                    language="json"
                    theme="light"
                  />
                </div>
                <div className="flex-[2] min-h-0">
                  <CodeEditor
                    value={payload}
                    onChange={setPayload}
                    label="Payload (JSON)"
                    language="json"
                    theme="light"
                  />
                </div>
                <div className="h-24">
                  <label
                    htmlFor="secret-input"
                    className="block text-xs font-bold text-foreground-muted uppercase mb-1.5"
                  >
                    Secret (HMAC-SHA256)
                  </label>
                  <input
                    id="secret-input"
                    type="text"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    placeholder="Enter secret to sign..."
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                  />
                </div>
                <button
                  onClick={encode}
                  className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors"
                >
                  Sign & Encode JWT
                </button>
              </div>

              {/* Output */}
              <div className="flex flex-col h-full">
                <CodeEditor
                  value={encodedToken}
                  label="Generated Token"
                  readOnly
                  theme="dark"
                  actions={
                    encodedToken && (
                      <ActionButton
                        icon={copied === 'encoded' ? Check : Copy}
                        label="Copy"
                        onClick={() => handleCopy(encodedToken, 'encoded')}
                        variant={copied === 'encoded' ? 'success' : 'primary'}
                      />
                    )
                  }
                />
                {error && <p className="mt-2 text-xs text-danger font-bold">{error}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
