# Owner actions

Actions that only the owner (Jeff) can take. No agent can complete these. Tick each checkbox when done and record the date.

---

## O-S1 — DNS and Vercel domain

**When:** before Oct 10 (blocks O-S2, O-S3 and the production indexing flip).
**Unblocks:** everything.

### Steps

1. **Add the custom domain in Vercel:**
   - Go to the `main` app's Vercel project → Settings → Domains.
   - Add `riceconnect.syntaxure.dev`.
   - Vercel will show you the required DNS record (usually a CNAME).

2. **Create the DNS record:**
   - Log in to your DNS provider (wherever `syntaxure.dev` is registered).
   - Add a CNAME record: `riceconnect` → `cname.vercel-dns.com` (Vercel will confirm the exact target).
   - TTL: 300 seconds (5 minutes) for fast propagation.

3. **Verify in Vercel:**
   - Wait for DNS propagation (usually under 10 minutes with a low TTL).
   - Vercel's domain panel shows a green tick when verified.

4. **Confirm the 301 redirect from the `.app` domain:**
   - Open a browser in private mode.
   - Visit the Vercel `.app` URL (e.g. `rice-connect.vercel.app`).
   - Confirm it 301-redirects to `https://riceconnect.syntaxure.dev`.
   - If it does not redirect automatically, add a redirect rule in Vercel project settings.

- [ ] DNS CNAME record created
- [ ] Vercel domain verified (green tick)
- [ ] 301 redirect from `.app` confirmed in private browser

---

## O-S2 — Google Search Console

**When:** before Oct 10. **Depends on:** O-S1 (domain must resolve).
**Unblocks:** O-S3 (Bing can auto-verify from Search Console).

### Steps

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Click **Add property** → choose **Domain** (not URL prefix). Enter `syntaxure.dev` if you want to cover all subdomains, or `riceconnect.syntaxure.dev` for just this product. Recommendation: add `riceconnect.syntaxure.dev` as a URL prefix property first (simpler), then add `syntaxure.dev` as a domain property to cover both.
3. **Verify via DNS TXT record:**
   - Search Console shows a TXT record value.
   - Add it to your DNS provider under the `@` record for `riceconnect.syntaxure.dev` (or `syntaxure.dev` for the domain property).
   - Click Verify.
4. After SEO-05 merges: go to Sitemaps → submit `https://riceconnect.syntaxure.dev/sitemap.xml`.
5. After SEO-04 merges: check the **International Targeting** report for `hreflang` errors.

- [ ] Search Console property added and verified
- [ ] Sitemap submitted (after SEO-05 merges)
- [ ] International Targeting checked (after SEO-04 merges)

---

## O-S3 — Bing Webmaster Tools

**When:** before Oct 10. **Depends on:** O-S2.

### Steps

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters).
2. Click **Add a site** → enter `https://riceconnect.syntaxure.dev`.
3. **Auto-verify from Google Search Console** (fastest): choose "Import from Google Search Console" if available.
4. Submit sitemap: `https://riceconnect.syntaxure.dev/sitemap.xml`.
5. In the Bing Webmaster dashboard → IndexNow → enter the IndexNow key (from O-S4) once it is available.

- [ ] Bing Webmaster Tools property added and verified
- [ ] Sitemap submitted (after SEO-05 merges)
- [ ] IndexNow key entered (after O-S4)

---

## O-S4 — IndexNow key

**When:** before SEO-13 merges. Can be done at any time.

### Steps

1. Generate a UUID (any UUID generator works, e.g. `node -e "console.log(require('crypto').randomUUID())"`).
2. Supply the UUID to the agent implementing SEO-13. The agent creates `apps/main/public/<uuid>.txt` containing only the UUID string (no newline).
3. The agent also references this key in `scripts/seo-check.mjs` as the IndexNow key for post-deploy pings.
4. After SEO-14 (production flip), manually ping: `POST https://api.indexnow.org/indexnow` — the agent documents the exact curl command in SEO-13.

- [ ] UUID generated
- [ ] UUID supplied to the agent (SEO-13)
- [ ] Post-deploy ping sent (after SEO-14)

---

## O-S5 — Google Analytics 4 property

**When:** before SEO-12 merges.

### Steps

1. Go to [analytics.google.com](https://analytics.google.com) → Admin → Create property.
2. Property name: `RiceConnect`. Timezone: Philippines (Asia/Manila). Currency: PHP.
3. Create a Web data stream → URL: `https://riceconnect.syntaxure.dev`.
4. Copy the Measurement ID (format: `G-XXXXXXXXXX`).
5. In Vercel → project settings → Environment variables → add `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX` for **Production** environment only. Do not set it for Preview or Development.

- [ ] GA4 property created
- [ ] `NEXT_PUBLIC_GA_ID` set in Vercel production environment only

---

## O-S6 — Syntaxure Labs profile URLs

**When:** before SEO-07 merges (structured data ticket).

The `Organization` schema in SEO-07 references Syntaxure Labs' `sameAs` URLs. Supply:

- [ ] LinkedIn: `https://linkedin.com/company/syntaxure-labs` (or the actual URL)
- [ ] GitHub org: `https://github.com/syntaxure-labs` (or the actual URL)
- [ ] Website: `https://syntaxure.dev`

Record the confirmed URLs in `docs/DECISIONS.md` when you supply them.

---

## O-S7 — Native TL and HIL reviewers

**When:** before the noindex flip for each language. No hard deadline, but recruit before Dec 2026.
**Unblocks:** the Assumption A1 gate — TL and HIL pages flip from `noindex` to `index` only after sign-off.

### What reviewers do

1. Read every string in `packages/i18n/src/` for their language (TL or HIL).
2. Flag any string marked `draft: needs native review` that is incorrect, unnatural or culturally inappropriate.
3. Sign off in `docs/DECISIONS.md` with their name, language and date.

### Who to recruit

- A native Hiligaynon speaker from the Dingle, Iloilo area is ideal for HIL — they will recognise the agricultural vocabulary.
- A native Tagalog speaker (any region) for TL.
- Enactus ISUFST members or their network are the first place to look.

- [ ] TL reviewer recruited (name: _______________)
- [ ] HIL reviewer recruited (name: _______________)
- [ ] TL review complete — recorded in `docs/DECISIONS.md`
- [ ] HIL review complete — recorded in `docs/DECISIONS.md`

---

## O-S8 — OG template design (Karl)

**When:** before SEO-09 starts.

Karl designs the OG image template in Figma following the spec in `04-og-spec.md`:
- 1200×630 px.
- Token palette only (no hex literals).
- Wordmark top-left, product name top-right, page title large, subtitle below, location tag, bottom bar.

### Deliverable

Karl provides a Figma frame link or an exported spec showing:
- Layer names and their corresponding token names.
- Font sizes and weights.
- Spacing values.

The implementing agent (SEO-09) uses this spec to write the `ImageResponse` JSX — it does not need the Figma file itself.

- [ ] Figma template frame complete
- [ ] Spec exported and shared with the agent
- [ ] Static fallback (`og-fallback.png`) exported as 1200×630 PNG
