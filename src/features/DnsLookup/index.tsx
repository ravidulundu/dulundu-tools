import React, { useState } from 'react';
import { Search, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';

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
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={Globe}
               title="DNS Lookup"
               description="Check DNS records for any domain"
            />

            {/* Toolbar */}
            <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
               <div className="flex-1 flex items-center gap-2 max-w-2xl">
                  <div className="relative flex-1">
                     <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="example.com"
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                     />
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>

                  <select
                     value={type}
                     onChange={(e) => setType(e.target.value as DnsType)}
                     className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-700 text-sm"
                  >
                     {['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'].map(t => (
                        <option key={t} value={t}>{t}</option>
                     ))}
                  </select>

                  <button
                     onClick={lookup}
                     disabled={loading || !domain}
                     className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                  >
                     {loading ? <RefreshCw className="animate-spin mr-2" size={16} /> : 'Lookup'}
                  </button>
               </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
               <div className="max-w-5xl mx-auto space-y-4">
                  {error && (
                     <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={20} className="mr-2" />
                        {error}
                     </div>
                  )}

                  {results.length > 0 ? (
                     <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                 <tr>
                                    <th className="px-6 py-3 border-b border-gray-100">Type</th>
                                    <th className="px-6 py-3 border-b border-gray-100">Name</th>
                                    <th className="px-6 py-3 border-b border-gray-100">TTL</th>
                                    <th className="px-6 py-3 border-b border-gray-100">Data</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 bg-white">
                                 {results.map((record, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
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
                     </div>
                  ) : (
                     !loading && !error && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                           <Globe size={48} className="mb-4 opacity-20" />
                           <p>Enter a domain to lookup DNS records</p>
                        </div>
                     )
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
