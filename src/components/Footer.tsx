import { Code2, Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-auto transition-colors duration-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                <Code2 size={24} className="text-primary" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Dulundu<span className="text-primary">.tools</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              The ultimate suite of developer utilities. Beautify, convert, generate, and debug with
              our collection of 100+ free tools.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Popular Tools</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/json-formatter"
                  className="hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2 group-hover:bg-primary transition-colors"></span>
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  to="/base64-converter"
                  className="hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2 group-hover:bg-primary transition-colors"></span>
                  Base64 Converter
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-assistant"
                  className="hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2 group-hover:bg-primary transition-colors"></span>
                  AI Code Assistant
                </Link>
              </li>
              <li>
                <Link
                  to="/sql-formatter"
                  className="hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2 group-hover:bg-primary transition-colors"></span>
                  SQL Formatter
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Explore</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/?category=Formatters%20%26%20Beautifiers"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Formatters & Beautifiers
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Generators"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Generators
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Converters"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Converters
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Cryptography"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Cryptography
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://donate.stripe.com/6oU6oG537fBTbW94Lig7e00"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.umami?.track('Donate Footer Click')}
                  className="inline-flex items-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  <Heart size={16} className="text-red-400 fill-red-400" />
                  <span>Donate via Stripe</span>
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/coming-soon"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} Dulundu.tools. Free for Developers.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="flex items-center">
              Made with{' '}
              <span className="inline-flex items-center justify-center w-4 h-4 mx-1">
                <Heart size={14} className="text-red-500 fill-current animate-pulse" />
              </span>{' '}
              by Developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
