/**
 * Converts kebab-case attributes to camelCase for React compatibility.
 * e.g. stroke-width -> strokeWidth, fill-opacity -> fillOpacity
 */
const toCamelCase = (str: string) => {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

/**
 * Parses style string into object
 */
const parseStyle = (styleStr: string): Record<string, string> => {
  const style: Record<string, string> = {};
  styleStr.split(';').forEach(prop => {
    const [key, value] = prop.split(':');
    if (key && value) {
      style[toCamelCase(key.trim())] = value.trim();
    }
  });
  return style;
};

/**
 * Formats a value for JSX (string or number)
 */
const formatValue = (value: string): string => {
  if (!isNaN(Number(value)) && value.trim() !== '') {
    return `{${value}}`;
  }
  return `"${value}"`;
};

/**
 * Recursive function to convert DOM node to JSX string
 */
const nodeToJsx = (
  node: Element,
  indent: number,
  type: 'react' | 'react-native',
  imports: Set<string>
): string => {
  const tagName = node.tagName.toLowerCase();
  let ComponentName = tagName;

  if (type === 'react-native') {
    // Map standard SVG tags to React Native Svg components
    const map: Record<string, string> = {
      svg: 'Svg',
      path: 'Path',
      rect: 'Rect',
      circle: 'Circle',
      line: 'Line',
      polygon: 'Polygon',
      polyline: 'Polyline',
      ellipse: 'Ellipse',
      g: 'G',
      text: 'Text',
      tspan: 'TSpan',
      defs: 'Defs',
      use: 'Use',
      stop: 'Stop',
      lineargradient: 'LinearGradient',
      radialgradient: 'RadialGradient',
      mask: 'Mask',
      pattern: 'Pattern',
      clippath: 'ClipPath',
      image: 'Image',
    };
    ComponentName = map[tagName] || tagName;
    if (map[tagName]) imports.add(ComponentName);
  }

  const spaces = '  '.repeat(indent);
  let props = '';

  // Process attributes
  Array.from(node.attributes).forEach(attr => {
    let name = attr.name;
    const value = attr.value;

    // Skip empty attributes
    if (!value && name !== 'disabled') return;

    // Handle style attribute specially
    if (name === 'style') {
      const styleObj = parseStyle(value);
      const styleProps = Object.entries(styleObj)
        .map(([k, v]) => `      ${k}: "${v}",`)
        .join('\n');
      props += `\n${spaces}  style={{\n${styleProps}\n${spaces}  }}`;
      return;
    }

    // Convert attribute names
    if (name === 'class') name = 'className';
    else if (name.includes('-')) name = toCamelCase(name);

    // Special case for xlink:href
    if (name === 'xlink:href') name = 'xlinkHref';

    props += `\n${spaces}  ${name}=${formatValue(value)}`;
  });

  // Add {...props} to root svg element
  if (tagName === 'svg' && indent === 2) {
    // indent 2 means root inside the component wrapper
    props += `\n${spaces}  {...props}`;
  }

  const children = Array.from(node.children)
    .map(child => nodeToJsx(child, indent + 1, type, imports))
    .join('\n');

  if (!children) {
    return `${spaces}<${ComponentName}${props}\n${spaces}/>`;
  }

  return `${spaces}<${ComponentName}${props}\n${spaces}>\n${children}\n${spaces}</${ComponentName}>`;
};

/**
 * Converts SVG code to a React Functional Component string.
 */
export const svgToReact = (svgCode: string, componentName = 'SvgIcon'): string => {
  if (!svgCode) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return '';

    const imports = new Set<string>(); // Not used for web React usually, but kept for consistency
    const jsx = nodeToJsx(svg, 1, 'react', imports);

    return `import * as React from "react";

const ${componentName} = (props) => (
${jsx}
);

export default ${componentName};`;
  } catch (e) {
    console.error('Error converting SVG to React:', e);
    return svgCode; // Fallback
  }
};

/**
 * Converts SVG code to a React Native component string.
 */
export const svgToReactNative = (svgCode: string): string => {
  if (!svgCode) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return '';

    const imports = new Set<string>();
    const jsx = nodeToJsx(svg, 1, 'react-native', imports);

    // Ensure Svg is imported if used (it usually is as root)
    if (jsx.includes('<Svg')) imports.add('Svg');

    const importsList = Array.from(imports).join(', ');

    return `import * as React from "react";
import Svg, { ${importsList} } from "react-native-svg";

const SVGComponent = (props) => (
${jsx}
);

export default SVGComponent;`;
  } catch (e) {
    console.error('Error converting SVG to React Native:', e);
    return svgCode; // Fallback
  }
};

/**
 * Converts SVG code to a base64 Data URI.
 */
export const svgToDataUri = (svgCode: string): string => {
  if (!svgCode) return '';
  const encoded = btoa(unescape(encodeURIComponent(svgCode)));
  return `data:image/svg+xml;base64,${encoded}`;
};

/**
 * Converts SVG code to a PNG Data URI using a Canvas.
 * @param svgCode The SVG code to convert
 * @param scale The scale factor (default: 1)
 */
export const svgToPng = (svgCode: string, scale: number = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!svgCode) {
      reject(new Error('No SVG code provided'));
      return;
    }

    // Inject width/height if missing but viewBox exists
    let processedSvg = svgCode;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (svg) {
        if (
          !svg.hasAttribute('width') &&
          !svg.hasAttribute('height') &&
          svg.hasAttribute('viewBox')
        ) {
          const viewBox = svg.getAttribute('viewBox')?.split(/\s+/) || [];
          if (viewBox.length === 4) {
            const [, , w, h] = viewBox;
            svg.setAttribute('width', w);
            svg.setAttribute('height', h);
            processedSvg = new XMLSerializer().serializeToString(doc);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to inject dimensions for PNG generation', e);
    }

    const img = new Image();
    // Use the processed SVG data URI as the source
    const svgUrl = svgToDataUri(processedSvg);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Set canvas dimensions to match the SVG * scale
      // Use naturalWidth/Height if available, otherwise fallback to width/height
      const baseWidth = img.naturalWidth || img.width;
      const baseHeight = img.naturalHeight || img.height;

      canvas.width = baseWidth * scale;
      canvas.height = baseHeight * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Enable better scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the image onto the canvas with scaling
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to PNG Data URI
      const pngDataUri = canvas.toDataURL('image/png');
      resolve(pngDataUri);
    };

    img.onerror = err => {
      reject(err);
    };

    img.src = svgUrl;
  });
};

/**
 * Formats bytes to human readable string
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Generates different Data URI formats
 */
export const generateDataUris = (svgCode: string) => {
  const minified = svgCode.replace(/\s+/g, ' ').trim();

  // 1. Minified Data URI (using encodeURIComponent but minimal)
  // We use a simpler encoding for "Minified" to match common usage, or just standard encoding
  const minifiedUri = `data:image/svg+xml,${encodeURIComponent(minified)}`;

  // 2. Base64
  const base64Uri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgCode)))}`;

  // 3. encodeURIComponent (Full)
  const encodedUri = `data:image/svg+xml,${encodeURIComponent(svgCode)}`;

  return {
    minified: {
      label: 'Minified Data URI',
      value: minifiedUri,
      size: new Blob([minifiedUri]).size,
    },
    base64: {
      label: 'base64',
      value: base64Uri,
      size: new Blob([base64Uri]).size,
    },
    encoded: {
      label: 'encodeURIComponent',
      value: encodedUri,
      size: new Blob([encodedUri]).size,
    },
  };
};
