import React from 'react';

import { Footer } from './Footer';
import { Header } from './Header';
import { useTheme } from '../contexts/ThemeContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />

      <main className="flex-grow min-h-[80vh]">{children}</main>

      <Footer />
    </div>
  );
};
