# AGENTS.md — RiceConnect (product)

> Proposed. Replaces the prototype `AGENTS.md` / `CLAUDE.md` at the start of Phase 1 (ticket F-02). Until then the prototype rules apply. The Enactus prototype rules stay with the release branch `release/demo-enactus-2026`.

RiceConnect helps a farmer cluster in Dingle, Iloilo plan harvests, dry palay, haul it and sell it, with farmers reached by SMS. The product runs in two modes: **demo** (simulated data, for presentations) and **live** (real users, from the pilot). The plan is in `docs/plan/`; read `docs/plan/README.md` before any task.

## Hard rules

- **Stack:** Next.js App Router, React, TypeScript strict, Tailwind with the token preset, pnpm + Turborepo. Approved dependencies: vitest, @playwright/test (CI only), @fontsource/plus-jakarta-sans, maplibre-gl, Radix UI primitives (unstyled only), react-hook-form, zod, @tanstack/react-query, and in Phase 3 the Supabase client. Anything else: ask the owner first and record the answer in `docs/DECISIONS.md`. Exact versions only.
- **Personal data:** no real person's data in code, fixtures, tests, screenshots, logs or URLs. Live data exists only in the live Supabase projects, behind row-level security. Demo mode uses the deterministic seed (`packages/domain/src/seed.ts`).
- **Modes:** `NEXT_PUBLIC_RC_MODE=demo|live`. Demo shows the DemoChip "PROTOTYPE · SIMULATED DATA" (translated) on every route and keeps routes open; live hides it and guards routes by role. Every route shows the footer "Team Syntaxure Labs · ISUFST" in both modes.
- **Colours** only from tokens (`design/tokens.json` → `tokens.css`; never edit token values). No colour literals (hex, rgb, rgba, hsl) outside token files; CI enforces it.
- **Money** in integer centavos, shown as ₱ with 2 decimals. Units always shown (kg, ₱/kg, t, sacks). Dates in UTC on the wire, shown in Asia/Manila.
- **Numbers:** never invent figures. Assumptions go in `src/data/overrides.json` and `docs/NUMBERS.md`, labelled "assumed", and are shown as assumed in the UI.
- **Scope:** no feature without a ticket. If unsure, ask.
- **Browsers:** Playwright runs only in GitHub Actions. Agent sessions never run browsers or download them.

## Architecture rules

- Layers: `apps → screens → ui`, `screens → data → store → domain`. Lower layers never import higher ones (lint enforces it).
- Screens use only: the UI kit (`@rc/ui`), the form kit (React Hook Form + Zod through `@rc/ui` form components), data hooks (`@rc/data`), and `ZLink` / `useZoneNav` for links. No direct Radix, `next/link`, `fetch`, Supabase or `localStorage` in screens.
- One Zod schema per entity in `packages/domain/src/schemas`; types are inferred from schemas. Server and client validate with the same schema.
- Repositories are async and take idempotency keys for writes; errors are typed codes, mapped to i18n keys in the UI.
- TanStack Query defaults for mock adapters: `retry: false`, `refetchOnWindowFocus: false`, `staleTime: Infinity`.

## UI rules

Everything in `docs/plan/04-ux-standards.md`, and in short:
- Glass by default; panels holding text use `glass-fill-strong`. Haul screens use the hard logistics style for content; never mix inside one card. Portaled dialogs and menus carry the opener's style class.
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

## Workflow

- One ticket per PR, using the template and definition of done in `docs/plan/06-agent-playbook.md`.
- Before opening a PR: `pnpm lint && pnpm build && pnpm test`, and paste the summary.
- Record decisions in `docs/DECISIONS.md`, blockers in `docs/BLOCKERS.md`, in the same PR.
- Say what you did not verify.
