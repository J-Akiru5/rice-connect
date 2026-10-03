# Numbers: where every figure comes from

Three sources only:

- **brief** — given in the build brief; constants in `src/data/params.ts`.
- **assumed** — not in the brief; every one is in `src/data/overrides.json` and in the table below.
- **computed** — derived in code (`src/data/*.ts`) from the two above. Nothing on screen is typed in by hand.

All data is simulated. Money is integer centavos, shown as ₱ with 2 decimals (SMS uses `PHP`, see DECISIONS D5).

## Assumptions (all labeled "assumed")

| Value | Where | Why |
|---|---|---|
| 1 sack = 50 kg | `kgPerSack` | assumed (the brief says "assumed"; the design also says 50 kg, simulated). |
| Dryer 24 t/day = 24,000 kg/day | `dryerKgPerDay` | assumed (the brief says "assumed"). Applied to dried kg. |
| W1 starts Mon 5 Oct 2026 | `calendarW1Monday` | assumed. Matches the design's W2 date (Tue 13 Oct) for the calendar. |
| 110 days from planting to harvest | `cropDaysPlantingToHarvest` | assumed. Only used to show each farm's planting week. |
| Slot SMS goes out 2 days before harvest | `smsSlotLeadDays` | assumed. Only sets the date shown on SMS 1. |
| Buyer pays 7 days after the advance | `buyerPaysAfterDays` | assumed. Only sets the date shown on SMS 3 ("balance when the buyer pays"). |
| Forecast lots are Grade 1 at 14% MC | `forecastGrade`, `forecastMcPct` | assumed. The brief gives no grade per farm; needed to match C-01 (Grade 1, 14% MC). |
| C-02: Grade 1, 14% MC, ₱22.50/kg | `commitmentC02` | assumed. The brief gives C-02 only volume and window. The card shows these as assumed. |
| Vehicles: motor 4 sacks ₱250.00/trip; tricycle 10 / ₱450.00; multicab/pickup 25 / ₱1,200.00; truck 100 / ₱3,500.00 | `vehicles` | assumed (the brief says price per trip is assumed). Values copied from the design's `lib/demo.ts`. |
| Six drivers (DR-01 … DR-06), their vehicles and availability (DR-04 unavailable) | `drivers` | assumed roster. Distances are seeded (mulberry32, drawn after the farms). |
| F-014 pinned: 1.5 ha, harvest W3, status Verified | `hero` | assumed. The seed gives F-014 1.3 ha in W1, which cannot yield lot L-03 (5,000 kg) or match C-01 (W3–W4). 1.5 ha × 3,429 = 5,144 kg forecast ≥ 5,000 kg weighed. Status Verified so "Add to cluster" has something to do (the design pins it the same way). |

## Brief inputs (`src/data/params.ts`)

Seed 20261009 · 100 farms · 120.0 ha total · 0.5–2.5 ha each · barangays 33/34/33 · weeks W1–W4 · 4,000 kg/ha wet · 3% loss · drying factor 0.884 · quoted ₱22.50/kg · drying ₱1.50/kg · coordination margin ₱1.00/kg · advance 80% of net · buyer sourcing fee 3% of quoted · C-01 30 t Grade 1 14% MC W3–W4 ₱22.50 Buyer A · C-02 25 t W2–W3 Buyer B · IDs F-014, L-03 (5,000 kg), H-07 · demo beats and flip times.
Slip ID S-0303 is the design's ID (the brief names no slip ID).

## On-screen numbers (current values; all recomputed on every build)

| Screen | Number shown | Value | Source |
|---|---|---|---|
| all | Money format | ₱ + 2 decimals | computed from integer centavos (`money.ts`) |
| /farm | Farm count · total area | 100 farms · 120.0 ha | computed: `FARMS.length`, sum of tenths = 1200 (tested) |
| /farm, /farm/[id] | Area per farm | 0.5–1.9 ha | computed: seeded raw 0.5–2.5 ha scaled to 120.0 ha, rounded to 0.1, residual on F-100; F-014 = 1.5 ha (assumed pin) |
| /farm/[id] | Mobile | `09•• ••• nnnn` | seeded last 4 digits, masked |
| /farm/[id] | Planting week | e.g. Jul W1 | computed: harvest date − 110 days (assumed) |
| /farm/[id] | Harvest week/date | e.g. W3 · Thu 22 Oct | seeded week and weekday; W1 = Mon 5 Oct 2026 (assumed); F-014 W3 (assumed pin) |
| /farm/[id] | Forecast, dried | e.g. 5,144 kg · 103 sacks | computed: area × 3,429 kg/ha; sacks = ⌈kg ÷ 50⌉ (50 kg assumed) |
| /plan | Farms in cluster | 100 | computed |
| /plan | Area · average | 120.0 ha · 1.2 ha per farm | computed |
| /plan | Planned harvest | 411.5 t dried (wet 480.0 t) | computed: Σ farm dried kg (411,479 kg); wet = 120.0 ha × 4,000 kg/ha |
| /plan | kg/ha dried | 3,429 | computed: ⌊4,000 × 0.97 × 0.884⌋ = ⌊3,429.92⌋ (tested) |
| /plan | Peak week | W4 · 145.0 t | computed: max of weekly dried kg (96.0 / 81.3 / 89.2 / 145.0 t) |
| /plan | Calendar cells | e.g. Barangay A W3 = 18.5 t | computed: Σ dried kg by barangay and week |
| /plan | Highlight | F-014 · L-03 · 5.1 t | computed: F-014 forecast 5,144 kg |
| /market | Commitment tonnes, grade, MC, price | C-01 30.0 t Grade 1 14% MC ₱22.50/kg; C-02 25.0 t (grade, MC, ₱22.50 assumed) | brief / assumed (C-02) |
| /market | Filled · % | C-01 32.4 of 30.0 t · 100%; C-02 25.4 of 25.0 t · 100% | computed by `autoMatch()` (whole lots; matched ≥ requested, tested) |
| /market | Forecast in window | C-01 234.1 t; C-02 170.3 t | computed: Σ lot kg with harvest week in the window |
| /market | Lots matched | C-01 6 (incl. L-03); C-02 7 | computed |
| /market | Chip counts | (n) | computed: commitments per chip value |
| /dry | Capacity per day | 480 sacks · 24 t | assumed 24 t/day ÷ 50 kg per sack |
| /dry | Booked this week · % | W3: 1,789 sacks · 53% of 3,360 | computed: Σ slot sacks in the week ÷ (480 × 7) |
| /dry | Lot L-03 slot | D-58 · Thu 22 Oct · 5,000 kg · 100 sacks | computed: first-fit slots in harvest-date order; ID = order given out |
| /dry | Day bars | used / 480 sacks | computed; no day over 24,000 kg (tested) |
| /haul | Sacks | 100 | computed: 5,000 kg ÷ 50 kg |
| /haul | Vehicle capacity, price per trip, trips | motor 4 / ₱250.00 … truck 100 / ₱3,500.00; trips = ⌈sacks ÷ capacity⌉ | assumed (vehicles), computed (trips); options disabled above 3 trips (design rule) |
| /haul | Driver distance | DR-05 Truck T-02 · 6.2 km | seeded; auto-assign = nearest available whose vehicle carries all sacks, tie → lowest price (tested) |
| /haul | Route length | 8.3 km (6.5 + 1.8) | seeded, labeled "stylized, not to scale" |
| /haul/driver | You earn | ₱3,500.00 | computed: trips × price per trip |
| /haul/driver | Sacks (about t dried) | 100 (about 5.0 t dried) | computed |
| /pay/L-03 | Quoted | ₱112,500.00 | computed: 5,000 kg × ₱22.50 (tested) |
| /pay/L-03 | Drying | ₱7,500.00 | computed: 5,000 × ₱1.50 (tested) |
| /pay/L-03 | Coordination margin | ₱5,000.00 | computed: 5,000 × ₱1.00 (tested) |
| /pay/L-03 | Net to farmer | ₱100,000.00 · ₱20.00/kg | computed (tested) |
| /pay/L-03 | Advance 80% | ₱80,000.00 | computed (tested) |
| /pay/L-03 | Balance 20% | ₱20,000.00 | computed (tested) |
| /pay/L-03 | Buyer sourcing fee | ₱0.68/kg (3% of ₱22.50 = 0.675, rounded) · ₱3,375.00 | computed: 3% of quoted total, paid by the buyer, not deducted (tested) |
| /pay | Estimate per forecast lot | net ₱ | computed with the same `settle()` on forecast kg |
| /pay/L-03, slip | Slip date | Fri 23 Oct 2026 | computed: dryer slot day + 1 (advance within 24 h) |
| /sms | Message dates | Tue 20 Oct · Fri 23 Oct · Fri 30 Oct | computed: harvest − 2 days (assumed); slot day + 1; + 7 days (assumed) |
| /sms | chars · SMS parts | e.g. 107 chars · 1 SMS | computed by SmsBubble; every message ≤ 160 GSM-7 characters (tested) |
| /demo | Beat times, flips | 0–6 … 72–78 s; EN/TL/HIL at 64/67/70 s | brief (tested) |
| /demo | End card line | "One cluster. One hundred farms. 80% paid within 24 hours." | design copy; 100 farms and 80% within 24 h match the brief |
