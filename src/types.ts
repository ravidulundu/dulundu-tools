import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  AI = 'AI Tools',
  FORMATTER = 'Formatters & Beautifiers',
  CONVERTER = 'Converters',
  IMAGE_CONVERTER = 'Image Converter Tools',
  FINANCE = 'Finance Tools',
  TSV = 'TSV Tools',
  JSON = 'JSON Tools',
  XML = 'XML Tools',
  YAML = 'YAML Tools',
  HTML = 'HTML Tools',
  CSS = 'CSS Tools',
  JS = 'Javascript Tools',
  CSV = 'CSV Tools',
  SQL = 'SQL Tools',
  COLOR = 'Color Tools',
  UNIT = 'Unit Tools',
  NUMBER = 'Number Tools',
  STRING = 'String Tools',
  BASE64 = 'Base64 Tools',
  RANDOM = 'Random Tools',
  MINIFIER = 'Minifiers',
  VALIDATOR = 'Validators',
  CRYPTO = 'Cryptography',
  ESCAPE = 'Escape Unescape Tools',
  UTF = 'UTF Tools',
  COMPRESSION = 'Compress Decompress',
  HTML_GEN = 'HTML Generators',
  CSS_GEN = 'CSS Generators',
  OTHER = 'Other Tools',
  TEXT_STYLE = 'Text Style Tools',
  CSS_UNIT = 'CSS Unit Converter Tools',
  POJO = 'POJO Tools',
  TWITTER = 'Twitter Tools',
  RANDOM_GEN = 'Random Generators',
  NETWORK = 'IP Tools',
  DEV = 'Utility',
  ENCODE = 'Encode and Decode',
  VIEWER = 'Viewers',
  EDITOR = 'Programming Editors',
  PARSER = 'Parsers',
  MATH = 'Bitwise Tools',
  CHART = 'Chart Tools',
  TEXT = 'String Utilities', // Kept for backward compatibility if needed, though STRING is preferred
}

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: LucideIcon;
  popular?: boolean;
  isNew?: boolean; // Manual override - if true, always shows as new
  addedDate?: string; // ISO date string (YYYY-MM-DD) - auto computes isNew if within 30 days
  tags?: string[]; // Additional keywords for better search
}

// Helper to check if a tool should show "New" badge
export function isToolNew(tool: ToolDef): boolean {
  // Manual override takes precedence
  if (tool.isNew === true) return true;
  if (tool.isNew === false) return false;

  // Auto-compute based on addedDate (within last 30 days)
  if (tool.addedDate) {
    const addedTime = new Date(tool.addedDate).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return addedTime > thirtyDaysAgo;
  }

  return false;
}
