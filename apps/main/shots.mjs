// pnpm --filter @rc/main shots — slide screenshots with Playwright. NOT run in CI or agent sessions.
// Needs every app running first: `pnpm demo:local` in another terminal (main app on :3000). Saves PNGs to exports/<theme>/<width>x<height>/<name>.png, light and dark.
// Phone shots use a real 390x844 viewport (the responsive mobile layout, no PhoneFrame);
// desktop shots use 1920x1080. The `framed` shots are the phone-frame stills the 78 s video uses (desktop only). Options:
//   --only=<substring>        only shots whose name contains it
//   --executable=<path>       a Chromium binary, if Playwright's own is not installed
//   --base=<url>              where the main app runs (default http://localhost:3000)
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = dirname(fileURLToPath(import.meta.url));
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const only = arg('only');
const executablePath = arg('executable');
const base = arg('base') ?? 'http://localhost:3000';

const VIEWPORTS = [{ width: 1920, height: 1080 }, { width: 390, height: 844 }];
const THEMES = ['light', 'dark'];
const SHOTS = [
  // [name, path, viewports] — viewports: 'both' | 'desktop'
  ['farm-list', '/coordinator/farm', 'both'],
  ['farm-list-page-2', '/coordinator/farm?page=2', 'both'],
  ['farm-list-filtered', '/coordinator/farm?status=verified&barangay=Licu-an', 'both'],
  ['farm-no-match', '/coordinator/farm?q=zzz', 'both'],
  ['farm-profile-F-014', '/coordinator/farm/F-014', 'both'],
  ['farm-empty', '/coordinator/farm?state=empty', 'both'],
  ['farm-error', '/coordinator/farm/F-014?state=error', 'both'],
  ['farm-success', '/coordinator/farm/F-014?state=success', 'both'],
  ['plan', '/coordinator/plan', 'both'],
  ['market', '/coordinator/market', 'both'],
  ['dry', '/coordinator/dry', 'both'],
  ['haul-coordinator', '/coordinator/haul', 'both'],
  ['haul-driver', '/driver', 'both'],
  ['haul-empty', '/coordinator/haul?state=empty', 'both'],
  ['haul-error', '/coordinator/haul?state=error', 'both'],
  ['haul-success', '/coordinator/haul?state=success', 'both'],
  ['pay-list', '/coordinator/pay', 'both'],
  ['pay-L-03', '/coordinator/pay/L-03', 'both'],
  ['pay-empty', '/coordinator/pay?state=empty', 'both'],
  ['pay-error', '/coordinator/pay/L-03?state=error', 'both'],
  ['pay-success', '/coordinator/pay/L-03?state=success', 'both'],
  ['sms', '/farmer', 'both'],
  ['sms-all-languages', '/farmer?all=1', 'both'],
  ['framed-farm-F-014', '/coordinator/farm/F-014?frame=phone', 'desktop'],
  ['framed-haul', '/coordinator/haul?frame=phone', 'desktop'],
  ['framed-haul-driver', '/driver?frame=phone', 'desktop'],
  ['framed-sms', '/farmer?frame=phone', 'desktop'],
  ['demo-end-card', '/coordinator/demo?rec=1&beat=8', 'desktop'],
].filter(([name]) => !only || name.includes(only));

async function waitForServer(url, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { const r = await fetch(url); if (r.ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`no app at ${url} (start it with pnpm demo:local)`);
}

let browser;
try {
  await waitForServer(base + '/coordinator/farm');
  browser = await chromium.launch(executablePath ? { executablePath } : {});
  let n = 0;
  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: 'reduce' });
      await context.addInitScript((th) => {
        try { localStorage.setItem('rc-theme', th); localStorage.setItem('rc-lang', 'en'); } catch { /* ignore */ }
      }, theme);
      const page = await context.newPage();
      const dir = join(root, 'exports', theme, `${vp.width}x${vp.height}`);
      mkdirSync(dir, { recursive: true });
      for (const [name, path, where] of SHOTS) {
        if (where === 'desktop' && vp.width < 768) continue;
        await page.goto(base + path, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(400);
        await page.screenshot({ path: join(dir, `${name}.png`) });
        n++;
      }
      await context.close();
    }
  }
  console.log(`shots: ${n} PNGs in exports/`);
} finally {
  await browser?.close();
}
