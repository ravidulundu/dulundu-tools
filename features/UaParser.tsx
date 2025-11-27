
import React, { useState, useEffect } from 'react';
import { Monitor, Cpu, Globe, RefreshCw } from 'lucide-react';
import UAParser from 'ua-parser-js';

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
     setTimeout(parse, 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Monitor size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">User Agent Parser</h1>
                <p className="text-sm text-slate-500">Decode browser user agent strings</p>
             </div>
           </div>
        </div>

        <div className="p-8 space-y-8">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">User Agent String</label>
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={uaString} 
                   onChange={(e) => setUaString(e.target.value)}
                   className="flex-1 p-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                 />
                 <button onClick={parse} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-bold shadow-sm">
                    Parse
                 </button>
              </div>
              <button onClick={setToCurrent} className="mt-2 text-sm text-primary hover:underline flex items-center">
                 <RefreshCw size={12} className="mr-1" /> Use my current User Agent
              </button>
           </div>

           {result && (
              <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
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
                 
                 <div className="col-span-full bg-slate-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="font-bold text-slate-700 mb-4 border-b border-gray-200 pb-2">Engine</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <span className="text-xs text-slate-500 uppercase font-bold">Name</span>
                          <p className="font-mono text-slate-800">{result.engine.name || 'N/A'}</p>
                       </div>
                       <div>
                          <span className="text-xs text-slate-500 uppercase font-bold">Version</span>
                          <p className="font-mono text-slate-800">{result.engine.version || 'N/A'}</p>
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

const InfoCard: React.FC<{icon: any, title: string, data: {label: string, value: string}[]}> = ({icon: Icon, title, data}) => (
    <div className="bg-slate-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4 border-b border-gray-200 pb-2">
            <Icon size={18} className="text-slate-400" />
            <h3 className="font-bold text-slate-700">{title}</h3>
        </div>
        <div className="space-y-3">
            {data.map((item, i) => (
                <div key={i} className="flex justify-between">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-medium text-slate-800">{item.value || 'N/A'}</span>
                </div>
            ))}
        </div>
    </div>
);
