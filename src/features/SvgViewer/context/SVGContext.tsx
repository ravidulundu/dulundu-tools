import React, { useState, ReactNode } from 'react';

import { DEFAULT_SVG_CODE } from '../constants';
import { SVGContext, OptimizationStats } from './SVGContextDefinition';

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
