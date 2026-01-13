import { OnMount } from '@monaco-editor/react';
import { Check, Crop, Redo, RotateCcw, Settings, Undo } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { DEFAULT_SVG_CODE } from '../constants';
import { optimizeSvg, prettifySvg } from '../utils/svgOptimizer';

type EditorType = Parameters<OnMount>[0];

interface EditorTopBarProps {
  svgCode: string;
  setSvgCode: (code: string) => void;
  editorRef: React.RefObject<EditorType | null>;
  optimizationStats: {
    originalSize: number;
    optimizedSize: number;
    percentage: number;
  } | null;
  cursorPosition: { line: number; column: number };
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
  svgCode,
  setSvgCode,
  editorRef,
  optimizationStats,
  cursorPosition,
}) => {
  const [showDimensions, setShowDimensions] = useState(false);
  const [overrideDimensions, setOverrideDimensions] = useState<{
    w: string | number;
    h: string | number;
  } | null>(null);

  // Track previous svgCode to reset override on change
  const [prevSvgCode, setPrevSvgCode] = useState(svgCode);
  if (svgCode !== prevSvgCode) {
    setPrevSvgCode(svgCode);
    setOverrideDimensions(null);
  }

  const [isPrettified, setIsPrettified] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  // Parse dimensions from SVG code
  const parsedDimensions = useMemo(() => {
    if (!svgCode) return { w: 0, h: 0 };
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (svg) {
      const width = parseInt(svg.getAttribute('width') || '0') || 0;
      const height = parseInt(svg.getAttribute('height') || '0') || 0;
      return { w: width, h: height };
    }
    return { w: 0, h: 0 };
  }, [svgCode]);

  const dimensions = overrideDimensions || parsedDimensions;

  // Close dimensions popover on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDimensions(false);
      }
    };
    if (showDimensions) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDimensions]);

  const updateSvgDimensions = (w: number, h: number) => {
    if (!svgCode) return;

    const svgTagMatch = svgCode.match(/<svg[^>]*>/);
    if (!svgTagMatch) return;

    let openTag = svgTagMatch[0];

    const updateAttr = (tag: string, attr: string, value: number) => {
      // Validate attr is an allowed attribute (defense in depth)
      const allowedAttrs = ['width', 'height', 'viewBox', 'x', 'y'];
      if (!allowedAttrs.includes(attr)) return tag;

      // Escape for safety (though validated above)
      const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(\\s|^)${escapedAttr}\\s*=\\s*"[^"]*"`);
      if (regex.test(tag)) {
        return tag.replace(regex, `$1${attr}="${value}"`);
      } else {
        return tag.replace(/(\/?>)$/, ` ${attr}="${value}"$1`);
      }
    };

    openTag = updateAttr(openTag, 'width', w);
    openTag = updateAttr(openTag, 'height', h);

    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const matches = model.findMatches('<svg[^>]*>', true, true, false, null, true);
        if (matches && matches.length > 0) {
          const range = matches[0].range;
          editorRef.current.executeEdits('dimensions-update', [
            {
              range: range,
              text: openTag,
              forceMoveMarkers: true,
            },
          ]);
          return;
        }
      }
    }

    const newCode = svgCode.replace(svgTagMatch[0], openTag);
    setSvgCode(newCode);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the code to default?')) {
      setSvgCode(DEFAULT_SVG_CODE);
    }
  };

  const handleUndo = () => {
    editorRef.current?.trigger('source', 'undo', null);
  };

  const handleRedo = () => {
    editorRef.current?.trigger('source', 'redo', null);
  };

  const handlePrettify = () => {
    // Use our custom prettifier for consistent results
    // Monaco's built-in formatter often requires additional configuration for XML
    const formatted = prettifySvg(svgCode);
    setSvgCode(formatted);

    setIsPrettified(true);
    setIsOptimized(false);
    setTimeout(() => setIsPrettified(false), 2000);
  };

  const handleOptimize = () => {
    if (!svgCode) return;

    const optimized = optimizeSvg(svgCode);

    setSvgCode(optimized);
    setIsOptimized(true);
    setIsPrettified(false);
    setTimeout(() => setIsOptimized(false), 2000);
  };

  const handleClear = () => {
    setSvgCode('');
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-background-secondary border-b border-border">
      {/* Left Tools */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleReset}
          className="text-foreground-secondary hover:text-foreground transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            className="text-foreground-secondary hover:text-foreground transition-colors"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            className="text-foreground-secondary hover:text-foreground transition-colors"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-background-secondary"
          >
            <Crop className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">
              {dimensions.w}px x {dimensions.h}px
            </span>
          </button>

          {/* Dimensions Popover */}
          {showDimensions && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-md shadow-xl p-3 z-50">
              <div className="text-xxs font-bold text-foreground-secondary mb-2 tracking-wider">
                DIMENSIONS
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground-muted text-xs font-medium">
                    W
                  </div>
                  <input
                    type="number"
                    value={dimensions.w}
                    onChange={e => {
                      const val = e.target.value;
                      setOverrideDimensions(prev => ({ ...(prev || parsedDimensions), w: val }));
                      const w = parseInt(val);
                      const h =
                        typeof dimensions.h === 'string'
                          ? parseInt(dimensions.h) || 0
                          : dimensions.h;
                      if (!isNaN(w)) {
                        updateSvgDimensions(w, h);
                      }
                    }}
                    className="w-full bg-background-secondary border border-border rounded px-2 py-1 pl-6 text-xs text-foreground-secondary focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground-muted text-xs font-medium">
                    H
                  </div>
                  <input
                    type="number"
                    value={dimensions.h}
                    onChange={e => {
                      const val = e.target.value;
                      setOverrideDimensions(prev => ({ ...(prev || parsedDimensions), h: val }));
                      const h = parseInt(val);
                      const w =
                        typeof dimensions.w === 'string'
                          ? parseInt(dimensions.w) || 0
                          : dimensions.w;
                      if (!isNaN(h)) {
                        updateSvgDimensions(w, h);
                      }
                    }}
                    className="w-full bg-background-secondary border border-border rounded px-2 py-1 pl-6 text-xs text-foreground-secondary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePrettify}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            isPrettified ? 'text-primary' : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          {isPrettified && <Check className="w-3.5 h-3.5" />}
          Prettify
        </button>

        <button
          onClick={handleOptimize}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            isOptimized ? 'text-success' : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          {isOptimized && <Check className="w-3.5 h-3.5" />}
          {isOptimized ? 'Optimized' : 'Optimize'}
          {!isOptimized && optimizationStats && optimizationStats.percentage > 0 && (
            <span className="ml-1 text-xxs bg-success/10 text-success px-1.5 py-0.5 rounded-full">
              -{optimizationStats.percentage}%
            </span>
          )}
        </button>

        {/* Optimization Stats Display - Compact */}
        {optimizationStats && optimizationStats.percentage > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 border border-success/20 rounded text-xxs whitespace-nowrap">
            <span className="text-foreground-secondary">{optimizationStats.originalSize}b</span>
            <span className="text-success">→</span>
            <span className="text-foreground-secondary">{optimizationStats.optimizedSize}b</span>
            <span className="text-success font-semibold">-{optimizationStats.percentage}%</span>
          </div>
        )}

        <button
          className="text-foreground-secondary hover:text-foreground transition-colors"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Stats */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-foreground-secondary font-mono">
          Line {cursorPosition.line}:{cursorPosition.column}
        </span>

        <button
          onClick={handleClear}
          className="text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors px-2 py-1 hover:bg-background-secondary rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
