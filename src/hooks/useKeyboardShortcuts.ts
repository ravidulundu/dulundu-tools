import { useEffect, useCallback, useRef } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  handler: ShortcutHandler;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

/**
 * Hook for handling keyboard shortcuts
 *
 * @example
 * // Simple shortcut map
 * useKeyboardShortcuts({
 *   'mod+k': () => openSearch(),
 *   'mod+d': () => toggleDarkMode(),
 *   'escape': () => closeModal(),
 * });
 *
 * @example
 * // With options
 * useKeyboardShortcuts(shortcuts, { enabled: isModalOpen });
 */
export function useKeyboardShortcuts(
  shortcuts: Record<string, ShortcutHandler>,
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;
  const shortcutsRef = useRef(shortcuts);

  // Keep shortcuts ref updated
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Skip if user is typing in an input/textarea (unless it's Escape)
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Build the key combination string
      const parts: string[] = [];

      if (event.ctrlKey || event.metaKey) {
        parts.push('mod');
      }
      if (event.shiftKey) {
        parts.push('shift');
      }
      if (event.altKey) {
        parts.push('alt');
      }

      // Normalize key names
      let key = event.key.toLowerCase();
      if (key === ' ') key = 'space';
      if (key === 'escape') key = 'esc';

      parts.push(key);

      const combo = parts.join('+');

      // Check if we have a handler for this combination
      const handler = shortcutsRef.current[combo];

      if (handler) {
        // Allow Escape and global navigation shortcuts even in input fields
        const isGlobalShortcut = combo === 'esc' || combo === 'mod+k';

        if (!isInputField || isGlobalShortcut) {
          event.preventDefault();
          handler(event);
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Parse a shortcut string and return normalized form
 * Supports: mod (ctrl/cmd), shift, alt, and any key
 */
export function parseShortcut(shortcut: string): ShortcutConfig | null {
  const parts = shortcut.toLowerCase().split('+');
  if (parts.length === 0) return null;

  const key = parts.pop();
  if (!key) return null;

  const modifiers = new Set(parts);

  return {
    key,
    ctrl: modifiers.has('mod') || modifiers.has('ctrl'),
    meta: modifiers.has('mod') || modifiers.has('cmd') || modifiers.has('meta'),
    shift: modifiers.has('shift'),
    alt: modifiers.has('alt'),
    handler: () => {},
    preventDefault: true,
  };
}

/**
 * Format a shortcut for display (platform-aware)
 */
export function formatShortcut(shortcut: string): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');

  return shortcut
    .split('+')
    .map(part => {
      const p = part.toLowerCase();
      if (p === 'mod') return isMac ? '⌘' : 'Ctrl';
      if (p === 'shift') return isMac ? '⇧' : 'Shift';
      if (p === 'alt') return isMac ? '⌥' : 'Alt';
      if (p === 'esc') return 'Esc';
      if (p === 'enter') return '↵';
      if (p === 'space') return 'Space';
      return p.toUpperCase();
    })
    .join(isMac ? '' : '+');
}
