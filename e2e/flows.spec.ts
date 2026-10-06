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

  test('farmer: plan reads the harvest, then a repeat delivery books and cancels with Undo', async ({ page }) => {
    await page.goto('/farmer/plan');
    await expect(page.getByRole('heading', { name: 'My Harvest' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Harvest by Barangay and Week' })).toBeVisible();
    await page.getByRole('button', { name: 'Book Repeat Delivery' }).click();
    const dialog = page.getByRole('alertdialog');
    await expect(dialog.getByText('Book a repeat delivery?')).toBeVisible();
    await dialog.getByRole('button', { name: 'Book Repeat Delivery' }).click();
    await expect(page.getByText('Repeat Delivery Booked').first()).toBeVisible();
    await page.getByRole('button', { name: 'Cancel Booking' }).click();
    await expect(page.getByText('Booking cancelled').first()).toBeVisible();
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.getByText('Repeat Delivery Booked').first()).toBeVisible();
  });

  test('farmer: central milling reads the dryer slot, then confirms and moves it', async ({ page }) => {
    await page.goto('/farmer/milling');
    await expect(page.getByRole('heading', { name: 'Central Milling' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Drying' })).toBeVisible();
    await expect(page.getByText('62% recovery (assumed)')).toBeVisible();
    await expect(page.getByText('25 kg per sack (assumed)')).toBeVisible();
    const confirm = page.getByRole('button', { name: 'Confirm Slot' });
    const move = page.getByRole('button', { name: 'Request Another Time' });
    if (await confirm.isVisible()) await confirm.click();
    await expect(move).toBeVisible();
    await expect(page.getByText('confirmed by farmer').first()).toBeVisible();
    await move.click();
    await expect(page.getByText('asked to move slot').first()).toBeVisible();
    await expect(confirm).toBeVisible();
    await confirm.click();
    await expect(page.getByText('confirmed by farmer').first()).toBeVisible();
  });

  test('farmer: Price lives in More and the contract reads beside the variety', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/farmer/plan');
    await page.getByRole('button', { name: 'More' }).click();
    const sheet = page.getByRole('dialog');
    await sheet.getByRole('link', { name: 'Price' }).click();
    await expect(page.getByRole('heading', { name: 'Contract Price & Variety' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Contract' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rice Variety' })).toBeVisible();
    await expect(page.getByText('Grade 1').first()).toBeVisible();
    await expect(page.getByText('Price per Kilo')).toBeVisible();
    await expect(page.getByText(/₱\d+\.\d\d/).first()).toBeVisible();
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

    // Empty (filtered): a distinct state with a Clear Filters action.
    await page.goto('/coordinator/farm?q=zzz');
    await expect(page.getByText('No farms match')).toBeVisible();
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await expect(page).not.toHaveURL(/q=/);

    // Add Farm: the form kit; simulated data only; the new farm joins the cluster.
    await page.getByRole('button', { name: 'Add Farm' }).click();
    const addDialog = page.getByRole('dialog');
    await expect(addDialog).toBeVisible();
    await addDialog.getByLabel(/Farmer Name/).fill('Demo Farm One');
    await addDialog.getByLabel(/Area/).fill('1.5');
    await addDialog.getByRole('button', { name: 'Add Farm' }).click();
    await expect(page.getByText(/Farm F-101 added/)).toBeVisible({ timeout: 15000 });
    await page.goto('/coordinator/farm?q=F-101');
    await expect(page.locator('table').getByText(/F-101/).first()).toBeVisible();

    await page.goto('/coordinator/haul');
    const list = page.getByRole('group', { name: 'Pick Any Driver' }).first();
    const target = list.getByRole('listitem').filter({ hasText: 'DR-06' });
    await target.getByRole('button', { name: 'Assign' }).click();
    await expect(page.getByText('Coordinator override').first()).toBeVisible();
    await expect(page.getByText(/Override history/).first()).toBeVisible();
    // Undo restores the auto-assigned driver.
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.getByText('Coordinator override')).toHaveCount(0);

    // Dryer: capacity is visible before any assignment; the domain refuses a double booking.
    await page.goto('/coordinator/dry');
    await expect(page.getByText(/Free this week/)).toBeVisible();

    // Settlement: summary + confirm for Mark Paid; irreversible after (chip survives a reload).
    await page.goto('/coordinator/pay/L-03');
    await page.getByRole('button', { name: 'Mark Paid' }).click();
    const settle = page.getByRole('alertdialog');
    await expect(settle).toBeVisible();
    await expect(settle.getByText(/100,000\.00/)).toBeVisible();
    await settle.getByRole('button', { name: 'Mark Paid' }).click();
    await expect(page.getByText(/Paid on/).first()).toBeVisible();
    await page.reload();
    await expect(page.getByText(/Paid on/).first()).toBeVisible();
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

  test('admin: typed confirmations guard role, assumption and reset changes (S-11)', async ({ page }) => {
    // Role change: the kit AlertDialog locks confirm until the user code is typed; Undo reverts it.
    await page.goto('/admin/users?q=F-001');
    const userRow = page.locator('table').getByRole('row').filter({ hasText: 'F-001' });
    await userRow.getByRole('button', { name: 'Change Role' }).click();
    const roleDialog = page.getByRole('alertdialog');
    await expect(roleDialog).toBeVisible();
    const roleConfirm = roleDialog.getByRole('button', { name: 'Change Role' });
    await expect(roleConfirm).toBeDisabled();
    await roleDialog.getByLabel(/Type F-001 to confirm/).fill('F-001');
    await roleDialog.getByLabel('New role').click();
    await page.getByRole('option', { name: 'Buyer' }).click();
    await expect(roleConfirm).toBeEnabled();
    await roleConfirm.click();
    await expect(page.getByText('F-001 is now Buyer (simulated).').first()).toBeVisible();
    await expect(page.locator('table').getByText('Changed in this browser').first()).toBeVisible();
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.locator('table').getByText('Changed in this browser')).toHaveCount(0, { timeout: 15000 });

    // Assumption change: same typed confirmation, then the row shows the simulated value and the built-in one.
    await page.goto('/admin/settings');
    const settingRow = page.locator('table').getByRole('row').filter({ hasText: 'Kilograms per sack' });
    await settingRow.getByRole('button', { name: 'Change' }).click();
    const settingDialog = page.getByRole('alertdialog');
    await expect(settingDialog).toBeVisible();
    const settingConfirm = settingDialog.getByRole('button', { name: 'Save Change' });
    await expect(settingConfirm).toBeDisabled();
    await settingDialog.getByLabel(/Type CHANGE to confirm/).fill('CHANGE');
    await settingDialog.getByLabel('New value').fill('60');
    await expect(settingConfirm).toBeEnabled();
    await settingConfirm.click();
    await expect(page.getByText('Kilograms per sack is now 60 kg (simulated).').first()).toBeVisible();
    await expect(page.locator('table').getByText('60 kg').first()).toBeVisible();
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.locator('table').getByText('50 kg').first()).toBeVisible({ timeout: 15000 });

    // Reset: typed confirmation; Escape must not close it, then the reset is reported.
    await page.goto('/admin/activity');
    await page.getByRole('button', { name: 'Reset Demo Data' }).click();
    const resetDialog = page.getByRole('alertdialog');
    await expect(resetDialog).toBeVisible();
    await expect(resetDialog.getByText(/changes in this browser will be cleared/)).toBeVisible();
    const resetConfirm = resetDialog.getByRole('button', { name: 'Reset Demo Data' });
    await expect(resetConfirm).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(resetDialog).toBeVisible();
    await resetDialog.getByLabel(/Type RESET to confirm/).fill('RESET');
    await expect(resetConfirm).toBeEnabled();
    await resetConfirm.click();
    await expect(page.getByText('Demo data reset.')).toBeVisible();
  });

  test('ANNI: the head bubble opens the assistant panel and Escape closes it', async ({ page }) => {
    await page.goto('/coordinator/home');
    await page.getByRole('button', { name: 'Ask ANNI, the Farm Assistant' }).click();
    const panel = page.getByRole('dialog');
    await expect(panel).toBeVisible();
    await expect(panel.getByText(/Hi! I am ANNI\./)).toBeVisible();
    await expect(panel.getByRole('textbox', { name: 'Message ANNI' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
