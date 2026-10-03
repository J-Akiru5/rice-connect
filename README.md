# RiceConnect · Enactus 2026 prototype

A clickable **prototype** for a ~78-second demo video and slide screenshots. It is not a product.
Every screen carries the **PROTOTYPE · SIMULATED DATA** chip: farms, people, prices and dates are simulated.

Team Syntaxure Labs · ISUFST

- Design system: "RiceConnect · Enactus 2026" (Claude Design). Its components live in `src/components/riceconnect/`.
- No database, no auth, no environment variables, no network calls at runtime, no analytics. All data comes from `src/data/seed.ts` (seeded, deterministic).

## Run

Node 18.18+ (tested on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000 (opens /farm)
```

## Build and check

```bash
npm run lint
npm run build      # also regenerates src/styles/tokens.css from design/tokens.json
npm test           # vitest: settlement fixture, 120.0 ha, matching, dryer capacity, driver assignment, SMS, demo timeline
npm start          # serve the production build
```

Guard checks (both must print nothing):

```bash
rg -i "rice-field|rc-photo|photo-scrim" src public
rg "#[0-9a-fA-F]{3,8}" src --glob '!**/tokens*' --glob '!**/app.css'
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New… → Project → Import** the repository.
3. Framework preset: **Next.js** (detected). Build command `npm run build`, output default. No environment variables.
4. Deploy. Every route is prerendered as static HTML; `/` redirects to `/farm`.

## Routes

| Route | Screen | Size |
|---|---|---|
| `/farm`, `/farm/[id]` | Farm list (100 farms; table + detail panel when wide, cards when narrow; filters, pagination) and profile | all |
| `/plan` | Harvest calendar W1–W4, dried tonnes per barangay per week | desktop |
| `/market` | Commitment board: search, filters (grade, volume, window), auto-match | desktop |
| `/dry` | Dryer capacity per day and slots by harvest week | desktop |
| `/haul`, `/haul/driver` | Haul request with auto-assigned driver and override (two columns when wide); the driver's job card | all |
| `/pay`, `/pay/L-03` | Lots to settle; lot record, settlement, A6 slip (Print Slip prints only the slip) | desktop |
| `/sms` (`?all=1`) | The three SMS on the farmer's phone (all three languages) | all |
| `/demo` | The guided 78 s sequence | both |

State boards from the design: add `?state=empty|error|success` (see `docs/BOARDS.md`).

**Responsive:** one layout for every width (<768 mobile, 768–1199 tablet, ≥1200 desktop); the same URLs work everywhere. The phone frame appears only on `/sms` (the farmer's phone), inside `/demo`, and on Farm/Haul with `?frame=phone` or `?rec=1`. Lists over 12 rows are paginated with the state in the URL (`?page=&size=&q=&status=&barangay=`, `/dry?week=`). Hand checks: `docs/RESPONSIVE-CHECKLIST.md`.

## The demo (`/demo`)

Beats: Farm 0–6 s · Plan 6–16 · Market 16–28 · Dry 28–40 · Haul 40–52 · Pay 52–64 · SMS 64–72 · End card 72–78.
One lot flows through all of it: **Farm F-014 → Lot L-03 → Haul H-07 → Dryer slot → Slip S-0303**.

- Keys: **← / →** step between beats, **Space** pauses, **R** restarts.
- `?rec=1` hides the demo controls (for screen recording). The app's own chip, switcher and footer stay.
- `?flip=1` switches the language EN → TL → HIL at 64 / 67 / 70 s.
- `?beat=N` (1–8) starts at beat N, for example `/demo?rec=1&beat=8` for the end card.
- Record at 1920×1080: `/demo?rec=1&flip=1`.

## Screenshots

```bash
npm run build
npm run shots                      # needs Playwright's Chromium: npx playwright install chromium
npm run shots -- --executable=/path/to/chromium   # or point at any Chromium
```

PNGs land in `exports/<light|dark>/<1920x1080|390x844>/`. (`exports/` is git-ignored.)

## Language

English, Tagalog and Hiligaynon through one header switcher (`<html lang>` follows). **Tagalog and Hiligaynon are drafts and need native review** before anyone reads them as final; the switcher says so on screen.

## Docs

- `AGENTS.md` / `CLAUDE.md` — hard rules for anyone (or any agent) changing this repo.
- `docs/BOARDS.md` — every canvas board mapped to a route.
- `docs/DECISIONS.md` — every conflict between the design and the brief, and what was decided.
- `docs/NUMBERS.md` — where every on-screen number comes from; assumptions labeled "assumed".
- `docs/BLOCKERS.md` — what is missing or unverified.
