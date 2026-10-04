import { defineConfig, devices } from '@playwright/test';

/* E2E runs against the local multi-zone demo build (RC_LOCAL=1): the main app on `mainPort` rewrites
   /buyer, /driver and /farmer to their apps on 3002–3004. CI builds with `pnpm build:local` first and
   installs its own Chromium in the job; agent sessions may override the port with E2E_MAIN_PORT. */
const mainPort = Number(process.env.E2E_MAIN_PORT ?? 3000);
const COMMON_ENV = { RC_LOCAL: '1', NEXT_TELEMETRY_DISABLED: '1' };

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
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
