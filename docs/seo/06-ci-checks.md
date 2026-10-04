# CI checks

**Decision:** M49. **Ticket:** SEO-13.

Eight checks. Zero new npm dependencies. Pure Node.js, no puppeteer, no cheerio, no playwright. The checks run against the Next.js build output and source files — not against a live URL.

---

## The eight checks

| # | Name | What it checks | Failure condition |
|---|---|---|---|
| 1 | `robots-present` | `apps/main/.next/` or `public/robots.txt` | File missing from build output or public dir |
| 2 | `sitemap-valid` | `apps/main/.next/server/app/sitemap.xml` | File missing or XML parse error (`DOMParser` / `node:xml` equivalent) |
| 3 | `canonical-present` | HTML build output for every marketing page | Any marketing page missing `<link rel="canonical">` in `<head>` |
| 4 | `hreflang-count` | HTML build output for every multilingual marketing page | Page has fewer than 4 `<link rel="alternate" hreflang>` entries (EN + fil-PH + hil + x-default) |
| 5 | `og-image-present` | HTML build output for every marketing page | `<meta property="og:image">` missing from any marketing page |
| 6 | `llms-txt-present` | `apps/main/public/llms.txt` | File missing |
| 7 | `no-color-literals-in-script` | `scripts/seo-check.mjs` itself | Hex (`#[0-9a-fA-F]{3,8}`), `rgb(`, `rgba(` or `hsl(` literal found in the script file |
| 8 | `analytics-boundary` | Source files in `apps/farmer/`, `apps/buyer/`, `apps/driver/` | String `gtag` or `GA_ID` found in any source file in those three apps |

---

## Script location and structure

```
scripts/seo-check.mjs
```

Plain ES module. Uses only Node.js built-ins: `fs/promises`, `path`, `url`, `node:util`. No third-party packages.

Structure:
```js
// scripts/seo-check.mjs
import { readFile, readdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = /* repo root */;
const CHECKS = [ /* array of check functions */ ];

let failed = 0;
for (const check of CHECKS) {
  try {
    await check();
    console.log(`  PASS  ${check.name}`);
  } catch (err) {
    console.error(`  FAIL  ${check.name}: ${err.message}`);
    failed++;
  }
}
if (failed > 0) process.exit(1);
```

Each check is an `async function` named after the check (e.g. `async function robots_present()`). The naming matches column 1 of the table above.

---

## Turborepo task

Add to root `turbo.json`:

```json
{
  "tasks": {
    "seo": {
      "dependsOn": ["build"],
      "inputs": [
        "apps/main/.next/**",
        "apps/main/public/**",
        "apps/farmer/src/**",
        "apps/buyer/src/**",
        "apps/driver/src/**",
        "scripts/seo-check.mjs"
      ],
      "outputs": [],
      "cache": false
    }
  }
}
```

`cache: false` because the check reads the build output which changes with every build.

---

## CI integration

In `.github/workflows/ci.yml`, add the `seo` step after `lint` and before `build`:

```yaml
- name: SEO checks
  run: pnpm turbo seo
```

> Wait — `seo` depends on `build` in Turborepo, so Turborepo will run `build` first automatically. The `seo` step in CI just needs to call `pnpm turbo seo`.

Make `seo` a required status check in the GitHub branch ruleset (alongside `lint`, `check` and `e2e`).

---

## Running locally

```bash
pnpm turbo seo
```

This runs `build` first (if not cached), then the eight checks. To run the checks alone after an existing build:

```bash
node scripts/seo-check.mjs
```

---

## What the checks do NOT cover

- Live URL reachability (no network calls — use the workbench for that).
- Search Console indexing status (manual: Search Console UI).
- Rendering correctness (visual — use the workbench OG panel).
- TL/HIL translation quality (manual: native reviewer sign-off, O-S7).
- PageSpeed / Core Web Vitals (separate concern; covered by Q-05 bundle budget check).
