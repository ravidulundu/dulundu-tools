import { ArrowRight, Star } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { ToolDef, isToolNew } from '../types';

interface ToolCardProps {
  tool: ToolDef;
  variant?: 'default' | 'mini';
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  variant = 'default',
  showFavorite = false,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.();
  };

  if (variant === 'mini') {
    return (
      <Link
        to={tool.path}
        title={tool.description}
        className="group flex items-center p-3 bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 rounded-xl w-full"
      >
        <div className="mr-3 p-1.5 rounded-lg bg-background-secondary text-foreground-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
          <tool.icon size={18} />
        </div>
        <span className="font-semibold text-foreground-secondary text-sm group-hover:text-primary truncate flex-1 transition-colors">
          {tool.name}
        </span>
        {isToolNew(tool) && (
          <span className="ml-2 text-xxs font-bold bg-success-light text-success px-2 py-0.5 rounded-full uppercase flex-shrink-0 tracking-wide">
            New
          </span>
        )}
        {showFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`ml-2 p-1 rounded-md transition-all flex-shrink-0 ${
              isFavorite
                ? 'text-warning bg-warning-light'
                : 'text-foreground-muted opacity-0 group-hover:opacity-100 hover:text-warning hover:bg-warning-light'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </Link>
    );
  }

  return (
    <article className="h-full">
      <Link
        to={tool.path}
        className="group bg-card border border-border rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
      >
        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg shadow-sm backdrop-blur-sm transition-all ${
                isFavorite
                  ? 'bg-warning-light text-warning'
                  : 'bg-background-secondary text-foreground-muted opacity-0 group-hover:opacity-100 hover:bg-warning-light hover:text-warning'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          {!showFavorite && tool.popular && (
            <div
              className="bg-warning-light text-warning p-1.5 rounded-lg shadow-sm backdrop-blur-sm"
              title="Popular Tool"
            >
              <Star size={14} fill="currentColor" />
            </div>
          )}
          {isToolNew(tool) && (
            <span className="bg-success-light text-success text-xxs font-bold px-2.5 py-1 rounded-full tracking-wide backdrop-blur-sm">
              NEW
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="p-3.5 bg-primary-light text-primary rounded-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
            <tool.icon size={26} />
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors mb-2.5 line-clamp-1">
            {tool.name}
          </h3>
          <p className="text-sm text-foreground-muted line-clamp-2 leading-relaxed h-10 font-medium">
            {tool.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xxs font-bold text-foreground-secondary uppercase tracking-wider bg-background-secondary px-2 py-1 rounded-md">
            {tool.category}
          </span>
          <div className="flex items-center text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
            Open Tool <ArrowRight size={14} className="ml-1" />
          </div>
        </div>
      </Link>
    </article>
  );
};
