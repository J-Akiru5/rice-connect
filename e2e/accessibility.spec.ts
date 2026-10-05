import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/* Q-04: no serious or critical WCAG 2.x violations on any route, checked in CI with axe. */

const ROUTES = [
  '/',
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
  '/driver/login',
  '/farmer',
  '/farmer/slip',
  '/farmer/login'
];

test.describe('accessibility', () => {
  for (const route of ROUTES) {
    test(`${route} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'load' });
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const blocking = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical'
      );
      expect(
        blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s)`),
        `axe violations on ${route}`
      ).toEqual([]);
    });
  }
});
