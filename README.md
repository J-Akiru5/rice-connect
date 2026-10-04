# RiceConnect · Enactus 2026 prototype

A clickable **prototype** for a ~78-second demo video and slide screenshots. It is not a product.
Every screen carries the **PROTOTYPE · SIMULATED DATA** chip: farms, people, prices and dates are simulated.

Team Syntaxure Labs · ISUFST

- Design system: "RiceConnect · Enactus 2026" (Claude Design). Its components live in `packages/ui`.
- No database, no auth, no environment variables (except `RC_LOCAL` for local runs), no analytics. All data comes from `packages/domain/src/seed.ts` (seeded, deterministic). Only the buyer map loads tiles at runtime.

## Monorepo

pnpm + Turborepo. Four apps, served on one origin through Next.js multi-zones.

| Path | What | Port (local) | URL |
|---|---|---|---|
| `apps/main` | Public site (`/`, `/launch`), the **super admin** (`/admin`, sign-in `/admin/login`) **and** the coordinator app (`/login`, `/signup`): Home, Farm Profile, Plan, Market, Dry, Logistics (Haul), Orders/Pay, `/demo`. The origin users visit; rewrites `/buyer`, `/driver`, `/farmer` and redirects the old URLs | 3000 | `/`, `/launch`, `/login`, `/signup`, `/admin/login`, `/admin/...`, `/coordinator/...` |
| `apps/buyer` | Supply map, orders, commitments, own sign-in and sign-up (basePath `/buyer`) | 3002 | `/buyer/login`, `/buyer/signup`, `/buyer`, `/buyer/orders` |
| `apps/driver` | Haul job, own sign-in and sign-up (basePath `/driver`) | 3003 | `/driver/login`, `/driver/signup`, `/driver` |
| `apps/farmer` | SMS inbox simulator with replies, slip viewer, own sign-in and sign-up by mobile number (basePath `/farmer`) | 3004 | `/farmer/login`, `/farmer/signup`, `/farmer`, `/farmer/slip` |
| `packages/ui` | Design-system components, `app.css`, tokens (`design/tokens.json` → `src/styles/tokens.css`), `ZLink` | | |
| `packages/domain` | Seed, money, settlement, match, assign, buyers, SMS reply parser, pagination + tests | | |
| `packages/i18n` | I18nProvider, STRINGS (EN; TL/HIL drafts) | | |
| `packages/store` | `DataAdapter` + `LocalAdapter` (localStorage + BroadcastChannel) + actions + tests | | |
| `packages/screens` | Every screen, shared by the apps and `/demo` | | |
| `packages/config` | tsconfig, eslint, Tailwind preset, Next CLI wrapper (telemetry off), app domains (`zones.mjs`) | | |

Same origin matters: the apps share `localStorage` and `BroadcastChannel`, so a buyer order placed in `/buyer/orders` appears on `/coordinator/home` in another tab, and a farmer's "1 OK" / "2 Move" in `/farmer` updates the dryer slot and haul in the coordinator app.

## Run

Node 18.18+ and pnpm 10 (`corepack enable` or `npm i -g pnpm`).

```bash
pnpm install
pnpm demo:local     # builds every app with RC_LOCAL=1 and starts all four; open http://localhost:3000
pnpm dev            # dev servers for every app (open the main app at :3000; buyer, driver, farmer at 3002-3004)
pnpm build && pnpm lint && pnpm test
```

`pnpm demo:local` works with the network off (verified in an isolated network namespace); only the buyer map's tiles need internet, and the page shows a notice and the table without them. Old URLs (`/farm`, `/sms`, `/haul/driver`, `/demo`, …) redirect to their new homes. "Reset demo data" is on `/launch`.

Guard checks (both must print nothing):

```bash
rg -i "rice-field|rc-photo|photo-scrim" apps packages --glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/tokens*'
rg "#[0-9a-fA-F]{3,8}" apps packages --glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/tokens*' --glob '!**/app.css' --glob '!**/*.svg'
```

## Branches and deploy

- `main` = production, `staging` = the only preview, `develop` = integration. Feature branches → PR into `develop` → PR `develop` → `staging` → check the preview → PR `staging` → `main`.
- Vercel builds `main` and `staging` only (`apps/*/vercel.json`). GitHub Actions CI (lint, build, test, guard checks) runs on every PR and on pushes to `develop`.
- Vercel projects (Root Directory): `rice-connect` → `apps/main` (production https://rice-connect-opal.vercel.app), `riceconnect-buyer` → `apps/buyer`, `riceconnect-driver` → `apps/driver`, `riceconnect-farmer` → `apps/farmer`. Domains are hard-coded in `packages/config/zones.mjs` (no env vars; `RC_LOCAL=1` only for local). Details and rollback: `docs/CUTOVER.md`.

## The demo (`/demo` → `/coordinator/demo`)

Beats: Farm 0–6 s · Plan 6–16 · Market 16–28 · Dry 28–40 · Haul 40–52 · Pay 52–64 · SMS 64–72 · End card 72–78. Keys: ← / → step, Space pauses, R restarts. `?rec=1` hides the controls, `?flip=1` switches EN → TL → HIL at 64 / 67 / 70 s, `?beat=N` starts at beat N.

## Screenshots

`apps/main/shots.mjs` (Playwright, written but not run here): start `pnpm demo:local`, then `pnpm --filter @rc/main shots` in a second terminal.

## Language

English, Tagalog and Hiligaynon through one header switcher (`<html lang>` follows). **Tagalog and Hiligaynon are drafts and need native review** before anyone reads them as final; the switcher says so on screen.

## Docs

- `AGENTS.md` / `CLAUDE.md` — hard rules for anyone (or any agent) changing this repo.
- `docs/BOARDS.md` — every canvas board mapped to a route.
- `docs/DECISIONS.md` — every conflict between the design and the brief, and what was decided.
- `docs/NUMBERS.md` — where every on-screen number comes from; assumptions labeled "assumed".
- `docs/BLOCKERS.md` — what is missing or unverified.
