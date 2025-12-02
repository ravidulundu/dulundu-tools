import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  RefreshCw,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { ToolHeader } from "../components/common/ToolHeader";
import { ActionButton } from "../components/common/ActionButton";

export const DateConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState<number>(
    Math.floor(Date.now() / 1000)
  );
  const [iso, setIso] = useState("");
  const [local, setLocal] = useState("");
  const [utc, setUtc] = useState("");

  useEffect(() => {
    // Check for input in URL hash (from extension)
    const hash = window.location.hash;
    if (hash.includes("input=")) {
      try {
        const params = new URLSearchParams(hash.substring(1));
        const inputParam = params.get("input");
        if (inputParam) {
          const decoded = decodeURIComponent(inputParam);
          // Try to parse as number (timestamp)
          const ts = parseInt(decoded);
          if (!isNaN(ts)) {
            handleTsChange(decoded); // Reuse existing logic
            window.history.replaceState(null, "", window.location.pathname);
            return; // Skip default updateFromTs
          }
        }
      } catch (e) {}
    }

    updateFromTs(timestamp);
  }, []);

  const updateFromTs = (ts: number) => {
    setTimestamp(ts);
    const date = new Date(ts * 1000);
    setIso(date.toISOString());
    setLocal(date.toLocaleString());
    setUtc(date.toUTCString());
  };

  const handleTsChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num)) {
      // Heuristic to detect milliseconds vs seconds
      if (num > 100000000000) {
        updateFromTs(Math.floor(num / 1000));
      } else {
        updateFromTs(num);
      }
    }
  };

  const handleIsoChange = (val: string) => {
    setIso(val);
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      updateFromTs(Math.floor(date.getTime() / 1000));
    }
  };

  const setToNow = () => {
    updateFromTs(Math.floor(Date.now() / 1000));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Calendar}
          title="Date & Epoch Converter"
          description="Convert between Unix Timestamps and Human Dates"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <ActionButton
            onClick={setToNow}
            icon={Clock}
            label="Set to Now"
            variant="secondary"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Epoch Input */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-wide">
                  Unix Timestamp (Seconds)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={timestamp}
                    onChange={(e) => handleTsChange(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg text-slate-800"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Supports seconds or milliseconds (auto-detected)
                </p>
              </div>

              {/* ISO Input */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-wide">
                  ISO 8601 Date
                </label>
                <input
                  type="text"
                  value={iso}
                  onChange={(e) => handleIsoChange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-lg text-slate-800"
                  placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Standard exchange format
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-gray-200 font-bold text-slate-700 text-sm uppercase tracking-wide">
                Converted Results
              </div>
              <div className="divide-y divide-gray-100">
                <ResultRow label="Local Time" value={local} />
                <ResultRow label="UTC / GMT" value={utc} />
                <ResultRow
                  label="Unix Timestamp (Milliseconds)"
                  value={(timestamp * 1000).toString()}
                />
                <ResultRow
                  label="Unix Timestamp (Seconds)"
                  value={timestamp.toString()}
                />
                <ResultRow
                  label="Relative"
                  value={(() => {
                    const diff = Date.now() - timestamp * 1000;
                    const rtf = new Intl.RelativeTimeFormat("en", {
                      numeric: "auto",
                    });
                    if (Math.abs(diff) < 1000) return "Just now";
                    if (Math.abs(diff) < 60000)
                      return rtf.format(-Math.round(diff / 1000), "seconds");
                    if (Math.abs(diff) < 3600000)
                      return rtf.format(-Math.round(diff / 60000), "minutes");
                    if (Math.abs(diff) < 86400000)
                      return rtf.format(-Math.round(diff / 3600000), "hours");
                    return rtf.format(-Math.round(diff / 86400000), "days");
                  })()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors group">
      <span className="text-sm font-medium text-slate-500 mb-1 md:mb-0">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-slate-800 font-bold text-lg">
          {value}
        </span>
        <ActionButton
          onClick={handleCopy}
          icon={copied ? Check : Copy}
          variant="ghost"
          className={
            copied ? "text-green-500" : "text-slate-400 hover:text-primary"
          }
          title="Copy"
        />
      </div>
    </div>
  );
};
