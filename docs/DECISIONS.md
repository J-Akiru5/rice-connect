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

## Data and numbers (the brief wins)

| # | Topic | Design says | Brief says | Decision |
|---|---|---|---|---|
| D1 | Hero lot | L-03: 60 sacks, 3,000 kg dried, net PHP 60,000.00, advance 48,000.00, balance 12,000.00, fee 2,040.00. | L-03 = 5,000 kg: quoted 112,500; drying 7,500; margin 5,000; net 100,000; advance 80,000; balance 20,000; buyer fee 3,375. | Brief. L-03 = 5,000 kg dried = 100 sacks. All amounts computed by `settle()` and tested. |
| D2 | People | Farmer "Rosa Villanueva", other personal names, mobile "+63 917 *** **42", driver "Dodong Reyes". | Codes ("Farmer F-014"), masked "09•• ••• 4821". No real people. | Brief. Farmers `Farmer F-0xx`, drivers `Driver DR-0x`, mobiles `09•• ••• nnnn`. |
| D3 | Barangays | Barangay Uno / Dos / Tres. | "Barangay A/B/C (placeholder)", split 33/34/33. | Brief. |
| D4 | Buyers and commitments | Four commitments C-01…C-04 for Buyers B-01/B-02/B-05/B-07. | C1 30 t Grade 1 14% MC W3–W4 ₱22.50 "Buyer A (simulated)"; C2 25 t W2–W3 "Buyer B (simulated)". | Brief: two commitments, IDs written C-01/C-02 in the design's ID format. C-02's grade, MC and price are assumed (overrides.json). |
| D5 | Currency text | "PHP 22.50". | ₱ with 2 decimals. | ₱ on every screen and on the slip. SMS keeps `PHP` because ₱ is not in GSM-7 (one ₱ would turn each message into a 70-character Unicode SMS, breaking the design's one-SMS rule). |
| D6 | Dryer capacity | 400 sacks/day (~20 t). | 24 t/day (assumed). | Brief: 24,000 kg = 480 sacks per day. |
| D7 | Hero dates | Pickup Tue 13 Oct (W2), slot D-2 10:00–16:00, slip Wed 14 Oct. | L-03 must flow into C-01, whose window is W3–W4. | F-014 pinned to W3 (assumed, see NUMBERS.md). Dates computed: harvest Thu 22 Oct, slot D-58 same day, advance/slip Fri 23 Oct. Clock times dropped (no source); slots show kg. |
| D8 | Yield | Plan shows 480.0 t wet at 4.0 t/ha. | 4,000 kg/ha wet, 3% loss, ×0.884 → 3,429 kg/ha dried (~411 t). | Plan calendar shows dried tonnes (what is sold and matched); the wet total (480.0 t) is shown as a note. 3,429 = floor(4,000 × 0.97 × 0.884 = 3,429.92). |
| D9 | Haul H-07 | Truck T-02, 60 of 100 sacks, 11.8 km, PHP 3,500.00 per trip. | Auto-assign nearest available driver with enough capacity, tie-break lowest price. | Computed: 100 sacks → DR-05 Truck T-02 (nearest available truck, 6.2 km). Route km seeded. Haul sacks use the dried lot weight (simplification). |
| D10 | Lot numbering | L-00 IDs, hero L-03. | IDs link F-014 → L-03. | One forecast lot per farm, numbered by harvest date; L-03 is reserved for F-014's lot. Only L-03 is "weighed" (5,000 kg); the rest are forecasts. |
| D11 | Money units | `PRICE` in pesos (22.5). | Integer centavos. | `PRICE`/`SLIP`/vehicle prices in centavos; `peso()` and `rate()` format them. The design's `peso()` now takes centavos. |

## Screens

| # | Screen | Topic | Decision |
|---|---|---|---|
| S1 | /farm | The canvas has no list board. | List built from existing pieces only: glass panel, SearchField, StatusChip, line icons. Rows link to `/farm/[id]`. Search with no hits shows EmptyState (terrace band). |
| S2 | /farm?state=empty | The design's empty state has an "Add Farm" button. | Button dropped: adding a farm is not a listed feature, and a button that does nothing is a dead control. Title and body kept. |
| S3 | /farm/[id] | Profile shows the 8 fields via FarmProfileCard; "Add to Cluster" turns into "Added to Cluster 1" (the design's own behavior). | Added one glass "Harvest" panel (harvest week/date, lot ID, dried forecast) so the F-014 → L-03 link is visible. Farms already in the cluster show no Add button. |
| S4 | State boards | The design draws error/success as separate boards. | Same route with `?state=error` / `?state=success`; Try Again returns to the profile, Next Farm opens the next farm. Pages render the default state on the server (Suspense fallback), then apply `?state=` on the client. |
| S5 | /plan | Design: 4 BigStats + HarvestCalendar (wet t), highlight F-014. | Same layout; calendar shows dried t (D8); highlight = F-014's cell (Barangay A, W3). Every stat and note is computed. |
| S6 | /market | Design board uses the Buyer role nav; chips Grade 1 / Grade 2 / 14% MC / W2 / W3 / Open Only. | Coordinator nav (the brief's nav list; keeps one nav across the demo). Chips are the brief's three groups (grade, volume, window), values derived from the data; OR inside a group, AND across groups. Added a glass "Auto-Match to Forecast" table (requested / forecast in window / matched / lots). C-02 shows an "assumed" note under its card. "Commit Lot" turns into "Committed to C-01" (local state only). |
| S7 | /dry | Design: 3 BigStats + SlotTimeline for one week (Mon–Sat), slot times 10:00–16:00. | Seven days of the selected harvest week (W1–W4 switch; opens on L-03's week). Slots carry kg instead of clock times (no source for times). Capacity 480 sacks = 24 t/day (assumed). |
| S8 | /haul | Design: HaulRequestCard (stepper, RouteLine, 4 VehicleOptions, DriverCard with Change Driver). Empty/Error/Success boards; error action "Change Time". | Same pieces. Flow: Empty → New Request (hard form: sacks) → Send Request → auto-assign (nearest available driver whose vehicle carries all sacks; tie: lowest price) → Assigned. Picking a vehicle assigns the nearest available driver of that vehicle; "Change Driver" opens an inline hard list of every driver (busy ones included: "override with any driver"). Not a glass Modal: a glass panel inside a hard card would mix styles. Error action is Try Again (back to the form): there is no time picker. Success links to /dry. |
| S9 | /haul/driver | Design: Accept/Decline, then Mark Picked Up; Decline resets. | Accept → Mark Picked Up → Mark Delivered → "Delivered" (local state). Decline shows a hard notice with Undo. Pay = trips × price per trip. |
| S10 | StatusChip hard + neutral | Neutral chip is glass even when `hard`. | Hard neutral chip is white with black text (no glass inside a hard card). |
| S11 | RouteLine | The brief says "stylized SVG"; the design's RouteLine is a hard HTML list with a black line, labeled "stylized, not to scale". | Design wins (visual): reused as is. No map tiles. |
