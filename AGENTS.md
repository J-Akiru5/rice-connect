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
- Apps (Next.js multi-zones on ONE origin): `marketing` (gateway, `/`, `/launch`, rewrites + legacy redirects; zone domains in `apps/marketing/zones.mjs`), `coordinator` (`/coordinator`), `buyer` (`/buyer`), `driver` (`/driver`), `farmer` (`/farmer`). `apps/web` is the whole prototype as one app (fallback). `packages/screens` holds every screen.
- Links: write the original URLs and use `ZLink` / `useZoneNav` from `@rc/ui`; cross-zone links become full page loads on the same origin. Shared runtime state goes through `@rc/store` only.
- App routes are noindex (X-Robots-Tag); the marketing site is indexable. Every app route shows the DemoChip and the footer.

## Workflow

- After each step: `pnpm lint && pnpm build && pnpm test`, then commit.
- Log every design-vs-prompt conflict in `docs/DECISIONS.md`; blockers in `docs/BLOCKERS.md`.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
