# OG image spec

**Decision:** M46. **Ticket:** SEO-09 (dynamic route) + SEO-10 (static fallback, owner action O-S8).
**Designer brief:** Karl. **Implementing agent:** follows SEO-09.

---

## Dimensions and format

| Property | Value |
|---|---|
| Width | 1200 px |
| Height | 630 px |
| Aspect ratio | 40:21 (standard OG) |
| Format | PNG (static fallback); dynamic route returns `image/png` |
| Dynamic route | `/api/og?page=<slug>&lang=<lang>` |
| Static fallback | `/public/og-fallback.png` (used when the dynamic route throws) |

---

## Dynamic route — implementation notes (SEO-09)

- Built with Next.js `ImageResponse` from `next/og`. **No new dependency** — `ImageResponse` ships with Next.js.
- No `canvas`, `sharp`, `puppeteer` or any other image library.
- Query params: `page` (slug string, e.g. `how-it-works`) and `lang` (`en`, `tl`, `hil`).
- Reads title and subtitle from a static lookup table inside the route file (not from the database or i18n package — this route must work at the edge without Supabase).
- Validates `page` and `lang` against an allowlist; falls back to the fallback image on unknown values.
- Renders using design tokens only — no hex literals in the route file (the CI colour guard runs on `apps/` source).
- Font: Plus Jakarta Sans 700, loaded from `@fontsource/plus-jakarta-sans` via a `fetch()` to the local file at build time.

---

## Token palette for the template

Karl's Figma design must use only the following tokens. The implementing agent uses the same names to set CSS properties inside `ImageResponse`.

| Token | Intended use |
|---|---|
| `--brand-green` | Primary background or large field |
| `--brand-gold` | Accent bar, highlight |
| `--gray-900` | Heading text on light backgrounds |
| `--gray-50` | Body text on dark backgrounds |
| `--black` | Bezel / border if needed |

No hex literals anywhere in the route file. The CI colour guard (`scripts/seo-check.mjs` check 7) enforces this.

---

## Layout brief for Karl

```
+--------------------------------------------------+
|  [Syntaxure Labs wordmark]         [RiceConnect] |
|                                                   |
|                                                   |
|   [Page title — large, brand-gold or gray-50]    |
|   [Page subtitle — smaller]                       |
|                                                   |
|   [Location tag: Dingle, Iloilo · Philippines]   |
|                                                   |
|   [Bottom bar: Team Syntaxure Labs · ISUFST]     |
+--------------------------------------------------+
```

- Wordmark top-left; RiceConnect product name top-right.
- Page title is the largest element; subtitle is one line below.
- Location tag is a small pill or label at the bottom-left.
- Bottom bar matches the footer used on every app route.
- Background: `--brand-green` or a gradient from `--brand-green` to `--gray-900`.
- Gold accent: a horizontal bar under the title or a left border.

---

## Per-page copy table

Copywriter / owner fills in the `[placeholder]` values before SEO-09 starts.

| Page | Lang | `og:title` | `og:description` |
|---|---|---|---|
| `/` | EN | `[OG title — Home EN]` | `[OG description — Home EN, max 160 chars]` |
| `/` | TL | `[OG title — Home TL]` | `[OG description — Home TL]` |
| `/` | HIL | `[OG title — Home HIL]` | `[OG description — Home HIL]` |
| `/how-it-works` | EN | `[OG title — How it works EN]` | `[OG description — How it works EN]` |
| `/how-it-works` | TL | `[OG title — How it works TL]` | `[OG description — How it works TL]` |
| `/how-it-works` | HIL | `[OG title — How it works HIL]` | `[OG description — How it works HIL]` |
| `/team` | EN | `[OG title — Team EN]` | `[OG description — Team EN]` |
| `/team` | TL | `[OG title — Team TL]` | `[OG description — Team TL]` |
| `/team` | HIL | `[OG title — Team HIL]` | `[OG description — Team HIL]` |
| `/for-cooperatives` | EN | `[OG title — For cooperatives EN]` | `[OG description — For cooperatives EN]` |
| `/for-cooperatives` | TL | `[OG title — For cooperatives TL]` | `[OG description — For cooperatives TL]` |
| `/for-cooperatives` | HIL | `[OG title — For cooperatives HIL]` | `[OG description — For cooperatives HIL]` |
| `/for-buyers` | EN | `[OG title — For buyers EN]` | `[OG description — For buyers EN]` |
| `/for-buyers` | TL | `[OG title — For buyers TL]` | `[OG description — For buyers TL]` |
| `/for-buyers` | HIL | `[OG title — For buyers HIL]` | `[OG description — For buyers HIL]` |
| `/evidence` | EN | `[OG title — Evidence EN]` | `[OG description — Evidence EN]` |
| `/evidence` | TL | `[OG title — Evidence TL]` | `[OG description — Evidence TL]` |
| `/evidence` | HIL | `[OG title — Evidence HIL]` | `[OG description — Evidence HIL]` |
| `/privacy` | EN | `RiceConnect Privacy Policy` | `How RiceConnect handles your data under the Data Privacy Act of the Philippines (RA 10173).` |

---

## Fallback behaviour

The static fallback at `/public/og-fallback.png` is used when:
- The `page` or `lang` param is not in the allowlist.
- The dynamic route throws at runtime.
- The page's `generateMetadata()` cannot reach the `/api/og` route.

The fallback must also comply with the token palette (no hex literals in its design). Karl produces it alongside the template. It should show the RiceConnect name, Syntaxure Labs wordmark and location tag — no page-specific content.

---

## Owner action

**O-S8:** Karl exports the Figma frame as a spec (dimensions, layer names, colours mapped to token names) and shares the link with the agent before SEO-09 starts. The agent does not need the Figma file itself — only the spec.
