import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Command,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  History,
} from "lucide-react";
import { ALL_TOOLS } from "@/constants";

// Helper to detect content type (Same as before)
const detectContent = (text: string) => {
  if (!text || text.length > 10000) return null;
  const trimmed = text.trim();
  if (
    (trimmed.startsWith("{") || trimmed.startsWith("[")) &&
    (trimmed.endsWith("}") || trimmed.endsWith("]"))
  ) {
    try {
      JSON.parse(trimmed);
      return { type: "json", label: "Format JSON", toolId: "json-formatter" };
    } catch (e) {}
  }
  if (/^\d{10}(\d{3})?$/.test(trimmed))
    return {
      type: "date",
      label: "Convert Timestamp",
      toolId: "date-converter",
    };
  if (
    trimmed.length > 20 &&
    /^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) &&
    trimmed.length % 4 === 0
  ) {
    try {
      if (/[\x20-\x7E]/.test(atob(trimmed)))
        return {
          type: "base64",
          label: "Decode Base64",
          toolId: "base64-converter",
        };
    } catch (e) {}
  }
  return null;
};

const Popup = () => {
  const [search, setSearch] = useState("");
  const [smartAction, setSmartAction] = useState<{
    type: string;
    label: string;
    toolId: string;
  } | null>(null);
  const [clipboardPreview, setClipboardPreview] = useState("");
  const [recents, setRecents] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  // Load state
  useEffect(() => {
    const savedRecents = localStorage.getItem("dulundu_recents");
    if (savedRecents) setRecents(JSON.parse(savedRecents));

    const savedFavs = localStorage.getItem("dulundu_favs");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    // Clock ticker
    const interval = setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  // Clipboard logic (Same as before)
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          const detected = detectContent(text);
          if (detected) {
            setSmartAction(detected);
            setClipboardPreview(
              text.substring(0, 40) + (text.length > 40 ? "..." : "")
            );
          }
        }
      } catch (e) {}
    };
    checkClipboard();
    window.addEventListener("focus", checkClipboard);
    const timer = setTimeout(checkClipboard, 100);
    return () => {
      window.removeEventListener("focus", checkClipboard);
      clearTimeout(timer);
    };
  }, []);

  const handleToolClick = (path: string, id: string, input?: string) => {
    // Update recents
    const newRecents = [id, ...recents.filter((r) => r !== id)].slice(0, 4);
    setRecents(newRecents);
    localStorage.setItem("dulundu_recents", JSON.stringify(newRecents));

    const baseUrl = import.meta.env.VITE_APP_URL;
    if (!baseUrl) {
      console.error("VITE_APP_URL not configured");
      return;
    }
    const url = input
      ? `${baseUrl}${path}#input=${input}`
      : `${baseUrl}${path}`;
    chrome.tabs.create({ url });
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("dulundu_favs", JSON.stringify(newFavs));
  };

  const filteredTools = useMemo(() => {
    if (!search.trim()) return ALL_TOOLS.slice(0, 20); // Show more by default
    const lowerSearch = search.toLowerCase();
    return ALL_TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerSearch) ||
        tool.description.toLowerCase().includes(lowerSearch) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch))
    ).slice(0, 20);
  }, [search]);

  const recentTools = useMemo(
    () =>
      ALL_TOOLS.filter((t) => recents.includes(t.id)).sort(
        (a, b) => recents.indexOf(a.id) - recents.indexOf(b.id)
      ),
    [recents]
  );
  const favoriteTools = useMemo(
    () => ALL_TOOLS.filter((t) => favorites.includes(t.id)),
    [favorites]
  );

  return (
    <div className="w-[400px] h-[550px] bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header & Search */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm space-y-3">
        {/* Quick Info Bar */}
        <div className="flex justify-between items-center text-xs text-slate-500 font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors active:scale-95"
            onClick={() => {
              navigator.clipboard.writeText(now.toString());
              // Simple visual feedback could be added here
            }}
            title="Click to copy Unix Timestamp"
          >
            <Clock size={12} className="text-primary" />
            <span className="font-semibold">Unix:</span>
            <span>{now}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>
        {/* Smart Action */}
        {smartAction && !search && (
          <div
            onClick={async () => {
              const tool = ALL_TOOLS.find((t) => t.id === smartAction.toolId);
              if (tool) {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text)
                    handleToolClick(
                      tool.path,
                      tool.id,
                      encodeURIComponent(text)
                    );
                } catch (e) {
                  handleToolClick(tool.path, tool.id);
                }
              }
            }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Sparkles size={14} className="fill-blue-400" />
                {smartAction.label}
              </div>
              <ArrowRight
                size={14}
                className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
              />
            </div>
            <div className="text-xs text-slate-500 font-mono bg-white/50 p-1.5 rounded border border-blue-100/50 truncate">
              {clipboardPreview}
            </div>
          </div>
        )}

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tools (e.g. JSON, Base64)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Recents & Favorites (Only when not searching) */}
        {!search && (recents.length > 0 || favorites.length > 0) && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="col-span-2 space-y-1">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />{" "}
                  Favorites
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {favoriteTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.path, tool.id)}
                      className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all text-left"
                    >
                      <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded">
                        <tool.icon size={14} />
                      </div>
                      <span className="text-xs font-medium truncate">
                        {tool.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recents Section */}
            {recents.length > 0 && (
              <div className="col-span-2 space-y-1 mt-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
                  <History size={10} /> Recently Used
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {recentTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.path, tool.id)}
                      className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all text-left"
                    >
                      <div className="p-1.5 bg-slate-50 text-slate-500 rounded">
                        <tool.icon size={14} />
                      </div>
                      <span className="text-xs font-medium truncate">
                        {tool.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* All Tools List */}
        <div className="space-y-1">
          {!search && (
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
              All Tools
            </h4>
          )}
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.path, tool.id)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200 transition-all group flex items-center gap-3 border border-transparent relative"
              >
                <div className="p-2 bg-blue-50 text-primary rounded-md group-hover:bg-blue-100 transition-colors">
                  <tool.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-slate-800 truncate">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {tool.description}
                  </p>
                </div>

                {/* Favorite Button */}
                <div
                  onClick={(e) => toggleFavorite(e, tool.id)}
                  className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${
                    favorites.includes(tool.id)
                      ? "text-yellow-400"
                      : "text-slate-300 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Star
                    size={14}
                    className={
                      favorites.includes(tool.id) ? "fill-current" : ""
                    }
                  />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Command size={40} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs">No tools found</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 bg-white text-[10px] text-center text-slate-400 flex justify-between px-4">
        <span>Dulundu Tools v1.1</span>
        <span>{ALL_TOOLS.length} Tools</span>
      </div>
    </div>
  );
};

export default Popup;
