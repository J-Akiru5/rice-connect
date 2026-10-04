import { expect, test } from '@playwright/test';

/* Q-02: one critical flow per role, through the one origin (state is shared by the demo store). */

test.describe('critical flows', () => {
  test('farmer: reply 1 OK confirms the slot, then the slip reads', async ({ page }) => {
    await page.goto('/farmer');
    await page.getByRole('button', { name: '1 OK' }).click();
    await expect(page.getByText('Slot D-58 confirmed').first()).toBeVisible();
    await page.goto('/farmer/slip');
    await expect(page.getByText('Net to Farmer').first()).toBeVisible();
    await expect(page.getByText(/100,000\.00/).first()).toBeVisible();
    await expect(page.getByText(/80,000\.00/).first()).toBeVisible();
    await expect(page.getByText(/20,000\.00/).first()).toBeVisible();
  });

  test('driver: accept, pick up, deliver', async ({ page }) => {
    await page.goto('/driver');
    await page.getByRole('button', { name: 'Accept Job' }).click();
    await page.getByRole('button', { name: 'Mark Picked Up' }).click();
    await page.getByRole('button', { name: 'Mark Delivered' }).click();
    await expect(page.getByText('Delivered. Thank you!')).toBeVisible();
  });

  test('driver: an offline step is queued as Not sent yet and flushed when back online', async ({ page, context }) => {
    await page.goto('/driver');
    await page.getByRole('button', { name: 'Accept Job' }).click();
    await expect(page.getByRole('button', { name: 'Mark Picked Up' })).toBeVisible();
    await context.setOffline(true);
    await page.waitForFunction(() => navigator.onLine === false);
    await page.getByRole('button', { name: 'Mark Picked Up' }).click();
    await expect(page.getByText('Not sent yet', { exact: true })).toBeVisible();
    await context.setOffline(false);
    await page.waitForFunction(() => navigator.onLine === true);
    await expect(page.getByText('Not sent yet', { exact: true })).toHaveCount(0, { timeout: 15000 });
    await page.getByRole('button', { name: 'Mark Delivered' }).click();
    await expect(page.getByText('Delivered. Thank you!')).toBeVisible();
  });

  test('buyer: review, place, undo, place again and the coordinator sees it', async ({ page }) => {
    await page.goto('/buyer/orders');
    await page.getByRole('button', { name: 'Review Order' }).click();
    await expect(page.getByText('Order Summary')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeEnabled();
    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page.getByText(/R-001/).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/4,800\.00/).first()).toBeVisible();
    // Undo within the toast window removes the order.
    const undo = page.getByRole('button', { name: 'Undo' });
    await expect(undo).toBeVisible();
    await undo.click();
    await expect(page.getByText(/R-001/)).toHaveCount(0, { timeout: 15000 });
    // Place again so the coordinator home can show it.
    await page.getByRole('button', { name: 'Review Order' }).click();
    await expect(page.getByText('Order Summary')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeEnabled();
    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page.getByText(/R-001/).first()).toBeVisible({ timeout: 15000 });
    // Trace from the order row to the farm; farmer identity stays a code only.
    await page.getByRole('link', { name: 'Trace to the Farm' }).first().click();
    await expect(page.getByText(/F-014/).first()).toBeVisible();
    await expect(page.getByText(/Farmer F-/)).toHaveCount(0);
    await page.waitForLoadState('networkidle');
    await page.goto('/coordinator/home');
    await expect(page.getByText(/R-001/).first()).toBeVisible();
  });

  test('coordinator: filters keep the URL and a haul can be reassigned', async ({ page }) => {
    await page.goto('/coordinator/farm');
    await page.selectOption('select[name="status"]', 'verified');
    await expect(page).toHaveURL(/status=verified/);
    await expect(page.locator('table').getByText('Verified').first()).toBeVisible();
    await expect(page.locator('table').getByText('Registered')).toHaveCount(0);

    await page.goto('/coordinator/haul');
    const list = page.getByRole('group', { name: 'Pick Any Driver' }).first();
    const target = list.getByRole('listitem').filter({ hasText: 'DR-06' });
    await target.getByRole('button', { name: 'Assign' }).click();
    await expect(page.getByText('Coordinator override').first()).toBeVisible();
    await expect(page.getByText(/Override history/).first()).toBeVisible();
    // Undo restores the auto-assigned driver.
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.getByText('Coordinator override')).toHaveCount(0);
  });

  test('auth: empty submit shows errors, sign in works, sign out returns', async ({ page }) => {
    await page.goto('/login');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[name="identifier"]')).toHaveAttribute('aria-invalid', 'true');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('name'))).toBe('identifier');
    await page.fill('[name="identifier"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/coordinator\/home/);
    await page.waitForLoadState('networkidle');
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
