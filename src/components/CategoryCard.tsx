import { ArrowRight, Layers } from 'lucide-react';
import React from 'react';

interface CategoryCardProps {
  category: string;
  toolCount: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, toolCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-card rounded-2xl border border-border p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full text-left"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Decorative Circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-primary-light text-primary rounded-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
            <Layers size={22} />
          </div>
          <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowRight
              size={16}
              className="text-foreground-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>

        <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {category}
        </h3>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background-secondary text-foreground-muted group-hover:bg-card transition-colors">
            {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
          </span>
        </div>
      </div>
    </button>
  );
};
