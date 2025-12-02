
export interface IconifyIcon {
  name: string;
  title?: string;
}

export interface IconifySearchResult {
  icons: string[];
  total: number;
  limit: number;
  start: number;
  collections: Record<string, { name: string; author?: { name: string } }>;
}

const API_BASE = "https://api.iconify.design";

export const searchIcons = async (query: string, limit = 50, colorful = false): Promise<IconifySearchResult> => {
  if (!query) return { icons: [], total: 0, limit, start: 0, collections: {} };
  
  let url = `${API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  
  if (colorful) {
    // Known colorful icon sets
    const colorfulSets = [
      "noto",
      "twemoji",
      "flat-color-icons",
      "logos",
      "emojione",
      "fxemoji",
      "openmoji",
      "circle-flags"
    ].join(",");
    url += `&prefixes=${colorfulSets}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch icons");
  }
  return response.json();
};

export const getIconSvg = async (iconName: string): Promise<string> => {
  const [prefix, name] = iconName.split(":");
  const response = await fetch(`${API_BASE}/${prefix}/${name}.svg`);
  if (!response.ok) {
    throw new Error("Failed to fetch icon SVG");
  }
  return response.text();
};
