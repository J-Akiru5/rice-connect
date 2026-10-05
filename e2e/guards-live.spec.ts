import { expect, test, type Page } from '@playwright/test';

/* S-12: the route guards only exist in a live-mode build (NEXT_PUBLIC_RC_MODE=live). CI builds one after the
   demo suite; locally: remove each app's .next, then NEXT_PUBLIC_RC_MODE=live pnpm build:local --force, then
   E2E_LIVE=1 E2E_MAIN_PORT=3100 pnpm e2e e2e/guards-live.spec.ts. The clean/forced build matters: a turbo cache
   restore over an existing .next mixes chunks and serves stale modules. The default suite ignores this file. */

const seedSession = (session: Record<string, string>) => async (page: Page) => {
  await page.addInitScript(
    (value) => {
      window.localStorage.setItem('rc-store-v1', value);
    },
    JSON.stringify({ version: 1, riceOrders: [], commitments: [], hauls: {}, slots: {}, session })
  );
};

const signIn = async (page: Page) => {
  await page.fill('[name="identifier"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.locator('button[type="submit"]').click();
};

test.describe('live-mode route guards', () => {
  test('signed out: the coordinator page redirects to sign-in and returns there after sign-in', async ({ page }) => {
    await page.goto('/coordinator/home');
    await expect(page).toHaveURL(/\/login\?next=%2Fcoordinator%2Fhome/);
    await signIn(page);
    await expect(page).toHaveURL(/\/coordinator\/home/);
    await expect(page.getByText('This Week').first()).toBeVisible();
  });

  test('signed in with the right role: the page opens', async ({ page }) => {
    await seedSession({ coordinator: 'Cluster 1' })(page);
    await page.goto('/coordinator/home');
    await expect(page).toHaveURL(/\/coordinator\/home/);
    await expect(page.getByText('This Week').first()).toBeVisible();
  });

  test('wrong role: the forbidden state shows and Sign In switches role', async ({ page }) => {
    await seedSession({ buyer: 'Buyer A (simulated)' })(page);
    await page.goto('/coordinator/home');
    await expect(page.getByText('This page is for Coordinator')).toBeVisible();
    await expect(page).toHaveURL(/\/coordinator\/home/);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/login\?next=%2Fcoordinator%2Fhome/);
    await signIn(page);
    await expect(page).toHaveURL(/\/coordinator\/home/);
  });

  test('buyer app: signed out redirects to its own sign-in; signed in opens; another role is forbidden', async ({
    page
  }) => {
    await page.goto('/buyer');
    await expect(page).toHaveURL(/\/buyer\/login\?next=%2Fbuyer/);
    await seedSession({ buyer: 'Buyer A (simulated)' })(page);
    await page.goto('/buyer');
    await expect(page).toHaveURL(/\/buyer$/);
    await expect(page.getByText('Cluster Supply').first()).toBeVisible();
    await seedSession({ coordinator: 'Cluster 1' })(page);
    await page.goto('/buyer/orders');
    await expect(page.getByText('This page is for Buyer')).toBeVisible();
  });

  test('admin: sign-in stays open, other admin routes redirect', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin/);
    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await seedSession({ admin: 'Super Admin' })(page);
    await page.goto('/admin/users');
    await expect(page.getByText('Users and Roles').first()).toBeVisible();
  });
});
