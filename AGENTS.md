# AGENTS.md — RiceConnect (product)

RiceConnect helps a farmer cluster in Dingle, Iloilo plan harvests, dry palay, haul it and sell it, with farmers reached by SMS. The product runs in two modes: **demo** (simulated data, for presentations) and **live** (real users, from the pilot). The plan is in `docs/plan/`; read `docs/plan/README.md` before any task. The Enactus prototype rules stay on the release branch `release/demo-enactus-2026`.

## Hard rules

- **Stack:** Next.js App Router, React, TypeScript strict, Tailwind with the token preset, pnpm + Turborepo. Approved dependencies: vitest, @playwright/test (CI only), @fontsource/plus-jakarta-sans, maplibre-gl, Radix UI primitives (unstyled only), react-hook-form, zod, @tanstack/react-query, Prettier, @testing-library/react + jsdom (UI kit tests only), @axe-core/playwright (E2E only), @google/genai (ANNI assistant only, server-side in `apps/main`, decision M42), and in Phase 3 the Supabase CLI 2.119.0 (dev tool) and client `@supabase/supabase-js` (decisions M43, B-04). Anything else: ask the owner first and record the answer in `docs/DECISIONS.md`. Exact versions only.
- **Personal data:** no real person's data in code, fixtures, tests, screenshots, logs or URLs. Live data exists only in the live Supabase projects, behind row-level security. Demo mode uses the deterministic seed (`packages/domain/src/seed.ts`).
- **Modes:** `NEXT_PUBLIC_RC_MODE=demo|live`. Demo shows the DemoChip "PROTOTYPE · SIMULATED DATA" (translated) on every route and keeps routes open; live hides it and guards routes by role. Every route shows the footer "Team Syntaxure Labs · ISUFST" in both modes.
- **Colours** only from tokens (`design/tokens.json` → `tokens.css`; never edit token values). No colour literals (hex, rgb, rgba, hsl) outside token files; CI enforces it. Shared alpha values use `color-mix(in srgb, var(--token) N%, transparent)` utilities in `app.css`.
- **Money** in integer centavos, shown as ₱ with 2 decimals. Units always shown (kg, ₱/kg, t, sacks). Dates in UTC on the wire, shown in Asia/Manila.
- **Numbers:** never invent figures. Assumptions go in `src/data/overrides.json` and `docs/NUMBERS.md`, labelled "assumed", and are shown as assumed in the UI.
- **Scope:** no feature without a ticket. If unsure, ask.
- **Browsers:** Playwright E2E runs in GitHub Actions on every PR. Agent sessions may also run Playwright browsers locally for visual checks (owner decision M37); never commit browsers or test artifacts.

## Architecture rules

- Layers: `apps → screens → ui`, `screens → data → store → domain`. Lower layers never import higher ones (lint enforces it).
- Screens use only: the UI kit (`@rc/ui`), the form kit (React Hook Form + Zod through `@rc/ui` form components), data hooks (`@rc/data`), and `ZLink` / `useZoneNav` for links. No direct Radix, `next/link`, `fetch`, Supabase or `localStorage` in screens.
- One Zod schema per entity in `packages/domain/src/schemas`; types are inferred from schemas. Server and client validate with the same schema.
- Repositories are async and take idempotency keys for writes; errors are typed codes, mapped to i18n keys in the UI.
- TanStack Query defaults for mock adapters: `retry: false`, `refetchOnWindowFocus: false`, `staleTime: Infinity`.

## Repo specifics (inherited from the prototype)

- **Four apps, Next.js multi-zones on one origin.** `main` is the origin users visit (public site, `/coordinator/*`, `/admin/*`; rewrites `/buyer`, `/driver`, `/farmer`). `buyer`, `driver` and `farmer` are their own apps with a `basePath` and their own sign-in pages. App domains are in `packages/config/zones.mjs`; `packages/screens` holds every screen. Don't add apps without asking.
- **Links:** write the original URLs and use `ZLink` / `useZoneNav` from `@rc/ui`; links across apps become full page loads on the same origin. Shared runtime state goes through `@rc/store` only.
- **Ground:** flat canvas + faint terrace-contour SVG watermark (`.rc-ground`, `.rc-ground-auth` in `packages/ui/src/app.css`). The rice-field photo is retired: never use or add it, never set `--rc-photo`; CI guards `rice-field|rc-photo|photo-scrim`.
- **Terrace illustration** only in EmptyState and EndCard.
- **PhoneFrame** only on `/sms`, inside `/demo`, and on Farm/Haul with `?frame=phone` or `?rec=1`. App routes are noindex (X-Robots-Tag); the public site is indexable.

## UI rules

Everything in `docs/plan/04-ux-standards.md`, and in short:

- Glass by default; panels holding text use `glass-fill-strong`. Haul screens use the hard logistics style (`.hard`, `.hard-thin`, `.hard-btn`) for content; the shell and nav around Haul stay glass. Never mix inside one card. Portaled dialogs and menus carry the opener's style class.
- Radix is used as unstyled primitives wrapped in `packages/ui`; never Radix Themes or shadcn/ui CSS.
- Every screen implements the state matrix (loading, empty, empty-filtered, error, not found, forbidden, offline, pending, success). No default spinners.
- Choose instead of type; units next to inputs; one primary action per screen; Undo for reversible actions; summary + confirm for money and irreversible actions; typed confirmation for dangerous admin actions; never `window.confirm`/`alert`/`prompt`.
- Line icons + a word on every action; icons 24px phone / 20px desktop. Text ≥12px (caps labels only), body ≥14px (16px phone). Targets ≥44px phone / 40px desktop. 3px focus ring. Status = icon + word + colour. Respect `prefers-reduced-motion`.
- Font: Plus Jakarta Sans via @fontsource (400–800); never weight 900. `.tabular` on every number.
- Breakpoints: <768 mobile, 768–1199 tablet, ≥1200 desktop; media queries for the shell, container queries (`.rc-cq`) for module content; no user-agent sniffing.
- Lists over 12 rows use `<Pagination>` with URL state. Never truncate key data with an ellipsis.
- Light theme default, dark toggle.

## I18n

- `packages/i18n`: EN, TL, HIL. One LanguageSwitcher drives UI, SMS and slip; `<html lang>` follows. No i18n library.
- Every user-facing string, including validation errors, is a key with EN, TL and HIL. TL/HIL stay marked "draft: needs native review" until signed off in the glossary review. No string concatenation for sentences.

## Branches and deploys

- `main` (production), `staging` (preview), `develop` (integration). Feature branches from `develop`; PR into `develop`; promote by PR only (`develop → staging → main`).
- Required CI on all three branches (no reviewer required). Never push straight to `staging` or `main`; never force-push.
- Vercel builds `main` and `staging` only. CI (`.github/workflows/ci.yml`) runs lint, types, unit tests, build, guards and Playwright E2E on every PR.
- Check the `staging` preview before opening the `staging` → `main` PR.

## Workflow

- One ticket per PR, using the template and definition of done in `docs/plan/06-agent-playbook.md`.
- Before opening a PR: `pnpm lint && pnpm build && pnpm test`, and paste the summary.
- Record decisions in `docs/DECISIONS.md`, blockers in `docs/BLOCKERS.md`, in the same PR.
- Say what you did not verify.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
