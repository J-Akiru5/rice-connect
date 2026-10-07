# RiceConnect handover — Phase 4 readiness (after the Gate 3 batch)

You are working in the RiceConnect monorepo (`S:\Dev\Enactus\rice-connect`, Windows, PowerShell 5.1).
Read `AGENTS.md` and `docs/plan/README.md` first. `docs/DECISIONS.md` rows M32–M55 are the current history;
`docs/BLOCKERS.md` is the live list of open items. This file tells you where we are and what to do next.

## Repo state (7 Oct 2026)

- `origin/main` = `origin/staging` = `f40f4cc` (the last promotion, PRs #28/#29).
- `origin/develop` = `origin/work/phase1` = the Gate 3 conversion + Phase 4 readiness commits (see `git log`).
- Another developer's branch `origin/lou` (public-site restyle) is **not merged yet** and rewrites
  `packages/screens/src/buyer-orders.tsx`, `buyer.tsx`, `buyer-type.tsx`, `marketing.tsx` and
  `packages/i18n/src/strings.prototype.ts`; do not edit those files until it merges (see BLOCKERS).
- Work on `work/phase1`; push to `origin/work/phase1` and fast-forward `origin/develop` (`git push origin work/phase1:develop`).
  Never push `staging` or `main`; promotion is by PR (`gh pr create` → watch checks → merge) and only when the owner says so.
  Before every push: `git fetch` and, if `origin/develop` moved, `git merge origin/develop` into `work/phase1`.
- CI (`.github/workflows/ci.yml`) has three jobs: `check`, `db` (Supabase local stack + pgTAP RLS/audit/auth/consent tests),
  `e2e` (demo suite 66 tests, then a live-mode build + guard tests). Watch with `gh run list --branch develop --limit 1` +
  `gh run watch <id>`. GitHub's API can time out from this machine; retry.

## What is done

- **Phase 0/1/2:** complete except the owner's F-01 (GitHub ruleset), S-13 (native TL/HIL review) and S-14 (second usability round).
- **Phase 3 backend:** B-01 scaffold; B-02 schema; B-03 RLS + pgTAP; B-04 live auth/session/guard; B-05 repositories behind the
  D-04 interfaces; B-06 audit triggers; B-09 security headers (CSP allows `https://vercel.live` and, since M51,
  `https://tiles.openfreemap.org` for the buyer map). B-08 declined (M46). B-07 is the `SmsAdapter` seam; provider + webhook wait on **O8**.
- **Gate 3 screen conversion — complete:** farm list/detail, coordinator home, pay, dry, haul (home + both screens), plan,
  market, buyer and SMS read the data layer; demo behavior is unchanged (mocks mirror the seed). `marketing`, `/demo`, the slip
  print and `/sms?all=1` stay seed-based by design. Known live gaps and deferrals in `docs/BLOCKERS.md`.
- **UI polish:** the mobile header keeps language + theme together under 768px; SVG dashboard charts (`BarChart`, `ProgressBar`,
  `StatusDistribution` in `packages/ui`, tokens only, hidden data tables, tested) are wired into the coordinator home.
- **Phase 4 (repo side):** public `/privacy` notice (EN/TL/HIL, versioned in `@rc/domain/privacy`), footer link on every route,
  consent capture at sign-up (sign-up metadata → `handle_new_user` → `consents`, pgTAP-tested; migration applied to the dev
  project). Docs pack: `DATA-INVENTORY.md`, `DSR.md` + `scripts/dsr.mjs`, `RUNBOOK.md`, `paper-fallback.html`,
  `guides/onboarding.html`; `08-pilot-readiness.md` marks what is built. DPO name/contact and retention periods are still
  provisional (O7 + owner).
- **ANNI (M42/M50):** dock in all four apps, Gemini runner with a bounded tool loop, role-scoped read tools under the caller's
  JWT, typed proposals (`create_order`, `mark_paid`) confirmed in the dock. Both dialogs were browser-verified in demo mode
  (this session); the live/RLS run is pending (see below). Karl's UX review (`docs/anni-ux-checklist.html`) is pending.
- **Cloud dev project** `kssyjvjwslzgxnkfsayh`: all migrations applied (last: `20261007120000_consent_capture.sql`);
  five dev accounts at `password123`; `pnpm seed:dev` is idempotent.

## Next steps, in order

1. **Run the gated live smokes from a network that can reach Supabase** (this machine cannot: see BLOCKERS). Both specs are in
   the repo, skipped unless gated:
   - Gate 3: live build (`NEXT_PUBLIC_RC_MODE=live pnpm build:local --force`), then
     `E2E_GATE3=1 E2E_MAIN_PORT=3100 pnpm e2e e2e/gate3-live.spec.ts`.
   - ANNI: same build (apps' env needs Supabase + `GEMINI_API_KEY`), then
     `E2E_ANNI=1 E2E_MAIN_PORT=3100 pnpm e2e e2e/anni-live.spec.ts`.
   Report failures with the screen and the console/API response; fix before any staging Gate 3 run.
2. **After `origin/lou` merges:** add the privacy link to the marketing `SiteFooter`, and do the deferred buyer honesty pass
   (buyer commitment cards: stored grade, no demo MC, live fill from `autoMatch`) — see BLOCKERS.
3. **ANNI follow-ups:** Karl's review may generate fixes; A-07 additional actions only if the owner asks.
4. **Owner-gated items** (do not do these; list them in reports): F-01 ruleset; P0-02 private-window check; P0-04/05 usability
   test + findings; `CONTACT_EMAIL`; S-13/S-14; B-10 restore rehearsal; cloud auth policy/MFA in the dashboards; O7 (DPO) and
   O8 (SMS aggregator); demo-off-in-production env.

## Workflow and environment rules (learned the hard way)

- Before every commit: `pnpm format` (CI runs `format:check`), `pnpm lint`, `pnpm build`, `pnpm test`,
  `node scripts/bundle-budget.mjs`. For UI changes also `pnpm build:local` then `E2E_MAIN_PORT=3100 pnpm e2e`.
- One ticket per commit; Conventional Commits with the ticket id.
- Port 3000 is occupied by another project; always run E2E with `E2E_MAIN_PORT=3100`.
- **Force demo on local builds:** `apps/*/.env.local` can carry `NEXT_PUBLIC_RC_MODE=live` (a leftover from live testing;
  something outside the repo re-added it once). Build with `$env:NEXT_PUBLIC_RC_MODE='demo'` set, or check the file first;
  otherwise `/driver` hangs on the Supabase call and the smoke fails.
- **Always** run `pnpm build:local` immediately before `pnpm e2e`; for a live-mode build, clean each app's `.next` and use
  `pnpm build:local --force` (a turbo cache restore over an existing `.next` mixes chunks and serves stale modules).
- Live guards: `E2E_LIVE=1 pnpm e2e e2e/guards-live.spec.ts` against a live build with a dummy Supabase project. Gate 3 and
  ANNI live specs are excluded from the default suite via `playwright.config.ts` unless their gate env is set.
- Supabase work: push migrations with the session pooler (reachable even when `*.supabase.co:443` is not):
  read `SUPABASE_DB_PASSWORD` from `apps/main/.env.local` and
  `pnpm exec supabase db push --db-url "postgresql://postgres.kssyjvjwslzgxnkfsayh:<pw>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" --yes`.
  Never print secrets; `.env*` is gitignored (`.env.example` is the one exception).
- Visual snapshots: Windows baselines were refreshed after the header/charts work (`VISUAL=1 pnpm e2e e2e/visual.spec.ts
  --update-snapshots`); CI updates Linux ones only with the `visual-update` label.
- The colour guard only scans `apps`/`packages`; standalone docs may use hex. The smoke checks 360px overflow and console
  errors on every route, so keep mobile layouts overflow-free.

## First task for you

Step 1 above: run the two gated live smokes from a network with Supabase access (or hand them to the owner), then pick up
step 2 as soon as `origin/lou` merges. Read `docs/BLOCKERS.md` before starting anything.
