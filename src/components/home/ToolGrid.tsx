import React from "react";
import { TrendingUp, Grid, Zap, Search } from "lucide-react";
import { ToolCard } from "../ToolCard";
import { ToolDef } from "../../types";
import { SetURLSearchParams } from "react-router-dom";

interface ToolGridProps {
  isDirectoryView: boolean;
  popularTools: ToolDef[];
  activeCategory: string;
  filteredTools: ToolDef[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSearchParams: SetURLSearchParams;
  setActiveCategory: (category: string) => void;
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
}) => {
  return (
    <main className="flex-1 min-w-0 px-2 lg:px-0">
      {/* Popular Section (Only on 'All' view) */}
      {isDirectoryView && (
        <section className="mb-10 animate-fade-in">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Popular Tools
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="mini" />
            ))}
          </div>
        </section>
      )}

      {/* Filtered Tools Grid */}
      <section className="animate-fade-in">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4 lg:gap-0">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-primary rounded-lg">
              {activeCategory === "All" ? (
                <Grid size={20} />
              ) : (
                <Zap size={20} />
              )}
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {activeCategory === "All" ? "All Tools" : activeCategory}
              </h2>
            </div>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md text-xs font-bold">
              {filteredTools.length}
            </span>
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
            <div className="inline-block p-6 bg-gray-50 dark:bg-slate-700/50 rounded-full mb-4">
              <Search size={40} className="text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-center">
              We couldn't find any tools matching "{searchTerm}". Try checking
              your spelling or browsing by category.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchParams({});
                setActiveCategory("All");
              }}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
