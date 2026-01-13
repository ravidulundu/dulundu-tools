import { Globe, RefreshCw, CheckCircle, XCircle, Server } from 'lucide-react';
import React, { useState } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';

interface CheckResult {
  online: boolean;
  status?: number;
  statusText?: string;
  error?: string;
  errorCode?: string;
  url?: string;
}

export const MirrorOnline: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'up' | 'down' | 'error'>('idle');
  const [result, setResult] = useState<CheckResult | null>(null);

  const checkStatus = async () => {
    if (!url) return;

    setStatus('checking');
    setResult(null);

    try {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      // Handle non-JSON responses
      const text = await response.text();
      if (!text) {
        throw new Error('Server returned empty response. Is the backend running?');
      }

      let data: CheckResult;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setResult(data);
      setStatus(data.online ? 'up' : 'down');
    } catch (e) {
      setStatus('error');
      setResult({
        online: false,
        error: e instanceof Error ? e.message : 'Failed to check URL',
        errorCode: 'REQUEST_FAILED',
      });
    }
  };

  const getStatusMessage = () => {
    if (!result) return '';

    if (result.online) {
      return `Online (${result.status} ${result.statusText})`;
    }

    switch (result.errorCode) {
      case 'TIMEOUT':
        return 'Timeout - Server took too long to respond';
      case 'DNS_ERROR':
        return 'DNS Error - Domain not found';
      case 'CONNECTION_REFUSED':
        return 'Connection refused - Server not accepting connections';
      case 'CONNECTION_RESET':
        return 'Connection reset - Server closed connection';
      default:
        return result.error || 'Website unreachable';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Globe}
          title="Is It Down?"
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
                  className="flex-1 p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background text-foreground placeholder:text-foreground-muted"
                  onKeyDown={e => e.key === 'Enter' && checkStatus()}
                />
                <button
                  onClick={checkStatus}
                  disabled={status === 'checking' || !url}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors font-bold shadow-sm flex items-center"
                >
                  {status === 'checking' ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    'Check'
                  )}
                </button>
              </div>

              {status !== 'idle' && status !== 'checking' && result && (
                <div
                  className={`mt-6 p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 animate-in fade-in slide-in-from-top-2 ${
                    result.online
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {result.online ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    <span className="font-bold text-lg">
                      {result.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <span className="text-sm opacity-80">{getStatusMessage()}</span>
                  {result.url && <span className="text-xs opacity-60 font-mono">{result.url}</span>}
                </div>
              )}
            </div>

            <div className="bg-primary-light dark:bg-primary/10 p-4 rounded-xl border border-border flex items-start">
              <Server size={20} className="text-primary mr-3 mt-0.5 shrink-0" />
              <p className="text-sm text-primary-foreground dark:text-primary">
                <strong>Server-side check:</strong> This tool performs the check from our server,
                bypassing browser CORS restrictions for more accurate results. Rate limited to 10
                requests per minute.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
