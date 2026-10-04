# RiceConnect SEO portal

Source of truth for RiceConnect's public search presence: the canonical URL, audience targeting, language strategy, structured data, OG images, analytics gating, CI checks and the owner action checklist. Agents and developers read these files; the interactive workbench (`workbench.html`) is a rendered copy for manual checks. When the two disagree, these markdown files win.

**Status:** Step 1 in progress (5 Oct 2026). Step 2 (technical build on staging) follows after this PR merges to `develop`.

---

## Files

| File | What it covers |
|---|---|
| [01-decisions.md](01-decisions.md) | All 10 locked decisions (M40–M49) and 4 assumptions (A1–A4). Veto any assumption here. |
| [02-url-map.md](02-url-map.md) | The 21 indexable URLs, `hreflang` block example, `noindex` status per environment. |
| [03-content-brief.md](03-content-brief.md) | Seven-page content brief: audiences, keyword clusters, copy requirements, tone. |
| [04-og-spec.md](04-og-spec.md) | OG image spec for Karl (designer) and the implementing agent (SEO-09). |
| [05-analytics.md](05-analytics.md) | GA4 gating rules, event plan, IndexNow, decision record (M47). |
| [06-ci-checks.md](06-ci-checks.md) | Eight required CI checks, script location, Turborepo task, how to run locally. |
| [07-owner-actions.md](07-owner-actions.md) | Checklist of actions only the owner can take (O-S1 through O-S8). |
| [workbench.html](workbench.html) | Interactive HTML checker: six panels, self-contained, opens from `file://`. |

---

## Build order

### Step 1 — `docs/seo/` and the workbench (this PR)
Safe to do now; touches no source code.

| Ticket | Deliverable |
|---|---|
| SEO-01 | This folder: `README.md` + 7 section files |
| SEO-02 | `workbench.html`: 6 interactive panels, self-contained |

### Step 2 — Technical build on staging
After Step 1 merges to `develop`. Each ticket is a separate PR.

| Ticket | What |
|---|---|
| SEO-03 | Seven public pages in `apps/main/(marketing)/`; `generateMetadata()` per page |
| SEO-04 | `/tl/` and `/hil/` prefix route groups; `hreflang` helper; TL/HIL start `noindex` |
| SEO-05 | `sitemap.ts` — 21 URLs, excludes app routes |
| SEO-06 | `robots.ts` — environment-aware; AI crawlers allowed |
| SEO-07 | `Organization` schema: Syntaxure parent, RiceConnect product, Dingle/Iloilo scope |
| SEO-08 | `WebSite` schema on Home; `BreadcrumbList` on inner pages |
| SEO-09 | `/api/og` dynamic route — `ImageResponse`, Karl's template, token palette |
| SEO-10 | Static fallback `/public/og-fallback.png` (Karl, owner action O-S8) |
| SEO-11 | `public/llms.txt` |
| SEO-12 | `<Analytics />` component; marketing layout only; `NEXT_PUBLIC_GA_ID`-gated |
| SEO-13 | `scripts/seo-check.mjs` — eight checks; `seo` Turborepo task; CI integration |
| SEO-14 | Production indexing flip PR (after Oct 10) |

### Step 3 — Owner-only actions
See [07-owner-actions.md](07-owner-actions.md). DNS and Search Console can run in parallel with Step 1.

---

## How to use this folder

1. Before any SEO ticket: read `01-decisions.md` and the section file the ticket references.
2. After a ticket changes a rule or a decision: update the relevant section file and record the decision in `docs/DECISIONS.md` in the same PR.
3. Use `workbench.html` to manually validate `<head>` tags, OG images, sitemaps and schemas after each Step 2 ticket.
4. The workbench is not a substitute for Search Console; both are needed.
