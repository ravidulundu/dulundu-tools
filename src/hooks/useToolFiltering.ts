import { useMemo } from 'react';

import { ALL_TOOLS } from '@/config/allTools';

interface UseToolFilteringOptions {
  searchTerm: string;
  activeCategory: string;
}

export function useToolFiltering({ searchTerm, activeCategory }: UseToolFilteringOptions) {
  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category.toLowerCase().includes(searchLower) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const popularTools = useMemo(() => ALL_TOOLS.filter(t => t.popular), []);

  const isDirectoryView = !searchTerm && activeCategory === 'All';

  return { filteredTools, popularTools, isDirectoryView };
}
