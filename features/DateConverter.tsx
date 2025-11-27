
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';

export const DateConverter: React.FC = () => {
  // Store timestamp in seconds for easy manipulation, but handle ms input
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const [iso, setIso] = useState('');
  const [local, setLocal] = useState('');
  const [utc, setUtc] = useState('');
  
  useEffect(() => {
    updateFromTs(timestamp);
  }, []);

  const updateFromTs = (ts: number) => {
    setTimestamp(ts);
    const date = new Date(ts * 1000);
    setIso(date.toISOString());
    setLocal(date.toLocaleString());
    setUtc(date.toUTCString());
  };

  const handleTsChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num)) {
       // Heuristic to detect milliseconds vs seconds (if > 100 billion, probably ms)
       if (num > 100000000000) {
           updateFromTs(Math.floor(num / 1000));
       } else {
           updateFromTs(num);
       }
    }
  };

  const handleIsoChange = (val: string) => {
      setIso(val);
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
          updateFromTs(Math.floor(date.getTime() / 1000));
      }
  };

  const setToNow = () => {
    updateFromTs(Math.floor(Date.now() / 1000));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Calendar size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Date & Epoch Converter</h1>
                <p className="text-sm text-slate-500">Convert between Unix Timestamps and Human Dates</p>
             </div>
           </div>
           <button onClick={setToNow} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-600 transition-colors">
              <Clock size={16} /> <span>Now</span>
           </button>
        </div>

        <div className="p-8 space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
               {/* Epoch Input */}
               <div className="bg-slate-50 p-6 rounded-xl border border-gray-200">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Unix Timestamp (Seconds)</label>
                  <div className="flex gap-2">
                     <input 
                        type="number" 
                        value={timestamp}
                        onChange={(e) => handleTsChange(e.target.value)}
                        className="flex-1 p-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg"
                     />
                     <button onClick={() => updateFromTs(timestamp)} className="p-3 bg-primary text-white rounded-lg hover:bg-blue-600">
                        <RefreshCw size={20} />
                     </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Supports seconds or milliseconds (auto-detected)</p>
               </div>

               {/* ISO Input */}
               <div className="bg-slate-50 p-6 rounded-xl border border-gray-200">
                  <label className="block text-sm font-bold text-slate-700 mb-2">ISO 8601 Date</label>
                  <input 
                     type="text" 
                     value={iso}
                     onChange={(e) => handleIsoChange(e.target.value)}
                     className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg"
                     placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                  />
                  <p className="text-xs text-slate-500 mt-2">Standard exchange format</p>
               </div>
           </div>

           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-gray-200 font-bold text-slate-700">Converted Results</div>
               <div className="divide-y divide-gray-100">
                   <div className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50">
                       <span className="text-sm font-medium text-slate-500 mb-1 md:mb-0">Local Time</span>
                       <span className="font-mono text-slate-800 font-bold text-lg">{local}</span>
                   </div>
                   <div className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50">
                       <span className="text-sm font-medium text-slate-500 mb-1 md:mb-0">UTC / GMT</span>
                       <span className="font-mono text-slate-800 font-bold text-lg">{utc}</span>
                   </div>
                   <div className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50">
                       <span className="text-sm font-medium text-slate-500 mb-1 md:mb-0">Unix Timestamp (Milliseconds)</span>
                       <span className="font-mono text-slate-800 font-bold text-lg">{timestamp * 1000}</span>
                   </div>
                   <div className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50">
                       <span className="text-sm font-medium text-slate-500 mb-1 md:mb-0">Relative</span>
                       <span className="font-mono text-slate-800 font-bold text-lg">
                           {(() => {
                               const diff = Date.now() - (timestamp * 1000);
                               const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
                               if (Math.abs(diff) < 1000) return 'Just now';
                               if (Math.abs(diff) < 60000) return rtf.format(-Math.round(diff/1000), 'seconds');
                               if (Math.abs(diff) < 3600000) return rtf.format(-Math.round(diff/60000), 'minutes');
                               if (Math.abs(diff) < 86400000) return rtf.format(-Math.round(diff/3600000), 'hours');
                               return rtf.format(-Math.round(diff/86400000), 'days');
                           })()}
                       </span>
                   </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
