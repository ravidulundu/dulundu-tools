
import React, { useState } from 'react';
import { Key, RefreshCw, Copy, Check, Download } from 'lucide-react';

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
                    name: "RSA-OAEP",
                    modulusLength: keySize,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <Key size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">RSA Key Generator</h1>
              <p className="text-sm text-slate-500">Generate secure Public/Private Key pairs (PEM format)</p>
           </div>
        </div>

        <div className="p-8">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8 bg-slate-50 p-6 rounded-xl border border-gray-100">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Key Size (bits)</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[1024, 2048, 4096].map(size => (
                            <button
                                key={size}
                                onClick={() => setKeySize(size)}
                                className={`py-2 rounded-lg text-sm font-bold transition-all border ${keySize === size ? 'bg-white text-primary border-primary shadow-sm' : 'bg-transparent text-slate-500 border-transparent hover:bg-white/50'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={generateKeys}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md flex items-center justify-center disabled:opacity-70"
                >
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : 'Generate Key Pair'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Public Key */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-slate-700">Public Key</label>
                        <div className="flex space-x-1">
                             <button onClick={() => handleDownload(publicKey, 'public.pem')} disabled={!publicKey} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Download">
                                <Download size={14} />
                             </button>
                             <button onClick={() => handleCopy(publicKey, 'pub')} disabled={!publicKey} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Copy">
                                {copied === 'pub' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                             </button>
                        </div>
                    </div>
                    <textarea 
                        readOnly
                        value={publicKey}
                        className="flex-1 min-h-[300px] p-4 bg-slate-50 border border-gray-200 rounded-xl font-mono text-xs text-slate-600 outline-none resize-none"
                        placeholder="-----BEGIN PUBLIC KEY-----..."
                    />
                </div>

                {/* Private Key */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-red-700 flex items-center">
                            Private Key 
                            <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">SECRET</span>
                        </label>
                        <div className="flex space-x-1">
                             <button onClick={() => handleDownload(privateKey, 'private.pem')} disabled={!privateKey} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Download">
                                <Download size={14} />
                             </button>
                             <button onClick={() => handleCopy(privateKey, 'priv')} disabled={!privateKey} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Copy">
                                {copied === 'priv' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                             </button>
                        </div>
                    </div>
                    <div className="relative flex-1 min-h-[300px]">
                        <textarea 
                            readOnly
                            value={privateKey}
                            className="w-full h-full p-4 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-red-200 outline-none resize-none"
                            placeholder="-----BEGIN PRIVATE KEY-----..."
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
