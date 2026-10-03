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
