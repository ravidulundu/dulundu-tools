import { Check, Copy, Image as ImageIcon, Palette, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';

export const PaletteExtractor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      extractColors(url);
    }
  };

  const extractColors = (url: string) => {
    setLoading(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize for performance
      const width = 100;
      const height = (img.height / img.width) * width;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      const colorCounts: Record<string, number> = {};

      // Quantize colors (round to nearest 10 for grouping)
      for (let i = 0; i < imageData.length; i += 4) {
        const r = Math.round(imageData[i] / 10) * 10;
        const g = Math.round(imageData[i + 1] / 10) * 10;
        const b = Math.round(imageData[i + 2] / 10) * 10;
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // Top 10 colors
        .map(([hex]) => hex);

      setColors(sorted);
      setLoading(false);
    };
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Palette}
          title="Image Palette Extractor"
          description="Extract dominant colors from any image"
        />

        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background-secondary/30 flex flex-col items-center">
          <div className="max-w-4xl w-full">
            <div
              role="button"
              tabIndex={0}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-background-secondary transition-all cursor-pointer mb-8 relative bg-card"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
              />
              <canvas ref={canvasRef} className="hidden" />

              {image ? (
                <div className="flex flex-col items-center">
                  <img
                    src={image}
                    alt="Preview"
                    className="max-h-64 rounded-lg shadow-md mb-4 object-contain"
                  />
                  <button className="text-sm text-primary hover:underline font-medium flex items-center">
                    <Upload size={16} className="mr-1.5" /> Upload another image
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-foreground-muted py-8">
                  <div className="p-4 bg-background-secondary rounded-full mb-4">
                    <ImageIcon size={32} className="text-foreground-muted" />
                  </div>
                  <p className="text-lg font-medium text-foreground-secondary">
                    Click to Upload Image
                  </p>
                  <p className="text-sm">JPG, PNG, WEBP supported</p>
                </div>
              )}
            </div>

            {loading && (
              <div className="text-center text-foreground-muted font-medium animate-pulse">
                Analyzing colors...
              </div>
            )}

            {colors.length > 0 && !loading && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4">
                {colors.map(hex => (
                  <ColorCard key={hex} hex={hex} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

const ColorCard: React.FC<{ hex: string }> = ({ hex }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleCopy}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCopy(e);
        }
      }}
    >
      <div className="h-24 w-full relative" style={{ backgroundColor: hex }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <span className="bg-card/90 text-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
            Click to Copy
          </span>
        </div>
      </div>
      <div className="p-3 flex justify-between items-center">
        <span className="font-mono font-bold text-foreground-secondary uppercase">{hex}</span>
        {copied ? (
          <Check size={16} className="text-success" />
        ) : (
          <Copy
            size={16}
            className="text-foreground-muted group-hover:text-primary transition-colors"
          />
        )}
      </div>
    </div>
  );
};
