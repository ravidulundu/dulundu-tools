import { useContext } from 'react';

import { SVGContext } from '../context/SVGContextDefinition';

export const useSVG = () => {
  const context = useContext(SVGContext);
  if (context === undefined) {
    throw new Error('useSVG must be used within a SVGProvider');
  }
  return context;
};
