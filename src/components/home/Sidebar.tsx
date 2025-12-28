import { Grid } from 'lucide-react';
import React from 'react';

import { ALL_TOOLS } from '@/config/allTools';
import { NavButton } from '@/components/common/NavButton';

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
          <NavButton
            label="All Tools"
            count={ALL_TOOLS.length}
            isActive={activeCategory === 'All'}
            onClick={() => handleCategoryClick('All')}
            icon={<Grid size={16} />}
          />

          {sortedCategories.map(category => (
            <NavButton
              key={category}
              label={category}
              count={categoryInfo[category].count}
              isActive={activeCategory === category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile Category Scroll */}
      <div className="lg:hidden w-full overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex space-x-2">
          <NavButton
            label="All Tools"
            isActive={activeCategory === 'All'}
            onClick={() => setActiveCategory('All')}
            variant="pill"
          />
          {sortedCategories.map(category => (
            <NavButton
              key={category}
              label={category}
              isActive={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              variant="pill"
            />
          ))}
        </div>
      </div>
    </>
  );
};
