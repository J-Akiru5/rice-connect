// npm run shots — slide screenshots with Playwright. NOT run in CI or agent sessions.
// Needs a production build first (npm run build). Saves PNGs to exports/<theme>/<width>x<height>/<name>.png
// at 1920x1080 and 390x844, light and dark. Options:
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
  ['farm-list', '/farm'],
  ['farm-profile-F-014', '/farm/F-014'],
  ['farm-empty', '/farm?state=empty'],
  ['farm-error', '/farm/F-014?state=error'],
  ['farm-success', '/farm/F-014?state=success'],
  ['plan', '/plan'],
  ['market', '/market'],
  ['dry', '/dry'],
  ['haul-coordinator', '/haul'],
  ['haul-driver', '/haul/driver'],
  ['haul-empty', '/haul?state=empty'],
  ['haul-error', '/haul?state=error'],
  ['haul-success', '/haul?state=success'],
  ['pay-list', '/pay'],
  ['pay-L-03', '/pay/L-03'],
  ['pay-empty', '/pay?state=empty'],
  ['pay-error', '/pay/L-03?state=error'],
  ['pay-success', '/pay/L-03?state=success'],
  ['sms', '/sms'],
  ['sms-all-languages', '/sms?all=1'],
  ['demo-end-card', '/demo?rec=1&beat=8'],
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
      for (const [name, path] of SHOTS) {
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
