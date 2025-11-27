import React, { useState } from 'react';
import { ArrowRightLeft, Trash2 } from 'lucide-react';

export const DiffViewer: React.FC = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diff, setDiff] = useState<React.ReactNode[] | null>(null);

  // Simple line-by-line diff
  const computeDiff = () => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    // Very naive diff visualization for demo purposes
    const maxLines = Math.max(oldLines.length, newLines.length);
    const result = [];

    for (let i = 0; i < maxLines; i++) {
        const oldLine = oldLines[i] || '';
        const newLine = newLines[i] || '';

        if (oldLine === newLine) {
            result.push(
                <div key={i} className="flex border-b border-gray-100 hover:bg-gray-50 group">
                    <div className="w-12 p-1 text-right text-gray-400 text-xs select-none border-r border-gray-200 bg-gray-50 font-mono pr-2">{i + 1}</div>
                    <div className="flex-1 p-1 pl-4 font-mono text-sm text-slate-600 overflow-x-auto whitespace-pre">{oldLine}</div>
                </div>
            );
        } else {
            if (oldLine) {
                result.push(
                    <div key={`d-${i}`} className="flex bg-red-50/50 border-b border-red-100 hover:bg-red-50 transition-colors">
                        <div className="w-12 p-1 text-right text-red-400 text-xs select-none border-r border-red-200 bg-red-50 font-mono pr-2">-</div>
                        <div className="flex-1 p-1 pl-4 font-mono text-sm text-red-700 overflow-x-auto whitespace-pre">{oldLine}</div>
                    </div>
                );
            }
            if (newLine) {
                result.push(
                    <div key={`a-${i}`} className="flex bg-green-50/50 border-b border-green-100 hover:bg-green-50 transition-colors">
                        <div className="w-12 p-1 text-right text-green-400 text-xs select-none border-r border-green-200 bg-green-50 font-mono pr-2">+</div>
                        <div className="flex-1 p-1 pl-4 font-mono text-sm text-green-700 overflow-x-auto whitespace-pre">{newLine}</div>
                    </div>
                );
            }
        }
    }
    setDiff(result);
  };

  const handleClear = () => {
      setOldText('');
      setNewText('');
      setDiff(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <ArrowRightLeft size={24} />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Diff Viewer</h1>
                <p className="text-xs md:text-sm text-slate-500">Compare text files line by line</p>
             </div>
           </div>
           
           <div className="flex space-x-2">
               {diff && (
                   <button 
                   onClick={() => setDiff(null)} 
                   className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
                   >
                   Edit
                   </button>
               )}
               <button 
                onClick={handleClear} 
                className="px-3 py-2 bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm shadow-sm"
                title="Clear All"
               >
                   <Trash2 size={16} />
               </button>
               {!diff && (
                <button 
                    onClick={computeDiff} 
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold shadow-md text-sm"
                >
                    Compare Texts
                </button>
               )}
           </div>
        </div>

        {/* Input Area - Only show if no diff computed yet */}
        {!diff ? (
            <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
                <div className="grid md:grid-cols-2 gap-4 h-full">
                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Original Text</label>
                        <div className="flex-1 relative rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner overflow-hidden bg-white">
                            <textarea 
                                value={oldText} 
                                onChange={(e) => setOldText(e.target.value)}
                                className="w-full h-full p-4 resize-none outline-none font-mono text-sm text-slate-900 bg-white"
                                placeholder="Paste original text here..."
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Modified Text</label>
                        <div className="flex-1 relative rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner overflow-hidden bg-white">
                            <textarea 
                                value={newText} 
                                onChange={(e) => setNewText(e.target.value)}
                                className="w-full h-full p-4 resize-none outline-none font-mono text-sm text-slate-900 bg-white"
                                placeholder="Paste modified text here..."
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="p-2 bg-slate-100 border-b border-gray-200 flex justify-between items-center px-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comparison Result</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {diff}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};