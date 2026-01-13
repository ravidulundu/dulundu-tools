import { Grid, Search, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { SetURLSearchParams } from 'react-router-dom';

import { useToolHistoryContext } from '@/contexts/useToolHistoryContext';

import { ToolDef } from '../../types';
import { ToolCard } from '../ToolCard';
import { FavoritesSection } from './FavoritesSection';

interface ToolGridProps {
  isDirectoryView: boolean;
  popularTools: ToolDef[];
  activeCategory: string;
  filteredTools: ToolDef[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSearchParams: SetURLSearchParams;
  setActiveCategory: (category: string) => void;
  favoriteTools: ToolDef[];
  recentTools: ToolDef[];
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  isDirectoryView,
  popularTools,
  activeCategory,
  filteredTools,
  searchTerm,
  setSearchTerm,
  setSearchParams,
  setActiveCategory,
  favoriteTools,
  recentTools,
}) => {
  const { toggleFavorite, isFavorite } = useToolHistoryContext();
  return (
    <main className="flex-1 min-w-0 px-2 lg:px-0">
      {/* Favorites & Recent Section (Only on 'All' view) */}
      {isDirectoryView && (
        <FavoritesSection favoriteTools={favoriteTools} recentTools={recentTools} />
      )}

      {/* Popular Section (Only on 'All' view) */}
      {isDirectoryView && (
        <section className="mb-10 animate-fade-in">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
            <div className="p-2 bg-warning-light text-warning rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-bold text-foreground">Popular Tools</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                variant="mini"
                showFavorite
                isFavorite={isFavorite(tool.id)}
                onFavoriteToggle={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filtered Tools Grid */}
      <section className="animate-fade-in">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4 lg:gap-0">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="p-2 bg-primary-light text-primary rounded-lg">
              {activeCategory === 'All' ? <Grid size={20} /> : <Zap size={20} />}
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-bold text-foreground">
                {activeCategory === 'All' ? 'All Tools' : activeCategory}
              </h2>
            </div>
            <span className="bg-background-secondary text-foreground-secondary px-2 py-0.5 rounded-md text-xs font-bold">
              {filteredTools.length}
            </span>
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                showFavorite
                isFavorite={isFavorite(tool.id)}
                onFavoriteToggle={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <div className="inline-block p-6 bg-background-secondary rounded-full mb-4">
              <Search size={40} className="text-foreground-muted" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No tools found</h3>
            <p className="text-foreground-muted">
              No tools found matching &quot;{searchTerm}&quot;
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchParams({});
                setActiveCategory('All');
              }}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
