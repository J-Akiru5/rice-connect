# SEO decisions

**Status:** all 10 decisions locked (5 Oct 2026). Owner: Jeff (Syntaxure Labs).
These are recorded in `docs/DECISIONS.md` (M40–M49) in the same PR as this file.

> **Note:** M37–M39 are already taken in `develop` (M37 = agent browser access, M38 = ESLint version, M39 = package boundaries). SEO decisions start at M40.

---

## Decisions (all 10 locked)

| ID | # | Decision |
|---|---|---|
| M40 | D-S1 | **Canonical:** `riceconnect.syntaxure.dev`. The Vercel `.app` domain 301-redirects to it. DNS is an owner action (O-S1). |
| M41 | D-S2 | **Audiences:** judges, mentors and investors (brand searches); cooperatives and LGUs; rice buyers. **Not farmers** — they are reached by SMS, not by search. |
| M42 | D-S3 | **Seven public pages:** Home, How it works, Team, For cooperatives and LGUs, For buyers, Evidence, Privacy. No blog. Privacy is indexed in English only. |
| M43 | D-S4 | **EN, TL and HIL all indexable** from day one. 21 URLs total (6 pages × 3 languages = 18, plus 1 EN-only Privacy). `hreflang` + `x-default` on every multilingual page. TL and HIL pages are `noindex` until a native speaker signs them off (Assumption A1). |
| M44 | D-S5 | **Syntaxure is the parent organisation.** RiceConnect claims Dingle, Iloilo and Western Visayas through content and schema. No standalone Google Business Profile for RiceConnect. |
| M45 | D-S6 | **Allow all search and AI crawlers.** Add `llms.txt` to `public/`. |
| M46 | D-S7 | **OG image:** one designed template generated per page and language via Next.js `ImageResponse` (`/api/og?page=<slug>&lang=<lang>`). Static fallback `/public/og-fallback.png`. Dimensions 1200×630. Karl designs the Figma template (O-S8). |
| M47 | D-S8 | **Measurement:** Search Console (domain property), Bing Webmaster Tools, IndexNow and Google Analytics 4. GA4 loads on marketing pages only — approved exception to the no-analytics rule in `AGENTS.md` (see `05-analytics.md`). |
| M48 | D-S9 | **Portal:** `docs/seo/` markdown as source of truth. `workbench.html` is the interactive checker. |
| M49 | D-S10 | **CI:** eight required SEO checks in `scripts/seo-check.mjs`, run as a `seo` Turborepo task. Zero new npm dependencies. |

---

## Assumptions (veto any of these)

| # | Assumption | Impact if vetoed |
|---|---|---|
| A1 | **Review gate.** TL and HIL public pages carry `<meta name="robots" content="noindex">` until a native speaker signs them off. EN pages index immediately. The gate is lifted per-language, not per-page. | All 18 multilingual URLs index from day one. `hreflang` quality depends on translation accuracy. |
| A2 | **Analytics guardrail.** GA4 loads only on the seven marketing pages. No tracker reaches the coordinator, buyer, driver or farmer apps. Recorded as an approved exception in `docs/DECISIONS.md` (M47). | Wider data collection permitted; `AGENTS.md` must be updated to reflect the change. |
| A3 | **Hiligaynon `hreflang`.** `hil` is not an IANA-registered BCP 47 tag. We use `fil-PH` for Tagalog and `hil` for Hiligaynon. Google will silently ignore unrecognised tags. We verify after launch using Search Console's International Targeting report. | Use only EN + TL; HIL is excluded from `hreflang` (HIL pages remain indexable, just with no explicit signal). |
| A4 | **Contest freeze.** SEO PRs land on `develop` and `staging`. `robots.ts` blocks indexing in all environments except production. The production flip — a single dedicated PR removing the Disallow — happens after Oct 10. DNS records can be prepared earlier. | Indexing allowed before Oct 10; a failing production deploy during the contest window becomes a risk. |

---

## What these decisions do NOT cover

- The content of each page — see `03-content-brief.md`.
- The OG template visual design — see `04-og-spec.md` and owner action O-S8.
- Step-by-step instructions for owner actions — see `07-owner-actions.md`.
- The CI implementation details — see `06-ci-checks.md`.
