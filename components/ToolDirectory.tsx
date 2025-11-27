import React, { useMemo } from 'react';
import { ToolDef } from '../types';
import { ToolCard } from './ToolCard';
import { ALL_TOOLS } from '../constants';

interface ToolDirectoryProps {
  tools: ToolDef[];
}

export const ToolDirectory: React.FC<ToolDirectoryProps> = ({ tools }) => {
  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, ToolDef[]> = {};
    
    // Initialize with empty arrays to ensure specific order if needed, 
    // or just let it fill dynamically.
    
    tools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    return grouped;
  }, [tools]);

  // Get categories (sorted alphabetically or custom order)
  const categories = Object.keys(toolsByCategory).sort();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const categoryTools = toolsByCategory[category];
        
        // Skip empty categories
        if (categoryTools.length === 0) return null;

        return (
          <div 
            key={category} 
            className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 h-full"
          >
            {/* Category Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-slate-50/50 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
              <h3 className="font-bold text-slate-800 text-lg truncate" title={category}>
                {category}
              </h3>
              <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {categoryTools.length}
              </span>
            </div>

            {/* Tools List (Grid inside Card) */}
            <div className="p-4 grid grid-cols-1 gap-2">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} variant="mini" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};