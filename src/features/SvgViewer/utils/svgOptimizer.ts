/**
 * Optimizes SVG code by removing unnecessary elements, attributes, and whitespace.
 * Mimics some of the core functionality of SVGO.
 */
export const optimizeSvg = (svgCode: string): string => {
  if (!svgCode) return '';

  let optimized = svgCode;

  // 1. Remove comments
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Remove metadata, editor data, and XML instructions
  optimized = optimized.replace(/<\?xml[^?]*\?>/gi, '');
  optimized = optimized.replace(/<!DOCTYPE[^>]*>/gi, '');
  optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
  optimized = optimized.replace(/xmlns:sketch="[^"]*"/g, '');
  optimized = optimized.replace(/xmlns:xlink="[^"]*"/g, '');
  optimized = optimized.replace(/sketch:type="[^"]*"/g, '');

  // Remove Adobe Illustrator / Editor specific attributes
  optimized = optimized.replace(/\s+data-name="[^"]*"/g, '');
  optimized = optimized.replace(/\s+id="[^"]*"/g, ''); // Be careful with IDs, but for pure icons often safe. Maybe make optional later.
  // For now, let's keep IDs as they might be used for gradients/masks.
  // Reverting ID removal to be safe.

  // 3. Remove unnecessary descriptive elements
  optimized = optimized.replace(/<title>[\s\S]*?<\/title>/gi, '');
  optimized = optimized.replace(/<desc>[\s\S]*?<\/desc>/gi, '');
  optimized = optimized.replace(/<defs>\s*<\/defs>/gi, ''); // Empty defs

  // 4. Optimize colors (#FFFFFF -> #FFF)
  optimized = optimized.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');

  // 5. Remove only truly redundant attributes
  optimized = optimized.replace(/\s+opacity="1"/g, '');
  optimized = optimized.replace(/\s+fill-opacity="1"/g, '');
  optimized = optimized.replace(/\s+stroke-opacity="1"/g, '');

  // Remove empty groups <g></g>
  optimized = optimized.replace(/<g[^>]*>\s*<\/g>/gi, '');

  // Remove groups that just wrap one element and have no attributes (simplified)
  // This is hard with regex, skipping for safety to avoid breaking nesting.

  // 6. Round numbers to 2 decimal places
  optimized = optimized.replace(/(\d+\.\d{3,})/g, match => {
    return parseFloat(match).toFixed(2);
  });

  // 7. Remove whitespace and newlines (Minification)
  optimized = optimized.replace(/\s+/g, ' ');
  optimized = optimized.replace(/>\s+</g, '><');
  optimized = optimized.trim();

  // 8. Remove spaces around attribute values
  optimized = optimized.replace(/\s*=\s*/g, '=');

  return optimized;
};

/**
 * Prettifies SVG code by formatting it with indentation.
 */
export const prettifySvg = (svgCode: string): string => {
  let formatted = '';
  let indent = 0;

  // Remove existing formatting first
  const clean = svgCode.replace(/>\s+</g, '><').trim();

  // Split by tags
  const tags = clean
    .replace(/>/g, '>~')
    .split('~')
    .filter(t => t.length > 0);

  tags.forEach(tag => {
    // Closing tag
    if (tag.match(/^<\//)) {
      indent--;
      if (indent < 0) indent = 0;
    }

    // Add indentation
    formatted += '  '.repeat(indent) + tag + '\n';

    // Opening tag (not self-closing, not special tags)
    if (tag.match(/^<[a-zA-Z]/) && !tag.match(/\/>$/) && !tag.match(/<\?/) && !tag.match(/<!/)) {
      indent++;
    }
  });

  return formatted.trim();
};
