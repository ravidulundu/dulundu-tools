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
  TEXT = 'String Utilities' // Kept for backward compatibility if needed, though STRING is preferred
}

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: LucideIcon;
  popular?: boolean;
  isNew?: boolean;
  tags?: string[]; // Additional keywords for better search
}