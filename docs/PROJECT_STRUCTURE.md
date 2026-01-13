# Proje Dosya Yapısı - Refactoring Kılavuzu

> ⚠️ **KRİTİK DOKÜMAN**
> Bu dosya projenin damar yapısını temsil eder. Değişiklikler dikkatli planlanmalı.
> Her değişiklik öncesi `npm run build` ve `npm run test` çalıştırılmalı.
> Son güncelleme: 2025-12-26

---

## Güvenlik Kuralları

### Her Değişiklik Öncesi:
```bash
# 1. Mevcut durumu kaydet
git status
git stash  # (eğer uncommitted değişiklik varsa)

# 2. Test et
npm run build
npm run test:run

# 3. Yedek al
git checkout -b refactor/[değişiklik-adı]
```

### Her Değişiklik Sonrası:
```bash
# 1. Build kontrol
npm run build

# 2. Test kontrol
npm run test:run

# 3. Type kontrol
npm run type-check

# 4. Dev server kontrol
npm run dev
# Manuel test: Ana sayfa, bir araç, AI özelliği

# 5. Sorun varsa geri al
git checkout main
git branch -D refactor/[değişiklik-adı]
```

---

## Mevcut Yapı Haritası

```
src/
│
├── index.tsx ─────────────────► Uygulama giriş noktası
├── App.tsx ───────────────────► Router + Layout + Providers
├── routes.tsx ────────────────► Tüm route tanımları (230 satır)
│
├── constants.tsx ─────────────► RE-EXPORT: @/config/allTools
│   └── Bağımlılar: 3 dosya import ediyor
│
├── types.ts ──────────────────► ToolDef, ToolCategory interfaces
│   └── Bağımlılar: ~10 dosya import ediyor
│
├── config/
│   └── allTools.tsx ──────────► 170+ araç tanımı (940 satır)
│       └── Bağımlılar: routes.tsx, SeoManager, Home, ToolGrid
│
├── components/
│   ├── SEO.tsx ◄──────────────── useSeo hook kullanır
│   ├── SeoManager.tsx ◄──────── ALL_TOOLS, SEO, useSeo kullanır
│   ├── Layout.tsx ◄───────────── useToolHistory, Header, Footer
│   ├── ToolCard.tsx ◄─────────── types.ts (ToolDef)
│   └── ...
│
├── hooks/
│   ├── useSeo.ts ◄────────────── SEO.tsx tarafından kullanılır
│   ├── useToolHistory.ts ◄────── Layout, Home, ToolGrid
│   ├── useToolLogic.ts ◄─────── Tüm araçlar
│   └── ...
│
├── features/
│   ├── Home/ ◄────────────────── ALL_TOOLS, useToolHistory, SEO
│   └── [80+ araç]/
│       └── index.tsx ◄────────── useToolLogic, ToolHeader, CodeEditor
│
└── services/
    └── geminiService.ts ◄─────── AiAssistant, ParaphrasingTool
```

---

## Bağımlılık Matrisi

### constants.tsx Bağımlılıkları
```bash
# Kim import ediyor?
grep -r "from '@/constants'" src/ --include="*.tsx" --include="*.ts"
```

| Dosya | Import |
|-------|--------|
| `src/components/SeoManager.tsx` | `ALL_TOOLS` |
| `src/components/Layout.tsx` | `ALL_TOOLS` |
| `src/features/Home/index.tsx` | `ALL_TOOLS` |

### types.ts Bağımlılıkları
```bash
grep -r "from '@/types'" src/ --include="*.tsx" --include="*.ts"
# veya
grep -r "from '../types'" src/ --include="*.tsx" --include="*.ts"
```

### geminiService.ts Bağımlılıkları
```bash
grep -r "geminiService" src/ --include="*.tsx" --include="*.ts"
```

| Dosya | Import |
|-------|--------|
| `src/features/AiAssistant/index.tsx` | `generateCodeHelp` |
| `src/features/ParaphrasingTool/index.tsx` | `paraphraseText` |

---

## Değişiklik Planları

---

### 1. Boş Klasörleri Sil

**Risk:** ✅ Düşük (kullanılmıyor)

**Etkilenen:** Hiçbir şey

```bash
# Kontrol et (boş olduğundan emin ol)
ls -la src/lib/
ls -la src/components/ui/

# Sil
rm -rf src/lib src/components/ui

# Doğrula
npm run build
```

---

### 2. constants.tsx Kaldır

**Risk:** 🟡 Orta (3 dosya etkilenir)

**Mevcut:**
```typescript
// src/constants.tsx
export { ALL_TOOLS } from '@/config/allTools';
```

**Adımlar:**

```bash
# 1. Bağımlılıkları bul
grep -rn "from '@/constants'" src/

# 2. Her dosyayı güncelle
```

**Değişiklikler:**

```typescript
// ÖNCE (3 dosyada)
import { ALL_TOOLS } from '@/constants';

// SONRA
import { ALL_TOOLS } from '@/config/allTools';
```

**Etkilenen Dosyalar:**
1. `src/components/SeoManager.tsx`
2. `src/components/Layout.tsx`
3. `src/features/Home/index.tsx`

**Script:**
```bash
# macOS/Linux
sed -i '' "s|from '@/constants'|from '@/config/allTools'|g" \
  src/components/SeoManager.tsx \
  src/components/Layout.tsx \
  src/features/Home/index.tsx

# Sonra sil
rm src/constants.tsx

# Test
npm run build && npm run test:run
```

---

### 3. geminiService.ts → aiService.ts

**Risk:** 🟡 Orta (2 dosya etkilenir)

**Mevcut:**
```
src/services/geminiService.ts
```

**Hedef:**
```
src/services/aiService.ts
```

**Adımlar:**

```bash
# 1. Dosyayı yeniden adlandır
mv src/services/geminiService.ts src/services/aiService.ts

# 2. Import'ları güncelle
sed -i '' "s|from '@/services/geminiService'|from '@/services/aiService'|g" \
  src/features/AiAssistant/index.tsx \
  src/features/ParaphrasingTool/index.tsx

# 3. Test
npm run build && npm run test:run
```

**Değişiklikler:**

```typescript
// src/features/AiAssistant/index.tsx
// ÖNCE
import { generateCodeHelp } from '@/services/geminiService';
// SONRA
import { generateCodeHelp } from '@/services/aiService';

// src/features/ParaphrasingTool/index.tsx
// ÖNCE
import { paraphraseText } from '@/services/geminiService';
// SONRA
import { paraphraseText } from '@/services/aiService';
```

---

### 4. routes.tsx Parçalama

**Risk:** 🔴 Yüksek (tüm routing etkilenir)

**Mevcut:** 230 satır, 80+ lazy import, 80+ route

**Hedef Yapı:**
```
src/routes/
├── index.tsx           # Ana router export
├── lazyImports.ts      # Tüm lazy importlar
├── toolRoutes.tsx      # Araç route'ları
└── staticRoutes.tsx    # Privacy, Terms, NotFound
```

**Adımlar:**

#### Adım 1: Klasör oluştur
```bash
mkdir -p src/routes
```

#### Adım 2: lazyImports.ts oluştur
```typescript
// src/routes/lazyImports.ts
import { lazy } from 'react';

// Helper function
const lazyLoad = (
  importFn: () => Promise<{ [key: string]: React.ComponentType }>,
  componentName: string
) => {
  return lazy(() =>
    importFn().then(module => ({
      default: module[componentName],
    }))
  );
};

// Araçlar
export const JsonFormatter = lazyLoad(() => import('@/features/JsonFormatter'), 'JsonFormatter');
export const Base64Converter = lazyLoad(() => import('@/features/Base64Converter'), 'Base64Converter');
// ... diğerleri
```

#### Adım 3: toolRoutes.tsx oluştur
```typescript
// src/routes/toolRoutes.tsx
import { RouteObject } from 'react-router-dom';
import * as Tools from './lazyImports';

export const toolRoutes: RouteObject[] = [
  { path: '/json-formatter', element: <Tools.JsonFormatter /> },
  { path: '/base64-converter', element: <Tools.Base64Converter /> },
  // ... diğerleri
];
```

#### Adım 4: staticRoutes.tsx oluştur
```typescript
// src/routes/staticRoutes.tsx
import { RouteObject } from 'react-router-dom';
import * as Pages from './lazyImports';

export const staticRoutes: RouteObject[] = [
  { path: '/privacy', element: <Pages.PrivacyPolicy /> },
  { path: '/terms', element: <Pages.TermsOfService /> },
  { path: '*', element: <Pages.NotFound /> },
];
```

#### Adım 5: index.tsx oluştur
```typescript
// src/routes/index.tsx
import { RouteObject } from 'react-router-dom';
import { toolRoutes } from './toolRoutes';
import { staticRoutes } from './staticRoutes';
import * as Pages from './lazyImports';

export const routes: RouteObject[] = [
  { path: '/', element: <Pages.Home /> },
  ...toolRoutes,
  ...staticRoutes,
];
```

#### Adım 6: App.tsx güncelle
```typescript
// ÖNCE
import { routes } from './routes';

// SONRA
import { routes } from './routes';  // Aynı kalıyor, path değişti
```

#### Adım 7: Eski dosyayı sil
```bash
rm src/routes.tsx
```

#### Doğrulama:
```bash
npm run build
npm run test:run
npm run dev
# Manuel: Birkaç araç sayfasını test et
```

---

### 5. allTools.tsx Parçalama

**Risk:** 🔴 Yüksek (tüm araç tanımları etkilenir)

**Mevcut:** 940 satır, 170+ araç tek dosyada

**Hedef Yapı:**
```
src/config/
├── tools/
│   ├── index.ts            # Export all
│   ├── formatters.ts       # Formatter araçları
│   ├── converters.ts       # Converter araçları
│   ├── generators.ts       # Generator araçları
│   ├── encoders.ts         # Encoder/Decoder araçları
│   ├── cryptography.ts     # Crypto araçları
│   ├── validators.ts       # Validator araçları
│   ├── ai.ts               # AI araçları
│   └── misc.ts             # Diğerleri
├── categories.ts           # ToolCategory enum
└── allTools.tsx            # ← KALDIR (sonra)
```

**Adımlar:**

#### Adım 1: categories.ts oluştur
```typescript
// src/config/categories.ts
export enum ToolCategory {
  FORMATTERS = 'Formatters & Beautifiers',
  CONVERTERS = 'Converters',
  GENERATORS = 'Generators',
  // ... diğerleri
}
```

#### Adım 2: tools/ klasörü oluştur
```bash
mkdir -p src/config/tools
```

#### Adım 3: Her kategori için dosya oluştur
```typescript
// src/config/tools/formatters.ts
import { FileJson, Code, Database } from 'lucide-react';
import { ToolDef } from '@/types';
import { ToolCategory } from '../categories';

export const formatterTools: ToolDef[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    // ...
  },
  // ...
];
```

#### Adım 4: index.ts oluştur
```typescript
// src/config/tools/index.ts
import { formatterTools } from './formatters';
import { converterTools } from './converters';
// ... diğerleri

export const ALL_TOOLS = [
  ...formatterTools,
  ...converterTools,
  // ...
];

// Kategorileri de export et
export * from '../categories';
```

#### Adım 5: Bağımlılıkları güncelle
```typescript
// Tüm dosyalarda:
// ÖNCE
import { ALL_TOOLS } from '@/config/allTools';
// SONRA
import { ALL_TOOLS } from '@/config/tools';
```

#### Adım 6: Eski dosyayı sil
```bash
rm src/config/allTools.tsx
```

---

### 6. components/ Reorganizasyonu

**Risk:** 🔴 Yüksek (çok dosya etkilenir)

**Mevcut:**
```
components/
├── common/     (4 dosya)
├── home/       (4 dosya)
├── ui/         (boş)
└── 12 dosya (root)
```

**Hedef:**
```
components/
├── common/         # Her yerde kullanılan
│   ├── Button.tsx
│   ├── ActionButton.tsx
│   ├── CodeEditor.tsx
│   ├── ToolHeader.tsx
│   ├── Loading.tsx
│   └── ErrorBoundary.tsx
│
├── layout/         # Sayfa yapısı
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── MegaMenu.tsx
│   ├── MobileMenu.tsx
│   └── ScrollToTop.tsx
│
├── seo/            # SEO componentleri
│   ├── SEO.tsx
│   ├── SeoManager.tsx
│   └── Analytics.tsx
│
├── home/           # Home page özel
│   ├── HeroSection.tsx
│   ├── Sidebar.tsx
│   ├── ToolGrid.tsx
│   ├── FavoritesSection.tsx
│   ├── ToolCard.tsx
│   ├── ToolDirectory.tsx
│   └── CategoryCard.tsx
│
└── index.ts        # Barrel export
```

**Bu değişiklik çok kapsamlı - ayrı bir PR olarak yapılmalı.**

---

## Öncelik Sırası

| # | Değişiklik | Risk | Import Değişikliği | Öncelik |
|---|------------|------|-------------------|---------|
| 1 | Boş klasörleri sil | ✅ Düşük | Yok | 🟢 Hemen |
| 2 | constants.tsx kaldır | 🟡 Orta | 3 dosya | 🟢 Hemen |
| 3 | geminiService → aiService | 🟡 Orta | 2 dosya | 🟡 AI geçişiyle |
| 4 | routes.tsx parçala | 🔴 Yüksek | 1 dosya (App.tsx) | 🟠 Sonra |
| 5 | allTools.tsx parçala | 🔴 Yüksek | 4+ dosya | 🟠 Sonra |
| 6 | components/ reorganize | 🔴 Yüksek | 20+ dosya | 🔴 En son |

---

## Doğrulama Scripti

Her değişiklik sonrası çalıştır:

```bash
#!/bin/bash
# validate.sh

echo "🔍 Build kontrolü..."
npm run build || { echo "❌ Build BAŞARISIZ"; exit 1; }

echo "🧪 Test kontrolü..."
npm run test:run || { echo "❌ Testler BAŞARISIZ"; exit 1; }

echo "📝 Type kontrolü..."
npm run type-check || { echo "❌ Type hatası"; exit 1; }

echo "✅ Tüm kontroller başarılı!"
```

---

## Import Yolu Referansı

| Alias | Gerçek Yol |
|-------|------------|
| `@/` | `./src/` |
| `@/components` | `./src/components` |
| `@/features` | `./src/features` |
| `@/hooks` | `./src/hooks` |
| `@/config` | `./src/config` |
| `@/services` | `./src/services` |
| `@/types` | `./src/types` |
| `@/utils` | `./src/utils` |
| `@/contexts` | `./src/contexts` |

**tsconfig.json ve vite.config.ts'de tanımlı.**

---

## Acil Durum: Geri Alma

Bir şey kırıldıysa:

```bash
# Son commit'e dön
git checkout .

# Veya belirli bir dosyayı geri al
git checkout HEAD -- src/[dosya-yolu]

# Veya tüm branch'i sil ve main'e dön
git checkout main
git branch -D refactor/[değişiklik-adı]
```

---

## Notlar

1. **Her değişiklik ayrı commit olmalı** - Kolay geri alma için
2. **Büyük değişiklikler ayrı branch'te yapılmalı**
3. **Manuel test şart** - Build başarılı olsa bile
4. **Paralel değişiklik yapma** - Bir tamamlanmadan diğerine geçme
