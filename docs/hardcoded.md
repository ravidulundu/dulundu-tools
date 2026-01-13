# Hardcoded CSS Audit Report

**Status:** ✅ Refactoring Completed
**Date:** 2026-01-13
**Project:** dulundu-tools

---

## 🚀 Executive Summary

All critical and major hardcoded CSS issues have been resolved. The codebase now adheres to the Design System, utilizing semantic tokens (primary, danger, success, warning) and a centralized layout architecture.

---

## ✅ Resolved Issues (Fixed)

### 🔴 P0: Critical Hex/RGB & Dark Mode

- [x] **SvgViewer:** Replaced hardcoded checkerboard patterns with global `.bg-checkerboard`.
- [x] **SvgViewer:** Fixed hardcoded `#ffffff` and `#3b82f6` backgrounds/fills.
- [x] **NotFound:** Replaced hardcoded SVG fill with `fill-primary`.
- [x] **LoanCalculator:** Replaced hardcoded conic-gradient colors with CSS variables.

### 🟡 P2: Tailwind Color Standardization

- [x] **Red/Danger:** Replaced 30+ instances of `text-red-500`, `bg-red-50` with `text-danger`, `bg-danger-light`.
- [x] **Green/Success:** Replaced 12+ instances of `text-green-500` with `text-success`.
- [x] **Yellow/Warning:** Replaced `text-yellow-*` in RegexTester with `text-warning`.
- [x] **Others:** Fixed hardcoded colors in MirrorOnline, Footer, and tool components.

### 🟠 P3: Architectural Debt (Layout)

- [x] **Duplication:** Refactored 50+ files to use `<ToolPageLayout>` instead of duplicating `h-[calc(100vh-80px)]`.
- [x] **Maintainability:** Layout changes are now centralized.

### 🟣 P4: Forensic Audit (Deep Scan)

- [x] **`text-[10px]`:** Replaced with `text-xxs` (added to Tailwind config).
- [x] **`w-[50px]`:** Standardized to `w-12`.
- [x] **`min-h-[400px]`:** Standardized to `min-h-96`.
- [x] **HeroSection:** Cleaned up `opacity-[0.03]` and `blur-[100px]` magic numbers.
- [x] **Hidden Colors:** `text-indigo/orange/purple` mapped to new semantic tokens (`accent-*`).
- [x] **Arbitrary Layouts:** `min-h-[200/300px]`, `h-[600px]`, `max-w-[820px]` standardized.

---

## Acceptable Debt (Won't Fix / Intentional)

The following items are intentional exceptions and do not require refactoring:

| File                                          | Reason                                                                    |
| :-------------------------------------------- | :------------------------------------------------------------------------ |
| `src/components/MegaMenu.tsx`                 | Layout fragility (double-line wrapping) requires hardcoded `text-[10px]`. |
| `src/features/HtmlTableGenerator/index.tsx`   | Generates user-facing HTML with inline styles for portability.            |
| `src/features/GradientGenerator/index.tsx`    | User-defined gradient colors must be dynamic.                             |
| `src/features/ColorConverter/index.tsx`       | Color picker needs to display specific raw values.                        |
| `src/features/PaletteExtractor/index.tsx`     | Displays dynamic colors extracted from images.                            |
| `src/features/TwitterCardGenerator/index.tsx` | Dynamic background images.                                                |
| `src/components/common/CodeEditor.tsx`        | Syntax highlighting themes use specific hex values.                       |
| `src/components/Footer.tsx`                   | "Made with ❤️" intentionally uses `text-danger`.                          |

---

## 🎨 Design System Designations

### Semantic Colors

- `--primary`: Brand blue
- `--danger`: Error/Delete/Alert (Red)
- `--success`: Valid/Save/Go (Green)
- `--warning`: Caution/Attention (Yellow/Orange)
- `--accent-purple`: Special tools/features
- `--accent-indigo`: Special tools/features

### Layout Tokens

- `ToolPageLayout`: Standard wrapper for all tools.
- `text-xxs`: 10px font size.

---

## 📁 Archives (Previously Affected Files)

_See `previous_hardcoded_report.md` or git history for the full list of 56+ originally affected files._
