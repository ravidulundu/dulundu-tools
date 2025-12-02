import React from "react";
import clsx from "clsx";

interface BackgroundSelectorProps {
  currentBackground: "white" | "transparent" | "black" | "checkerboard";
  onChange: (bg: "white" | "transparent" | "black" | "checkerboard") => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onChange,
}) => {
  const backgrounds: Array<"white" | "transparent" | "black" | "checkerboard"> =
    ["white", "transparent", "black", "checkerboard"];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-2">Background:</span>
      {backgrounds.map((bg) => (
        <button
          key={bg}
          onClick={() => onChange(bg)}
          className={clsx(
            "w-6 h-6 rounded border-2 transition-all",
            currentBackground === bg
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
  );
};
