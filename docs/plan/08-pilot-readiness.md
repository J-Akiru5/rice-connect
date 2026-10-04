# Pilot readiness (Gate 4)

Nothing on this list is optional. Real farmers' names, mobile numbers, farm locations and payments are personal information under the **Data Privacy Act of 2012 (RA 10173)**. Items marked *verify* depend on rules the team should confirm with the National Privacy Commission's published issuances or a lawyer; this plan is not legal advice.

## People and accountability

- [ ] A named **Data Protection Officer** (or compliance officer) for the pilot, with contact details published in the privacy notice. (Open question O7.)
- [ ] A named on-call developer for each pilot day, and a backup.
- [ ] Every team member with data access has signed a short confidentiality agreement and knows the incident procedure.

## Privacy and consent

- [ ] **Privacy notice** in EN, TL and HIL, written plainly: what is collected, why, who sees it, how long it is kept, and how to ask for access, correction or deletion. Shown at sign-up and reachable from every page footer.
- [ ] **Consent capture** at sign-up, stored in the `consents` table with the notice version, the channel (app, SMS, paper) and the time. Farmers who join by SMS or on paper get the notice read to them, and the coordinator records consent with the same fields.
- [ ] **Data inventory**: every field collected, its purpose, who can read it (matches the RLS table in [03-architecture.md](03-architecture.md#row-level-security-who-sees-what)) and its retention period.
- [ ] **Minimum data**: no field without a purpose. No national ID numbers, no photos of people, no exact home locations; farm locations at barangay level unless a task needs more.
- [ ] **Data subject requests**: a written procedure, and an admin screen or script, to export, correct or delete one person's data.
- [ ] **Registration with the National Privacy Commission** checked against the current registration criteria (*verify*: NPC Circular 2022-04 sets who must register).
- [ ] **Breach procedure**: who decides, who notifies the NPC and the affected people, and within what time (*verify*: NPC rules require notifying the Commission within 72 hours of knowledge of a qualifying breach).

## Security

- [ ] Row-level security on every table, with the per-role CI test passing (Gate 3).
- [ ] Service-role keys only on the server; no secrets in the repo (secret scanning on in GitHub).
- [ ] Multi-factor authentication on GitHub, Vercel and Supabase for every team account.
- [ ] Backups on, and one restore rehearsed into the staging project.
- [ ] Admin accounts limited to named people; every admin action audited.
- [ ] Error tracking and logs scrub personal data (checked with a test record).

## SMS

- [ ] Aggregator chosen and contracted (O8); **sender name registered** (start early: registration takes days to weeks).
- [ ] Message templates reviewed by native speakers in TL and HIL; each fits one SMS segment where possible.
- [ ] Opt-out word handled (`STOP` and local equivalents) and honoured.
- [ ] Delivery reports stored; failed messages visible to the coordinator with a manual fallback (call or visit).
- [ ] Monthly SMS budget set, with an alert before it runs out.

## Operations

- [ ] **Paper fallback** for every step the app handles (slot list, haul sheet, slip), so the cluster can run a day without the app.
- [ ] Onboarding script and a one-page guide per role, in the user's language, tested in the Phase 2 usability round.
- [ ] Support channel (a phone number staffed by the team during pilot hours) printed on the guides.
- [ ] Incident runbook: site down, SMS not sending, wrong payment shown, suspected data leak; each with who acts and how.
- [ ] Pilot success criteria agreed with the cluster in writing before day one.

## Product

- [ ] Gate 2 passed (no severity 3–4 findings in the second usability round).
- [ ] Gate 3 passed (E2E on staging Supabase, RLS tests, restore rehearsed).
- [ ] Demo mode switched off in production; the DemoChip is gone in live mode and present in the demo deployment.
- [ ] Every figure shown to users comes from real records; assumptions from `docs/NUMBERS.md` are either confirmed with the cluster or removed.

## Sign-off

| Role | Name | Date |
|---|---|---|
| Owner | | |
| Data Protection Officer | | |
| Lead developer | | |
