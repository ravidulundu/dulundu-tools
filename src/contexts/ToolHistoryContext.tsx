import React, { createContext, useContext, ReactNode } from 'react';
import { useToolHistory } from '@/hooks/useToolHistory';

type ToolHistoryContextType = ReturnType<typeof useToolHistory>;

const ToolHistoryContext = createContext<ToolHistoryContextType | null>(null);

interface ToolHistoryProviderProps {
  children: ReactNode;
}

export function ToolHistoryProvider({ children }: ToolHistoryProviderProps) {
  const toolHistory = useToolHistory();

  return <ToolHistoryContext.Provider value={toolHistory}>{children}</ToolHistoryContext.Provider>;
}

export function useToolHistoryContext() {
  const context = useContext(ToolHistoryContext);
  if (!context) {
    throw new Error('useToolHistoryContext must be used within a ToolHistoryProvider');
  }
  return context;
}
