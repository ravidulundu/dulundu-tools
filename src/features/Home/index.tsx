import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { HeroSection } from '@/components/home/HeroSection';
import { Sidebar } from '@/components/home/Sidebar';
import { ToolGrid } from '@/components/home/ToolGrid';
import { ALL_TOOLS } from '@/config/allTools';
import { useToolHistoryContext } from '@/contexts/ToolHistoryContext';
import { useCategoryInfo } from '@/hooks/useCategoryInfo';
import { useToolFiltering } from '@/hooks/useToolFiltering';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { favorites, recentTools: recentToolIds } = useToolHistoryContext();

  const activeCategory = searchParams.get('category') || 'All';

  // Use extracted hooks
  const { categoryInfo, sortedCategories } = useCategoryInfo();
  const { filteredTools, popularTools, isDirectoryView } = useToolFiltering({
    searchTerm,
    activeCategory,
  });

  // Map favorite IDs to tool objects
  const favoriteTools = useMemo(
    () => favorites.map(id => ALL_TOOLS.find(t => t.id === id)).filter(Boolean) as typeof ALL_TOOLS,
    [favorites]
  );

  // Map recent tool IDs to tool objects
  const recentTools = useMemo(
    () =>
      recentToolIds
        .map(t => ALL_TOOLS.find(tool => tool.id === t.id))
        .filter(Boolean) as typeof ALL_TOOLS,
    [recentToolIds]
  );

  const setActiveCategory = (category: string) => {
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), category });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background-secondary transition-colors duration-200 pb-20">
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <Sidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            sortedCategories={sortedCategories}
            categoryInfo={categoryInfo}
          />

          <ToolGrid
            isDirectoryView={isDirectoryView}
            popularTools={popularTools}
            activeCategory={activeCategory}
            filteredTools={filteredTools}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSearchParams={setSearchParams}
            setActiveCategory={setActiveCategory}
            favoriteTools={favoriteTools}
            recentTools={recentTools}
          />
        </div>
      </div>
    </div>
  );
};
