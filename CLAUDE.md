# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **client-side web tool for orientative TEA (autism spectrum) screening**, based on the
DSM-5-TR clinical domains, specified by a psychologist (`PROYECTO TEST TEA.docx`).

It is a **tamizaje/orientation** tool, **NOT a diagnostic test**. Two rules are
non-negotiable and come from the clinical spec:

1. The result NEVER asserts a diagnosis — only "baja / moderada / alta compatibilidad
   orientativa" (or "inconcluso") + a recommendation to consult a professional.
2. The mandatory disclaimer (`DISCLAIMER` in `src/lib/test/questions.ts`) must appear
   BEFORE the test (landing) and AFTER it (result).

The flow: respondent fills an intro form → answers one question per step (57 scored + 6
optional specifiers) → sees a clinical breakdown they download as an image or screenshot
to share with their professional. No backend, no database — everything is client-side.

## Commands

- `npm run dev` — dev server (`localhost:4321`)
- `npm run test` — run the Vitest suite once (`test:watch` for watch mode)
- `npm run astro check` — type-check (must be clean before considering work done)

Node `>=22.12.0`.

## Architecture

shadcn/ui is React, so the interactive test is a **single React island** mounted in Astro
with `client:only="react"` (avoids SSR/hydration mismatch with its `localStorage` state).
Static pages (landing) stay pure Astro.

- **Astro 6** shell + routing · **React 19** island · **Tailwind v4** (Vite plugin) · **shadcn/ui**.
- Path alias `@/*` → `src/*`.

```
src/
  pages/index.astro          landing + pre-test disclaimer + CTA → /test
  pages/test.astro           hosts the wizard island (client:only)
  layouts/Layout.astro       html shell, imports styles/global.css
  components/test/           TestWizard (state/nav/localStorage), IntroForm,
                             QuestionStep, SpecifierStep, SectionIntro, ResultView
  components/ui/             shadcn components (generated — regenerate via shadcn CLI)
  lib/test/
    types.ts                 Question/Subarea/Respondent/answer types
    questions.ts             the 57 questions + 6 specifiers + scales + DISCLAIMER
    steps.ts                 buildSteps(): flattens data into the linear wizard flow
    result-text.ts           state → human-readable clinical messages (from the spec)
    scoring/                 PURE scoring engine (the core of the project)
      index.ts               scoreBlockA..E, integrate, scoreTest
      types.ts               result types
      *.test.ts              Vitest specs encoding the clinical rules
```

## The scoring engine is the heart — change it test-first

`src/lib/test/scoring/` is pure TypeScript with full Vitest coverage. The clinical rules
(subarea activation thresholds, criterion states, support levels, final integration) live
there and are NOT "sum points = autism". If you touch scoring, update/add tests FIRST
(strict TDD) — the tests are the executable spec. Key rules:

- Subarea "active": A needs total ≥8, B needs ≥7, AND ≥2 answers scored 2 or 3.
- Criterion A: 3 active → compatible · 2 → parcial · ≤1 → bajo. B: ≥2 → compatible · 1 → parcial · 0 → bajo.
- `integrate()` is intentionally conservative: missing early-onset (C), missing functional
  impact (D), or relevant differential alerts (E) push toward "inconcluso", never a diagnosis.
- One spec ambiguity is documented in the plan: Criterion A "3 subáreas leves" case — the
  hard subarea-activation rule is used; flag for the psychologist if revisited.

## Gotcha: pin Vite to 7

`package.json` has `"overrides": { "vite": "^7" }`. Astro 6.4.7's bundled rolldown-vite
(reports as Vite 8) breaks `@astrojs/react`'s refresh wrapper with
`Missing field 'moduleType'` — the React island returns 500 and won't hydrate. Do not
remove this override without re-verifying the island compiles
(`curl localhost:4321/src/components/test/TestWizard.tsx` should be 200).
