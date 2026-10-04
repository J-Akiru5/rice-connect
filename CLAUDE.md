# AGENTS.md — RiceConnect Enactus 2026 prototype

This repo is a **prototype** for a ~78 s demo video and slide screenshots. It is not a product.

## Hard rules

- Next.js (App Router) + TypeScript + Tailwind. Extra deps allowed: vitest, @playwright/test, @fontsource/plus-jakarta-sans, maplibre-gl (buyer supply map, approved by the team). Anything else: ask first.
- Font: Plus Jakarta Sans via @fontsource (400–800, self-hosted). Never weight 900 (`font-extrabold` at most). `.tabular` on every number.
- Ground: flat canvas + faint terrace-contour SVG watermark (`.rc-ground`, `.rc-ground-auth` in `src/components/riceconnect/app.css`). The rice-field photo is retired: never use or add it, never set `--rc-photo`. Check: `rg -i "rice-field|rc-photo|photo-scrim" apps packages --glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/tokens*'` returns nothing.
- No database, no auth, no env vars except `RC_LOCAL` (local multi-zone routing), no analytics. No runtime network calls except the buyer supply map's tiles (OpenFreeMap, no API key, `/buyer` only); the page must still work when tiles fail. All data comes from `packages/domain/src/seed.ts` (deterministic: mulberry32, seed 20261009), in the same shapes as the design's `lib/demo.ts` (Farm, Lot, Haul, Slot, Slip, Commitment).
- All data is simulated: farmers are codes ("Farmer F-014"), mobiles masked ("09•• ••• 4821"), barangays are real places in Dingle, Iloilo (San Matias, Licu-an, Ilajas; team decision) but every farm, farmer and figure in them is simulated. No real people or photos.
- Every route shows the DemoChip "PROTOTYPE · SIMULATED DATA" (translated) and the footer "Team Syntaxure Labs · ISUFST".
- Colors only from tokens (`src/styles/tokens.css` is generated from `design/tokens.json`; never edit token values). Check: `rg "#[0-9a-fA-F]{3,8}" apps packages --glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/tokens*' --glob '!**/app.css' --glob '!**/*.svg'` returns nothing.
- Money in integer centavos, shown as ₱ with 2 decimals. Units always shown (kg, ₱/kg, t, sacks).
- Never invent numbers. Every assumption goes in `src/data/overrides.json` AND `docs/NUMBERS.md`, labeled "assumed".
- No features that aren't listed. If unsure, ask.
- Do not run Playwright or download browsers in CI/agent sessions. Only the screenshot script is written.

## Design rules (from the design system README)

- Glass is the default. Panels holding text use `glass-fill-strong`. Haul screens use the hard logistics style (`.hard`, `.hard-thin`, `.hard-btn`) for content; the shell and nav around Haul stay glass. Never mix inside one card.
- Light theme default, dark toggle (localStorage in try/catch).
- Line icons + a word on every action; icons 24px phone / 20px desktop. Text ≥12px (caps labels only), body ≥14px (16px phone). Targets ≥44px phone / 40px desktop. 3px focus ring. Status = icon + word + color. Respect prefers-reduced-motion.
- Terrace illustration only in EmptyState and EndCard.
- One responsive layout: <768 mobile, 768–1199 tablet, ≥1200 desktop; CSS media queries for the shell, container queries (`.rc-cq`) for module content; no user-agent sniffing. PhoneFrame only on `/sms`, inside `/demo`, and on Farm/Haul with `?frame=phone` or `?rec=1`.
- Lists over 12 rows use `<Pagination>` with URL state (`packages/domain/src/list.ts`, `packages/screens/src/list-state.tsx`). Never truncate key data with an ellipsis.

## I18n

- `packages/i18n` (I18nProvider, STRINGS, `<T>`), plus `strings.prototype.ts`. EN, TL, HIL. One header LanguageSwitcher drives UI, SMS and slip; `<html lang>` follows. No i18n library.
- EN complete; TL/HIL are drafts: "draft: needs native review". Title Case strings (CSS uppercases). No fixed-width buttons.

## Monorepo

- pnpm + Turborepo. `packages/`: `config` (tsconfig, eslint, tailwind preset, Next CLI wrapper), `ui` (design-system components, app.css, tokens), `domain` (seed, money, settlement, match, assign, buyers, pagination + tests), `i18n` (I18nProvider, STRINGS), `store` (DataAdapter + LocalAdapter: localStorage + BroadcastChannel).
- Four apps (Next.js multi-zones on ONE origin):
  - `main`: public site (`/`, `/launch`) and the coordinator (`/coordinator/*`) in one app, no basePath. It is the origin users visit (Vercel project `rice-connect`). It rewrites `/buyer`, `/driver` and `/farmer` to their apps and redirects the legacy URLs.
  - `buyer` (`/buyer`), `driver` (`/driver`), `farmer` (`/farmer`): own apps with a basePath. Their bare domain `/` redirects to the same page on the main origin.
  - App domains are in `packages/config/zones.mjs`. `packages/screens` holds every screen. Don't add apps without asking.
- Links: write the original URLs and use `ZLink` / `useZoneNav` from `@rc/ui`; links across apps become full page loads on the same origin. Shared runtime state goes through `@rc/store` only.
- App routes (`/coordinator/*`, `/buyer`, `/driver`, `/farmer`) are noindex (X-Robots-Tag); the public site is indexable. Every app route shows the DemoChip and the footer.

## Branches and deploys

- Three long-lived branches: `main` (production), `staging` (the only preview), `develop` (integration).
- Work on a feature branch from `develop`, then open a PR into `develop`. Promote with PRs only: `develop` → `staging` → `main`. Never push straight to `staging` or `main`.
- Vercel builds `main` and `staging` only (`git.deploymentEnabled` in each `apps/*/vercel.json`). Other branches are checked by GitHub Actions CI (`.github/workflows/ci.yml`: lint, build, test, guard checks) on every PR and on pushes to `develop`.
- Check the `staging` preview before opening the `staging` → `main` PR.

## Workflow

- After each step: `pnpm lint && pnpm build && pnpm test`, then commit.
- Log every design-vs-prompt conflict in `docs/DECISIONS.md`; blockers in `docs/BLOCKERS.md`.
