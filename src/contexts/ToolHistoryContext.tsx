import { ReactNode } from 'react';

import { useToolHistory } from '@/hooks/useToolHistory';

import { ToolHistoryContext } from './ToolHistoryContextDefinition';

interface ToolHistoryProviderProps {
  children: ReactNode;
}

export function ToolHistoryProvider({ children }: ToolHistoryProviderProps) {
  const toolHistory = useToolHistory();

  return <ToolHistoryContext.Provider value={toolHistory}>{children}</ToolHistoryContext.Provider>;
}
