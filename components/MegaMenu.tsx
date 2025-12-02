import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Grid, ChevronDown } from "lucide-react";
import { ALL_TOOLS } from "../constants";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  // Get first tool path for each category
  const categoryToPath = useMemo(() => {
    const mapping: Record<string, string> = {};
    ALL_TOOLS.forEach((tool) => {
      if (!mapping[tool.category]) {
        mapping[tool.category] = tool.path;
      }
    });
    return mapping;
  }, []);

  // exact list provided by user, organized into columns for the mega menu
  const menuColumns = [
    [
      "IP Tools",
      "Formatters & Beautifiers",
      "Image Converter Tools",
      "Finance Tools",
      "TSV Tools",
      "JSON Tools",
      "XML Tools",
      "YAML Tools",
    ],
    [
      "HTML Tools",
      "CSS Tools",
      "Javascript Tools",
      "CSV Tools",
      "SQL Tools",
      "Color Tools",
      "Unit Tools",
      "Number Tools",
    ],
    [
      "String Tools",
      "Base64 Tools",
      "Random Tools",
      "Minifiers",
      "Validators",
      "Cryptography",
      "Escape Unescape Tools",
      "UTF Tools",
    ],
    [
      "Compress Decompress",
      "HTML Generators",
      "CSS Generators",
      "Other Tools",
      "Text Style Tools",
      "CSS Unit Converter Tools",
      "POJO Tools",
      "Twitter Tools",
      "Random Generators",
    ],
  ];

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[90vw] max-w-[900px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 transition-all duration-200 transform p-6 z-50 ${
        isOpen
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible translate-y-2"
      }`}
    >
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
          onClick={onClose}
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
                to={categoryToPath[category] || "/"}
                className="text-[13px] text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1.5 rounded-lg transition-colors truncate block"
                title={category}
                onClick={onClose}
              >
                {category}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
          Popular Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          {ALL_TOOLS.filter((t) => t.popular)
            .slice(0, 8)
            .map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
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
