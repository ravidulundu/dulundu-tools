import React, { useState } from 'react';

import { IconGrid } from './IconGrid';
import { SearchBar } from './SearchBar';
import { useSVG } from '../../hooks/useSVG';
import { searchIcons } from '../../services/iconify';

export const Sidebar = () => {
  const { setSvgCode } = useSVG();
  const [query, setQuery] = useState('');
  const [icons, setIcons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [isColorful, setIsColorful] = useState(false);

  const handleSearch = React.useCallback(
    async (searchQuery: string = query, colorful: boolean = isColorful) => {
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
    },
    [query, isColorful]
  );

  // Initial load or popular icons could go here
  React.useEffect(() => {
    handleSearch('arrow'); // Default search to show something
  }, [handleSearch]);

  // Debounced search: auto-search when user types
  React.useEffect(() => {
    if (!query.trim()) return;

    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch]);

  const handleSelectIcon = (svg: string) => {
    setSvgCode(svg);
  };

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-3">SVG Library</h2>
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
                ? 'bg-accent-secondary text-accent border-accent'
                : 'bg-background-secondary text-foreground-secondary border-border hover:bg-background-tertiary'
            }`}
          >
            {isColorful ? '✨ Colorful Only' : '🎨 Show Colorful'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {!hasSearched && !isLoading && icons.length === 0 ? (
          <div className="text-center text-foreground-muted text-xs mt-10">Search for icons...</div>
        ) : (
          <IconGrid icons={icons} onSelectIcon={handleSelectIcon} />
        )}
      </div>

      <div className="p-3 border-t border-border text-[10px] text-foreground-muted text-center">
        Powered by Iconify
      </div>
    </div>
  );
};
