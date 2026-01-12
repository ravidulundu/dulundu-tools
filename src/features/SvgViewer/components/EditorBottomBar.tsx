import { Upload, Copy, Download, Share2, Check } from 'lucide-react';
import React, { useState } from 'react';

interface EditorBottomBarProps {
  svgCode: string;
  setSvgCode: (code: string) => void;
  onShare: () => void;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  svgCode,
  setSvgCode,
  onShare,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          const content = e.target?.result as string;
          setSvgCode(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-12 bg-background-secondary border-t border-border flex items-center justify-between px-4">
      <button
        onClick={handleUpload}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors"
      >
        <Upload className="w-3.5 h-3.5" />
        Upload
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors border ${
            isCopied
              ? 'text-success border-success bg-success-light'
              : 'text-foreground-secondary hover:bg-background-tertiary border-border'
          }`}
        >
          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground-secondary hover:bg-background-tertiary rounded transition-colors border border-border"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground-secondary hover:bg-background-tertiary rounded transition-colors border border-border"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
    </div>
  );
};
