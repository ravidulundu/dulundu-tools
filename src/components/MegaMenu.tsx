import { Grid } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ALL_TOOLS } from '../constants';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
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
      'Finance Tools',
      'Formatters & Beautifiers',
      'Image Converter Tools',
      'IP Tools',
      'JSON Tools',
      'TSV Tools',
      'XML Tools',
      'YAML Tools',
    ],
    [
      'Color Tools',
      'CSV Tools',
      'CSS Tools',
      'HTML Tools',
      'Javascript Tools',
      'Number Tools',
      'SQL Tools',
      'Unit Tools',
    ],
    [
      'Base64 Tools',
      'Cryptography',
      'Escape Unescape Tools',
      'Minifiers',
      'Random Tools',
      'String Tools',
      'UTF Tools',
      'Validators',
    ],
    [
      'Compress Decompress',
      'CSS Generators',
      'CSS Unit Converter Tools',
      'HTML Generators',
      'Other Tools',
      'POJO Tools',
      'Random Generators',
      'Text Style Tools',
      'Twitter Tools',
    ],
  ];

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[90vw] max-w-[900px] bg-card rounded-xl shadow-2xl border border-border transition-all duration-200 transform p-6 z-50 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
      }`}
    >
      {/* Invisible bridge to prevent menu from closing when moving mouse from nav to menu */}
      <div className="absolute -top-4 left-0 w-full h-4"></div>

      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h3 className="font-bold text-foreground flex items-center">
          <Grid size={18} className="mr-2 text-primary" />
          All Categories
        </h3>
        <Link
          to="/"
          className="text-xs font-semibold text-primary hover:underline"
          onClick={onClose}
        >
          View Full Directory &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-8">
        {menuColumns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col space-y-1">
            {column.map(category => (
              <Link
                key={category}
                to={categoryToPath[category] || '/'}
                className="text-[13px] text-foreground-secondary hover:text-primary hover:bg-primary-light px-2 py-1.5 rounded-lg transition-colors truncate block"
                title={category}
                onClick={onClose}
              >
                {category}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-2">
          Popular Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          {ALL_TOOLS.filter(t => t.popular)
            .slice(0, 8)
            .map(tool => (
              <Link
                key={tool.id}
                to={tool.path}
                className="text-xs bg-background-secondary text-foreground-secondary px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={onClose}
              >
                {tool.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
