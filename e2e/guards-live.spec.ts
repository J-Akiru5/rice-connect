import { expect, test, type Page } from '@playwright/test';

/* S-12 + B-04: the route guards only exist in a live-mode build (NEXT_PUBLIC_RC_MODE=live). CI builds one with
   dummy Supabase env vars (https://test.supabase.co) so the SupabaseAuthAdapter runs for real against a
   locally-seeded session (storage key sb-test-auth-token). Locally: remove each app's .next, then
   NEXT_PUBLIC_RC_MODE=live NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=test
   pnpm build:local --force, then E2E_LIVE=1 E2E_MAIN_PORT=3100 pnpm e2e e2e/guards-live.spec.ts. */

const STORAGE_KEY = 'sb-test-auth-token';

/** A Supabase-shaped session in localStorage: the SDK reads it without any network call (far-future expiry). */
const seedSupabaseSession = (role: string, name: string) => async (page: Page) => {
  const session = JSON.stringify({
    access_token: 'test-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    refresh_token: 'test-refresh-token',
    user: {
      id: '00000000-0000-0000-0000-0000000000aa',
      aud: 'authenticated',
      role: 'authenticated',
      email: `${role}@example.com`,
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { role, display_name: name },
      created_at: new Date().toISOString()
    }
  });
  await page.addInitScript(([key, value]) => window.localStorage.setItem(key, value), [STORAGE_KEY, session] as [
    string,
    string
  ]);
};

test.describe('live-mode route guards', () => {
  test('signed out: the coordinator page redirects to sign-in with a return link', async ({ page }) => {
    await page.goto('/coordinator/home');
    await expect(page).toHaveURL(/\/login\?next=%2Fcoordinator%2Fhome/);
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('signed in with the right role: the page opens', async ({ page }) => {
    await seedSupabaseSession('coordinator', 'Cluster 1')(page);
    await page.goto('/coordinator/home');
    await expect(page).toHaveURL(/\/coordinator\/home/);
    await expect(page.getByText('This Week').first()).toBeVisible();
  });

  test('wrong role: the forbidden state shows and Sign In points at the right sign-in page', async ({ page }) => {
    await seedSupabaseSession('buyer', 'Buyer A')(page);
    await page.goto('/coordinator/home');
    await expect(page.getByText('This page is for Coordinator')).toBeVisible();
    await expect(page).toHaveURL(/\/coordinator\/home/);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/login\?next=%2Fcoordinator%2Fhome/);
  });

  test('buyer app: signed out redirects; the buyer session opens; another role is forbidden', async ({ page }) => {
    await page.goto('/buyer');
    await expect(page).toHaveURL(/\/buyer\/login\?next=%2Fbuyer/);
    await seedSupabaseSession('buyer', 'Buyer A')(page);
    await page.goto('/buyer');
    await expect(page).toHaveURL(/\/buyer$/);
    await expect(page.getByText('Cluster Supply').first()).toBeVisible();
    await seedSupabaseSession('coordinator', 'Cluster 1')(page);
    await page.goto('/buyer/orders');
    await expect(page.getByText('This page is for Buyer')).toBeVisible();
  });

  test('admin: sign-in stays open, other admin routes redirect, the admin session opens them', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin/);
    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await seedSupabaseSession('admin', 'Super Admin')(page);
    await page.goto('/admin/users');
    await expect(page.getByText('Users and Roles').first()).toBeVisible();
  });
});
