
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check, Trash2 } from 'lucide-react';

export const ListComparator: React.FC = () => {
  const [listA, setListA] = useState('Apple\nBanana\nCherry\nDate');
  const [listB, setListB] = useState('Banana\nDate\nElderberry\nFig');
  
  const [aOnly, setAOnly] = useState<string[]>([]);
  const [bOnly, setBOnly] = useState<string[]>([]);
  const [intersection, setIntersection] = useState<string[]>([]);
  const [union, setUnion] = useState<string[]>([]);

  useEffect(() => {
    compare();
  }, [listA, listB]);

  const compare = () => {
    const setA = new Set(listA.split('\n').map(s => s.trim()).filter(Boolean));
    const setB = new Set(listB.split('\n').map(s => s.trim()).filter(Boolean));

    const intersectionRes = [...setA].filter(x => setB.has(x));
    const aOnlyRes = [...setA].filter(x => !setB.has(x));
    const bOnlyRes = [...setB].filter(x => !setA.has(x));
    const unionRes = Array.from(new Set([...setA, ...setB]));

    setIntersection(intersectionRes.sort());
    setAOnly(aOnlyRes.sort());
    setBOnly(bOnlyRes.sort());
    setUnion(unionRes.sort());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <ArrowRightLeft size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">List Comparator</h1>
                <p className="text-sm text-slate-500">Compare two lists (Intersection, Union, Difference)</p>
             </div>
           </div>
           <button onClick={() => {setListA(''); setListB('')}} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={20} />
           </button>
        </div>

        <div className="flex-1 overflow-hidden grid md:grid-cols-3">
            {/* Inputs Column */}
            <div className="col-span-1 p-6 border-r border-gray-200 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
                <div className="flex-1 flex flex-col min-h-[200px]">
                    <label className="text-sm font-bold text-slate-700 mb-2">List A</label>
                    <textarea 
                      value={listA} onChange={e => setListA(e.target.value)}
                      className="flex-1 w-full p-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      placeholder="One item per line..."
                    />
                </div>
                <div className="flex-1 flex flex-col min-h-[200px]">
                    <label className="text-sm font-bold text-slate-700 mb-2">List B</label>
                    <textarea 
                      value={listB} onChange={e => setListB(e.target.value)}
                      className="flex-1 w-full p-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      placeholder="One item per line..."
                    />
                </div>
            </div>

            {/* Results Column */}
            <div className="col-span-2 p-6 overflow-y-auto bg-white">
                <div className="grid grid-cols-2 gap-6 h-full">
                    <ResultBox title="A ∩ B (Intersection)" count={intersection.length} data={intersection} color="bg-blue-50 border-blue-200 text-blue-800" />
                    <ResultBox title="A ∪ B (Union)" count={union.length} data={union} color="bg-slate-50 border-gray-200 text-slate-800" />
                    <ResultBox title="A Only (A - B)" count={aOnly.length} data={aOnly} color="bg-orange-50 border-orange-200 text-orange-800" />
                    <ResultBox title="B Only (B - A)" count={bOnly.length} data={bOnly} color="bg-green-50 border-green-200 text-green-800" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ResultBox: React.FC<{title: string, count: number, data: string[], color: string}> = ({title, count, data, color}) => {
   const [copied, setCopied] = useState(false);
   const handleCopy = () => {
      navigator.clipboard.writeText(data.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div className={`rounded-xl border flex flex-col overflow-hidden ${color}`}>
         <div className="p-3 border-b border-inherit flex justify-between items-center bg-white/50">
            <span className="font-bold text-sm">{title} <span className="opacity-60 ml-1">({count})</span></span>
            <button onClick={handleCopy} className="p-1.5 hover:bg-white rounded-lg transition-colors">
               {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
         </div>
         <textarea 
            readOnly 
            value={data.join('\n')} 
            className="flex-1 w-full p-3 bg-transparent resize-none outline-none text-sm font-mono leading-relaxed"
         />
      </div>
   );
};
