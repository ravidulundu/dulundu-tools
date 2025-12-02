import React, { useState, useEffect } from "react";
import { Regex, Flag, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ToolHeader } from "@/components/common/ToolHeader";
import { CodeEditor } from "@/components/common/CodeEditor";
import { Button } from "@/components/common/Button";

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState(
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
  );
  const [flags, setFlags] = useState("gm");
  const [text, setText] = useState(
    "Contact us at support@example.com or sales@example.org for more info."
  );
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

      if (!regex.global && text.match(regex)) {
        const m = text.match(regex);
        if (m)
          newMatches.push({ index: m.index, value: m[0], groups: m.slice(1) });
      } else {
        let match;
        let limit = 1000;
        while ((match = regex.exec(text)) !== null) {
          newMatches.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1),
          });
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
      if (m.index > lastIndex) {
        parts.push(
          <span key={`pre-${i}`}>{text.substring(lastIndex, m.index)}</span>
        );
      }
      parts.push(
        <span
          key={`match-${i}`}
          className="bg-yellow-200 text-yellow-800 rounded px-0.5 font-bold border-b-2 border-yellow-400"
          title={`Match ${i + 1}`}
        >
          {m.value}
        </span>
      );
      lastIndex = m.index + m.value.length;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="post">{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) setFlags(flags.replace(f, ""));
    else setFlags(flags + f);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Regex}
          title="Regex Tester"
          description="Test and debug regular expressions (JS flavor)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <span className="text-slate-400 font-mono text-lg select-none">
                /
              </span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 p-2 bg-transparent outline-none font-mono text-slate-800 text-sm"
                placeholder="Enter regex pattern..."
              />
              <span className="text-slate-400 font-mono text-lg select-none">
                /
              </span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-12 p-2 bg-transparent outline-none font-mono text-slate-600 font-bold text-sm"
                placeholder="gims"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { char: "g", label: "Global" },
              { char: "i", label: "Insensitive" },
              { char: "m", label: "Multiline" },
              { char: "s", label: "Single Line" },
              { char: "u", label: "Unicode" },
            ].map((f) => (
              <Button
                key={f.char}
                onClick={() => toggleFlag(f.char)}
                variant={flags.includes(f.char) ? "primary" : "outline"}
                size="sm"
                icon={flags.includes(f.char) ? CheckCircle : Flag}
                className={
                  flags.includes(f.char)
                    ? "bg-blue-100 text-primary border-blue-200 hover:bg-blue-200"
                    : ""
                }
              >
                {f.label} ({f.char})
              </Button>
            ))}
          </div>

          {error && (
            <div className="flex items-center text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input Text */}
            <CodeEditor
              value={text}
              onChange={setText}
              label="Test String"
              placeholder="Enter text to match against..."
              theme="light"
            />

            {/* Match Results */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  Matches ({matches.length})
                </label>
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-gray-100 h-1/2 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-500 custom-scrollbar">
                  {highlightText()}
                </div>
                <div className="flex-1 overflow-y-auto bg-white p-0 custom-scrollbar">
                  {matches.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                      No matches found
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-white text-slate-500 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="p-3 font-medium border-b border-gray-100 w-12 text-center">
                            #
                          </th>
                          <th className="p-3 font-medium border-b border-gray-100">
                            Match
                          </th>
                          <th className="p-3 font-medium border-b border-gray-100 w-20">
                            Index
                          </th>
                          <th className="p-3 font-medium border-b border-gray-100">
                            Groups
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {matches.map((m, i) => (
                          <tr
                            key={i}
                            className="hover:bg-blue-50/50 transition-colors group"
                          >
                            <td className="p-3 text-slate-400 text-center font-mono text-xs">
                              {i + 1}
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-700 break-all">
                              {m.value}
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-xs">
                              {m.index}
                            </td>
                            <td className="p-3 text-slate-500">
                              {m.groups && m.groups.length > 0 ? (
                                <span className="flex flex-wrap gap-1">
                                  {m.groups.map((g: string, gi: number) => (
                                    <span
                                      key={gi}
                                      className="px-1.5 py-0.5 bg-gray-100 rounded text-xs border border-gray-200 font-mono text-slate-600"
                                    >
                                      {g}
                                    </span>
                                  ))}
                                </span>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
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
