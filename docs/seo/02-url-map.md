# URL map and `hreflang`

21 indexable URLs total: 18 multilingual public pages (6 pages × 3 languages) plus 1 EN-only Privacy page.

---

## Full URL table

| # | Path | Language | `hreflang` value | `noindex` until |
|---|---|---|---|---|
| 1 | `/` | EN | `en` + `x-default` | — (indexes immediately) |
| 2 | `/tl/` | TL | `fil-PH` | Native sign-off (A1) |
| 3 | `/hil/` | HIL | `hil` | Native sign-off (A1) |
| 4 | `/how-it-works` | EN | `en` | — |
| 5 | `/tl/how-it-works` | TL | `fil-PH` | Native sign-off (A1) |
| 6 | `/hil/how-it-works` | HIL | `hil` | Native sign-off (A1) |
| 7 | `/team` | EN | `en` | — |
| 8 | `/tl/team` | TL | `fil-PH` | Native sign-off (A1) |
| 9 | `/hil/team` | HIL | `hil` | Native sign-off (A1) |
| 10 | `/for-cooperatives` | EN | `en` | — |
| 11 | `/tl/for-cooperatives` | TL | `fil-PH` | Native sign-off (A1) |
| 12 | `/hil/for-cooperatives` | HIL | `hil` | Native sign-off (A1) |
| 13 | `/for-buyers` | EN | `en` | — |
| 14 | `/tl/for-buyers` | TL | `fil-PH` | Native sign-off (A1) |
| 15 | `/hil/for-buyers` | HIL | `hil` | Native sign-off (A1) |
| 16 | `/evidence` | EN | `en` | — |
| 17 | `/tl/evidence` | TL | `fil-PH` | Native sign-off (A1) |
| 18 | `/hil/evidence` | HIL | `hil` | Native sign-off (A1) |
| 19 | `/privacy` | EN only | `en` | — |

> **Privacy is EN only.** The legal text is authored in English for compliance clarity (RA 10173). No `/tl/privacy` or `/hil/privacy` variant. Privacy has no `hreflang` alternates — just a self-referencing canonical.

> **`hil` tag (Assumption A3).** `hil` is not an IANA-registered BCP 47 tag. Google will silently ignore it. We use it anyway and verify post-launch via Search Console's International Targeting report. If it causes indexing problems, the fallback is to remove `hreflang` from HIL pages only (they remain crawlable).

---

## `hreflang` block — example for `/how-it-works`

Add to every `<head>` on a multilingual page:

```html
<!-- Self-referencing canonical -->
<link rel="canonical" href="https://riceconnect.syntaxure.dev/how-it-works" />

<!-- hreflang alternates -->
<link rel="alternate" hreflang="en"      href="https://riceconnect.syntaxure.dev/how-it-works" />
<link rel="alternate" hreflang="fil-PH"  href="https://riceconnect.syntaxure.dev/tl/how-it-works" />
<link rel="alternate" hreflang="hil"     href="https://riceconnect.syntaxure.dev/hil/how-it-works" />
<link rel="alternate" hreflang="x-default" href="https://riceconnect.syntaxure.dev/how-it-works" />
```

`x-default` always points to the EN URL. The `alternatesFor(slug, lang)` helper in `packages/config/seo.ts` (SEO-04) generates these tags programmatically.

---

## `robots` meta — per-environment behaviour

| Environment | `robots` meta on EN pages | `robots` meta on TL/HIL pages |
|---|---|---|
| Local (`localhost`) | `noindex, nofollow` | `noindex, nofollow` |
| Vercel preview (any branch) | `noindex, nofollow` | `noindex, nofollow` |
| Staging (`VERCEL_ENV=preview` on `staging` branch) | `noindex, nofollow` | `noindex, nofollow` |
| Production (`VERCEL_ENV=production`) before sign-off | `index, follow` | `noindex, nofollow` |
| Production after TL/HIL native sign-off | `index, follow` | `index, follow` |

> The environment check uses `VERCEL_ENV`. Locally and in preview, `VERCEL_ENV` is either missing or `preview`. The `robots.ts` metadata route (SEO-06) enforces the production Disallow at the `robots.txt` level as a second layer.

---

## Sitemap

The `sitemap.ts` route (SEO-05) emits these 21 URLs. It never emits:
- `/coordinator/*`, `/admin/*`, `/buyer/*`, `/driver/*`, `/farmer/*`
- `/api/*`
- Any TL/HIL URL that is currently `noindex` (those are excluded until sign-off is recorded)

`lastmod` is set to the deployment timestamp (`process.env.VERCEL_GIT_COMMIT_SHA` lookup or `new Date().toISOString()`).
