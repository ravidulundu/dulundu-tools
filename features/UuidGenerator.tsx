import React, { useState } from 'react';
import { Shuffle, RefreshCw, Copy, Check } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';
import { ActionButton } from '../components/common/ActionButton';

export const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const generateUUID = () => {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback for older browsers
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } catch (e) {
      return "Error generating UUID";
    }
  };

  const handleGenerate = () => {
    const newUuids = Array(count).fill(null).map(() => generateUUID());
    setUuids(newUuids);
    setCopied(false);
  };

  const handleCopy = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate on first load
  React.useEffect(() => {
    if (uuids.length === 0) handleGenerate();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <ToolHeader
          icon={Shuffle}
          title="UUID Generator"
          description="Generate Version 4 UUIDs (Universally Unique Identifiers)"
        />

        <div className="p-8">
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mb-8">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-slate-700 mb-2">Quantity (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full p-3 bg-white text-slate-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <button
              onClick={handleGenerate}
              className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center font-bold shadow-sm hover:shadow-md"
            >
              <RefreshCw size={20} className="mr-2" />
              Generate UUIDs
            </button>
          </div>

          <div className="relative group">
            <div className="absolute top-4 right-4 z-10">
              <ActionButton
                icon={copied ? Check : Copy}
                label={copied ? 'Copied' : 'Copy All'}
                onClick={handleCopy}
                variant={copied ? 'success' : 'primary'}
                size="sm"
              />
            </div>
            <div className="relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 border-b border-slate-700 flex items-center px-4 space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <textarea
                readOnly
                value={uuids.join('\n')}
                className="w-full h-96 p-6 pt-12 bg-[#1e293b] font-mono text-gray-50 text-base leading-relaxed resize-none outline-none"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};