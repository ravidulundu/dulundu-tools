import { useMemo, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { ALL_TOOLS } from '@/config/allTools';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
import { useToolHistory } from '@/hooks/useToolHistory';

import { Footer } from './Footer';
import { Header } from './Header';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { PwaInstallPrompt } from './PwaInstallPrompt';
import { QuickSearch } from './QuickSearch';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';
  const location = useLocation();
  const { trackUsage } = useToolHistory();
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  const closeQuickSearch = useCallback(() => setIsQuickSearchOpen(false), []);
  const closeShortcutsHelp = useCallback(() => setIsShortcutsHelpOpen(false), []);

  // Track tool usage when navigating to a tool page
  useEffect(() => {
    const tool = ALL_TOOLS.find(t => t.path === location.pathname);
    if (tool) {
      trackUsage(tool.id);
    }
  }, [location.pathname, trackUsage]);

  const shortcuts = useMemo(
    () => ({
      'mod+d': () => {
        toggleTheme();
      },
      'mod+k': () => {
        setIsQuickSearchOpen(prev => !prev);
      },
      'mod+/': () => {
        setIsShortcutsHelpOpen(prev => !prev);
      },
    }),
    [toggleTheme]
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        onShortcutsClick={() => setIsShortcutsHelpOpen(true)}
      />

      <main className="flex-grow min-h-[80vh]">{children}</main>

      <Footer />

      <QuickSearch isOpen={isQuickSearchOpen} onClose={closeQuickSearch} />
      <KeyboardShortcutsHelp isOpen={isShortcutsHelpOpen} onClose={closeShortcutsHelp} />
      <PwaInstallPrompt />
    </div>
  );
};
