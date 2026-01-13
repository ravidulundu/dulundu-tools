import {
  ArrowRightLeft,
  Binary,
  Braces,
  Clock,
  Code,
  Database,
  FileCode,
  FileJson,
  FileText,
  Fingerprint,
  GitCompare,
  Globe,
  Grid,
  Hash,
  Key,
  KeyRound,
  Link2,
  Lock,
  Palette,
  QrCode,
  Regex,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Developer'ların en çok kullandığı araçlar - gruplandırılmış
const developerTools = {
  'Format & Validate': [
    { name: 'JSON Formatter', path: '/json-formatter', icon: Braces },
    { name: 'SQL Formatter', path: '/sql-formatter', icon: Database },
    { name: 'XML Formatter', path: '/xml-formatter', icon: FileCode },
    { name: 'Code Beautifier', path: '/code-formatter', icon: Code },
    { name: 'JS Validator', path: '/js-validator', icon: FileJson },
  ],
  'Encode & Decode': [
    { name: 'Base64 Converter', path: '/base64-converter', icon: Binary },
    { name: 'URL Encoder', path: '/url-encoder', icon: Link2 },
    { name: 'JWT Debugger', path: '/jwt-decoder', icon: KeyRound },
    { name: 'HTML Escape', path: '/escape-tools', icon: FileText },
  ],
  Generate: [
    { name: 'UUID Generator', path: '/uuid-generator', icon: Fingerprint },
    { name: 'Password Generator', path: '/password-generator', icon: Lock },
    { name: 'Hash & HMAC Generator', path: '/hash-generator', icon: Hash },
    { name: 'QR Code Generator', path: '/qrcode-generator', icon: QrCode },
    { name: 'Lorem Ipsum Generator', path: '/lorem-ipsum', icon: FileText },
  ],
  Convert: [
    { name: 'YAML Converter', path: '/yaml-converter', icon: ArrowRightLeft },
    { name: 'XML <> JSON', path: '/xml-json-converter', icon: ArrowRightLeft },
    { name: 'Date Converter', path: '/date-converter', icon: Clock },
    { name: 'Color Converter', path: '/color-converter', icon: Palette },
    { name: 'Number Converter', path: '/number-converter', icon: Hash },
  ],
  'Test & Debug': [
    { name: 'Regex Tester', path: '/regex-tester', icon: Regex },
    { name: 'Text Diff', path: '/diff-viewer', icon: GitCompare },
    { name: 'DNS Lookup', path: '/dns-lookup', icon: Globe },
    { name: 'Bcrypt Generator', path: '/bcrypt-generator', icon: Key },
    { name: 'AI Code Helper', path: '/ai-assistant', icon: Sparkles },
  ],
};

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[90vw] max-w-4xl bg-card rounded-xl shadow-2xl border border-border transition-all duration-200 transform p-5 z-50 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
      }`}
    >
      {/* Invisible bridge */}
      <div className="absolute -top-4 left-0 w-full h-4" />

      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h3 className="font-bold text-foreground flex items-center text-sm">
          <Grid size={16} className="mr-2 text-primary" />
          Quick Access
        </h3>
        <Link
          to="/"
          className="text-xs font-semibold text-primary hover:underline"
          onClick={onClose}
        >
          Browse All Tools &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {Object.entries(developerTools).map(([groupName, tools]) => (
          <div key={groupName}>
            <h4 className="text-[10px] whitespace-nowrap font-bold text-foreground-muted uppercase tracking-wide mb-2 px-1">
              {groupName}
            </h4>
            <div className="flex flex-col">
              {tools.map(tool => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-primary hover:bg-primary-light px-2 py-1.5 rounded-lg transition-colors group"
                  onClick={onClose}
                >
                  <tool.icon
                    size={14}
                    className="text-foreground-muted group-hover:text-primary shrink-0"
                  />
                  <span className="truncate">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
