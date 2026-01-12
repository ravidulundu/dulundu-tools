import { useMemo } from 'react';

import { useKeyboardShortcuts } from './useKeyboardShortcuts';

interface UseToolShortcutsOptions {
  onExecute?: () => void;
  onClear?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
}

/**
 * Hook for tool-specific keyboard shortcuts
 *
 * Shortcuts:
 * - Ctrl+Enter: Execute primary action
 * - Ctrl+L: Clear input/output
 * - Ctrl+S: Download output
 * - Ctrl+Shift+C: Copy output
 *
 * @example
 * useToolShortcuts({
 *   onExecute: () => processJson('beautify'),
 *   onClear: handleClear,
 *   onCopy: handleCopy,
 *   onDownload: () => handleDownload('output.json'),
 * });
 */
export function useToolShortcuts(options: UseToolShortcutsOptions) {
  const { onExecute, onClear, onCopy, onDownload } = options;

  const shortcuts = useMemo(() => {
    const map: Record<string, () => void> = {};

    if (onExecute) {
      map['mod+enter'] = onExecute;
    }

    if (onClear) {
      map['mod+l'] = onClear;
    }

    if (onCopy) {
      map['mod+shift+c'] = onCopy;
    }

    if (onDownload) {
      map['mod+s'] = onDownload;
    }

    return map;
  }, [onExecute, onClear, onCopy, onDownload]);

  useKeyboardShortcuts(shortcuts);
}
