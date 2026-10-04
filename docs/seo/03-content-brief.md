# Content brief

Seven pages. Each page has a primary audience, a keyword cluster, a content brief, and key requirements. All metrics and numbers come from `docs/NUMBERS.md` or `src/data/overrides.json` — never invented.

---

## Copy tone (applies to all pages)

- **Register:** formal enough for judges, LGU officials and investors; plain enough for cooperative leaders and buyers who are not tech-literate.
- **Voice:** direct, factual, optimistic but not promotional. Show the problem, show the mechanism, show the evidence.
- **Language:** English is the default. TL and HIL translations are native-quality — not machine-translated without review. Every TL/HIL string is marked `draft: needs native review` until a speaker signs off (Assumption A1, O-S7).
- **Numbers:** always shown with units (kg, t, sacks, ₱/kg, ₱). Dates in Asia/Manila timezone. Never round up to look better.
- **No invented figures.** Anything not in `docs/NUMBERS.md` goes in `src/data/overrides.json`, labelled "assumed", and is shown as assumed in the UI.

---

## Page 1 — Home `/`

**Canonical:** `https://riceconnect.syntaxure.dev/`
**Audience:** all three groups; primary entry point for brand searches.
**Keywords:** "RiceConnect Dingle Iloilo", "rice cooperative technology Philippines", "palay coordination platform", "Team Syntaxure Labs ISUFST"

**Brief:** The home page establishes the brand and states the mission in one screen. It answers: what is RiceConnect, who built it, and why does it matter for rice farmers in Dingle, Iloilo? It leads to the six inner pages. It does not try to convert — it orients.

**Key content requirements:**
- Tagline: must name Dingle, Iloilo and the farmer cluster.
- One sentence on Syntaxure Labs and ISUFST as the builders.
- Three value pillars (plan, dry, sell) as a visual summary — not a wall of text.
- A single call-to-action: "How it works →".
- DemoChip shown in demo mode (`NEXT_PUBLIC_RC_MODE=demo`): "PROTOTYPE · SIMULATED DATA".
- Footer: "Team Syntaxure Labs · ISUFST" on every page, both modes.

---

## Page 2 — How it works `/how-it-works`

**Canonical:** `https://riceconnect.syntaxure.dev/how-it-works`
**Audience:** judges and mentors (technical understanding); cooperatives and LGUs (operational understanding).
**Keywords:** "harvest planning app Philippines", "palay drying coordination", "rice haul coordination Iloilo", "farmer SMS platform"

**Brief:** Explains the three-phase flow — plan the harvest, coordinate drying slots, haul and sell — using the coordinator and farmer roles as the narrative lens. Judges need to understand the system's logic; cooperative leaders need to see themselves in it. Keep it visual: a three-step diagram drives the page.

**Key content requirements:**
- Three clearly labelled phases: Plan, Dry, Sell.
- Farmer's perspective: SMS-based, no smartphone required.
- Coordinator's perspective: the dashboard, slot assignment, haul dispatch.
- Buyer's perspective: supply visibility and volume commitments.
- One honest sentence on the current stage: "This is a tested prototype. The pilot with real farmers begins in [Phase 5 timeline — leave as placeholder]."
- No screenshots of the live app (demo data is simulated; screenshots could mislead).

---

## Page 3 — Team `/team`

**Canonical:** `https://riceconnect.syntaxure.dev/team`
**Audience:** judges, mentors and investors (credibility check).
**Keywords:** "Team Syntaxure Labs ISUFST", "Enactus ISUFST RiceConnect", "rice technology startup Philippines"

**Brief:** Introduces the people behind RiceConnect. Credibility is the only job of this page. Name the organisation (Syntaxure Labs), its link to ISUFST and Enactus, and the team's background. Keep it short — judges skim.

**Key content requirements:**
- Syntaxure Labs name, description (one sentence), and link to `syntaxure.dev`.
- ISUFST affiliation and Enactus chapter name.
- Team members: name and role only. No personal contact details. No real phone numbers.
- A sentence on the advisory/mentor relationship if one exists.
- Syntaxure Labs LinkedIn and GitHub org URLs (O-S6 supplies these).

---

## Page 4 — For cooperatives and LGUs `/for-cooperatives`

**Canonical:** `https://riceconnect.syntaxure.dev/for-cooperatives`
**Audience:** cooperative leaders, barangay captains, LGU agricultural officers.
**Keywords:** "cooperative harvest management Iloilo", "LGU rice supply data Philippines", "palay coordination system cooperative", "Western Visayas rice cooperative"

**Brief:** Addresses the cooperative's operational pain points directly: missed drying slots, uncoordinated hauls, no visibility into supply before market. Shows how RiceConnect gives the coordinator real-time data on harvest forecasts, dryer capacity and haul status. Speaks to LGUs about aggregate supply data for planning.

**Key content requirements:**
- Open with a specific problem, not a generic benefit claim. Example: "A cooperative coordinator in Dingle manages [N] farms across [N] barangays with no shared system."
- Three concrete coordinator benefits: harvest calendar, dryer slot visibility, haul dispatch.
- One concrete LGU benefit: aggregate supply data for the municipality.
- Reference the pilot cluster in Dingle, Iloilo (Western Visayas) without naming individual farmers.
- A "Request a demo" or "Get in touch" call-to-action linking to `CONTACT_EMAIL` (owner supplies before launch).
- No made-up cooperative names.

---

## Page 5 — For buyers `/for-buyers`

**Canonical:** `https://riceconnect.syntaxure.dev/for-buyers`
**Audience:** rice traders, millers and institutional buyers.
**Keywords:** "traceable palay Philippines", "rice buyer platform Iloilo", "palay supply commitment Western Visayas", "dried palay bulk purchase"

**Brief:** Buyers want supply certainty and traceability. This page shows how RiceConnect gives buyers visibility into the cooperative's drying schedule, volume commitments, and delivery windows — without exposing individual farmer identities. It is a trust-building page, not a marketplace listing.

**Key content requirements:**
- Lead with supply visibility: "Know how much dried palay is available, and when, before the season starts."
- Volume commitment flow: buyer commits to a grade, volume and window; coordinator sees it in the market view.
- Traceability claim: lot-level trace to the barangay, not to the individual farmer (privacy by design).
- Grade and moisture content standards (Grade 1, 14% MC — from `src/data/overrides.json`).
- Pricing note: prices are set by the cooperative, not by the platform.
- A "Request a demo" call-to-action.

---

## Page 6 — Evidence `/evidence`

**Canonical:** `https://riceconnect.syntaxure.dev/evidence`
**Audience:** judges and mentors (impact assessment); investors (due diligence).
**Keywords:** "rice supply chain Philippines data", "harvest coordination impact study", "palay cooperative pilot results"

**Brief:** Shows what is true, what is assumed, and what the next steps are. Judges need to distinguish prototype claims from pilot results. This page is honest about the current stage: the Oct 6–7 usability test findings, the simulated data, and the plan for a real pilot. Do not inflate claims.

**Key content requirements:**
- Usability test summary: date, number of participants, roles, top 3 findings. Source: `docs/plan/07-usability-test.md`.
- Simulated data disclosure: all numbers in the prototype are from the deterministic seed in `packages/domain/src/seed.ts`.
- Assumed numbers: any metric from `src/data/overrides.json` must be labelled "assumed" with a footnote.
- Real numbers: only from `docs/NUMBERS.md`. If there are none yet, say so.
- Next steps: pilot timeline (placeholder), phase gate description.
- No fabricated testimonials. No unnamed sources.

---

## Page 7 — Privacy `/privacy`

**Canonical:** `https://riceconnect.syntaxure.dev/privacy`
**Audience:** anyone — legal requirement.
**Keywords:** "privacy policy RiceConnect", "RA 10173 data privacy Philippines"

**Brief:** The privacy policy. EN only — no TL or HIL variant. Indexed. Written to comply with the Data Privacy Act of the Philippines (RA 10173). Plain language, not legalese.

**Key content requirements:**
- Data controller: Syntaxure Labs (name, address, contact — owner supplies before launch).
- What data is collected: none in demo mode. In live mode: farmer name and mobile number (collected by the coordinator, not the farmer directly), haul records, lot forecasts.
- No personal data of real people is in code, fixtures, tests or screenshots at any point.
- Data subject rights under RA 10173: right to access, correct, erase, object, data portability.
- Cookies: only the language preference and theme preference (localStorage, not a cookie). No third-party tracking cookies in app routes. GA4 on marketing pages only (see `05-analytics.md`).
- Contact for data requests: `CONTACT_EMAIL` (owner supplies before launch).
- Last updated date: set when the owner reviews and approves before launch.
