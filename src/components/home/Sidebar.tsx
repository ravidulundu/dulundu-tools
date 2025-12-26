import { Grid } from 'lucide-react';
import React from 'react';

import { ALL_TOOLS } from '../../constants';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortedCategories: string[];
  categoryInfo: Record<string, { count: number; path: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  setActiveCategory,
  sortedCategories,
  categoryInfo,
}) => {
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Sidebar Categories (Desktop) */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-xs font-bold text-foreground-secondary uppercase tracking-wider mb-4 px-2">
          Categories
        </h3>
        <nav className="space-y-1">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeCategory === 'All'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-foreground-secondary hover:bg-background-secondary'
            }`}
          >
            <span className="flex items-center">
              <Grid size={16} className="mr-2.5" /> All Tools
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md ${
                activeCategory === 'All'
                  ? 'bg-white/20 text-white'
                  : 'bg-background-secondary text-foreground-secondary'
              }`}
            >
              {ALL_TOOLS.length}
            </span>
          </button>

          {sortedCategories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-foreground-secondary hover:bg-background-secondary'
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md ${
                  activeCategory === category
                    ? 'bg-white/20 text-white'
                    : 'bg-background-secondary text-foreground-secondary'
                }`}
              >
                {categoryInfo[category].count}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Category Scroll */}
      <div className="lg:hidden w-full overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'All'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-card text-foreground-secondary border border-border'
            }`}
          >
            All Tools
          </button>
          {sortedCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-card text-foreground-secondary border border-border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
