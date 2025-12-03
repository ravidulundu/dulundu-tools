import { RotateCcw, Undo, Redo, Crop, Check, Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { DEFAULT_SVG_CODE } from '../context/SVGContext';
import { optimizeSvg, prettifySvg } from '../utils/svgOptimizer';

interface EditorTopBarProps {
  svgCode: string;
  setSvgCode: (code: string) => void;
  editorRef: React.RefObject<any>;
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
  const [dimensions, setDimensions] = useState<{
    w: string | number;
    h: string | number;
  }>({ w: 0, h: 0 });
  const [isPrettified, setIsPrettified] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  // Parse dimensions from SVG code on load or change
  useEffect(() => {
    if (!svgCode) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (svg) {
      const width = parseInt(svg.getAttribute('width') || '0') || 0;
      const height = parseInt(svg.getAttribute('height') || '0') || 0;
      setDimensions(prev =>
        prev.w !== width || prev.h !== height ? { w: width, h: height } : prev
      );
    }
  }, [svgCode]);

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
      const regex = new RegExp(`(\\s|^)${attr}\\s*=\\s*"[^"]*"`);
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
    editorRef.current?.trigger('source', 'undo');
  };

  const handleRedo = () => {
    editorRef.current?.trigger('source', 'redo');
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
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800">
      {/* Left Tools */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleReset}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Crop className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">
              {dimensions.w}px x {dimensions.h}px
            </span>
          </button>

          {/* Dimensions Popover */}
          {showDimensions && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#252526] border border-gray-300 dark:border-gray-700 rounded-md shadow-xl p-3 z-50">
              <div className="text-[10px] font-bold text-gray-600 dark:text-gray-500 mb-2 tracking-wider">
                DIMENSIONS
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">
                    W
                  </div>
                  <input
                    type="number"
                    value={dimensions.w}
                    onChange={e => {
                      const val = e.target.value;
                      setDimensions(prev => ({ ...prev, w: val }));
                      const w = parseInt(val);
                      const h =
                        typeof dimensions.h === 'string'
                          ? parseInt(dimensions.h) || 0
                          : dimensions.h;
                      if (!isNaN(w)) {
                        updateSvgDimensions(w, h);
                      }
                    }}
                    className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-2 py-1 pl-6 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">
                    H
                  </div>
                  <input
                    type="number"
                    value={dimensions.h}
                    onChange={e => {
                      const val = e.target.value;
                      setDimensions(prev => ({ ...prev, h: val }));
                      const h = parseInt(val);
                      const w =
                        typeof dimensions.w === 'string'
                          ? parseInt(dimensions.w) || 0
                          : dimensions.w;
                      if (!isNaN(h)) {
                        updateSvgDimensions(w, h);
                      }
                    }}
                    className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-2 py-1 pl-6 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePrettify}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            isPrettified
              ? 'text-blue-500'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {isPrettified && <Check className="w-3.5 h-3.5" />}
          Prettify
        </button>

        <button
          onClick={handleOptimize}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            isOptimized
              ? 'text-green-500'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {isOptimized && <Check className="w-3.5 h-3.5" />}
          {isOptimized ? 'Optimized' : 'Optimize'}
          {!isOptimized && optimizationStats && optimizationStats.percentage > 0 && (
            <span className="ml-1 text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full">
              -{optimizationStats.percentage}%
            </span>
          )}
        </button>

        {/* Optimization Stats Display - Compact */}
        {optimizationStats && optimizationStats.percentage > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-[10px] whitespace-nowrap">
            <span className="text-gray-600 dark:text-gray-400">
              {optimizationStats.originalSize}b
            </span>
            <span className="text-green-600 dark:text-green-400">→</span>
            <span className="text-gray-600 dark:text-gray-400">
              {optimizationStats.optimizedSize}b
            </span>
            <span className="text-green-600 dark:text-green-500 font-semibold">
              -{optimizationStats.percentage}%
            </span>
          </div>
        )}

        <button
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Stats */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-600 dark:text-gray-500 font-mono">
          Line {cursorPosition.line}:{cursorPosition.column}
        </span>

        <button
          onClick={handleClear}
          className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
