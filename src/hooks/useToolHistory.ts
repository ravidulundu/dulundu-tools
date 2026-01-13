import { useState, useCallback, useEffect, useMemo } from 'react';

const FAVORITES_KEY = 'dulundu-favorites';
const HISTORY_KEY = 'dulundu-history';
const HISTORY_LIMIT = 10;

interface ToolUsage {
  id: string;
  lastUsed: number;
  useCount: number;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function useToolHistory() {
  const [favorites, setFavorites] = useState<string[]>(() =>
    loadFromStorage<string[]>(FAVORITES_KEY, [])
  );

  const [history, setHistory] = useState<ToolUsage[]>(() =>
    loadFromStorage<ToolUsage[]>(HISTORY_KEY, [])
  );

  // Persist favorites
  useEffect(() => {
    saveToStorage(FAVORITES_KEY, favorites);
  }, [favorites]);

  // Persist history
  useEffect(() => {
    saveToStorage(HISTORY_KEY, history);
  }, [history]);

  const trackUsage = useCallback((toolId: string) => {
    setHistory(prev => {
      const now = Date.now();
      const existing = prev.find(t => t.id === toolId);

      if (existing) {
        // Update existing entry
        const updated = prev
          .map(t => (t.id === toolId ? { ...t, lastUsed: now, useCount: t.useCount + 1 } : t))
          .sort((a, b) => b.lastUsed - a.lastUsed);
        return updated.slice(0, HISTORY_LIMIT);
      }

      // Add new entry
      const newEntry: ToolUsage = { id: toolId, lastUsed: now, useCount: 1 };
      return [newEntry, ...prev].slice(0, HISTORY_LIMIT);
    });
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites(prev =>
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  }, []);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // Recent tools sorted by last used
  const recentTools = useMemo(() => history.slice(0, HISTORY_LIMIT), [history]);

  // Most used tools
  const mostUsedTools = useMemo(
    () => [...history].sort((a, b) => b.useCount - a.useCount).slice(0, 5),
    [history]
  );

  return {
    favorites,
    history,
    recentTools,
    mostUsedTools,
    trackUsage,
    toggleFavorite,
    isFavorite,
    clearHistory,
    clearFavorites,
  };
}
