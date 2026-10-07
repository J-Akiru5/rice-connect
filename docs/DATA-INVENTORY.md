# Data inventory (Phase 4, RA 10173)

Every field the pilot stores, why, who can read it, and how long we propose to keep it. Purpose is the only
reason a field may be collected; if a field has no purpose, it is removed. The "read by" column matches the
row-level security policies in `supabase/migrations/20261005120100_rls.sql` (the machine-checked copy).

**Retention periods are proposals.** They follow the project's rule that a record is kept only while the pilot
and its audit need it; the owner and the Data Protection Officer confirm or change them before Gate 4
(open in `docs/BLOCKERS.md`). Until then, nothing is deleted automatically.

| Table | Field | Purpose | Read by | Proposed retention |
|---|---|---|---|---|
| `profiles` | id (auth uid) | Link a person to their records | Self, admin, cluster coordinator | Pilot + 2 years after account closure |
| | role | Decide which screens and rows apply | Self, admin | as above |
| | display_name | Address the person in the app | Self, admin, coordinator, cluster members | as above |
| | mobile_e164 | Sign in, send SMS, contact | Self, admin; masked form for coordinator | as above |
| | barangay | Cluster planning | Self, admin, coordinator | as above |
| | cluster_id | Which cluster the person belongs to | Self, admin, coordinator | as above |
| `consents` | profile_id, policy_version, channel, accepted_at, withdrawn_at | Proof of consent under RA 10173 | Self, admin, coordinator | Pilot + 2 years (audit proof) |
| `farms` | id, name, barangay, area_ha, variety, planting/harvest week, status | Plan harvests, book the dryer | Farmer, coordinator, admin | Pilot + 2 years |
| | mobile_e164 | SMS about the farm's lots | Farmer, coordinator, admin (masked in lists) | as above |
| `lots` | id, sacks, wet_kg, dried_kg, grade, moisture, status, harvest_date | Settlement, haul and dryer planning | Farmer (own), coordinator, admin, buyer (only lots tied to their orders) | Financial records: pilot + 5 years (proposed) |
| `dryer_slots` | day, slot_time, kg, status, lot | Dryer schedule | Coordinator, admin, farmer (own lot), driver (assigned lot) | Pilot + 2 years |
| `vehicles`, `drivers` | plate, capacity, home distance | Assign a haul | Coordinator, admin, driver (own row) | Pilot + 2 years |
| `hauls` | route, pickup_date, status, km | Track delivery; driver's job card | Assigned driver, coordinator, farmer (own lot), admin | Pilot + 2 years |
| `commitments` | tonnes, grade, price, weeks, status, buyer | Match supply to buyers | Buyer (own), coordinator, admin | Pilot + 5 years (proposed) |
| `rice_orders` | type, kg, sacks, total, week, status | Order, cancel, trace | Buyer (own), coordinator, admin | Pilot + 5 years (proposed) |
| `settlements` | gross/advance/balance, paid_at | Pay the farmer; audit payments | Farmer (own), coordinator, admin | Pilot + 5 years (proposed) |
| `sms_messages` | body, direction, status, created_at | Deliver updates; show replies | Self, coordinator/cluster (outbound), admin | 90 days after send (proposed) |
| `audit_log` | actor, table, before/after, at | Who changed what, for audits and disputes | Admin only (writes are service-side) | Pilot + 2 years |
| `clusters` | name, municipality | Cluster scope | Everyone in the cluster, admin | Pilot + 5 years (proposed) |

## Minimum-data rules already enforced

- No national ID numbers, no photos of people, no exact home coordinates. Farm locations stay at barangay
  level in the app (the supply map plots barangays, never farms); the database stores no coordinates.
- SMS templates carry farm/lot codes, weights, dates and amounts only; no names.
- Seed, demo and test data contain no real person's data (`packages/domain/src/seed.ts`, dev fixtures).

## What leaves the system

- SMS bodies go to the aggregator chosen under O8 (once contracted); the contract must cover retention and
  deletion. Until then live SMS fails closed (`UnconfiguredSmsAdapter`).
- Nothing else leaves: no analytics, no error tracking (declined, M46). Vehicle telemetry is not collected.
- Backups are taken by Supabase; the restore rehearsal (B-10) covers them.

## Review

| Role | Name | Date |
|---|---|---|
| Owner | | |
| Data Protection Officer | | |
