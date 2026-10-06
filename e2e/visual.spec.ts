import { expect, test } from '@playwright/test';

/* Q-06: visual snapshots of the key screens at 390 and 1440, light and dark. They run only when VISUAL=1
   (locally, or in CI when the PR carries the `visual-update` label, with --update-snapshots); baselines are
   per platform (snapshotPathTemplate) because font rendering differs between Windows and Linux. */

const visual = process.env.VISUAL === '1';
test.skip(!visual, 'Visual snapshots run with VISUAL=1 or the visual-update label');

const SCREENS: [string, string][] = [
  ['home', '/'],
  ['farm', '/coordinator/farm'],
  ['plan', '/coordinator/plan'],
  ['pay', '/coordinator/pay/L-03'],
  ['driver', '/driver'],
  ['driver-job', '/driver/jobs/H-07'],
  ['farmer', '/farmer'],
  ['farmer-plan', '/farmer/plan'],
  ['farmer-milling', '/farmer/milling'],
  ['farmer-price', '/farmer/price']
];
const SIZES = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 }
];

for (const size of SIZES) {
  for (const theme of ['light', 'dark']) {
    for (const [name, path] of SCREENS) {
      test(`${name} ${size.width} ${theme}`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: size, reducedMotion: 'reduce' });
        await context.addInitScript((th) => {
          try {
            localStorage.setItem('rc-theme', th);
            localStorage.setItem('rc-lang', 'en');
          } catch {
            /* blocked */
          }
        }, theme);
        const page = await context.newPage();
        await page.goto(path, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        await expect(page).toHaveScreenshot(`${name}-${size.width}-${theme}.png`, {
          animations: 'disabled',
          maxDiffPixelRatio: 0.02
        });
        await context.close();
      });
    }
  }
}
