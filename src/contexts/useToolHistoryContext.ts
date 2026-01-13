import { useContext } from 'react';

import { ToolHistoryContext } from './ToolHistoryContextDefinition';

export function useToolHistoryContext() {
  const context = useContext(ToolHistoryContext);
  if (!context) {
    throw new Error('useToolHistoryContext must be used within a ToolHistoryProvider');
  }
  return context;
}
