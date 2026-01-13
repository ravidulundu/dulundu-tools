# Technical Debt & İyileştirmeler

> Bu belge, landing page analizinde tespit edilen sorunları ve önerilen düzeltmeleri içerir.
> Son güncelleme: 2025-12-26

---

## 🔴 Kritik - Hemen Düzeltilmeli

### 1. Duplicate Return Statement (Bug)
**Dosya:** `src/features/Home/index.tsx` - Line 37

```typescript
// ÖNCE (buggy)
return matchesSearch && matchesCategory;
return matchesSearch && matchesCategory;  // ← Unreachable code

// SONRA (fixed)
return matchesSearch && matchesCategory;
```

**Etki:** İkinci return'e hiç ulaşılmıyor, ama kod kirliliği yaratıyor.

---

### 2. "New" Badge Enflasyonu
**Durum:** 170 araçtan 31'i `isNew: true` (%18.2)

**Sorun:**
- Çok fazla araç "New" olarak işaretli
- Manuel sistem, otomatik süre dolumu yok
- Badge anlamsızlaşmış durumda

**Çözüm Önerileri:**

**A) Basit Çözüm - Manuel Temizlik:**
```typescript
// Son 30 gün içinde eklenenleri tut, diğerlerinden isNew kaldır
// Gerçekten yeni olanlar: son 5-10 tool
```

**B) Kalıcı Çözüm - Otomatik Sistem:**
```typescript
interface ToolDef {
  // ... mevcut alanlar
  addedDate?: string; // "2025-12-01" formatında
}

// Kullanım
const isNew = tool.addedDate
  ? daysSince(tool.addedDate) < 30
  : false;
```

---

## 🟡 Orta Öncelik - Refactoring

### 3. MirrorOnline Aracı İyileştirmesi
**Dosya:** `src/features/MirrorOnline/index.tsx`
**Path:** `/mirror-online`

**Mevcut Durum:**
- Basit client-side fetch ile website status check
- `no-cors` mode kullanıyor (CORS bypass için)
- Sadece browser'dan erişilebilirliği kontrol ediyor

**Sorunlar:**
1. İsim karmaşası: "MirrorOnline" → site aynalama gibi anlaşılıyor
2. Gerçek "Is It Down" servisi değil - sadece client-side check
3. CORS, ad blockers, browser security policies yüzünden yanıltıcı sonuçlar verebilir
4. "Benim için mi down, herkes için mi?" sorusuna cevap veremiyor

**Çözüm Önerileri:**

**A) Backend Endpoint Ekle:**
```typescript
// server.js
app.get('/api/ping/:url', async (req, res) => {
  try {
    const response = await fetch(req.params.url);
    res.json({ status: 'up', statusCode: response.status });
  } catch (e) {
    res.json({ status: 'down', error: e.message });
  }
});
```

**B) 3rd Party API Kullan:**
- isitdownrightnow.com API
- downforeveryoneorjustme.com API

**C) Aracı Kaldır:**
- Çok basit ve yanıltıcı, değer katmıyor

---

### 4. Prop Drilling Sorunu
**Dosya:** `src/components/home/ToolGrid.tsx`

**Mevcut:** 12 prop alıyor
```typescript
interface ToolGridProps {
  isDirectoryView: boolean;
  popularTools: ToolDef[];
  activeCategory: string;
  filteredTools: ToolDef[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSearchParams: SetURLSearchParams;
  setActiveCategory: (category: string) => void;
  favoriteTools: ToolDef[];
  recentTools: ToolDef[];
  onFavoriteToggle: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
}
```

**Öneri:** Context API ile `ToolsContext` oluştur:
```typescript
// src/contexts/ToolsContext.tsx
interface ToolsContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filteredTools: ToolDef[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}
```

---

### 5. Sidebar Stil Tekrarı
**Dosya:** `src/components/home/Sidebar.tsx`

**Sorun:** Aynı buton stilleri 4 kez tekrarlanmış (desktop/mobile × All/Category)

**Öneri:** `NavButton` komponenti çıkar:
```tsx
interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'desktop' | 'mobile';
}

const NavButton: React.FC<NavButtonProps> = ({ ... }) => {
  // Ortak stiller burada
};
```

---

### 6. Home Component Karmaşıklığı
**Dosya:** `src/features/Home/index.tsx`

**Mevcut:** 152 satır, 22 const/function

**Öneri:** Custom hook'lara ayır:
```typescript
// src/hooks/useCategoryInfo.ts
export function useCategoryInfo() {
  return useMemo(() => {
    // categoryInfo logic
  }, []);
}

// src/hooks/useToolFiltering.ts
export function useToolFiltering(searchTerm: string, category: string) {
  return useMemo(() => {
    // filteredTools logic
  }, [searchTerm, category]);
}
```

---

## 🟢 Düşük Öncelik - Nice to Have

### 7. Gereksiz Memoization
**Dosyalar:** `src/features/Home/index.tsx`

```typescript
// Bu iki useMemo gereksiz, basit işlemler
const popularTools = useMemo(() => ALL_TOOLS.filter(t => t.popular), []);
const sortedCategories = useMemo(() => Object.keys(categoryInfo).sort(), [categoryInfo]);
```

Basit `.filter()` ve `.sort()` için memoization overhead'i genellikle gereksiz.

---

### 8. Empty Dependency Array Dokümantasyonu
**Dosya:** `src/features/Home/index.tsx` - Line 88

```typescript
const categoryInfo = useMemo(() => {
  // ALL_TOOLS kullanıyor ama dependency'de yok
}, []); // ⚠️ ALL_TOOLS hiç değişmediği için çalışıyor
```

**Öneri:** Yorum ekle veya ALL_TOOLS'u dependency'e al.

---

## Özet Tablo

| # | Sorun | Öncelik | Dosya | Tahmini Süre |
|---|-------|---------|-------|--------------|
| 1 | Duplicate return | 🔴 Kritik | Home/index.tsx | 1 dk |
| 2 | New badge temizliği | 🔴 Kritik | allTools.tsx | 15 dk |
| 3 | MirrorOnline iyileştir | 🟡 Orta | MirrorOnline/index.tsx | 1-2 saat |
| 4 | Prop drilling | 🟡 Orta | ToolGrid.tsx | 1-2 saat |
| 5 | Sidebar tekrarı | 🟡 Orta | Sidebar.tsx | 30 dk |
| 6 | Home karmaşıklığı | 🟡 Orta | Home/index.tsx | 1 saat |
| 7 | Gereksiz memo | 🟢 Düşük | Home/index.tsx | 5 dk |
| 8 | Dependency docs | 🟢 Düşük | Home/index.tsx | 2 dk |

---

## Aksiyon Planı

### Faz 1: Quick Fixes ✅ TAMAMLANDI
- [x] Duplicate return kaldır
- [x] 26 tool'dan isNew kaldır (sadece son 5 tutuldu)

### Faz 2: Refactoring ✅ TAMAMLANDI
- [x] MirrorOnline aracını iyileştir (backend ping eklendi)
- [x] NavButton komponenti çıkar
- [x] Custom hooks oluştur (useCategoryInfo, useToolFiltering)
- [x] ToolsContext ile prop drilling azalt (ToolHistoryContext)

### Faz 3: Sistem İyileştirmesi ✅ TAMAMLANDI
- [x] addedDate bazlı otomatik New sistemi
- [ ] Tool analytics (en çok kullanılan, vs.) - Bekleyen
