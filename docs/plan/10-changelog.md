# Changelog

What has shipped, newest first. Each release to production is a `staging → main` PR. Each feature reached `develop` by its own PR, then `staging`. Links go to J-Akiru5/rice-connect.

## Release 4: Gate 3 conversion and Phase 4 readiness (7 Oct 2026)

Promoted by the owner's instruction: `develop → staging` ([#32](https://github.com/J-Akiru5/rice-connect/pull/32)) → `main` ([#33](https://github.com/J-Akiru5/rice-connect/pull/33)). Production runs demo mode (`NEXT_PUBLIC_RC_MODE=demo`); previews run live.

- **Gate 3 screen conversion.** Farm list/detail, coordinator home, pay, dry, haul (home + both role screens), plan, market, buyer and SMS read the Supabase repositories through the data hooks; the mock repositories keep demo behaviour identical. `marketing`, `/demo`, the slip print and `/sms?all=1` stay seed-based by design. Follow-ups: commitment moisture honesty (`28bb62d`), my-farm resolution for the farmer screens and live buyer commitment fills (M56/M57).
- **Phase 4 (repo side, M52).** Public `/privacy` notice in EN/TL/HIL with a version constant, footer links on every route, and consent capture at sign-up (metadata → `handle_new_user` → `consents`; migration `20261007120000_consent_capture.sql`). Readiness pack: data inventory, DSR procedure + `scripts/dsr.mjs`, incident runbook, printable paper fallback, per-role onboarding guides.
- **Owner requests.** Mobile header keeps language + theme together under 768px; SVG dashboard charts (`BarChart`, `ProgressBar`, `StatusDistribution`) on the coordinator home; buyer supply map tiles unblocked in the CSP (M51).
- **Integrated branches.** `lou` public-site institutional register + buyer typography + Menu fix + the 168-character mojibake repair ([#30](https://github.com/J-Akiru5/rice-connect/pull/30), S-19); `karl` S-15–S-18: farmer plan/milling/price screens, driver jobs list + job detail, shared `splitNav`/`MoreSheet` and phone-shell parity ([#31](https://github.com/J-Akiru5/rice-connect/pull/31), M53/M54/M55).
- **Verification.** CI green on every push and PR (`check`, `db` with pgTAP incl. consent, `e2e` with the demo suite + live guards); local `format:check`/lint/build/test/bundle and `build:local` + 77 demo E2E; visual suite 40 passed against committed baselines; post-deploy production smoke of 17 routes plus the buyer-order-to-coordinator-home flow.
- **Still gated** (recorded in `docs/BLOCKERS.md`): gated live smokes need a network that can reach Supabase; F-01 ruleset; P0-02 private-window check; P0-04/05 findings; CONTACT_EMAIL and DPO placeholders; S-13/S-14; B-10 restore rehearsal; cloud auth policy; O7/O8; demo-off-in-production.

## Release 3: sign-in and sign-up, product plan (4 Oct 2026)

Released to production by the owner's decision (M31) after the owner checked sign-in on staging. Freeze lifted early; see [01-decisions.md](01-decisions.md).

- **Mock Sign In and Sign Up per app**, split layout, production-shaped ([#12](https://github.com/J-Akiru5/rice-connect/pull/12), decision M23).
  - Coordinator `/login` + `/signup`; buyer, driver and farmer `/login` + `/signup` inside their apps; super admin `/admin/login` only.
  - Email for coordinator, buyer and admin; Philippine mobile for driver and farmer, normalised to +63.
  - Labelled fields, inline errors, focus on the first error, Show/Hide password, loading state, Data Privacy Act consent on sign-up.
  - The forms call only `AuthAdapter` (`@rc/store`). The shipped `MockAuthAdapter` accepts any well-formed input, keeps nothing typed (tested), and signs in as the app's demo identity. A Supabase adapter replaces it with no page changes.
  - The farmer app has its own shell (SMS, Slip).
- **Product plan** in `docs/plan/` with this portal ([#14](https://github.com/J-Akiru5/rice-connect/pull/14), decisions M25–M30).
  - Roadmap with gates, architecture, UX and engineering standards, agent playbook, usability test kit, pilot readiness, backlog, proposed product rules.
  - `docs/UAT-KIT.html` tasks B1 and D1 no longer use the removed "View as" switcher.
  - Rollback branch `release/demo-enactus-2026` at the previous production commit `02a6199`.

## Release 2: one sign-in per app, landing, super admin (4 Oct 2026)

Released in [#7](https://github.com/J-Akiru5/rice-connect/pull/7) (production commit `02a6199`).

- **Sign-in per app, no role picker** ([#10](https://github.com/J-Akiru5/rice-connect/pull/10), M22). `/login` is the coordinator's; buyer, driver and super admin each have their own. The "View as" switcher was removed.
- **Landing page** in the LikasLens structure with RiceConnect branding, Log In at the top ([#8](https://github.com/J-Akiru5/rice-connect/pull/8), M18).
- **Language menu** that no longer shifts the page when TL or HIL is chosen (M17).
- **Super admin** at `/admin`: overview, users and roles, settings and assumptions, activity (M20).
- **Zone apps opened directly** show their own page instead of a 404 (M21).

## Release 1: fewer apps and the branch flow (4 Oct 2026)

Part of [#7](https://github.com/J-Akiru5/rice-connect/pull/7) via [#5](https://github.com/J-Akiru5/rice-connect/pull/5).

- Marketing and coordinator merged into one main app (`rice-connect`); buyer, driver and farmer stay as their own apps (M13). Two Vercel projects retired and deleted by the owner.
- Branches `develop → staging → main`; Vercel builds only `main` and `staging`; GitHub Actions CI on every PR (M14, M15).

## Before the monorepo (3–4 Oct 2026)

- [#4](https://github.com/J-Akiru5/rice-connect/pull/4) Monorepo with zone apps, shared store, public marketing site.
- [#3](https://github.com/J-Akiru5/rice-connect/pull/3) Buyer portal for millers, retailers, market sellers and restaurants; supply map; trace to farm; test kit.
- [#2](https://github.com/J-Akiru5/rice-connect/pull/2) Responsive layout and URL-state pagination.
- [#1](https://github.com/J-Akiru5/rice-connect/pull/1) The Enactus 2026 prototype: simulated data, demo video and slides.
