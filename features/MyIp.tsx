
import React, { useState, useEffect } from 'react';
import { Wifi, Monitor, Globe, Smartphone, RefreshCw, Copy, Check } from 'lucide-react';

export const MyIp: React.FC = () => {
  const [ipData, setIpData] = useState<any>(null);
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
        memory: (navigator as any).deviceMemory ? `~${(navigator as any).deviceMemory} GB` : 'Unknown'
      });
      setError('');
    } catch (e) {
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Wifi size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">My IP Address</h1>
                <p className="text-sm text-slate-500">View your public IP and device information</p>
             </div>
           </div>
           <button onClick={fetchIp} className="p-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:text-primary transition-colors">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        <div className="p-8">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
                    {error}
                </div>
            )}

            {/* IP Display Hero */}
            <div className="bg-slate-900 rounded-2xl p-8 text-center mb-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Your Public IP Address</p>
                <div className="text-4xl md:text-6xl font-mono font-bold text-white tracking-tight mb-4">
                    {loading ? <span className="animate-pulse">Loading...</span> : (ipData?.ip || 'Unknown')}
                </div>
                {!loading && ipData?.ip && (
                    <button 
                        onClick={handleCopy}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm"
                    >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        <span>{copied ? 'Copied' : 'Copy IP'}</span>
                    </button>
                )}
            </div>

            {/* Device Details Grid */}
            {!loading && ipData && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <Monitor className="text-primary" size={20} />
                            <h3 className="font-bold text-slate-700">Display Info</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-slate-500 text-sm">Screen Resolution</span>
                                <span className="font-mono text-slate-800 text-sm">{ipData.screen}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-slate-500 text-sm">Window Size</span>
                                <span className="font-mono text-slate-800 text-sm">{ipData.window}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm">Pixel Ratio</span>
                                <span className="font-mono text-slate-800 text-sm">{window.devicePixelRatio}x</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <Smartphone className="text-primary" size={20} />
                            <h3 className="font-bold text-slate-700">System Info</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-slate-500 text-sm">Platform</span>
                                <span className="font-mono text-slate-800 text-sm">{ipData.platform}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-slate-500 text-sm">Language</span>
                                <span className="font-mono text-slate-800 text-sm">{ipData.language}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm">CPU Cores</span>
                                <span className="font-mono text-slate-800 text-sm">{ipData.cores}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full bg-slate-50 p-6 rounded-xl border border-gray-100">
                         <div className="flex items-center space-x-3 mb-4">
                            <Globe className="text-primary" size={20} />
                            <h3 className="font-bold text-slate-700">User Agent</h3>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-xs text-slate-600 break-all leading-relaxed">
                            {ipData.userAgent}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
