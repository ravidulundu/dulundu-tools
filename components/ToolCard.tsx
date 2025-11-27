import React from 'react';
import { Link } from 'react-router-dom';
import { ToolDef } from '../types';
import { ArrowRight, Star } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDef;
  variant?: 'default' | 'mini';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, variant = 'default' }) => {
  if (variant === 'mini') {
    return (
      <Link
        to={tool.path}
        title={tool.description}
        className="group flex items-center p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-lg w-full"
      >
        <div className="mr-2.5 text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-primary transition-colors">
          <tool.icon size={18} />
        </div>
        <span className="font-medium text-slate-700 dark:text-slate-200 text-sm group-hover:text-primary dark:group-hover:text-primary truncate flex-1">
          {tool.name}
        </span>
        {tool.isNew && (
          <span className="ml-1.5 text-[9px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded uppercase flex-shrink-0">
            New
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      to={tool.path}
      className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {tool.popular && (
          <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 p-1.5 rounded-lg shadow-sm" title="Popular Tool">
            <Star size={12} fill="currentColor" />
          </div>
        )}
        {tool.isNew && (
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-md tracking-wide">
            NEW
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-xl group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary dark:group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-primary/50">
          <tool.icon size={24} />
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-primary dark:group-hover:text-primary transition-colors mb-2 line-clamp-1">{tool.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-10">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{tool.category}</span>
        <ArrowRight size={16} className="text-gray-300 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};