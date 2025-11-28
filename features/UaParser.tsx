import React, { useState, useEffect } from 'react';
import { Monitor, Cpu, Globe, RefreshCw, Search } from 'lucide-react';
import UAParser from 'ua-parser-js';
import { ToolHeader } from '../components/common/ToolHeader';

export const UaParser: React.FC = () => {
   const [uaString, setUaString] = useState(navigator.userAgent);
   const [result, setResult] = useState<any>(null);

   useEffect(() => {
      parse();
   }, []);

   const parse = () => {
      const parser = new UAParser(uaString);
      setResult(parser.getResult());
   };

   const setToCurrent = () => {
      setUaString(navigator.userAgent);
      setTimeout(() => {
         const parser = new UAParser(navigator.userAgent);
         setResult(parser.getResult());
      }, 0);
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

            <ToolHeader
               icon={Monitor}
               title="User Agent Parser"
               description="Decode browser user agent strings"
            />

            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex flex-col">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">User Agent String</label>
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={uaString}
                        onChange={(e) => setUaString(e.target.value)}
                        className="flex-1 p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm text-slate-700"
                        placeholder="Paste User Agent string here..."
                     />
                     <button onClick={parse} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-bold shadow-sm flex items-center">
                        <Search size={18} className="mr-2" /> Parse
                     </button>
                  </div>
                  <button onClick={setToCurrent} className="mt-2 text-xs font-medium text-primary hover:text-blue-700 hover:underline flex items-center">
                     <RefreshCw size={12} className="mr-1" /> Use my current User Agent
                  </button>
               </div>

               {result && (
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                     <div className="grid md:grid-cols-3 gap-6 animate-fade-in pb-4">
                        <InfoCard
                           icon={Globe}
                           title="Browser"
                           data={[
                              { label: 'Name', value: result.browser.name },
                              { label: 'Version', value: result.browser.version },
                              { label: 'Major', value: result.browser.major }
                           ]}
                        />
                        <InfoCard
                           icon={Monitor}
                           title="OS"
                           data={[
                              { label: 'Name', value: result.os.name },
                              { label: 'Version', value: result.os.version }
                           ]}
                        />
                        <InfoCard
                           icon={Cpu}
                           title="Device"
                           data={[
                              { label: 'Vendor', value: result.device.vendor },
                              { label: 'Model', value: result.device.model },
                              { label: 'Type', value: result.device.type || 'Desktop' },
                              { label: 'CPU', value: result.cpu.architecture }
                           ]}
                        />

                        <div className="col-span-full bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                           <h3 className="font-bold text-slate-700 mb-4 border-b border-gray-100 pb-2 flex items-center">
                              <Monitor size={18} className="mr-2 text-slate-400" /> Engine Details
                           </h3>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Name</span>
                                 <p className="font-mono text-slate-800 mt-1 bg-slate-50 p-2 rounded border border-gray-100">{result.engine.name || 'N/A'}</p>
                              </div>
                              <div>
                                 <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Version</span>
                                 <p className="font-mono text-slate-800 mt-1 bg-slate-50 p-2 rounded border border-gray-100">{result.engine.version || 'N/A'}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

const InfoCard: React.FC<{ icon: any, title: string, data: { label: string, value: string }[] }> = ({ icon: Icon, title, data }) => (
   <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-2">
         <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
            <Icon size={18} />
         </div>
         <h3 className="font-bold text-slate-700">{title}</h3>
      </div>
      <div className="space-y-3">
         {data.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
               <span className="text-sm text-slate-500 font-medium">{item.label}</span>
               <span className="text-sm font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-gray-100">{item.value || 'N/A'}</span>
            </div>
         ))}
      </div>
   </div>
);
