import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Search, Menu, Sun, Moon, Github, MessageSquare, ChevronDown, Grid, X, Heart } from 'lucide-react';
import { ALL_TOOLS } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Assistant', path: '/ai-assistant' },
    { name: 'JSON Tools', path: '/json-formatter' },
  ];

  // Get first tool path for each category
  const categoryToPath = useMemo(() => {
    const mapping: Record<string, string> = {};
    ALL_TOOLS.forEach(tool => {
      if (!mapping[tool.category]) {
        mapping[tool.category] = tool.path;
      }
    });
    return mapping;
  }, []);

  // exact list provided by user, organized into columns for the mega menu
  const menuColumns = [
    [
      'IP Tools',
      'Formatters & Beautifiers',
      'Image Converter Tools',
      'Finance Tools',
      'TSV Tools',
      'JSON Tools',
      'XML Tools',
      'YAML Tools'
    ],
    [
      'HTML Tools',
      'CSS Tools',
      'Javascript Tools',
      'CSV Tools',
      'SQL Tools',
      'Color Tools',
      'Unit Tools',
      'Number Tools'
    ],
    [
      'String Tools',
      'Base64 Tools',
      'Random Tools',
      'Minifiers',
      'Validators',
      'Cryptography',
      'Escape Unescape Tools',
      'UTF Tools'
    ],
    [
      'Compress Decompress',
      'HTML Generators',
      'CSS Generators',
      'Other Tools',
      'Text Style Tools',
      'CSS Unit Converter Tools',
      'POJO Tools',
      'Twitter Tools',
      'Random Generators'
    ]
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm/50 transition-colors duration-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-blue-600 transition-colors shadow-sm">
              <Code2 size={22} />
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Dulundu<span className="text-primary">.tools</span></span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center justify-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Developer Tools Mega Menu */}
            <div
              className="relative px-4 py-2 cursor-pointer"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <span className="text-sm font-medium flex items-center text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                Developer Tools <ChevronDown size={14} className={`ml-1 opacity-70 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </span>

              {/* Mega Menu Dropdown */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[90vw] max-w-[900px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 transition-all duration-200 transform p-6 z-50 ${megaMenuOpen
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible translate-y-2'
                }`}>
                {/* Invisible bridge to prevent menu from closing when moving mouse from nav to menu */}
                <div className="absolute -top-4 left-0 w-full h-4"></div>

                <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                    <Grid size={18} className="mr-2 text-primary" />
                    All Categories
                  </h3>
                  <Link
                    to="/"
                    className="text-xs font-semibold text-primary hover:underline"
                    onClick={() => setMegaMenuOpen(false)}
                  >
                    View Full Directory &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-8">
                  {menuColumns.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col space-y-1">
                      {column.map((category) => (
                        <Link
                          key={category}
                          to={categoryToPath[category] || '/'}
                          className="text-[13px] text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1.5 rounded-lg transition-colors truncate block"
                          title={category}
                          onClick={() => setMegaMenuOpen(false)}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right: Actions (4 Icons: Github, Discord, Chat, Sun) */}
          <div className="flex items-center space-x-3 shrink-0">

            {/* Donate Button (Desktop) */}
            <a
              href="https://paypal.me/ravidulundu"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-2 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/40 rounded-lg transition-all text-sm font-bold mr-2 border border-pink-100 dark:border-pink-900/50"
              title="Support the project"
            >
              <Heart size={16} className="fill-current" />
              <span>Sponsor</span>
            </a>

            {/* Github */}
            <a
              href="https://github.com/ravidulundu/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              title="GitHub"
            >
              <Github size={20} />
            </a>

            {/* Discussions */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              title="Discussions"
            >
              <MessageSquare size={20} />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-yellow-400 hover:bg-orange-50 dark:hover:bg-yellow-400/10 rounded-lg transition-all"
              title="Toggle Theme"
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg ml-1"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg">
            <div className="container mx-auto px-4 py-4 max-h-[80vh] overflow-y-auto">
              {/* Mobile Nav Links */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-primary font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Categories */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center mb-3">
                  <Grid size={18} className="mr-2 text-primary" />
                  All Categories
                </h3>
                {menuColumns.flat().map((category) => (
                  <Link
                    key={category}
                    to={categoryToPath[category] || '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>

              {/* Mobile Donate */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                <a
                  href="https://paypal.me/ravidulundu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl font-bold hover:bg-pink-100 transition-colors"
                >
                  <Heart size={18} className="mr-2 fill-current" />
                  Sponsor Project
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-auto transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code2 size={20} className="text-primary" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  Dulundu.tools
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Free online tools for developers. Beautifiers, minifiers, converters, and AI utilities to speed up your workflow.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Popular</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/json-formatter" className="hover:text-primary dark:hover:text-primary">JSON Formatter</Link></li>
                <li><Link to="/base64-converter" className="hover:text-primary dark:hover:text-primary">Base64 Encode/Decode</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-primary dark:hover:text-primary">AI Code Assistant</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/?category=Formatters%20%26%20Beautifiers" className="hover:text-primary dark:hover:text-primary">Formatters</Link></li>
                <li><Link to="/?category=Generators" className="hover:text-primary dark:hover:text-primary">Generators</Link></li>
                <li><Link to="/?category=Converters" className="hover:text-primary dark:hover:text-primary">Converters</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="https://paypal.me/ravidulundu" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 dark:hover:text-pink-400 flex items-center font-medium text-pink-600 dark:text-pink-400">
                    <Heart size={14} className="mr-1.5 fill-current" /> Donate
                  </a>
                </li>
                <li><Link to="/coming-soon" className="hover:text-primary dark:hover:text-primary">Contact Us</Link></li>
                <li><Link to="/coming-soon" className="hover:text-primary dark:hover:text-primary">Report Bug</Link></li>
                <li><Link to="/coming-soon" className="hover:text-primary dark:hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} Dulundu.tools. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span>Made with ❤️ by Developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};