
import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Check, Copy } from 'lucide-react';

export const CronGenerator: React.FC = () => {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [week, setWeek] = useState('*');
  const [copied, setCopied] = useState(false);

  const expression = `${minute} ${hour} ${day} ${month} ${week}`;
  
  const humanReadable = () => {
    // Very basic descriptive text
    if (expression === '* * * * *') return 'Every minute';
    if (minute === '0' && hour === '*' && day === '*' && month === '*' && week === '*') return 'Every hour';
    if (minute === '0' && hour === '0' && day === '*' && month === '*' && week === '*') return 'At 00:00 every day';
    
    let desc = 'At ';
    if (minute !== '*' && hour !== '*') desc += `${hour}:${minute.padStart(2, '0')} `;
    else if (minute !== '*') desc += `minute ${minute} `;
    else desc += 'every minute ';
    
    if (day !== '*') desc += `on day ${day} of month `;
    if (week !== '*') desc += `on day of week ${week} `;
    
    return desc;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Clock size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Cron Generator</h1>
              <p className="text-sm text-slate-500">Schedule tasks visually</p>
           </div>
        </div>

        <div className="p-8">
           <div className="bg-slate-900 rounded-2xl p-8 mb-8 text-center relative group">
              <div className="text-5xl font-mono font-bold text-white mb-2 tracking-widest">{expression}</div>
              <p className="text-slate-400 font-medium">{humanReadable()}</p>
              <button 
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
               >
                  {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
               </button>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {[
                   { label: 'Minute', val: minute, set: setMinute, range: '0-59' },
                   { label: 'Hour', val: hour, set: setHour, range: '0-23' },
                   { label: 'Day', val: day, set: setDay, range: '1-31' },
                   { label: 'Month', val: month, set: setMonth, range: '1-12' },
                   { label: 'Week', val: week, set: setWeek, range: '0-6 (Sun-Sat)' },
               ].map((field) => (
                   <div key={field.label} className="bg-slate-50 p-4 rounded-xl border border-gray-200">
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-center">{field.label}</label>
                       <input 
                         type="text" 
                         value={field.val} 
                         onChange={(e) => field.set(e.target.value)}
                         className="w-full text-center p-2 bg-white border border-gray-300 rounded-lg font-bold text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                       />
                       <p className="text-[10px] text-center text-slate-400 mt-2">{field.range}</p>
                   </div>
               ))}
           </div>
           
           <div className="mt-8 flex flex-wrap gap-2 justify-center">
               <button onClick={() => {setMinute('*'); setHour('*'); setDay('*'); setMonth('*'); setWeek('*')}} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Every Minute</button>
               <button onClick={() => {setMinute('0'); setHour('*'); setDay('*'); setMonth('*'); setWeek('*')}} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Hourly</button>
               <button onClick={() => {setMinute('0'); setHour('0'); setDay('*'); setMonth('*'); setWeek('*')}} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Daily (Midnight)</button>
               <button onClick={() => {setMinute('0'); setHour('0'); setDay('*'); setMonth('*'); setWeek('0')}} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Weekly (Sunday)</button>
           </div>
        </div>
      </div>
    </div>
  );
};
