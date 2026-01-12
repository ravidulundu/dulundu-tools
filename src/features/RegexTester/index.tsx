import { AlertCircle, CheckCircle, Flag, Regex } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/common/Button';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

interface Match {
  index: number;
  value: string;
  groups: string[];
}

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState(
    'Contact us at support@example.com or sales@example.org for more info.'
  );
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ReDoS Protection Constants
  const MAX_PATTERN_LENGTH = 500;
  const MAX_TEXT_LENGTH = 50000;
  const MAX_MATCHES = 1000;
  const REGEX_TIMEOUT_MS = 3000;

  useEffect(() => {
    const testRegex = () => {
      try {
        if (!pattern) {
          setMatches([]);
          setError(null);
          return;
        }

        // ReDoS Protection: Pattern length limit
        if (pattern.length > MAX_PATTERN_LENGTH) {
          setError(`Pattern too long (max ${MAX_PATTERN_LENGTH} characters)`);
          setMatches([]);
          return;
        }

        // ReDoS Protection: Text length limit
        if (text.length > MAX_TEXT_LENGTH) {
          setError(`Text too long (max ${MAX_TEXT_LENGTH} characters)`);
          setMatches([]);
          return;
        }

        const regex = new RegExp(pattern, flags);
        const newMatches: Match[] = [];

        // Execute regex with timeout protection
        const startTime = performance.now();

        if (!regex.global && text.match(regex)) {
          const m = text.match(regex);
          if (m && m.index !== undefined) {
            newMatches.push({ index: m.index, value: m[0], groups: m.slice(1) });
          }
        } else {
          let match;
          let limit = MAX_MATCHES;
          while ((match = regex.exec(text)) !== null) {
            // ReDoS Protection: Timeout check
            if (performance.now() - startTime > REGEX_TIMEOUT_MS) {
              setError('Regex execution timeout - pattern may be too complex');
              setMatches([]);
              return;
            }

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

    testRegex();
  }, [pattern, flags, text]);

  const highlightText = () => {
    if (!text || matches.length === 0) return text;

    let lastIndex = 0;
    const parts = [];

    matches.forEach((m, i) => {
      if (m.index > lastIndex) {
        parts.push(<span key={`pre-${i}`}>{text.substring(lastIndex, m.index)}</span>);
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
    if (flags.includes(f)) setFlags(flags.replace(f, ''));
    else setFlags(flags + f);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Regex}
          title="Regex Tester"
          description="Test and debug regular expressions (JS flavor)"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-card border border-border rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <span className="text-foreground-muted font-mono text-lg select-none">/</span>
              <input
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                className="flex-1 p-2 bg-transparent outline-none font-mono text-foreground text-sm"
                placeholder="Enter regex pattern..."
              />
              <span className="text-foreground-muted font-mono text-lg select-none">/</span>
              <input
                type="text"
                value={flags}
                onChange={e => setFlags(e.target.value)}
                className="w-12 p-2 bg-transparent outline-none font-mono text-foreground-secondary font-bold text-sm"
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
              <Button
                key={f.char}
                onClick={() => toggleFlag(f.char)}
                variant={flags.includes(f.char) ? 'primary' : 'outline'}
                size="sm"
                icon={flags.includes(f.char) ? CheckCircle : Flag}
                className={
                  flags.includes(f.char)
                    ? 'bg-primary-light text-primary border-border hover:bg-primary-hover'
                    : ''
                }
              >
                {f.label} ({f.char})
              </Button>
            ))}
          </div>

          {error && (
            <div className="flex items-center text-danger text-sm font-medium bg-danger-light px-3 py-2 rounded-lg border border-border animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
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
                <label className="block text-sm font-bold text-foreground-secondary">
                  Matches ({matches.length})
                </label>
              </div>
              <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 bg-background-secondary border-b border-border h-1/2 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground-muted custom-scrollbar">
                  {highlightText()}
                </div>
                <div className="flex-1 overflow-y-auto bg-card p-0 custom-scrollbar">
                  {matches.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-foreground-muted text-sm italic">
                      No matches found
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-card text-foreground-muted sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="p-3 font-medium border-b border-border w-12 text-center">
                            #
                          </th>
                          <th className="p-3 font-medium border-b border-border">Match</th>
                          <th className="p-3 font-medium border-b border-border w-20">Index</th>
                          <th className="p-3 font-medium border-b border-border">Groups</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {matches.map((m, i) => (
                          <tr key={i} className="hover:bg-primary-light/50 transition-colors group">
                            <td className="p-3 text-foreground-muted text-center font-mono text-xs">
                              {i + 1}
                            </td>
                            <td className="p-3 font-mono font-bold text-foreground-secondary break-all">
                              {m.value}
                            </td>
                            <td className="p-3 text-foreground-muted font-mono text-xs">
                              {m.index}
                            </td>
                            <td className="p-3 text-foreground-muted">
                              {m.groups && m.groups.length > 0 ? (
                                <span className="flex flex-wrap gap-1">
                                  {m.groups.map((g: string, gi: number) => (
                                    <span
                                      key={gi}
                                      className="px-1.5 py-0.5 bg-background-secondary rounded text-xs border border-border font-mono text-foreground-secondary"
                                    >
                                      {g}
                                    </span>
                                  ))}
                                </span>
                              ) : (
                                <span className="text-foreground-muted">-</span>
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
