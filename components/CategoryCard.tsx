import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

interface CategoryCardProps {
  category: string;
  toolCount: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, toolCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden w-full text-left"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 dark:from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
            <Layers size={24} />
          </div>
          <ArrowRight
            size={20}
            className="text-gray-300 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all"
          />
        </div>

        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2 group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-2">
          {category}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
          </span>
          <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            View Tools →
          </span>
        </div>
      </div>
    </button>
  );
};
