# RiceConnect handover — continue the roadmap (after the ANNI batch)

You are working in the RiceConnect monorepo (`S:\Dev\Enactus\rice-connect`, Windows, PowerShell 5.1).
Read `AGENTS.md` and `docs/plan/README.md` first. `docs/DECISIONS.md` rows M32–M50 are the current history;
`docs/BLOCKERS.md` is the live list of open items. This file tells you where we are and what to do next.

## Repo state (6 Oct 2026)

- `origin/main` = `origin/staging` = `f40f4cc` (the last promotion, PRs #28/#29).
- `origin/develop` = `origin/work/phase1` = `2f82e77` (docs-only on top of `f40f4cc`: the ANNI UX tracker).
- Work on `work/phase1`; push to `origin/work/phase1` and fast-forward `origin/develop` (`git push origin work/phase1:develop`).
  Never push `staging` or `main`; promotion is by PR (`gh pr create` → watch checks → merge) and only when the owner says so.
  After any promotion, `develop` moves: `git fetch && git merge origin/develop` into `work/phase1` before the next push.
- CI (`.github/workflows/ci.yml`) has three jobs: `check`, `db` (Supabase local stack + pgTAP RLS/audit/auth tests), `e2e`
  (demo suite 63 tests, then a live-mode build + guard tests). Watch with `gh run list --branch develop --limit 1` + `gh run watch <id>`.

## What is done

- **Phase 0/1/2:** complete except the owner's F-01 (GitHub ruleset), S-13 (native TL/HIL review) and S-14 (second usability round).
- **Phase 3 backend:** B-01 Supabase CLI scaffold; B-02 schema; B-03 RLS policies + 30 pgTAP assertions; B-04 `SupabaseAuthAdapter`
  + live session + `RoleGuard`; B-05 Supabase repositories behind the D-04 interfaces; B-06 audit triggers; B-09 security headers
  (CSP allows `https://vercel.live` for the preview toolbar). B-08 declined by the owner (no error tracking, M46).
  B-07 shipped as the `SmsAdapter` interface + mock; provider + inbound webhook wait on **O8**.
- **Cloud dev project** `kssyjvjwslzgxnkfsayh`: all migrations applied; pgTAP suites run in CI; legacy anon/service keys work.
  Dev fixture: five role accounts (`dev-coordinator@example.com`, `dev-buyer@`, `dev-driver@`, `dev-farmer@`, `dev-admin@`,
  password `password123`), cluster/farm/lot/slot/settlement/commitment/order/vehicle/driver/haul rows, plus `pnpm seed:dev`
  (idempotent; 3 farmers, 8 farms; uses `curl.exe` because Node's resolver cannot see the IPv6-only Supabase host).
- **ANNI (out of plan, owner-requested; M42/M50):** dock in all four apps; Gemini via `@rc/ai` (provider runner with a bounded
  tool loop and proposal interception); eight role-scoped read tools executed server-side under the caller's Supabase JWT
  (RLS is the boundary; demo reads the seed); actions return typed proposals only — buyer `create_order` (summary + confirm +
  Undo) and coordinator `mark_paid` (typed confirmation) execute through the existing data hooks. Verified at API level
  (grounded numbers + proposal). A UX checklist/receipt for Karl lives at `docs/anni-ux-checklist.html` (his review is pending).
- **Vercel envs** set for all four projects: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_THINKING_LEVEL`, `NEXT_PUBLIC_RC_MODE`
  (production = `demo`, preview = `live`). Changing a `NEXT_PUBLIC_*` needs a redeploy.

## Next steps, in order

1. **Finish the Gate 3 screen conversion** — several screens still read `@rc/domain/seed` directly, so live mode shows demo
   content instead of Supabase rows. Done already: farm list, farm detail, coordinator-home harvests. Remaining, in the order in
   `docs/BLOCKERS.md`: **pay** (`useLots` + `useSettlement` + `useSettlementPaid`), **dry** (`useSlots`), **haul** (`HaulRepo.list`
   + coordinator home + driver app — this also fixes the “Hauls waiting for a driver: Something went wrong” panel, which asks for
   the seed haul `H-07`), then **plan**, **market** (`useCommitments`), **buyer** (mostly done) and **sms** (`useSmsThread`/`useSmsReplies`).
   Keep `marketing`, `/demo` and the slip print seed-based by design. Each conversion: keep the demo behavior identical (the mock
   repositories mirror the seed), add the loading/empty/error states, then run `pnpm build:local && E2E_MAIN_PORT=3100 pnpm e2e`.
2. **Mobile header bug** — under 768px the shell's top row (AppShell) carries logo + account + language + theme, so “DARK” wraps
   to its own line. A naive fix (duplicating `LanguageSwitcher`/`ThemeToggle` for a responsive split) hung the `/driver` route in
   the demo smoke; it was reverted. Fix it without duplicating the controls (reposition via CSS/order, or move the theme + language
   into the mobile title row with a single render), then screenshot 390px for buyer/driver and re-run the smoke.
3. **Dashboard graphs (owner request, design-system only)** — build small SVG chart primitives in `packages/ui` (tokens only,
   tabular numbers, `aria-label` + a visually hidden data table, reduced-motion safe): harvest-by-week bars, commitment-fill
   progress, haul-status distribution. Wire them into the coordinator home. No chart library (not on the approved dependency list).
4. **ANNI follow-ups** — browser smoke of the two confirmation dialogs on a live preview (buyer order + coordinator mark-paid),
   then A-07 additional actions (e.g. haul reassign, slot status) if the owner asks. Karl's review may generate fixes.
5. **Owner-gated items** (do not do these; list them in reports): F-01 ruleset; P0-02 private-window check; P0-04/05 usability test
   (Oct 6–7) + findings; `CONTACT_EMAIL` placeholder; S-13/S-14; B-10 restore rehearsal; cloud auth policy in the Supabase Dashboard
   (password rules, confirmations, rate limits, MFA); O7 (DPO) and O8 (SMS aggregator).

## Workflow and environment rules (learned the hard way)

- Before every commit: `pnpm format` (CI runs `format:check` and will fail otherwise), then `pnpm lint`, `pnpm build`,
  `pnpm test`, `node scripts/bundle-budget.mjs`. For UI changes also `pnpm build:local` then `E2E_MAIN_PORT=3100 pnpm e2e`.
- One ticket per commit; Conventional Commits with the ticket id.
- Port 3000 is occupied by another project; always run E2E with `E2E_MAIN_PORT=3100`.
- **Always** run `pnpm build:local` immediately before `pnpm e2e`; for a live-mode build, clean each app's `.next` and use
  `pnpm build:local --force` (a turbo cache restore over an existing `.next` mixes chunks and serves stale modules).
- Live guards E2E: `E2E_LIVE=1 pnpm e2e e2e/guards-live.spec.ts` against a live build with
  `NEXT_PUBLIC_RC_MODE=live NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key`.
- Supabase work: the CLI cannot use the Management API for this org role (403), so push migrations with the session pooler:
  read `SUPABASE_DB_PASSWORD` from `apps/main/.env.local` and
  `pnpm exec supabase db push --db-url "postgresql://postgres.kssyjvjwslzgxnkfsayh:<pw>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" --yes`.
  Never print secrets; `.env*` is gitignored (`.env.example` is the one exception).
- Vercel CLI 48 is logged in (`j-akiru5`); env vars can be managed by linking inside a temp dir (`vercel link --cwd <tmp>`), never in the repo.
- The colour guard only scans `apps`/`packages`; standalone docs may use hex. Playwright smoke checks 360px overflow and console errors
  on every route, so keep mobile layouts overflow-free.

## First task for you

Start with **step 1: the `pay` screen conversion** (`packages/screens/src/pay.tsx`): lot list from `useLots`, slip from
`useSettlement`, paid badge from `useSettlementPaid` (mark-paid already goes through `useMarkPaid`), with the full state matrix.
Then move down the list (dry → haul → plan → market → buyer → sms). After each screen, run the checks above and push the batch
(`git push origin work/phase1` and `git push origin work/phase1:develop`), then watch CI. Report what you verified and what you did not.
