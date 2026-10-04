# Analytics

**Decision:** M47. **Ticket:** SEO-12.

GA4 is an approved exception to the no-analytics rule in `AGENTS.md`. It loads only on the seven marketing pages. No tracker ever reaches the coordinator, buyer, driver or farmer apps.

---

## Decision record

This file is the record of the analytics exception referenced in M47. The following was agreed on 5 Oct 2026:

> Google Analytics 4 loads on the seven public marketing pages of the `main` app only (`/`, `/how-it-works`, `/team`, `/for-cooperatives`, `/for-buyers`, `/evidence`, `/privacy`). It does not load in the `farmer`, `buyer`, `driver` or `coordinator/admin` sections of any app, in any environment. This is an approved exception to the `AGENTS.md` rule "no analytics". The exception is bounded: adding GA4 to any non-marketing route is a rule violation and must be challenged in code review.

---

## The three gating conditions

GA4 loads only when **all three** are true simultaneously:

1. **Route gate:** the current Next.js route is in the marketing layout (`apps/main/src/app/(marketing)/layout.tsx`). No other layout renders the `<Analytics />` component.
2. **Environment gate:** `NEXT_PUBLIC_GA_ID` is set and non-empty. This variable is set only in Vercel production. It is absent in local, CI and preview environments — so no data is sent during development or testing.
3. **Mode gate:** `NEXT_PUBLIC_RC_MODE` is `demo` or `live` (both modes are on marketing pages, which are always public).

---

## Implementation sketch (SEO-12)

```tsx
// packages/ui/src/Analytics.tsx
// Renders null if NEXT_PUBLIC_GA_ID is not set.
// Only imported in apps/main/src/app/(marketing)/layout.tsx.

'use client';

export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
```

The component lives in `packages/ui` (shared) but is imported by `apps/main` only. The CI check (check 8 in `06-ci-checks.md`) enforces that `gtag` and `GA_ID` never appear in `apps/farmer/`, `apps/buyer/` or `apps/driver/` source.

**No new npm dependency.** GA4 is loaded via a plain `<script>` tag. No `@next/third-parties` or `react-ga4` package.

---

## Environments

| Environment | `NEXT_PUBLIC_GA_ID` | Analytics loads? |
|---|---|---|
| Local (`npm run dev`) | Not set | No |
| Vercel preview (any PR) | Not set | No |
| Staging | Not set | No |
| Production | Set (owner action O-S5) | Yes, on marketing pages only |

---

## Event plan

Minimal to start. Add events in a separate PR with owner approval.

| Event | Trigger | Parameters |
|---|---|---|
| `page_view` | Automatic (GA4 default) | `page_location`, `page_title` |
| `language_switch` | User changes language via `LanguageSwitcher` | `language` (new language code) |

No PII in any event. No event captures farmer names, mobile numbers, lot IDs or haul records.

---

## IndexNow

IndexNow pings search engines immediately when a page changes, rather than waiting for the crawler.

**Setup (SEO-13 + owner action O-S4):**
1. Owner generates a UUID at [indexnow.org](https://www.indexnow.org/) and supplies it.
2. Agent creates `apps/main/public/<uuid>.txt` containing just the UUID.
3. `scripts/seo-check.mjs` includes check 6 (`llms.txt`) and check 1 (`robots.txt`); IndexNow is not a CI check — it is a post-deploy action.
4. After each production deploy (starting with SEO-14), ping: `POST https://api.indexnow.org/indexnow` with the 21 URLs.

IndexNow is supported by Bing, Yandex and others; Google also reads it. It is a courtesy ping, not a guarantee.

---

## Search Console

Search Console is the primary measurement tool. After O-S2:
- Add the `riceconnect.syntaxure.dev` domain property (not URL prefix — domain property covers all protocols and subdomains).
- Verify via DNS TXT record (owner action O-S2).
- Submit `https://riceconnect.syntaxure.dev/sitemap.xml` after SEO-05 merges.
- Check the International Targeting report for `hreflang` errors after SEO-04 merges.
- Monitor the Coverage report for indexing status of TL/HIL pages before and after the native sign-off flip.

---

## Bing Webmaster Tools

Add via `https://www.bing.com/webmasters`. Auto-verify from Google Search Console (fastest). Submit the sitemap URL. Enable IndexNow in the Bing dashboard to auto-sync with the key from O-S4.
