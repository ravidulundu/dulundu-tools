import React from "react";
import { useSVG } from "../context/SVGContext";
import { Minus, Plus, Download, Copy, Share2, Upload } from "lucide-react";
import clsx from "clsx";

const BottomBar = () => {
  const { scale, setScale, background, setBackground } = useSVG();

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
      {/* Left: Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setScale(Math.max(0.1, scale - 0.1))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(Math.min(4, scale + 0.1))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Center: Background Toggles */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setBackground("white")}
          className={clsx(
            "w-6 h-6 rounded border transition-all",
            background === "white"
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-300 bg-white"
          )}
          title="White Background"
        />
        <button
          onClick={() => setBackground("transparent")}
          className={clsx(
            "w-6 h-6 rounded border transition-all bg-gray-100",
            background === "transparent"
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-300"
          )}
          title="Transparent Background"
        />
        <button
          onClick={() => setBackground("black")}
          className={clsx(
            "w-6 h-6 rounded border transition-all bg-black",
            background === "black"
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-600"
          )}
          title="Black Background"
        />
        <button
          onClick={() => setBackground("checkerboard")}
          className={clsx(
            "w-6 h-6 rounded border transition-all",
            background === "checkerboard"
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-300"
          )}
          style={{
            backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
            backgroundSize: "8px 8px",
            backgroundColor: "white",
          }}
          title="Checkerboard Background"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
          <Copy className="w-4 h-4" />
          Copy
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
