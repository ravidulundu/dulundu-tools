import { Keyboard, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

import { formatShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string;
  description: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: ShortcutItem[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Global',
    shortcuts: [
      { keys: 'mod+k', description: 'Open quick search' },
      { keys: 'mod+d', description: 'Toggle dark mode' },
      { keys: 'mod+/', description: 'Show keyboard shortcuts' },
      { keys: 'esc', description: 'Close modal / dialog' },
    ],
  },
  {
    title: 'Tool Actions',
    shortcuts: [
      { keys: 'mod+enter', description: 'Execute primary action' },
      { keys: 'mod+shift+c', description: 'Copy output' },
      { keys: 'mod+s', description: 'Download output' },
      { keys: 'mod+l', description: 'Clear input/output' },
    ],
  },
];

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        onKeyDown={e => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-light text-primary rounded-lg">
              <Keyboard size={20} />
            </div>
            <h2 className="text-lg font-bold text-foreground">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {SHORTCUT_GROUPS.map((group, groupIndex) => (
            <div key={group.title} className={groupIndex > 0 ? 'mt-6' : ''}>
              <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map(shortcut => (
                  <div
                    key={shortcut.keys}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-background-secondary transition-colors"
                  >
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-background-secondary border border-border rounded text-xs font-mono text-foreground-secondary">
                      {formatShortcut(shortcut.keys)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-background-secondary/50">
          <p className="text-xs text-foreground-muted text-center">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xxs">
              ESC
            </kbd>{' '}
            to close
          </p>
        </div>
      </div>
    </div>
  );
};
