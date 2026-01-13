# CSS Refactoring Progress Tracker

Bu dosya, `docs/hardcoded.md` raporunda tespit edilen sorunların düzeltilme durumunu takip eder.

## 🔴 P0: Kritik Hardcoded Hex/RGB Düzeltmeleri (Dark Mode Fix)

Design system token'larına (`--primary`, `--background`, `--card` vb.) geçiş.

- [x] `src/features/SvgViewer/components/PreviewPanel.tsx` (White/Blue mix)
- [x] `src/features/SvgViewer/components/controls/BackgroundSelector.tsx` (Gray hardcoded)
- [x] `src/features/SvgViewer/components/BottomBar.tsx` (Gray hardcoded)
- [x] `src/features/SvgViewer/components/tabs/PngTab.tsx` (Colors)
- [ ] `src/features/SvgViewer/constants.ts` (Default SVG color) - _Skipped (User Content)_
- [x] `src/features/NotFound/index.tsx` (SVG Fill)
- [x] `src/features/LoanCalculator/index.tsx` (Conic Gradient Colors)
- [x] `src/features/HtmlTableGenerator/index.tsx` (Generated HTML Styles) - _Skipped (Generator Output)_
- [x] `src/features/GradientGenerator/index.tsx` (Initial State) - _Skipped (Initial State)_
- [x] `src/features/ColorConverter/index.tsx` (Initial State) - _Skipped (Initial State)_
- [x] `src/features/HtmlEditor/index.tsx` (Template String Styles) - _Skipped (User Editable)_

## 🟡 P1: Design System Eksikleri ve Global Styles

- [x] `src/index.css`: Eksik token'ları ekle (`--accent-purple`, `--accent-indigo`, `text-xxs`)
- [x] `src/features/ReadmeGenerator/MDEditor.css`: Hardcoded RGB ve !important temizliği

## 🟡 P2: Hardcoded Tailwind Colors (Red/Green/Yellow)

Design System semantic class'larına geçiş (`text-danger`, `bg-success-light` vb.).

- [x] `src/features/**`: `text-red-500` -> `text-danger`
- [x] `src/features/**`: `bg-red-50` -> `bg-danger-light`arı (5+ dosya)
- [ ] `text-yellow/orange-*` kullanımları

## 🔴 P3: Architectural Debt (Duplicate Layout Logic)

Header yüksekliği (`80px`) hardcoded olarak 50+ dosyada tekrar ediyor.

- [x] `src/features/**`: `h-[calc(100vh-80px)]` -> `<ToolPageLayout>` (65+ dosya)
- [x] `src/components/layouts/ToolPageLayout.tsx` oluşturuldu

## 🟣 P4: Forensic Audit (Arbitrary Values & Pixel Perfect)

- [x] `text-[10px]` -> `text-xxs`
- [x] `min-h-[400px]` -> `min-h-96`
- [x] `w-[50px]` -> `w-12`
- [x] `src/components/home/HeroSection.tsx` (Magic numbers & Hardcoded Colors)
