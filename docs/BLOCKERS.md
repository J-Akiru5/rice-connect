# Blockers and missing items

| Item | Status | Note |
|---|---|---|
| `public/brand/*.svg` (5 logo files) | Present | Downloaded from the design system's asset store. They are a trace of the raster logo, not the designer's vector (per the design's Logos README). |
| Playwright screenshots | Not run here (by instruction) | `apps/main/shots.mjs` is written; run it locally against `pnpm demo:local` (`pnpm --filter @rc/main shots`). It needs a Chromium that Playwright can find. |
| Visual QA in a browser | Not done in this session | Playwright and browsers were off-limits here. Verified instead: `next build` (types + lint), 31 vitest tests, and server-rendered HTML of every route (DemoChip + footer present, no `href="#"`). Layout at 1440/1920/390, dark theme and TL/HIL lengths still need an eye-check with `npm run shots`. |
| Contrast re-measure | Not done | The design's contrast gate was measured on the design's boards. Changes here: `#374151`/`#4b5563` on white hard cards → `--gray-900` (darker, higher contrast); new screens reuse the measured tokens. Re-run a contrast pass on the screenshots. |
| TL / HIL copy | Draft | Every Tagalog and Hiligaynon string (design + prototype additions) needs native review. |
| Logo vectors | Trace | The SVGs are a trace of the raster logo; prefer the designer's original if one exists. |
| Dryer clock times | Dropped | No source for slot clock times; slots show kg. Add times only with a real dryer schedule. |
| Tag `demo-v1` | Not on GitHub | `git push origin demo-v1` is silently dropped by this environment's git proxy (it reports "Everything up-to-date"; GitHub lists no tags). Rollback point created instead as branch `rollback/demo-v1` at 550a55b (= `main` after PR #1). To make the tag yourself: `git fetch origin && git tag demo-v1 550a55b && git push origin demo-v1`. |
| Tag `demo-v2` | Not on GitHub | Same proxy issue. Rollback point is branch `rollback/demo-v2` at ec7de9e (= `main` before the monorepo). To make the tag yourself: `git fetch origin && git tag demo-v2 ec7de9e && git push origin demo-v2`. |
| Cross-tab / cross-zone sync in a browser | Unit-tested only | Two `LocalAdapter`s sync over a real `BroadcastChannel` in Node (`packages/store`). Not checked in a real browser here (no Playwright by rule). Check by hand: open `/buyer/orders` and `/coordinator/home` in two tabs, place an order, watch it appear. |
| Marketing claims | No dossier | No verified impact figures were supplied, so every claim on `/` is tagged Model, Simulated or Assumed. Replace with sourced figures only. |
| Contact email | Placeholder | `CONTACT_EMAIL = 'team@example.com'` in `packages/screens/src/marketing.tsx`. Put the team's real address in before sharing the site. |
| Retired Vercel projects | Owner deletes in dashboard | `riceconnect-site` and `riceconnect-coordinator` are retired (decision M13). The Vercel connector can't delete projects itself: it returns a dashboard link for the owner to confirm. Until then both are set to skip every build (Ignored Build Step `exit 0`). |
| Staging cross-app pages | By design | The staging preview of `apps/main` uses the production buyer, driver and farmer apps (decision M16). |
| Branch protection | Not set | Nothing here can set GitHub branch protection. Recommended in GitHub → Settings → Branches: protect `main` and `staging`: require a PR and the `CI / check` status. |
