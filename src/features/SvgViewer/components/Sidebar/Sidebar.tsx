import React, { useState } from 'react';

import { IconGrid } from './IconGrid';
import { SearchBar } from './SearchBar';
import { useSVG } from '../../context/SVGContext';
import { searchIcons } from '../../services/iconify';

export const Sidebar = () => {
  const { setSvgCode } = useSVG();
  const [query, setQuery] = useState('');
  const [icons, setIcons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [isColorful, setIsColorful] = useState(false);

  // Initial load or popular icons could go here
  React.useEffect(() => {
    handleSearch('arrow'); // Default search to show something
  }, []);

  // Debounced search: auto-search when user types
  React.useEffect(() => {
    if (!query.trim()) return;

    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async (searchQuery: string = query, colorful: boolean = isColorful) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const result = await searchIcons(searchQuery, 50, colorful);
      setIcons(result.icons);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIcon = (svg: string) => {
    setSvgCode(svg);
  };

  return (
    <div className="h-full bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">SVG Library</h2>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={() => handleSearch()}
          isLoading={isLoading}
        />

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => {
              setIsColorful(!isColorful);
              // Trigger search immediately when toggling if there is a query
              if (query.trim()) {
                // We need to pass the new value directly because state update is async
                handleSearch(query, !isColorful);
              }
            }}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              isColorful
                ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {isColorful ? '✨ Colorful Only' : '🎨 Show Colorful'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {!hasSearched && !isLoading && icons.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-500 text-xs mt-10">
            Search for icons...
          </div>
        ) : (
          <IconGrid icons={icons} onSelectIcon={handleSelectIcon} />
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-[10px] text-gray-500 dark:text-gray-600 text-center">
        Powered by Iconify
      </div>
    </div>
  );
};
