/**
 * Escape special regex characters in a string to prevent ReDoS attacks
 * when using user input in RegExp constructor.
 * @param string - String to escape
 * @returns Escaped string safe for use in RegExp
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Validate that a string matches allowed SVG element types.
 * Returns the element type if valid, null otherwise.
 */
export const validateSvgElementType = (elementType: string): string | null => {
  const allowedElements = [
    'path',
    'circle',
    'rect',
    'ellipse',
    'polygon',
    'polyline',
    'line',
    'g',
    'text',
    'use',
    'image',
    'defs',
    'symbol',
    'marker',
    'mask',
    'pattern',
    'clipPath',
    'linearGradient',
    'radialGradient',
    'stop',
    'svg',
  ];
  const lower = elementType.toLowerCase();
  return allowedElements.includes(lower) ? lower : null;
};
