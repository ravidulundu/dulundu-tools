# Dulundu Tools - Geliştirme Yol Haritası

> Bu belge, projenin gelecekteki geliştirme planlarını ve önerilerini içerir.
> Son güncelleme: 2025-12-26

---

## Mevcut Durum Analizi

### Güçlü Yanlar
- 100+ developer aracı - geniş kapsam
- Client-side processing - kullanıcı verisi sunucuya gitmez
- Lazy loading ile hızlı initial load
- Chrome extension mevcut
- Modern stack (React 19, TypeScript, Vite)
- Temiz tema sistemi (CSS variables)

### Zayıf Yanlar
- Favoriler ve kullanım geçmişi yok
- Offline çalışma desteği yok (PWA değil)
- CLI aracı yok
- VS Code extension yok
- Büyük dosyalarda performans sorunları
- Keyboard shortcuts eksik

---

## Öneri 1: Rust/WASM Entegrasyonu

### Neden?
JavaScript, CPU-intensive işlemlerde yavaş kalıyor. Rust + WebAssembly ile 10-100x performans artışı sağlanabilir.

### Hangi Araçlar İçin?

| Araç | Mevcut Durum | WASM ile Beklenen | Öncelik |
|------|--------------|-------------------|---------|
| JSON Formatter | JS - yavaş (>10MB) | 10-50x hızlı | HIGH |
| GZIP Compressor | pako.js | 5-20x hızlı | HIGH |
| Image Processing | Canvas API | 10-100x hızlı | HIGH |
| Regex Tester | JS RegExp | Rust regex daha güçlü | MEDIUM |
| Hash Generator | SubtleCrypto | Daha hızlı SHA512 | MEDIUM |
| Code Formatter | Prettier | dprint ile değiştir | MEDIUM |

### Implementasyon Planı

```bash
# 1. Rust toolchain kurulumu
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack

# 2. WASM paketi oluşturma
mkdir packages/wasm-tools
cd packages/wasm-tools
wasm-pack new .
```

### Örnek Rust Kodu (JSON Formatter)

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;
use serde_json::{from_str, to_string_pretty, Value};

#[wasm_bindgen]
pub fn format_json(input: &str, indent: usize) -> Result<String, JsValue> {
    let value: Value = from_str(input)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;

    let formatter = serde_json::ser::PrettyFormatter::with_indent(
        &" ".repeat(indent).into_bytes()
    );
    let mut buf = Vec::new();
    let mut ser = serde_json::Serializer::with_formatter(&mut buf, formatter);
    value.serialize(&mut ser)
        .map_err(|e| JsValue::from_str(&format!("Serialize error: {}", e)))?;

    String::from_utf8(buf)
        .map_err(|e| JsValue::from_str(&format!("UTF8 error: {}", e)))
}

#[wasm_bindgen]
pub fn minify_json(input: &str) -> Result<String, JsValue> {
    let value: Value = from_str(input)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
    serde_json::to_string(&value)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn validate_json(input: &str) -> bool {
    from_str::<Value>(input).is_ok()
}
```

### Cargo.toml

```toml
[package]
name = "dulundu-wasm"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
flate2 = "1.0"  # for gzip
image = "0.24"  # for image processing
regex = "1.10"  # for regex

[profile.release]
opt-level = "s"
lto = true
```

### React Entegrasyonu

```typescript
// src/lib/wasm.ts
let wasmModule: typeof import('dulundu-wasm') | null = null;

export async function loadWasm() {
  if (!wasmModule) {
    wasmModule = await import('dulundu-wasm');
  }
  return wasmModule;
}

export async function formatJsonWasm(input: string, indent = 2): Promise<string> {
  const wasm = await loadWasm();
  return wasm.format_json(input, indent);
}

// Fallback to JS if WASM fails
export async function formatJson(input: string, indent = 2): Promise<string> {
  try {
    return await formatJsonWasm(input, indent);
  } catch {
    // Fallback to JavaScript
    return JSON.stringify(JSON.parse(input), null, indent);
  }
}
```

---

## Öneri 2: Go Backend Değerlendirmesi

### Mevcut Express.js Backend Analizi

| Endpoint | Kullanım | Yük |
|----------|----------|-----|
| POST /api/ai/generate | Gemini proxy | Düşük |
| POST /api/ai/paraphrase | Gemini proxy | Düşük |
| POST /api/share | Share link oluştur | Düşük |
| GET /api/share/:id | Share link getir | Düşük |

### Karar: Go'ya Geçiş Gereksiz

**Sebepler:**
1. Mevcut yük Express.js için yeterli
2. Tüm ağır işlemler client-side
3. Migration maliyeti yüksek, fayda düşük
4. Node.js ecosystem avantajları (npm packages)

### Go Ne Zaman Mantıklı Olur?

1. **Public API sunulacaksa**
   - API key yönetimi
   - Rate limiting per user
   - Usage analytics

2. **Yüksek concurrent load**
   - 10,000+ simultaneous users
   - Heavy server-side processing

3. **Microservices mimarisi**
   - Ayrı servisler (auth, storage, processing)
   - Kubernetes deployment

### Alternatif: Mevcut Backend İyileştirmeleri

```javascript
// server.js improvements

// 1. Response caching
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 });

app.get('/api/share/:id', async (req, res) => {
  const cached = cache.get(req.params.id);
  if (cached) return res.json(cached);
  // ... fetch from storage
  cache.set(req.params.id, data);
  res.json(data);
});

// 2. Request validation with Zod
import { z } from 'zod';

const ShareSchema = z.object({
  content: z.string().max(5 * 1024 * 1024), // 5MB limit
  expiresIn: z.number().min(1).max(30).default(7),
});

// 3. Better error handling
app.use((err, req, res, next) => {
  logger.error({ err, path: req.path });
  res.status(500).json({
    error: 'Internal error',
    requestId: req.id
  });
});
```

---

## Öneri 3: Favorites & History Sistemi

### Özellikler

1. **Favorites (Yıldızlı Araçlar)**
   - Her araçta yıldız butonu
   - Anasayfada "Favorites" section
   - localStorage'da sakla

2. **History (Son Kullanılanlar)**
   - Son 20 kullanılan araç
   - Otomatik tracking
   - "Clear history" butonu

3. **Presets (Kayıtlı Ayarlar)**
   - Her araç için özel ayarlar
   - "Save as preset" butonu
   - Preset isimlendirme

### Implementasyon

```typescript
// src/hooks/useToolHistory.ts
import { useLocalStorage } from './useLocalStorage';

interface ToolUsage {
  id: string;
  lastUsed: number;
  useCount: number;
}

export function useToolHistory() {
  const [history, setHistory] = useLocalStorage<ToolUsage[]>('tool-history', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('tool-favorites', []);

  const trackUsage = (toolId: string) => {
    setHistory(prev => {
      const existing = prev.find(t => t.id === toolId);
      if (existing) {
        return prev
          .map(t => t.id === toolId
            ? { ...t, lastUsed: Date.now(), useCount: t.useCount + 1 }
            : t
          )
          .sort((a, b) => b.lastUsed - a.lastUsed)
          .slice(0, 20);
      }
      return [
        { id: toolId, lastUsed: Date.now(), useCount: 1 },
        ...prev.slice(0, 19)
      ];
    });
  };

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  const recentTools = history.slice(0, 10);
  const mostUsedTools = [...history].sort((a, b) => b.useCount - a.useCount).slice(0, 5);

  return {
    history,
    favorites,
    recentTools,
    mostUsedTools,
    trackUsage,
    toggleFavorite,
    isFavorite,
    clearHistory: () => setHistory([]),
  };
}
```

### UI Komponenti

```tsx
// src/components/FavoriteButton.tsx
import { Star } from 'lucide-react';
import { useToolHistory } from '@/hooks/useToolHistory';

interface FavoriteButtonProps {
  toolId: string;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ toolId, className }) => {
  const { isFavorite, toggleFavorite } = useToolHistory();
  const favorited = isFavorite(toolId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(toolId);
      }}
      className={`p-2 rounded-lg transition-colors ${
        favorited
          ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
          : 'text-foreground-muted hover:bg-background-secondary'
      } ${className}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star size={18} fill={favorited ? 'currentColor' : 'none'} />
    </button>
  );
};
```

---

## Öneri 4: PWA (Progressive Web App)

### Neden PWA?

1. **Offline çalışma** - İnternet olmadan da kullanılabilir
2. **Install prompt** - Masaüstüne/telefona kurulabilir
3. **Faster loads** - Service worker caching
4. **Push notifications** - Yeni araç bildirimleri

### Implementasyon

#### 1. Manifest Dosyası

```json
// public/manifest.json
{
  "name": "Dulundu Tools",
  "short_name": "Dulundu",
  "description": "100+ Free Developer Tools",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["developer", "productivity", "utilities"]
}
```

#### 2. Service Worker (Vite PWA Plugin)

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: false, // use manifest.json from public
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});
```

#### 3. Install Prompt Component

```tsx
// src/components/InstallPrompt.tsx
import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-xl shadow-lg p-4 max-w-sm z-50">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 text-foreground-muted hover:text-foreground"
      >
        <X size={18} />
      </button>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-light text-primary rounded-lg">
          <Download size={24} />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Install Dulundu Tools</h3>
          <p className="text-sm text-foreground-muted mt-1">
            Install for faster access and offline support
          </p>
          <button
            onClick={handleInstall}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## Öneri 5: Keyboard Shortcuts

### Global Shortcuts

| Kısayol | Aksiyon |
|---------|---------|
| `Ctrl/Cmd + K` | Quick search açılır |
| `Ctrl/Cmd + /` | Keyboard shortcuts modal |
| `Ctrl/Cmd + ,` | Settings (varsa) |
| `Escape` | Modal/dialog kapat |

### Tool-Specific Shortcuts

| Kısayol | Aksiyon |
|---------|---------|
| `Ctrl/Cmd + Enter` | Execute/Format/Convert |
| `Ctrl/Cmd + S` | Download output |
| `Ctrl/Cmd + C` | Copy output (when focused) |
| `Ctrl/Cmd + V` | Paste to input |
| `Ctrl/Cmd + L` | Clear all |
| `Ctrl/Cmd + D` | Toggle dark mode |

### Implementasyon

```typescript
// src/hooks/useKeyboardShortcuts.ts
import { useEffect, useCallback } from 'react';

type ShortcutHandler = () => void;

interface Shortcuts {
  [key: string]: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: Shortcuts) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = [
      event.ctrlKey || event.metaKey ? 'mod' : '',
      event.shiftKey ? 'shift' : '',
      event.altKey ? 'alt' : '',
      event.key.toLowerCase(),
    ].filter(Boolean).join('+');

    const handler = shortcuts[key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// src/hooks/useQuickSearch.ts
import { create } from 'zustand';

interface QuickSearchStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useQuickSearch = create<QuickSearchStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
```

### Quick Search (Cmd+K) Component

```tsx
// src/components/QuickSearch.tsx
import { Search, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_TOOLS } from '@/config/allTools';
import { useQuickSearch } from '@/hooks/useQuickSearch';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export const QuickSearch: React.FC = () => {
  const { isOpen, close, toggle } = useQuickSearch();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Global shortcut
  useKeyboardShortcuts({
    'mod+k': toggle,
  });

  // Filter tools
  const filteredTools = ALL_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase()) ||
    tool.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredTools.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (filteredTools[selectedIndex]) {
          navigate(filteredTools[selectedIndex].path);
          close();
        }
        break;
      case 'Escape':
        close();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="text-foreground-muted" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 px-4 py-4 bg-transparent text-foreground placeholder:text-foreground-muted outline-none"
          />
          <kbd className="px-2 py-1 bg-background-secondary text-foreground-muted text-xs rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filteredTools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => {
                navigate(tool.path);
                close();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-primary text-white'
                  : 'hover:bg-background-secondary'
              }`}
            >
              <tool.icon size={20} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{tool.name}</div>
                <div className={`text-sm truncate ${
                  index === selectedIndex ? 'text-white/70' : 'text-foreground-muted'
                }`}>
                  {tool.description}
                </div>
              </div>
              <ArrowRight size={16} className="opacity-50" />
            </button>
          ))}

          {filteredTools.length === 0 && query && (
            <div className="px-4 py-8 text-center text-foreground-muted">
              No tools found for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-xs text-foreground-muted">
          <span><kbd className="px-1.5 py-0.5 bg-background-secondary rounded">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1.5 py-0.5 bg-background-secondary rounded">↵</kbd> Open</span>
          <span><kbd className="px-1.5 py-0.5 bg-background-secondary rounded">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};
```

---

## Öneri 6: CLI Tool (npm package)

### Kullanım Örnekleri

```bash
# Global install
npm install -g @dulundu/cli

# JSON formatting
dulundu json format input.json
dulundu json format input.json -o output.json
dulundu json minify input.json
cat data.json | dulundu json format

# Base64
dulundu base64 encode "Hello World"
dulundu base64 decode "SGVsbG8gV29ybGQ="
dulundu base64 encode -f image.png

# Hash
dulundu hash sha256 "password"
dulundu hash sha256 -f largefile.zip
dulundu hash md5 "text"

# UUID
dulundu uuid generate
dulundu uuid generate -c 10  # 10 UUIDs
dulundu uuid validate "550e8400-e29b-41d4-a716-446655440000"

# Password
dulundu password generate
dulundu password generate -l 32 --symbols
dulundu password strength "mypassword123"

# Convert
dulundu convert yaml-to-json input.yaml
dulundu convert json-to-yaml input.json
dulundu convert csv-to-json data.csv

# QR Code
dulundu qr generate "https://dulundu.tools" -o qr.png
dulundu qr read qr.png
```

### Package Structure

```
packages/cli/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # CLI entry point
│   ├── commands/
│   │   ├── json.ts
│   │   ├── base64.ts
│   │   ├── hash.ts
│   │   ├── uuid.ts
│   │   ├── password.ts
│   │   ├── convert.ts
│   │   └── qr.ts
│   └── utils/
│       ├── input.ts      # stdin/file handling
│       └── output.ts     # stdout/file handling
└── bin/
    └── dulundu.js
```

### package.json

```json
{
  "name": "@dulundu/cli",
  "version": "1.0.0",
  "description": "Developer tools from the command line",
  "bin": {
    "dulundu": "./bin/dulundu.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --watch"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.0"
  },
  "keywords": ["cli", "developer-tools", "json", "base64", "hash"]
}
```

### CLI Entry Point

```typescript
// src/index.ts
#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { jsonCommand } from './commands/json';
import { base64Command } from './commands/base64';
import { hashCommand } from './commands/hash';
import { uuidCommand } from './commands/uuid';

const program = new Command();

program
  .name('dulundu')
  .description('Developer tools from the command line')
  .version('1.0.0');

// Register commands
program.addCommand(jsonCommand);
program.addCommand(base64Command);
program.addCommand(hashCommand);
program.addCommand(uuidCommand);

// Parse arguments
program.parse();

// Show help if no command
if (!process.argv.slice(2).length) {
  console.log(chalk.blue.bold('\n  Dulundu CLI - Developer Tools\n'));
  program.outputHelp();
}
```

---

## Öneri 7: VS Code Extension

### Özellikler

1. **Context Menu Actions**
   - Seçili JSON'u format et
   - Seçili metni Base64'e çevir
   - Seçili metni URL encode et
   - Seçili metinden hash oluştur

2. **Command Palette**
   - `Dulundu: Format JSON`
   - `Dulundu: Generate UUID`
   - `Dulundu: Generate Password`
   - `Dulundu: Open Tool...`

3. **Status Bar**
   - Seçili metnin karakter sayısı
   - Quick access button

### Extension Structure

```
extensions/vscode/
├── package.json
├── tsconfig.json
├── src/
│   ├── extension.ts
│   ├── commands/
│   │   ├── formatJson.ts
│   │   ├── base64.ts
│   │   ├── hash.ts
│   │   └── uuid.ts
│   └── utils/
│       └── editor.ts
└── .vscodeignore
```

### package.json

```json
{
  "name": "dulundu-tools",
  "displayName": "Dulundu Tools",
  "description": "Developer tools integration for VS Code",
  "version": "1.0.0",
  "publisher": "dulundu",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Formatters", "Other"],
  "activationEvents": [],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "dulundu.formatJson",
        "title": "Dulundu: Format JSON"
      },
      {
        "command": "dulundu.minifyJson",
        "title": "Dulundu: Minify JSON"
      },
      {
        "command": "dulundu.base64Encode",
        "title": "Dulundu: Base64 Encode Selection"
      },
      {
        "command": "dulundu.base64Decode",
        "title": "Dulundu: Base64 Decode Selection"
      },
      {
        "command": "dulundu.generateUuid",
        "title": "Dulundu: Generate UUID"
      },
      {
        "command": "dulundu.hashSelection",
        "title": "Dulundu: Hash Selection (SHA256)"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "submenu": "dulundu.submenu",
          "group": "dulundu"
        }
      ],
      "dulundu.submenu": [
        {
          "command": "dulundu.formatJson",
          "when": "editorHasSelection"
        },
        {
          "command": "dulundu.base64Encode",
          "when": "editorHasSelection"
        },
        {
          "command": "dulundu.base64Decode",
          "when": "editorHasSelection"
        },
        {
          "command": "dulundu.hashSelection",
          "when": "editorHasSelection"
        }
      ]
    },
    "submenus": [
      {
        "id": "dulundu.submenu",
        "label": "Dulundu Tools"
      }
    ],
    "keybindings": [
      {
        "command": "dulundu.formatJson",
        "key": "ctrl+alt+f",
        "mac": "cmd+alt+f",
        "when": "editorTextFocus"
      }
    ]
  }
}
```

---

## Öneri 8: Tool Chains / Workflows

### Konsept

Kullanıcıların birden fazla aracı zincirleyerek tek tıkla çalıştırmasını sağla.

### Örnek Workflow'lar

```yaml
# JSON Minify & Base64
name: "API Payload Encoder"
steps:
  - tool: json-formatter
    action: minify
  - tool: base64-converter
    action: encode

# Password Hash Chain
name: "Secure Password"
steps:
  - tool: password-generator
    options:
      length: 32
      symbols: true
  - tool: bcrypt-generator
    options:
      rounds: 12

# Data Export
name: "Export to CSV"
steps:
  - tool: json-formatter
    action: format
  - tool: json-converter
    action: to-csv
  - action: download
    filename: "export.csv"
```

### UI Mockup

```
┌─────────────────────────────────────────────────────────────┐
│  My Workflows                                    [+ New]    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ API Encoder     │  │ Secure Hash     │                   │
│  │ JSON → Base64   │  │ Password → SHA  │                   │
│  │ [Run] [Edit]    │  │ [Run] [Edit]    │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Data Export     │  │ + Create New    │                   │
│  │ JSON → CSV      │  │   Workflow      │                   │
│  │ [Run] [Edit]    │  │                 │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Öneri 9: SEO & Discoverability

### Her Araç İçin Landing Page

```tsx
// Mevcut: Sadece araç sayfası
/json-formatter → <JsonFormatter />

// Öneri: SEO-optimized wrapper
/json-formatter → <ToolPage tool={jsonFormatter}>
                    <JsonFormatter />
                  </ToolPage>
```

### ToolPage Wrapper

```tsx
// src/components/ToolPage.tsx
import { Helmet } from 'react-helmet-async';

interface ToolPageProps {
  tool: ToolDef;
  children: React.ReactNode;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, children }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <>
      <Helmet>
        <title>{tool.name} - Free Online Tool | Dulundu Tools</title>
        <meta name="description" content={tool.description} />
        <meta property="og:title" content={tool.name} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://dulundu.tools${tool.path}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      {children}
    </>
  );
};
```

### Sitemap Generator

```typescript
// scripts/generate-sitemap.ts
import { ALL_TOOLS } from '../src/config/allTools';
import fs from 'fs';

const BASE_URL = 'https://dulundu.tools';

const generateSitemap = () => {
  const urls = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    ...ALL_TOOLS.map(tool => ({
      loc: tool.path,
      priority: 0.8,
      changefreq: 'weekly'
    })),
    { loc: '/privacy', priority: 0.3, changefreq: 'monthly' },
    { loc: '/terms', priority: 0.3, changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('Sitemap generated!');
};

generateSitemap();
```

---

## Geliştirme Öncelik Sırası

### Phase 1: Quick Wins ✅ TAMAMLANDI
- [x] Coming Soon'u tool listesinden kaldır
- [x] Favorites + History sistemi
- [x] Ctrl+K global search
- [x] PWA manifest + service worker
- [x] Keyboard shortcuts

### Phase 2: Performance (2-3 hafta)
- [ ] Rust/WASM: JSON formatter
- [ ] Rust/WASM: Gzip compressor
- [ ] Rust/WASM: Image processing
- [ ] Large file handling optimization

### Phase 3: Ecosystem (3-4 hafta)
- [ ] CLI npm package (@dulundu/cli)
- [ ] VS Code extension
- [ ] Tool chains/workflows
- [ ] Presets sistemi

### Phase 4: Growth (Ongoing)
- [ ] Blog section with SEO content
- [ ] Public API for developers
- [ ] Community templates/presets
- [ ] Integration guides

---

## Sonuç

Bu roadmap, Dulundu Tools'u "bir developer aracı sitesi"nden "developer'ların vazgeçilmez araç setine" dönüştürmek için gerekli adımları içeriyor.

**En kritik 3 özellik:**
1. **PWA + Offline** → "Her yerde çalışıyor, internet gerekmez"
2. **CLI + VS Code** → "Workflow'uma tam entegre"
3. **Favorites + History** → "Beni tanıyor, hızlıca erişiyorum"

**Rust/WASM:** Performans için önemli ama öncelik değil. Önce UX'i düzelt.

**Go Backend:** Gereksiz. Mevcut Express.js yeterli.
