import { expect, test, type Page } from '@playwright/test';

/* Q-01 smoke: every route loads through the one origin, shows the DemoChip and the footer, produces no
   console errors and never scrolls sideways at 360px. Unknown URLs show the branded 404. */

const ROUTES = [
  '/',
  '/privacy',
  '/launch',
  '/login',
  '/signup',
  '/coordinator/home',
  '/coordinator/farm',
  '/coordinator/farm/F-014',
  '/coordinator/plan',
  '/coordinator/market',
  '/coordinator/dry',
  '/coordinator/haul',
  '/coordinator/pay',
  '/coordinator/pay/L-03',
  '/coordinator/demo',
  '/admin',
  '/admin/users',
  '/admin/activity',
  '/admin/settings',
  '/admin/login',
  '/buyer',
  '/buyer/orders',
  '/buyer/login',
  '/driver',
  '/driver/jobs/H-07',
  '/driver/login',
  '/farmer',
  '/farmer/plan',
  '/farmer/milling',
  '/farmer/price',
  '/farmer/slip',
  '/farmer/login'
];

async function collectErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));
  return errors;
}

test.describe('smoke', () => {
  for (const route of ROUTES) {
    test(`${route} loads clean`, async ({ page }) => {
      const errors = await collectErrors(page);
      const response = await page.goto(route, { waitUntil: 'load' });
      expect(response?.status(), `status of ${route}`).toBeLessThan(400);
      await expect(page.getByText('Team Syntaxure Labs').first()).toBeVisible();
      await expect(page.getByText(/Simulated/i).first()).toBeVisible();
      await page.setViewportSize({ width: 360, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
      expect(errors, `console errors on ${route}`).toEqual([]);
    });
  }

  test('unknown route shows the branded 404', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('This record no longer exists')).toBeVisible();
    await expect(page.getByText('Team Syntaxure Labs').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Go to Home/ })).toBeVisible();
  });

  test('security headers are set on the main app and the zone apps (B-09)', async ({ page }) => {
    const main = await page.request.get('/');
    expect(main.headers()['content-security-policy']).toContain("default-src 'self'");
    expect(main.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(main.headers()['x-content-type-options']).toBe('nosniff');
    expect(main.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
    const buyer = await page.request.get('/buyer');
    expect(buyer.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  });
});
