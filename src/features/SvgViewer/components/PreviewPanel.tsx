import React, { useState } from "react";
import DOMPurify from "dompurify";
import { useSVG } from "../context/SVGContext";
import clsx from "clsx";
import { ZoomIn, ZoomOut, Maximize2, Download, Copy } from "lucide-react";
import {
  svgToReact,
  svgToDataUri,
  svgToPng,
  svgToReactNative,
  generateDataUris,
  formatBytes,
} from "../utils/svgExporter";
import Editor from "@monaco-editor/react";
import { DataUriTab } from "./tabs/DataUriTab";
import { CodeTab } from "./tabs/CodeTab";
import { PngTab } from "./tabs/PngTab";

export const PreviewPanel = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { svgCode, hoveredElement, background, setBackground } = useSVG();
  const [activeTab, setActiveTab] = useState("Preview");
  const tabs = ["Preview", "React", "React Native", "PNG", "Data URI"];

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Sync global scale to local transform
  React.useEffect(() => {
    setTransform((prev) => ({ ...prev, scale: transform.scale })); // Note: 'scale' was removed from useSVG, using transform.scale here
  }, [transform.scale]); // Dependency changed to transform.scale

  // State for the highlight box overlay
  const [highlightBox, setHighlightBox] = React.useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Handle editor hover highlighting via bounding box calculation
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset highlight if no element is hovered
    if (!hoveredElement) {
      setHighlightBox(null);
      return;
    }

    // Find all elements of this type
    const elements = container.querySelectorAll(hoveredElement.elementType);
    const target = elements[hoveredElement.elementIndex] as SVGGraphicsElement;

    if (target && target.getBoundingClientRect) {
      // Calculate bounding box relative to the container
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Calculate relative position
      // We also account for any scrolling if the container was scrollable (though it's overflow-hidden usually)
      setHighlightBox({
        top: targetRect.top - containerRect.top,
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
        height: targetRect.height,
      });
    } else {
      setHighlightBox(null);
    }
  }, [hoveredElement, svgCode, transform]); // Re-calculate if transform changes (zoom/pan)

  // Handle wheel with non-passive listener to prevent page scroll
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setTransform((prev) => ({
          ...prev,
          scale: Math.min(Math.max(0.1, prev.scale * delta), 10),
        }));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTab !== "Preview" && activeTab !== "PNG") return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || (activeTab !== "Preview" && activeTab !== "PNG")) return;

    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Global mouseup listener to ensure drag state is cleared even if mouse is released outside container
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  const handleZoomIn = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(10, prev.scale * 1.2),
    }));
  };

  const handleZoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.1, prev.scale / 1.2),
    }));
  };

  const handleResetZoom = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const backgrounds: Array<"white" | "transparent" | "black" | "checkerboard"> =
    ["white", "transparent", "black", "checkerboard"];

  // Local state for zoom input to allow typing without immediate auto-formatting
  const [zoomInputValue, setZoomInputValue] = useState("100%");

  // Sync local input state when global transform scale changes (e.g. via buttons)
  React.useEffect(() => {
    setZoomInputValue(`${Math.round(transform.scale * 100)}%`);
  }, [transform.scale]);

  const handleZoomInputCommit = (value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (cleanVal) {
      const num = parseInt(cleanVal, 10);
      // Limit range 10% to 1000%
      const clampedNum = Math.min(Math.max(10, num), 1000);
      const newScale = clampedNum / 100;
      setTransform((prev) => ({ ...prev, scale: newScale }));
      // The useEffect will update zoomInputValue to formatted string
    } else {
      // Revert if invalid
      setZoomInputValue(`${Math.round(transform.scale * 100)}%`);
    }
  };

  // State for PNG Data URI and Scale
  const [pngDataUri, setPngDataUri] = useState<string | null>(null);
  const [pngScale, setPngScale] = useState(1);

  // Generate PNG when tab is active or SVG/Scale changes
  React.useEffect(() => {
    if (activeTab === "PNG" && svgCode) {
      setPngDataUri(null); // Clear previous URI while generating
      svgToPng(svgCode, pngScale)
        .then((uri) => setPngDataUri(uri))
        .catch((err) => console.error("Failed to generate PNG", err));
    }
  }, [activeTab, svgCode, pngScale]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#1e1e1e]">
      {/* Top Bar - Tabs */}
      <div className="h-10 border-b border-gray-200 dark:border-gray-800 bg-white flex items-center px-2 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
              activeTab === tab
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === "Preview" ? (
          <div className="w-full h-full bg-gray-50 dark:bg-[#1e1e1e] flex flex-col relative">
            {/* ... Preview content ... */}
            <div
              className={clsx(
                "flex-1 flex items-center justify-center overflow-hidden relative",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              style={{
                ...(background === "checkerboard"
                  ? {
                      backgroundImage: `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`,
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                      backgroundColor: "#ffffff",
                    }
                  : { backgroundColor: background }),
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              ref={containerRef}
            >
              {svgCode ? (
                <div
                  className="relative transition-transform duration-75 ease-out origin-center will-change-transform"
                  style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                  }}
                >
                  <div
                    className="shadow-sm svg-preview-wrapper"
                    style={{
                      ...(background === "checkerboard"
                        ? {
                            backgroundImage: `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`,
                            backgroundSize: "20px 20px",
                            backgroundPosition:
                              "0 0, 0 10px, 10px -10px, -10px 0px",
                            backgroundColor: "#ffffff",
                          }
                        : { backgroundColor: background }),
                      width: "fit-content",
                      height: "fit-content",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        (() => {
                          let processed = svgCode
                            .replace(/\<\?xml[^?]*\?\>/gi, "") // Remove XML declaration
                            .replace(/\<!DOCTYPE[^\>]*\>\s*/gi, "") // Remove DOCTYPE
                            .replace(/\<!--[\s\S]*?--\>/g, "") // Remove comments
                            .trim();

                          // If width/height missing but viewBox exists, inject them
                          const hasWidth = /\<svg[^\>]*\swidth\s*=/i.test(
                            processed
                          );
                          const hasHeight = /\<svg[^\>]*\sheight\s*=/i.test(
                            processed
                          );

                          if (!hasWidth && !hasHeight) {
                            const viewBoxMatch = processed.match(
                              /viewBox=[\"']\s*([-\d\.]+)\s+([-\d\.]+)\s+([-\d\.]+)\s+([-\d\.]+)\s*[\"']/i
                            );
                            if (viewBoxMatch) {
                              const [, , , w, h] = viewBoxMatch;
                              processed = processed.replace(
                                /\<svg/i,
                                `<svg width="${w}" height="${h}"`
                              );
                            }
                          }
                          return processed;
                        })()
                      ),
                    }}
                  />

                  <style>{`
                    .svg-preview-wrapper svg {
                      display: block;
                    }
                  `}</style>
                </div>
              ) : (
                <div className="flex items-center justify-center text-gray-400 text-sm">
                  No SVG loaded
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "React" ? (
          <CodeTab code={svgToReact(svgCode)} />
        ) : activeTab === "React Native" ? (
          <CodeTab code={svgToReactNative(svgCode)} />
        ) : activeTab === "Data URI" ? (
          <DataUriTab svgCode={svgCode} />
        ) : activeTab === "PNG" ? (
          <PngTab
            pngDataUri={pngDataUri}
            background={background}
            transform={transform}
            containerRef={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />
        ) : (
          <div className="flex items-center justify-center text-gray-400 text-sm">
            {activeTab} content coming soon...
          </div>
        )}

        {/* Selection Highlight Overlay - Moved outside transform container */}
        {highlightBox && activeTab === "Preview" && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: highlightBox.top,
              left: highlightBox.left,
              width: highlightBox.width,
              height: highlightBox.height,
              border: "2px solid #3b82f6", // Tailwind blue-500
              backgroundColor: "rgba(59, 130, 246, 0.2)", // Semi-transparent blue
              boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.2)", // Subtle inner light border
              borderRadius: "2px",
              transition: "all 0.1s ease-out",
            }}
          />
        )}
      </div>

      {/* Bottom Bar - Controls */}
      <div className="h-12 border-t border-gray-200 bg-white flex items-center justify-between px-4">
        {/* Left Group: Background, Scale, Download */}
        <div className="flex items-center gap-6">
          {/* Background (Only for Preview and PNG) */}
          {(activeTab === "Preview" || activeTab === "PNG") && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-2">Background:</span>
              {backgrounds.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBackground(bg)}
                  className={clsx(
                    "w-6 h-6 rounded border-2 transition-all",
                    background === bg
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  title={bg}
                >
                  {bg === "white" && (
                    <div className="w-full h-full bg-white rounded-sm" />
                  )}
                  {bg === "black" && (
                    <div className="w-full h-full bg-black rounded-sm" />
                  )}
                  {bg === "transparent" && (
                    <div className="w-full h-full bg-gray-200 rounded-sm" />
                  )}
                  {bg === "checkerboard" && (
                    <div
                      className="w-full h-full rounded-sm"
                      style={{
                        backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                        backgroundSize: "6px 6px",
                        backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Scale Selector (Only for PNG) */}
          {activeTab === "PNG" && (
            <>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Scale:</span>
                <select
                  value={pngScale}
                  onChange={(e) => setPngScale(Number(e.target.value))}
                  className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>
            </>
          )}

          {/* Download Button */}
          <button
            onClick={() => {
              if (activeTab === "PNG" && pngDataUri) {
                const a = document.createElement("a");
                a.href = pngDataUri;
                a.download = `image@${pngScale}x.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else if (activeTab === "React") {
                const blob = new Blob([svgToReact(svgCode)], {
                  type: "text/plain",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Icon.tsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } else if (activeTab === "React Native") {
                const blob = new Blob([svgToReactNative(svgCode)], {
                  type: "text/plain",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Icon.tsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } else {
                const blob = new Blob([svgCode], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "image.svg";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }
            }}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors whitespace-nowrap"
            title={
              activeTab === "PNG"
                ? "Download PNG"
                : activeTab === "React" || activeTab === "React Native"
                ? "Download Component"
                : "Download SVG"
            }
          >
            <Download className="w-3.5 h-3.5 flex-shrink-0" />
            {activeTab === "PNG"
              ? "Download PNG"
              : activeTab === "React" || activeTab === "React Native"
              ? "Download JSX"
              : "Download SVG"}
          </button>
        </div>

        {/* Right: Zoom */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 mr-2 hidden sm:inline-block whitespace-nowrap">
            Use Ctrl + Scroll to zoom
          </span>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="text"
            className="text-xs font-mono text-gray-600 w-[50px] text-center bg-transparent border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            value={zoomInputValue}
            onChange={(e) => setZoomInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleZoomInputCommit(e.currentTarget.value);
                e.currentTarget.blur();
              }
            }}
            onFocus={(e) => {
              // Remove % sign on focus for easier editing
              const val = e.target.value.replace("%", "");
              setZoomInputValue(val);
              e.target.select();
            }}
            onBlur={(e) => {
              handleZoomInputCommit(e.target.value);
            }}
          />
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
