import { createContext } from 'react';

export interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  percentage: number;
}

export interface SVGContextType {
  svgCode: string;
  setSvgCode: (code: string) => void;
  optimizationStats: OptimizationStats | null;
  setOptimizationStats: (stats: OptimizationStats | null) => void;
  scale: number;
  setScale: (scale: number) => void;
  background: 'white' | 'transparent' | 'black' | 'checkerboard';
  setBackground: (bg: 'white' | 'transparent' | 'black' | 'checkerboard') => void;
  hoveredElement: {
    lineNumber: number;
    elementType: string;
    elementIndex: number;
  } | null;
  setHoveredElement: (
    element: {
      lineNumber: number;
      elementType: string;
      elementIndex: number;
    } | null
  ) => void;
}

export const SVGContext = createContext<SVGContextType | undefined>(undefined);
