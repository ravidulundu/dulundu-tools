import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  percentage: number;
}

interface SVGContextType {
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

const SVGContext = createContext<SVGContextType | undefined>(undefined);

export const DEFAULT_SVG_CODE = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 32 32"><rect x="0" y="0" width="32" height="32" rx="8" fill="#3b82f6"/><g transform="translate(4, 4)" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></g></svg>`;

export const SVGProvider = ({ children }: { children: ReactNode }) => {
  // Default SVG (The orange logo from the screenshot or a placeholder)
  const [svgCode, setSvgCode] = useState<string>(DEFAULT_SVG_CODE);

  const [optimizationStats, setOptimizationStats] = useState<OptimizationStats | null>(null);

  const [scale, setScale] = useState(1);
  const [background, setBackground] = useState<'white' | 'transparent' | 'black' | 'checkerboard'>(
    'checkerboard'
  );

  const [hoveredElement, setHoveredElement] = useState<{
    lineNumber: number;
    elementType: string;
    elementIndex: number;
  } | null>(null);

  return (
    <SVGContext.Provider
      value={{
        svgCode,
        setSvgCode,
        optimizationStats,
        setOptimizationStats,
        scale,
        setScale,
        background,
        setBackground,
        hoveredElement,
        setHoveredElement,
      }}
    >
      {children}
    </SVGContext.Provider>
  );
};

export const useSVG = () => {
  const context = useContext(SVGContext);
  if (context === undefined) {
    throw new Error('useSVG must be used within a SVGProvider');
  }
  return context;
};
