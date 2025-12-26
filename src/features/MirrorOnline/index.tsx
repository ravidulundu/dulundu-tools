import { Globe, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';

export const MirrorOnline: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'up' | 'down' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const checkStatus = async () => {
    if (!url) return;

    let target = url;
    if (!target.startsWith('http')) {
      target = 'https://' + target;
    }

    setStatus('checking');
    setMessage('');

    try {
      // We use no-cors mode because most sites block CORS.
      // An opaque response (type: 'opaque') usually means the server is reachable.
      // A network error usually means it's down or DNS failed.
      await fetch(target, { mode: 'no-cors', cache: 'no-cache' });
      setStatus('up');
      setMessage('Website is reachable!');
    } catch (_e) {
      setStatus('down');
      setMessage('Website seems down or unreachable.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Globe}
          title="Website Status Checker"
          description="Check if a website is online or offline"
        />

        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background-secondary/30 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full space-y-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
              <label
                htmlFor="website-url"
                className="block text-sm font-medium text-foreground-secondary mb-2"
              >
                Website URL
              </label>
              <div className="flex gap-2">
                <input
                  id="website-url"
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="example.com"
                  className="flex-1 p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground"
                  onKeyDown={e => e.key === 'Enter' && checkStatus()}
                />
                <button
                  onClick={checkStatus}
                  disabled={status === 'checking' || !url}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors font-bold shadow-sm flex items-center"
                >
                  {status === 'checking' ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    'Check'
                  )}
                </button>
              </div>

              {status !== 'idle' && status !== 'checking' && (
                <div
                  className={`mt-6 p-4 rounded-xl border flex items-center justify-center space-x-3 animate-in fade-in slide-in-from-top-2 ${
                    status === 'up'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {status === 'up' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  <span className="font-bold text-lg">{message}</span>
                </div>
              )}
            </div>

            <div className="bg-primary-light p-4 rounded-xl border border-border flex items-start">
              <AlertCircle size={20} className="text-blue-600 mr-3 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This tool performs a client-side check from your browser.
                Some websites might block these requests or appear down due to browser security
                policies (CORS) or ad blockers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
