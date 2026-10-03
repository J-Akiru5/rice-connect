# Decisions and design-vs-prompt conflicts

Precedence: the design wins for visuals; the build prompt wins for data, numbers and behavior.
Sources: design system https://claude.ai/artifact/97dKcK7FbnPNaW3ezBoTVt (version 1791053899-f07e) and canvas https://claude.ai/artifact/94vqqSf54viULqNofNHooG (version 1791054420-9052).

## Process

| # | Topic | Design / prompt says | Decision |
|---|---|---|---|
| P1 | Git branch | Prompt: `build/prototype`. Session: must develop and push on `claude/optimistic-edison-0ybz8s`. | Used the session branch (the only one this environment may push). Rename on merge if wanted. |
| P2 | Stack versions | README: Next.js + Tailwind, react 18 in the design index. | Next.js 14.2 (App Router), React 18.3, Tailwind 3.4 (the design's app.css uses `@tailwind`/`@apply`). |
| P3 | Fonts | README: `next/font/google`. Prompt: @fontsource, offline. | @fontsource/plus-jakarta-sans 400–800 imported in `globals.css`; the Google Fonts `@import` was removed from app.css. |
| P4 | Next.js CLI telemetry | Next sends anonymous CLI telemetry by default. Prompt: no analytics. | `scripts/next.mjs` runs every `next` command with `NEXT_TELEMETRY_DISABLED=1` (a node wrapper, so it also works in Windows shells). |

## Visual / component port

| # | Topic | Design says | Decision |
|---|---|---|---|
| V1 | Photo ground | AppShell/PhoneShell default `photo = true` and set `--rc-photo`; tokens carry `photo-scrim*`. README also says the photo is retired. | Removed the `photo` prop and `--rc-photo` from both shells; `gen-tokens.mjs` skips the two `photo-*` tokens (values untouched in `design/tokens.json`). |
| V2 | Hex literals in components | StatusChip, RouteLine, VehicleOption, DriverCard, Stepper, PhoneFrame, EndCard use hex (`#22c55e`, `#facc15`, `#25ebd8`, `#374151`, `#4b5563`, `#0b0f0e`, `#0b5a44`, `#17734f`, `#de9f24`). | Mapped to tokens: `--success`, `--warning`, `--info`, `--gray-900` (for `#374151`/`#4b5563` on white hard cards; slightly darker), `--gray-400` (pending connector), `--black` (bezel), `--emerald-900`/`--emerald-800`/`--brand-gold` (end-card terraces). `bg-emerald-400` → `--emerald-400`. `#000`/`#fff` style via Tailwind `black`/`white` stays (hard style). |
| V3 | Inertia / Headless UI | NavLink uses Inertia `<Link>`; Modal and Dropdown use `@headlessui/react`. | NavLink → `next/link`. Modal rebuilt on native `<dialog>` with the same scrim and glass panel (no new dependency). Dropdown, ResponsiveNavLink and MunicipalitySelect are not copied (unused; need Inertia/Headless UI). |
| V4 | Nav items | Coordinator nav includes Console, Inventory, Settings; driver tab bar has Settings. | Dropped: they have no route and the prompt forbids dead links. Nav = Farm Profile, Plan, Market, Dry, Logistics · Haul, Orders · Pay, SMS. |
| V5 | Language sync | I18nProvider broadcasts over `BroadcastChannel` (created at module load). | Removed (one page tree; it would also run on the server). Language is kept in localStorage (try/catch) and mirrored to `<html lang>`. |
| V6 | Theme toggle | README: toggle `data-theme` on `<html>`; no toggle component exists. | New `ThemeToggle` (icon + word, localStorage in try/catch, applied before paint). |
| V7 | Phone modules on desktop | PhoneFrame exists; no wrapper. | New `PhoneStage`: PhoneFrame centered on the ground from 640px; below 640px the bezel and drawn status bar are dropped and the screen fills the viewport. |
| V8 | Footer | Not in the design. Prompt: every route shows "Team Syntaxure Labs · ISUFST". | New `TeamFooter` inside AppShell and PhoneShell. |
| V9 | Icons | No Moon/Sun/Play/Pause/ChevronLeft. | Added from Lucide (ISC), same grammar as the design's Lucide set. |
| V10 | Strings with numbers | STRINGS hard-code "PHP 48,000.00", "Rosa", "60 sacks", "PHP 2,040.00", "3,000 kg". | Replaced with `{placeholders}` filled from computed data (`t(key, vars)`), in all three languages. |
| V11 | Component-internal English | HarvestCalendar, SlotTimeline, DriverCard, CommitmentCard, VehicleOption print English units. | Routed through STRINGS (`unit.sacks`, `cal.*`, `driver.away`, `market.filledof`). HarvestCalendar gained a `caption` prop. |
