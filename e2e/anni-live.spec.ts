import { expect, test, type Page } from '@playwright/test';

/* ANNI live smoke (A-06/M50): the two confirmation dialogs against a real project and Gemini key. The runner
   reads under the caller's Supabase JWT (RLS) and only proposes; the dock confirms before any mutation.
     NEXT_PUBLIC_RC_MODE=live pnpm build:local --force   (apps' env: Supabase keys + GEMINI_API_KEY)
   E2E_ANNI=1 E2E_MAIN_PORT=3100 pnpm e2e e2e/anni-live.spec.ts */

const live = process.env.E2E_ANNI === '1';
test.skip(!live, 'ANNI live smoke runs with E2E_ANNI=1 after a live build');

const PASSWORD = process.env.E2E_PASSWORD ?? 'password123';
const COORDINATOR = process.env.E2E_COORDINATOR ?? 'dev-coordinator@example.com';
const BUYER = process.env.E2E_BUYER ?? 'dev-buyer@example.com';

async function signIn(page: Page, path: string, email: string) {
  await page.goto(path, { waitUntil: 'load' });
  await page.fill('[name="identifier"]', email);
  await page.fill('[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.endsWith('/login') && !url.pathname.endsWith('/signup'), {
    timeout: 30000
  });
  await page.waitForTimeout(2000);
}

async function ask(page: Page, prompt: string) {
  await page.getByRole('button', { name: 'Ask ANNI, the Farm Assistant' }).click();
  await page.getByLabel('Message ANNI').waitFor({ timeout: 15000 });
  await page.getByLabel('Message ANNI').fill(prompt);
  await page.getByRole('button', { name: 'Send' }).click();
  const dialog = page.getByRole('alertdialog');
  await dialog.waitFor({ timeout: 60000 });
  return dialog;
}

test.describe('ANNI live smoke', () => {
  test('coordinator: mark_paid proposal, typed confirmation, executes', async ({ page }) => {
    await signIn(page, '/login', COORDINATOR);
    await page.goto('/coordinator/pay', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const link = page.locator('a[href*="/coordinator/pay/L-"]').first();
    if ((await link.count()) === 0) test.skip(true, 'no payable lot in the live fixture');
    const lot = (await link.innerText()).trim();
    await link.click();
    await page.waitForTimeout(2000);
    if ((await page.getByRole('button', { name: 'Mark Paid' }).count()) === 0)
      test.skip(true, `settlement ${lot} is already paid or missing in the live fixture`);

    const dialog = await ask(page, `Mark lot ${lot} as paid.`);
    await expect(dialog.getByText(/Mark this settlement paid/i)).toBeVisible();
    await dialog.locator('input').fill(lot);
    await dialog.getByRole('button', { name: 'Mark Paid' }).click();
    await expect(page.getByText(new RegExp(`Settlement ${lot} marked paid`))).toBeVisible({ timeout: 20000 });
  });

  test('buyer: create_order proposal, summary, executes', async ({ page }) => {
    await signIn(page, '/buyer/login', BUYER);
    const dialog = await ask(page, 'Create an order as a restaurant: 10 sacks of milled rice for week W3.');
    await expect(dialog.getByText(/Place this order/i)).toBeVisible();
    await dialog.getByRole('button', { name: 'Place Order' }).click();
    await expect(page.getByText(/Order R-\d+ placed/)).toBeVisible({ timeout: 20000 });
  });
});
