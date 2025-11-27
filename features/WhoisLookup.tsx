
import React, { useState } from 'react';
import { Search, Globe, AlertCircle, RefreshCw } from 'lucide-react';

export const WhoisLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<any>(null);
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

  const extractValue = (obj: any, key: string) => {
      // Helper to traverse RDAP structure often deeply nested
      // This is a simplified traversal for common fields
      return obj?.[key] || 'N/A';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <Globe size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Whois Lookup</h1>
              <p className="text-sm text-slate-500">Check domain registration availability and details (RDAP)</p>
           </div>
        </div>

        <div className="p-8">
           <div className="relative mb-8">
              <input 
                type="text" 
                value={domain} 
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && lookup()}
                placeholder="example.com"
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <button 
                onClick={lookup} 
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Lookup'}
              </button>
           </div>

           {error && (
              <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-6">
                 <AlertCircle size={20} className="mr-2" />
                 {error}
              </div>
           )}

           {data && (
              <div className="space-y-6 animate-fade-in">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-gray-100">
                       <h3 className="font-bold text-slate-700 mb-4 border-b border-gray-200 pb-2">Status</h3>
                       <ul className="space-y-2 text-sm">
                          <li className="flex justify-between"><span className="text-slate-500">Handle</span> <span className="font-mono">{data.handle}</span></li>
                          <li className="flex justify-between"><span className="text-slate-500">Name</span> <span className="font-mono font-bold">{data.ldhName}</span></li>
                          <li className="flex flex-col mt-2">
                             <span className="text-slate-500 mb-1">Status Flags</span> 
                             <div className="flex flex-wrap gap-1">
                                {data.status?.map((s: string) => (
                                   <span key={s} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{s}</span>
                                ))}
                             </div>
                          </li>
                       </ul>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-gray-100">
                       <h3 className="font-bold text-slate-700 mb-4 border-b border-gray-200 pb-2">Events</h3>
                       <ul className="space-y-3 text-sm">
                          {data.events?.map((e: any) => (
                             <li key={e.eventAction} className="flex justify-between items-center">
                                <span className="text-slate-500 capitalize">{e.eventAction.replace(' last', '')}</span>
                                <span className="font-mono">{new Date(e.eventDate).toLocaleDateString()}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <div className="bg-slate-900 rounded-xl p-6 overflow-hidden">
                    <h3 className="text-slate-400 font-bold mb-4 text-xs uppercase">Raw JSON Response</h3>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                       <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                          {JSON.stringify(data, null, 2)}
                       </pre>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
