import { useMemo } from 'react';

import { ALL_TOOLS } from '@/config/allTools';
import { isToolNew } from '@/types';

export interface CategoryInfo {
  count: number;
  path: string;
}

export function useCategoryInfo() {
  // Category info with tool counts and representative tool path
  const categoryInfo = useMemo(() => {
    const info: Record<string, CategoryInfo> = {};

    // Group tools by category
    const byCategory: Record<string, typeof ALL_TOOLS> = {};
    ALL_TOOLS.forEach(tool => {
      if (!byCategory[tool.category]) {
        byCategory[tool.category] = [];
      }
      byCategory[tool.category].push(tool);
    });

    // For each category, pick the best representative tool
    Object.entries(byCategory).forEach(([category, tools]) => {
      // Prefer: non-popular, non-new tools first (core tools)
      // Then non-popular tools, then any tool
      const coreTools = tools.filter(t => !t.popular && !isToolNew(t));
      const regularTools = tools.filter(t => !t.popular);

      const representative = coreTools[0] || regularTools[0] || tools[0];

      info[category] = {
        count: tools.length,
        path: representative.path,
      };
    });

    return info;
  }, []);

  const sortedCategories = useMemo(() => {
    return Object.keys(categoryInfo).sort();
  }, [categoryInfo]);

  return { categoryInfo, sortedCategories };
}
