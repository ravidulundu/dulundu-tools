import { Code2, Github, Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto transition-colors duration-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-light p-2 rounded-lg">
                <Code2 size={24} className="text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Dulundu<span className="text-primary">.tools</span>
              </span>
            </div>
            <p className="text-foreground-muted text-sm leading-relaxed">
              The ultimate suite of developer utilities. Beautify, convert, generate, and debug with
              our collection of 95+ free tools.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Popular Tools</h4>
            <ul className="space-y-3 text-sm text-foreground-secondary">
              <li>
                <Link
                  to="/json-formatter"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  to="/base64-converter"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  Base64 Converter
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-assistant"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  AI Code Assistant
                </Link>
              </li>
              <li>
                <Link
                  to="/sql-formatter"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  SQL Formatter
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Explore</h4>
            <ul className="space-y-3 text-sm text-foreground-secondary">
              <li>
                <Link
                  to="/?category=Formatters%20%26%20Beautifiers"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  Formatters & Beautifiers
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=JSON%20Tools"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  JSON Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Converters"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  Converters
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Cryptography"
                  className="hover:text-primary transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle mr-2 group-hover:bg-primary transition-colors"></span>
                  Cryptography
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-foreground-secondary">
              <li>
                <a
                  href="https://donate.stripe.com/6oU6oG537fBTbW94Lig7e00"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.umami?.track('Donate Footer Click')}
                  className="inline-flex items-center space-x-2 bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm"
                >
                  <Heart size={16} className="text-danger fill-current" />
                  <span>Donate via Stripe</span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://github.com/ravidulundu/dulundu-tools/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Contact / Feedback
                </a>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground-muted">
          <p>&copy; {new Date().getFullYear()} Dulundu.tools. Free for Developers.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a
              href="https://github.com/ravidulundu/dulundu-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
            <span className="flex items-center">
              Made with{' '}
              <span className="inline-flex items-center justify-center w-4 h-4 mx-1">
                <Heart size={14} className="text-danger fill-current animate-pulse" />
              </span>{' '}
              by Developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
