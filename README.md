# RiceConnect · Enactus 2026 prototype

A clickable **prototype** for a ~78-second demo video and slide screenshots. It is not a product.
Every screen carries the **PROTOTYPE · SIMULATED DATA** chip: farms, people, prices and dates are simulated.

Team Syntaxure Labs · ISUFST

- Design system: "RiceConnect · Enactus 2026" (Claude Design). Its components live in `src/components/riceconnect/`.
- No database, no auth, no environment variables (except `RC_LOCAL` for local runs), no analytics. All data comes from `packages/domain/src/seed.ts` (seeded, deterministic). Only the buyer map loads tiles at runtime.

## Monorepo

pnpm + Turborepo. One app per user domain, served on one origin through Next.js multi-zones.

| Path | What | Port (local) | URL on the gateway |
|---|---|---|---|
| `apps/marketing` | Public site and **gateway**: owns `/` and `/launch`, rewrites the zones, redirects the old URLs | 3000 | `/`, `/launch` |
| `apps/coordinator` | Home, Farm Profile, Plan, Market, Dry, Logistics (Haul), Orders/Pay, `/demo` (basePath `/coordinator`) | 3001 | `/coordinator/...` |
| `apps/buyer` | Supply map, orders, commitments (basePath `/buyer`) | 3002 | `/buyer`, `/buyer/orders` |
| `apps/driver` | Haul job (basePath `/driver`) | 3003 | `/driver` |
| `apps/farmer` | SMS inbox simulator with replies, slip viewer, no login (basePath `/farmer`) | 3004 | `/farmer`, `/farmer/slip` |
| `apps/web` | The whole prototype as ONE app (multi-zone fallback; old URLs) | 3000 | — |
| `packages/ui` | Design-system components, `app.css`, tokens (`design/tokens.json` → `src/styles/tokens.css`) | | |
| `packages/domain` | Seed, money, settlement, match, assign, buyers, SMS reply parser, pagination + tests | | |
| `packages/i18n` | I18nProvider, STRINGS (EN; TL/HIL drafts) | | |
| `packages/store` | `DataAdapter` + `LocalAdapter` (localStorage + BroadcastChannel) + actions + tests | | |
| `packages/screens` | Every screen, shared by the apps, `/demo` and `apps/web` | | |
| `packages/config` | tsconfig, eslint, Tailwind preset, Next CLI wrapper (telemetry off) | | |

Same origin matters: the apps share `localStorage` and `BroadcastChannel`, so a buyer order placed in `/buyer/orders` appears on `/coordinator/home` in another tab, and a farmer's "1 OK" / "2 Move" in `/farmer` updates the dryer slot and haul in the coordinator app.

## Run

Node 18.18+ and pnpm 10 (`corepack enable` or `npm i -g pnpm`).

```bash
pnpm install
pnpm demo:local     # builds every app with RC_LOCAL=1 and starts the 4 zones + the gateway; open http://localhost:3000
pnpm dev            # dev servers for every app (open the gateway at :3000; zones at 3001-3004)
pnpm build && pnpm lint && pnpm test
```

`pnpm demo:local` works with the network off (verified in an isolated network namespace); only the buyer map's tiles need internet, and the page shows a notice and the table without them. Old URLs (`/farm`, `/sms`, `/haul/driver`, `/demo`, …) redirect to their new homes. "Reset demo data" is on `/launch`.

Guard checks (both must print nothing):

```bash
rg -i "rice-field|rc-photo|photo-scrim" apps packages --glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/tokens*'
rg "#[0-9a-fA-F]{3,8}" apps packages --glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/tokens*' --glob '!**/app.css' --glob '!**/*.svg'
```

## Deploy

One Vercel project per app (Root Directory `apps/<name>`); the marketing project is the public entry. Step-by-step, verification and rollback: `docs/CUTOVER.md`. Zone domains are hard-coded in `apps/marketing/zones.mjs` (no env vars; `RC_LOCAL=1` only for local).

## The demo (`/demo` → `/coordinator/demo`)

Beats: Farm 0–6 s · Plan 6–16 · Market 16–28 · Dry 28–40 · Haul 40–52 · Pay 52–64 · SMS 64–72 · End card 72–78. Keys: ← / → step, Space pauses, R restarts. `?rec=1` hides the controls, `?flip=1` switches EN → TL → HIL at 64 / 67 / 70 s, `?beat=N` starts at beat N.

## Screenshots

`apps/web/shots.mjs` (Playwright, written but not run here): `pnpm --filter @rc/web build && pnpm --filter @rc/web shots`.

## Language

English, Tagalog and Hiligaynon through one header switcher (`<html lang>` follows). **Tagalog and Hiligaynon are drafts and need native review** before anyone reads them as final; the switcher says so on screen.

## Docs

- `AGENTS.md` / `CLAUDE.md` — hard rules for anyone (or any agent) changing this repo.
- `docs/BOARDS.md` — every canvas board mapped to a route.
- `docs/DECISIONS.md` — every conflict between the design and the brief, and what was decided.
- `docs/NUMBERS.md` — where every on-screen number comes from; assumptions labeled "assumed".
- `docs/BLOCKERS.md` — what is missing or unverified.
