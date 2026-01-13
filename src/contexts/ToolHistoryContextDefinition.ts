import { createContext } from 'react';

import { useToolHistory } from '@/hooks/useToolHistory';

export type ToolHistoryContextType = ReturnType<typeof useToolHistory>;

export const ToolHistoryContext = createContext<ToolHistoryContextType | null>(null);
