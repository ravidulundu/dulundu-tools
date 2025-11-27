
import React, { useState } from 'react';
import { Search, Globe, RefreshCw, AlertCircle } from 'lucide-react';

type DnsType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME' | 'SOA';

export const DnsLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [type, setType] = useState<DnsType>('A');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async () => {
    if (!domain) return;
    setLoading(true);
    setResults([]);
    setError('');

    try {
      // Use Google DNS-over-HTTPS API
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
      const data = await res.json();

      if (data.Status !== 0) {
        throw new Error(`DNS Error Code: ${data.Status}. Domain might not exist or invalid.`);
      }

      if (data.Answer) {
        setResults(data.Answer);
      } else {
        setError('No records found for this type.');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') lookup();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <Globe size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">DNS Lookup</h1>
              <p className="text-sm text-slate-500">Check DNS records for any domain</p>
           </div>
        </div>

        <div className="p-8">
           <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                 <input 
                   type="text" 
                   value={domain} 
                   onChange={(e) => setDomain(e.target.value)}
                   onKeyDown={handleKeyDown}
                   placeholder="example.com"
                   className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
              <select 
                 value={type} 
                 onChange={(e) => setType(e.target.value as DnsType)}
                 className="p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-700"
              >
                 {['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'].map(t => (
                    <option key={t} value={t}>{t}</option>
                 ))}
              </select>
              <button 
                 onClick={lookup} 
                 disabled={loading || !domain}
                 className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                 {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Lookup'}
              </button>
           </div>

           {/* Results Area */}
           <div className="space-y-4">
              {error && (
                 <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                 </div>
              )}

              {results.length > 0 && (
                 <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                          <tr>
                             <th className="px-6 py-3">Type</th>
                             <th className="px-6 py-3">Name</th>
                             <th className="px-6 py-3">TTL</th>
                             <th className="px-6 py-3">Data</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 bg-white">
                          {results.map((record, i) => (
                             <tr key={i} className="hover:bg-slate-50/50">
                                <td className="px-6 py-3 text-sm font-bold text-primary">
                                   {['Unknown', 'A', 'NS', 'MD', 'MF', 'CNAME', 'SOA', 'MB', 'MG', 'MR', 'NULL', 'WKS', 'PTR', 'HINFO', 'MINFO', 'MX', 'TXT', 'RP', 'AFSDB', 'X25', 'ISDN', 'RT', 'NSAP', 'NSAP-PTR', 'SIG', 'KEY', 'PX', 'GPOS', 'AAAA', 'LOC', 'NXT', 'EID', 'NIMLOC', 'SRV', 'ATMA', 'NAPTR', 'KX', 'CERT', 'A6', 'DNAME', 'SINK', 'OPT', 'APL', 'DS', 'SSHFP', 'IPSECKEY', 'RRSIG', 'NSEC', 'DNSKEY', 'DHCID', 'NSEC3', 'NSEC3PARAM', 'TLSA', 'SMIMEA'][record.type] || record.type}
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-600">{record.name}</td>
                                <td className="px-6 py-3 text-sm text-slate-500">{record.TTL}</td>
                                <td className="px-6 py-3 text-sm font-mono text-slate-800 break-all">{record.data}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
