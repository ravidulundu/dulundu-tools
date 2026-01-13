import { ArrowRight, Command, Search } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ALL_TOOLS } from '@/config/allTools';
import { formatShortcut } from '@/hooks/useKeyboardShortcuts';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// Internal component that handles the search logic
// This component is only mounted when isOpen is true, guaranteeing fresh state
const QuickSearchContent: React.FC<Pick<QuickSearchProps, 'onClose'>> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter tools based on query
  const filteredTools = query.trim()
    ? ALL_TOOLS.filter(tool => {
        const q = query.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.tags?.some(tag => tag.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : ALL_TOOLS.filter(t => t.popular).slice(0, 8);

  // Focus input on mount
  useEffect(() => {
    // Small delay to ensure the modal is rendered and transition started
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  // Keep selected item in view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const selectedEl = list.children[selectedIndex] as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredTools.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          handleSelect(filteredTools[selectedIndex].path);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        onKeyDown={e => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="text-foreground-muted flex-shrink-0" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 py-4 bg-transparent text-foreground placeholder:text-foreground-muted outline-none text-lg"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-background-secondary text-foreground-muted text-xs rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto overscroll-contain">
          {filteredTools.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                {query ? 'Results' : 'Popular Tools'}
              </div>
              {filteredTools.map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={() => handleSelect(tool.path)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary text-white'
                      : 'hover:bg-background-secondary'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      index === selectedIndex ? 'bg-white/20' : 'bg-background-secondary'
                    }`}
                  >
                    <tool.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tool.name}</div>
                    <div
                      className={`text-sm truncate ${
                        index === selectedIndex ? 'text-white/70' : 'text-foreground-muted'
                      }`}
                    >
                      {tool.description}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`flex-shrink-0 ${
                      index === selectedIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-12 text-center text-foreground-muted">
              <Search size={32} className="mx-auto mb-3 opacity-50" />
              <p>No tools found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-t border-border text-xs text-foreground-muted bg-background-secondary/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-background-secondary rounded border border-border">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-background-secondary rounded border border-border">
                ↵
              </kbd>
              Open
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Command size={12} />
            <span>{formatShortcut('mod+k')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const QuickSearch: React.FC<QuickSearchProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <QuickSearchContent onClose={onClose} />;
};
