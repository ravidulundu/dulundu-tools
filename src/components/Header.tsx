import { Code2, Menu, Sun, Moon, Github, MessageSquare, ChevronDown, X, Heart, Keyboard } from 'lucide-react';
import React, { useState, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { formatShortcut } from '@/hooks/useKeyboardShortcuts';

const MegaMenu = React.lazy(() => import('./MegaMenu'));
const MobileMenu = React.lazy(() => import('./MobileMenu'));

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onShortcutsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme, onShortcutsClick }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Assistant', path: '/ai-assistant' },
    { name: 'JSON Tools', path: '/json-formatter' },
    { name: 'Readme Generator', path: '/readme-generator' },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm/50 transition-colors duration-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2 group shrink-0">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            <Code2 size={22} />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Dulundu<span className="text-primary">.tools</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center justify-center space-x-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-light text-primary font-semibold'
                    : 'text-foreground-secondary hover:text-primary hover:bg-background-secondary'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Developer Tools Mega Menu */}
          <button
            className="relative px-4 py-2 cursor-pointer bg-transparent border-none"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            aria-expanded={megaMenuOpen}
            type="button"
          >
            <span className="text-sm font-medium flex items-center text-foreground-secondary hover:text-primary transition-colors">
              Developer Tools{' '}
              <ChevronDown
                size={14}
                className={`ml-1 opacity-70 transition-transform ${
                  megaMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </span>

            {/* Mega Menu Dropdown */}
            <Suspense fallback={null}>
              {megaMenuOpen && (
                <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
              )}
            </Suspense>
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Donate Button (Desktop) */}
          <a
            href="https://donate.stripe.com/6oU6oG537fBTbW94Lig7e00"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => window.umami?.track('Donate Header Click')}
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-sm"
            title="Support the project"
          >
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span>Sponsor</span>
          </a>

          {/* Github */}
          <a
            href="https://github.com/ravidulundu/dulundu-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-secondary rounded-lg transition-all"
            title="GitHub"
          >
            <Github size={20} />
          </a>

          {/* Discussions */}
          <button
            onClick={() => window.open('#', '_blank')}
            className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-secondary rounded-lg transition-all"
            title="Discussions"
            type="button"
          >
            <MessageSquare size={20} />
          </button>

          {/* Keyboard Shortcuts */}
          {onShortcutsClick && (
            <button
              onClick={onShortcutsClick}
              className="hidden md:flex p-2 text-foreground-muted hover:text-primary hover:bg-primary-light rounded-lg transition-all"
              title={`Keyboard Shortcuts (${formatShortcut('mod+/')})`}
            >
              <Keyboard size={20} />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-foreground-muted hover:text-warning hover:bg-warning-light rounded-lg transition-all"
            title={`Toggle Theme (${formatShortcut('mod+d')})`}
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground-secondary hover:bg-background-secondary rounded-lg ml-1"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Suspense fallback={null}>
        {mobileMenuOpen && (
          <MobileMenu onClose={() => setMobileMenuOpen(false)} navLinks={navLinks} />
        )}
      </Suspense>
    </header>
  );
};
