// npm run shots — slide screenshots with Playwright. NOT run in CI or agent sessions.
// Needs a production build first (npm run build). Saves PNGs to exports/<theme>/<width>x<height>/<name>.png, light and dark.
// Phone shots use a real 390x844 viewport (the responsive mobile layout, no PhoneFrame);
// desktop shots use 1920x1080. The `framed` shots are the phone-frame stills the 78 s video uses (desktop only). Options:
//   --only=<substring>        only shots whose name contains it
//   --executable=<path>       a Chromium binary, if Playwright's own is not installed
//   --port=<n>                port for the local server (default 3300)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const port = Number(arg('port') ?? 3300);
const only = arg('only');
const executablePath = arg('executable');
const base = `http://localhost:${port}`;

const VIEWPORTS = [{ width: 1920, height: 1080 }, { width: 390, height: 844 }];
const THEMES = ['light', 'dark'];
const SHOTS = [
  // [name, path, viewports] — viewports: 'both' | 'desktop'
  ['farm-list', '/farm', 'both'],
  ['farm-list-page-2', '/farm?page=2', 'both'],
  ['farm-list-filtered', '/farm?status=verified&barangay=Licu-an', 'both'],
  ['farm-no-match', '/farm?q=zzz', 'both'],
  ['farm-profile-F-014', '/farm/F-014', 'both'],
  ['farm-empty', '/farm?state=empty', 'both'],
  ['farm-error', '/farm/F-014?state=error', 'both'],
  ['farm-success', '/farm/F-014?state=success', 'both'],
  ['plan', '/plan', 'both'],
  ['market', '/market', 'both'],
  ['dry', '/dry', 'both'],
  ['haul-coordinator', '/haul', 'both'],
  ['haul-driver', '/haul/driver', 'both'],
  ['haul-empty', '/haul?state=empty', 'both'],
  ['haul-error', '/haul?state=error', 'both'],
  ['haul-success', '/haul?state=success', 'both'],
  ['pay-list', '/pay', 'both'],
  ['pay-L-03', '/pay/L-03', 'both'],
  ['pay-empty', '/pay?state=empty', 'both'],
  ['pay-error', '/pay/L-03?state=error', 'both'],
  ['pay-success', '/pay/L-03?state=success', 'both'],
  ['sms', '/sms', 'both'],
  ['sms-all-languages', '/sms?all=1', 'both'],
  ['framed-farm-F-014', '/farm/F-014?frame=phone', 'desktop'],
  ['framed-haul', '/haul?frame=phone', 'desktop'],
  ['framed-haul-driver', '/haul/driver?frame=phone', 'desktop'],
  ['framed-sms', '/sms?frame=phone', 'desktop'],
  ['demo-end-card', '/demo?rec=1&beat=8', 'desktop'],
].filter(([name]) => !only || name.includes(only));

async function waitForServer(url, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { const r = await fetch(url); if (r.ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not start at ${url} (did you run npm run build?)`);
}

const server = spawn(process.execPath, [join(root, 'scripts/next.mjs'), 'start', '-p', String(port)], { cwd: root, stdio: 'ignore' });
let browser;
try {
  await waitForServer(base + '/farm');
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
  server.kill();
}
