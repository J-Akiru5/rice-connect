import { defineConfig, devices } from '@playwright/test';

/* E2E runs against the local multi-zone demo build (RC_LOCAL=1): the main app on `mainPort` rewrites
   /buyer, /driver and /farmer to their apps on 3002–3004. CI builds with `pnpm build:local` first and
   installs its own Chromium in the job; agent sessions may override the port with E2E_MAIN_PORT. */
const mainPort = Number(process.env.E2E_MAIN_PORT ?? 3000);
const COMMON_ENV = { RC_LOCAL: '1', NEXT_TELEMETRY_DISABLED: '1' };

/* Live-mode specs are excluded unless their gate env is on (the default suite is the demo build). */
const liveSpecs: string[] = [];
if (!process.env.E2E_LIVE) liveSpecs.push('**/guards-live.spec.ts');
if (!process.env.E2E_GATE3) liveSpecs.push('**/gate3-live.spec.ts');
if (!process.env.E2E_ANNI) liveSpecs.push('**/anni-live.spec.ts');

export default defineConfig({
  testDir: './e2e',
  // S-12 guards exist only in a live-mode build; set E2E_LIVE=1 with a NEXT_PUBLIC_RC_MODE=live build to run them.
  testIgnore: liveSpecs,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  // Local runs serialise so shared dev servers stay stable; CI keeps its parallel workers and one retry.
  workers: process.env.CI ? undefined : 1,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${mainPort}`,
    trace: 'retain-on-failure'
    // Visual baselines are stored per project and platform (default snapshot naming), so Windows and Linux
    // keep their own (Q-06); CI regenerates its own only with the visual-update label.
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm --filter @rc/buyer start',
      url: 'http://127.0.0.1:3002/buyer',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: COMMON_ENV
    },
    {
      command: 'pnpm --filter @rc/driver start',
      url: 'http://127.0.0.1:3003/driver',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: COMMON_ENV
    },
    {
      command: 'pnpm --filter @rc/farmer start',
      url: 'http://127.0.0.1:3004/farmer',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: COMMON_ENV
    },
    {
      command: `node ../../packages/config/next.mjs start -p ${mainPort}`,
      cwd: 'apps/main',
      url: `http://127.0.0.1:${mainPort}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: COMMON_ENV
    }
  ]
});
