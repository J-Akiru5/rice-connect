# AGENTS.md — RiceConnect Enactus 2026 prototype

This repo is a **prototype** for a ~78 s demo video and slide screenshots. It is not a product.

## Hard rules

- Next.js (App Router) + TypeScript + Tailwind. Extra deps allowed: vitest, @playwright/test, @fontsource/plus-jakarta-sans. Anything else: ask first.
- Font: Plus Jakarta Sans via @fontsource (400–800, self-hosted). Never weight 900 (`font-extrabold` at most). `.tabular` on every number.
- Ground: flat canvas + faint terrace-contour SVG watermark (`.rc-ground`, `.rc-ground-auth` in `src/components/riceconnect/app.css`). The rice-field photo is retired: never use or add it, never set `--rc-photo`. Check: `rg -i "rice-field|rc-photo|photo-scrim" src public` returns nothing.
- No database, no auth, no env vars, no runtime network calls, no analytics, no map tiles. All data comes from `src/data/seed.ts` (deterministic: mulberry32, seed 20261009), in the same shapes as the design's `lib/demo.ts` (Farm, Lot, Haul, Slot, Slip, Commitment).
- All data is simulated: farmers are codes ("Farmer F-014"), mobiles masked ("09•• ••• 4821"), barangays "Barangay A/B/C (placeholder)". No real people or photos.
- Every route shows the DemoChip "PROTOTYPE · SIMULATED DATA" (translated) and the footer "Team Syntaxure Labs · ISUFST".
- Colors only from tokens (`src/styles/tokens.css` is generated from `design/tokens.json`; never edit token values). Check: `rg "#[0-9a-fA-F]{3,8}" src --glob '!**/tokens*' --glob '!**/app.css'` returns nothing.
- Money in integer centavos, shown as ₱ with 2 decimals. Units always shown (kg, ₱/kg, t, sacks).
- Never invent numbers. Every assumption goes in `src/data/overrides.json` AND `docs/NUMBERS.md`, labeled "assumed".
- No features that aren't listed. If unsure, ask.
- Do not run Playwright or download browsers in CI/agent sessions. Only the screenshot script is written.

## Design rules (from the design system README)

- Glass is the default. Panels holding text use `glass-fill-strong`. Haul screens use the hard logistics style (`.hard`, `.hard-thin`, `.hard-btn`) for content; the shell and nav around Haul stay glass. Never mix inside one card.
- Light theme default, dark toggle (localStorage in try/catch).
- Line icons + a word on every action; icons 24px phone / 20px desktop. Text ≥12px (caps labels only), body ≥14px (16px phone). Targets ≥44px phone / 40px desktop. 3px focus ring. Status = icon + word + color. Respect prefers-reduced-motion.
- Terrace illustration only in EmptyState and EndCard.
- Phone modules at 390px (inside a centered PhoneFrame on desktop). Desktop modules at 1440 and 1920, stacked below 768.

## I18n

- `src/components/riceconnect/lib/i18n.tsx` (I18nProvider, STRINGS, `<T>`), plus `strings.prototype.ts`. EN, TL, HIL. One header LanguageSwitcher drives UI, SMS and slip; `<html lang>` follows. No i18n library.
- EN complete; TL/HIL are drafts: "draft: needs native review". Title Case strings (CSS uppercases). No fixed-width buttons.

## Workflow

- After each step: `npm run lint && npm run build && npm test`, then commit.
- Log every design-vs-prompt conflict in `docs/DECISIONS.md`; blockers in `docs/BLOCKERS.md`.
