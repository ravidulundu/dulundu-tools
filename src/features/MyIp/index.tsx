import { Wifi, Monitor, Globe, Smartphone, RefreshCw, Copy, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { ToolHeader } from '@/components/common/ToolHeader';

interface IpData {
  ip: string;
  userAgent: string;
  language: string;
  screen: string;
  window: string;
  platform: string;
  cores: number | string;
  memory: string;
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export const MyIp: React.FC = () => {
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchIp = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setIpData({
        ip: data.ip,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${window.screen.width} x ${window.screen.height}`,
        window: `${window.innerWidth} x ${window.innerHeight}`,
        platform: navigator.platform,
        cores: navigator.hardwareConcurrency || 'Unknown',
        memory: (navigator as NavigatorWithMemory).deviceMemory
          ? `~${(navigator as NavigatorWithMemory).deviceMemory} GB`
          : 'Unknown',
      });
      setError('');
    } catch (_e) {
      setError('Failed to retrieve IP address. Likely due to an ad-blocker or network issue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  const handleCopy = () => {
    if (!ipData?.ip) return;
    navigator.clipboard.writeText(ipData.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 min-h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col">
        <ToolHeader
          icon={Wifi}
          title="My IP Address"
          description="View your public IP and device information"
        />
        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-end">
          <ActionButton
            onClick={fetchIp}
            icon={RefreshCw}
            label="Refresh"
            variant="secondary"
            className={loading ? 'animate-spin' : ''}
          />
        </div>
        <div className="flex-1 p-4 md:p-6 bg-background-secondary/30 flex flex-col items-center">
          <div className="max-w-4xl w-full space-y-6">
            {error && (
              <div className="bg-danger-light text-danger p-4 rounded-xl border border-border animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* IP Display Hero */}
            <div className="bg-background-dark rounded-2xl p-8 text-center relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <p className="text-foreground-muted text-sm font-medium uppercase tracking-wider mb-2">
                Your Public IP Address
              </p>
              <div className="text-4xl md:text-6xl font-mono font-bold text-foreground-inverse tracking-tight mb-4">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  ipData?.ip || 'Unknown'
                )}
              </div>
              {!loading && ipData?.ip && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-foreground-inverse/10 text-foreground-inverse hover:bg-foreground-inverse/20 transition-colors text-sm font-medium backdrop-blur-sm border border-foreground-inverse/10"
                >
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied' : 'Copy IP'}</span>
                </button>
              )}
            </div>

            {/* Device Details Grid */}
            {!loading && ipData && (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary-light text-primary rounded-lg">
                      <Monitor size={20} />
                    </div>
                    <h3 className="font-bold text-foreground-secondary">Display Info</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-foreground-muted text-sm">Screen Resolution</span>
                      <span className="font-mono text-foreground text-sm">{ipData.screen}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-foreground-muted text-sm">Window Size</span>
                      <span className="font-mono text-foreground text-sm">{ipData.window}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted text-sm">Pixel Ratio</span>
                      <span className="font-mono text-foreground text-sm">
                        {window.devicePixelRatio}x
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                      <Smartphone size={20} />
                    </div>
                    <h3 className="font-bold text-foreground-secondary">System Info</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-foreground-muted text-sm">Platform</span>
                      <span className="font-mono text-foreground text-sm">{ipData.platform}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-foreground-muted text-sm">Language</span>
                      <span className="font-mono text-foreground text-sm">{ipData.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted text-sm">CPU Cores</span>
                      <span className="font-mono text-foreground text-sm">{ipData.cores}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-full bg-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-success-light text-success rounded-lg">
                      <Globe size={20} />
                    </div>
                    <h3 className="font-bold text-foreground-secondary">User Agent</h3>
                  </div>
                  <div className="bg-background-secondary p-4 rounded-lg border border-border font-mono text-xs text-foreground-secondary break-all leading-relaxed">
                    {ipData.userAgent}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
