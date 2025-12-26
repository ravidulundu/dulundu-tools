import { Search } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search icons (e.g. 'home', 'user')..."
        className="w-full bg-background-secondary border border-border text-foreground text-sm rounded-md pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-foreground-muted"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-foreground-muted border-t-transparent rounded-full animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </div>
    </div>
  );
};
