import { Grid, Heart } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ALL_TOOLS } from '../constants';

interface MobileMenuProps {
  onClose: () => void;
  navLinks: { name: string; path: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, navLinks }) => {
  const location = useLocation();

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

  const menuColumns = [
    [
      'IP Tools',
      'Formatters & Beautifiers',
      'Image Converter Tools',
      'Finance Tools',
      'TSV Tools',
      'JSON Tools',
      'XML Tools',
      'YAML Tools',
    ],
    [
      'HTML Tools',
      'CSS Tools',
      'Javascript Tools',
      'CSV Tools',
      'SQL Tools',
      'Color Tools',
      'Unit Tools',
      'Number Tools',
    ],
    [
      'String Tools',
      'Base64 Tools',
      'Random Tools',
      'Minifiers',
      'Validators',
      'Cryptography',
      'Escape Unescape Tools',
      'UTF Tools',
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
      'Random Generators',
    ],
  ];

  return (
    <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg">
      <div className="container mx-auto px-4 py-4 max-h-[80vh] overflow-y-auto">
        {/* Mobile Nav Links */}
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={onClose}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
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
          {menuColumns.flat().map(category => (
            <Link
              key={category}
              to={categoryToPath[category] || '/'}
              onClick={onClose}
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
  );
};

export default MobileMenu;
