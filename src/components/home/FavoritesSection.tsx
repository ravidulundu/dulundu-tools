import { Star, Clock, Heart } from 'lucide-react';
import React, { useState } from 'react';

import { useToolHistoryContext } from '@/contexts/ToolHistoryContext';

import { ToolDef } from '../../types';
import { ToolCard } from '../ToolCard';

type TabType = 'favorites' | 'recent';

interface FavoritesSectionProps {
  favoriteTools: ToolDef[];
  recentTools: ToolDef[];
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favoriteTools,
  recentTools,
}) => {
  const { toggleFavorite, isFavorite } = useToolHistoryContext();
  const [activeTab, setActiveTab] = useState<TabType>('favorites');

  const hasContent = favoriteTools.length > 0 || recentTools.length > 0;

  // Don't render if no favorites and no history
  if (!hasContent) {
    return null;
  }

  const tools = activeTab === 'favorites' ? favoriteTools : recentTools;
  const isEmpty = tools.length === 0;

  return (
    <section className="mb-10 animate-fade-in">
      {/* Tab Header */}
      <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'favorites'
              ? 'bg-warning-light text-warning'
              : 'bg-background-secondary text-foreground-muted hover:text-foreground'
          }`}
        >
          <Star size={16} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
          Favorites
          {favoriteTools.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-warning/20 rounded text-xs">
              {favoriteTools.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'recent'
              ? 'bg-primary-light text-primary'
              : 'bg-background-secondary text-foreground-muted hover:text-foreground'
          }`}
        >
          <Clock size={16} />
          Recent
          {recentTools.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-primary/20 rounded text-xs">
              {recentTools.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 bg-card rounded-xl border border-dashed border-border">
          <div className="p-3 bg-background-secondary rounded-full mb-3">
            {activeTab === 'favorites' ? (
              <Heart size={24} className="text-foreground-muted" />
            ) : (
              <Clock size={24} className="text-foreground-muted" />
            )}
          </div>
          <p className="text-foreground-muted text-sm">
            {activeTab === 'favorites'
              ? 'No favorites yet. Click the star on any tool to add it here.'
              : 'No recent tools. Start using tools to see them here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map(tool => (
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
      )}
    </section>
  );
};
