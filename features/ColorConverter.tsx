import React, { useState, useEffect } from "react";
import { Palette, Copy, Check, RefreshCw } from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { ActionButton } from "../components/common/ActionButton";

export const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");
  const [copied, setCopied] = useState("");

  // Conversion Helpers
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`;
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Handlers
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const rgbObj = hexToRgb(val);
      if (rgbObj) {
        setRgb(`rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`);
        setHsl(rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b));
      }
    }
  };

  const handleRgbChange = (val: string) => {
    setRgb(val);
    const match = val.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      setHex(rgbToHex(r, g, b));
      setHsl(rgbToHsl(r, g, b));
    }
  };

  const handleHslChange = (val: string) => {
    setHsl(val);
    const match = val.match(
      /^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i
    );
    if (match) {
      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      const rgbObj = hslToRgb(h, s, l);
      setRgb(`rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`);
      setHex(rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b));
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleReset = () => {
    setHex("#3b82f6");
    setRgb("rgb(59, 130, 246)");
    setHsl("hsl(217, 91%, 60%)");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Palette}
          title="Color Converter"
          description="Convert between HEX, RGB, and HSL formats"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <RefreshCw size={16} /> <span>Reset Default</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 flex items-center justify-center overflow-y-auto">
          <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Color Preview */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-8 border-white ring-1 ring-gray-100 transition-all transform group-hover:scale-105"
                  style={{ backgroundColor: hex }}
                ></div>
              </div>
              <p className="font-mono text-slate-500 text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                Preview
              </p>
            </div>

            {/* Inputs */}
            <div className="flex-1 w-full space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">
                  HEX Color
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={hex}
                    onChange={handleHexChange}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl font-mono text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase bg-slate-50 text-slate-800 transition-all"
                    maxLength={7}
                  />
                  <div
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: hex }}
                  ></div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <ActionButton
                      icon={copied === "hex" ? Check : Copy}
                      label={copied === "hex" ? "Copied" : "Copy"}
                      onClick={() => copyToClipboard(hex, "hex")}
                      variant={copied === "hex" ? "success" : "ghost"}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">
                  RGB Color
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={rgb}
                    onChange={(e) => handleRgbChange(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl font-mono text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 text-slate-800 transition-all"
                    placeholder="rgb(0, 0, 0)"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <ActionButton
                      icon={copied === "rgb" ? Check : Copy}
                      label={copied === "rgb" ? "Copied" : "Copy"}
                      onClick={() => copyToClipboard(rgb, "rgb")}
                      variant={copied === "rgb" ? "success" : "ghost"}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">
                  HSL Color
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={hsl}
                    onChange={(e) => handleHslChange(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl font-mono text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 text-slate-800 transition-all"
                    placeholder="hsl(0, 0%, 0%)"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <ActionButton
                      icon={copied === "hsl" ? Check : Copy}
                      label={copied === "hsl" ? "Copied" : "Copy"}
                      onClick={() => copyToClipboard(hsl, "hsl")}
                      variant={copied === "hsl" ? "success" : "ghost"}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
