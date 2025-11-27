
import React, { useState, useEffect } from 'react';
import { Regex, Flag, CheckCircle, XCircle } from 'lucide-react';

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('Contact us at support@example.com or sales@example.org for more info.');
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testRegex();
  }, [pattern, flags, text]);

  const testRegex = () => {
    try {
      if (!pattern) {
        setMatches([]);
        setError(null);
        return;
      }

      const regex = new RegExp(pattern, flags);
      const newMatches = [];
      
      // Prevent infinite loops with global flag missing but loop intention
      if (!regex.global && text.match(regex)) {
         const m = text.match(regex);
         if (m) newMatches.push({ index: m.index, value: m[0], groups: m.slice(1) });
      } else {
        let match;
        // Safety break counter
        let limit = 1000; 
        while ((match = regex.exec(text)) !== null) {
          newMatches.push({ index: match.index, value: match[0], groups: match.slice(1) });
          if (match.index === regex.lastIndex) regex.lastIndex++;
          if (--limit < 0) break;
        }
      }

      setMatches(newMatches);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setMatches([]);
    }
  };

  const highlightText = () => {
    if (!text || matches.length === 0) return text;

    let lastIndex = 0;
    const parts = [];

    matches.forEach((m, i) => {
       // Push text before match
       if (m.index > lastIndex) {
         parts.push(<span key={`pre-${i}`}>{text.substring(lastIndex, m.index)}</span>);
       }
       // Push match
       parts.push(
         <span key={`match-${i}`} className="bg-yellow-200 text-yellow-800 rounded px-0.5 font-bold border-b-2 border-yellow-400" title={`Match ${i+1}`}>
           {m.value}
         </span>
       );
       lastIndex = m.index + m.value.length;
    });

    // Push remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="post">{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) setFlags(flags.replace(f, ''));
    else setFlags(flags + f);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <Regex size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Regex Tester</h1>
              <p className="text-sm text-slate-500">Test and debug regular expressions (JS flavor)</p>
           </div>
        </div>

        <div className="p-6">
           {/* Controls */}
           <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2">Regular Expression</label>
              <div className="flex items-center gap-2 mb-4">
                 <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <span className="text-slate-400 font-mono text-lg">/</span>
                    <input 
                      type="text" 
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="flex-1 p-3 bg-transparent outline-none font-mono text-slate-800"
                      placeholder="Enter regex pattern..."
                    />
                    <span className="text-slate-400 font-mono text-lg">/</span>
                    <input 
                      type="text" 
                      value={flags}
                      onChange={(e) => setFlags(e.target.value)}
                      className="w-16 p-3 bg-transparent outline-none font-mono text-slate-600 font-bold"
                      placeholder="gims"
                    />
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                 {[
                   { char: 'g', label: 'Global' },
                   { char: 'i', label: 'Insensitive' },
                   { char: 'm', label: 'Multiline' },
                   { char: 's', label: 'Single Line' },
                   { char: 'u', label: 'Unicode' },
                 ].map(f => (
                   <button 
                     key={f.char}
                     onClick={() => toggleFlag(f.char)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center ${flags.includes(f.char) ? 'bg-blue-100 text-primary border-blue-200' : 'bg-white text-slate-500 border-gray-200 hover:border-gray-300'}`}
                   >
                     {flags.includes(f.char) ? <CheckCircle size={14} className="mr-1" /> : <Flag size={14} className="mr-1" />}
                     {f.label} ({f.char})
                   </button>
                 ))}
              </div>

              {error && (
                 <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center text-sm font-medium">
                    <XCircle size={16} className="mr-2" /> {error}
                 </div>
              )}
           </div>

           <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Text */}
              <div className="flex flex-col h-96">
                 <label className="block text-sm font-bold text-slate-700 mb-2">Test String</label>
                 <textarea 
                   value={text}
                   onChange={(e) => setText(e.target.value)}
                   className="flex-1 w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm leading-relaxed resize-none shadow-sm"
                   placeholder="Enter text to match against..."
                 />
              </div>

              {/* Match Results */}
              <div className="flex flex-col h-96">
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">Matches ({matches.length})</label>
                 </div>
                 <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                    {/* Visual Highlight Layer */}
                    <div className="p-4 bg-slate-50 border-b border-gray-100 h-1/2 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-500">
                        {highlightText()}
                    </div>
                    {/* Details List */}
                    <div className="flex-1 overflow-y-auto bg-white p-2">
                        {matches.length === 0 ? (
                           <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                              No matches found
                           </div>
                        ) : (
                           <table className="w-full text-sm text-left">
                              <thead className="bg-white text-slate-500 sticky top-0">
                                 <tr>
                                    <th className="p-2 font-medium">#</th>
                                    <th className="p-2 font-medium">Match</th>
                                    <th className="p-2 font-medium">Index</th>
                                    <th className="p-2 font-medium">Groups</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                 {matches.map((m, i) => (
                                    <tr key={i} className="hover:bg-blue-50/50">
                                       <td className="p-2 text-slate-400">{i+1}</td>
                                       <td className="p-2 font-mono font-bold text-slate-700">{m.value}</td>
                                       <td className="p-2 text-slate-500">{m.index}</td>
                                       <td className="p-2 text-slate-500">
                                          {m.groups && m.groups.length > 0 ? (
                                              <span className="flex flex-wrap gap-1">
                                                {m.groups.map((g: string, gi: number) => (
                                                    <span key={gi} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs border border-gray-200">{g}</span>
                                                ))}
                                              </span>
                                          ) : '-'}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
