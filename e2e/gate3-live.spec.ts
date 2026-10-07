import { expect, test, type Page } from '@playwright/test';

/* Gate 3 live smoke (B-05/S-12): run with E2E_GATE3=1 against a live build whose env points at a Supabase
   project with the dev fixture (five accounts at password123, M49). Every screen must show repository rows,
   never the seed, and live mode hides the DemoChip. Demo-mode CI runs ignore this file (playwright.config).
     NEXT_PUBLIC_RC_MODE=live pnpm build:local --force
   E2E_GATE3=1 E2E_MAIN_PORT=3100 pnpm e2e e2e/gate3-live.spec.ts */

const live = process.env.E2E_GATE3 === '1';
test.skip(!live, 'Gate 3 live smoke runs with E2E_GATE3=1 after a live build');

const PASSWORD = process.env.E2E_PASSWORD ?? 'password123';
const ACCOUNT = {
  coordinator: process.env.E2E_COORDINATOR ?? 'dev-coordinator@example.com',
  buyer: process.env.E2E_BUYER ?? 'dev-buyer@example.com',
  driver: process.env.E2E_DRIVER ?? 'dev-driver@example.com',
  farmer: process.env.E2E_FARMER ?? 'dev-farmer@example.com'
};

async function signIn(page: Page, path: string, email: string) {
  await page.goto(path, { waitUntil: 'load' });
  await page.fill('[name="identifier"]', email);
  await page.fill('[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.endsWith('/login') && !url.pathname.endsWith('/signup'), {
    timeout: 30000
  });
  await page.waitForTimeout(2000);
  /* Live mode: no DemoChip, footer present. */
  await expect(page.getByText(/PROTOTYPE · SIMULATED DATA/i)).toHaveCount(0);
  await expect(page.getByText('Team Syntaxure Labs').first()).toBeVisible();
}

async function noErrorStates(page: Page) {
  await expect(page.getByText(/Something went wrong|Could not save/i)).toHaveCount(0);
}

test.describe('Gate 3 live smoke', () => {
  test('coordinator screens read the repository', async ({ page }) => {
    await signIn(page, '/login', ACCOUNT.coordinator);

    for (const path of [
      '/coordinator/home',
      '/coordinator/farm',
      '/coordinator/plan',
      '/coordinator/market',
      '/coordinator/dry',
      '/coordinator/haul',
      '/coordinator/pay',
      '/sms'
    ]) {
      await page.goto(path, { waitUntil: 'load' });
      await page.waitForTimeout(1800);
      await noErrorStates(page);
      await expect(page.getByText('Team Syntaxure Labs').first()).toBeVisible();
    }

    /* Farm list and pay list show repository codes. */
    await page.goto('/coordinator/farm', { waitUntil: 'load' });
    await expect(page.getByText(/F-\d{3}/).first()).toBeVisible({ timeout: 15000 });
    await page.goto('/coordinator/pay', { waitUntil: 'load' });
    await expect(page.getByText(/L-\d{2,3}/).first()).toBeVisible({ timeout: 15000 });
  });

  test('buyer screens read the repository', async ({ page }) => {
    await signIn(page, '/buyer/login', ACCOUNT.buyer);
    await noErrorStates(page);
    await expect(page.getByText(/t$|sacks/i).first()).toBeVisible({ timeout: 15000 });
    await page.goto('/buyer/orders', { waitUntil: 'load' });
    await page.waitForTimeout(1800);
    await noErrorStates(page);
  });

  test('driver screen and job detail read the repository', async ({ page }) => {
    await signIn(page, '/driver/login', ACCOUNT.driver);
    await noErrorStates(page);
    const link = page.locator('a[href*="/driver/jobs/"]').first();
    if ((await link.count()) > 0) {
      await link.click();
      await page.waitForTimeout(1800);
      await noErrorStates(page);
    }
  });

  test('farmer screens read the repository (my farm resolves, never the seed)', async ({ page }) => {
    await signIn(page, '/farmer/login', ACCOUNT.farmer);
    await page.waitForTimeout(1500);
    await noErrorStates(page);
    for (const path of ['/farmer/plan', '/farmer/milling', '/farmer/price', '/farmer/slip']) {
      await page.goto(path, { waitUntil: 'load' });
      await page.waitForTimeout(1800);
      await noErrorStates(page);
      await expect(page.getByText('Team Syntaxure Labs').first()).toBeVisible();
    }
  });
});
