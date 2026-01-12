import { Search, Globe, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

interface RdapResponse {
  handle?: string;
  ldhName?: string;
  status?: string[];
  events?: Array<{
    eventAction: string;
    eventDate: string;
  }>;
  [key: string]: unknown;
}

export const WhoisLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<RdapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async () => {
    if (!domain.includes('.')) {
      setError('Please enter a valid domain (e.g., google.com)');
      return;
    }
    setLoading(true);
    setError('');
    setData(null);

    try {
      // Using rdap.org as a free proxy to RDAP
      const res = await fetch(`https://rdap.org/domain/${domain}`);
      if (!res.ok) throw new Error('Domain not found or registry does not support RDAP');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDomain('');
    setData(null);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Globe}
          title="Whois Lookup"
          description="Check domain registration availability and details (RDAP)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookup()}
                placeholder="example.com"
                className="w-full p-2 pl-9 bg-background-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                size={16}
              />
            </div>
            <button
              onClick={lookup}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 text-sm flex items-center"
            >
              {loading ? (
                <RefreshCw className="animate-spin mr-1.5" size={16} />
              ) : (
                <Search className="mr-1.5" size={16} />
              )}
              {loading ? 'Searching...' : 'Lookup'}
            </button>
            <ActionButton onClick={handleClear} icon={Trash2} label="Clear" variant="danger" />
          </div>

          {error && (
            <div className="flex items-center text-danger text-sm font-medium bg-danger-light px-3 py-2 rounded-lg border border-danger/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          {data ? (
            <div className="h-full grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                  <h3 className="font-bold text-foreground-secondary mb-4 border-b border-border pb-2 text-sm uppercase tracking-wide">
                    Status
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between items-center">
                      <span className="text-foreground-muted">Handle</span>{' '}
                      <span className="font-mono bg-background-secondary px-2 py-0.5 rounded border border-border">
                        {data.handle}
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-foreground-muted">Name</span>{' '}
                      <span className="font-mono font-bold text-primary">{data.ldhName}</span>
                    </li>
                    <li className="flex flex-col mt-2 gap-2">
                      <span className="text-foreground-muted">Status Flags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {data.status?.map(s => (
                          <span
                            key={s}
                            className="px-2 py-1 bg-primary-light text-primary rounded-md text-xs border border-primary/20 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                  <h3 className="font-bold text-foreground-secondary mb-4 border-b border-border pb-2 text-sm uppercase tracking-wide">
                    Events
                  </h3>
                  <ul className="space-y-3 text-sm">
                    {data.events?.map(e => (
                      <li
                        key={e.eventAction}
                        className="flex justify-between items-center group hover:bg-background-secondary p-1.5 rounded-lg transition-colors -mx-1.5 px-1.5"
                      >
                        <span className="text-foreground-muted capitalize font-medium">
                          {e.eventAction.replace(' last', '')}
                        </span>
                        <span className="font-mono text-foreground-secondary">
                          {new Date(e.eventDate).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="h-full overflow-hidden">
                <CodeEditor
                  value={JSON.stringify(data, null, 2)}
                  label="Raw JSON Response"
                  readOnly
                  language="json"
                  theme="dark"
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-foreground-muted">
              <Globe size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">Enter a domain to see registration details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
