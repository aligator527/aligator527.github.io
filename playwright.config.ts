import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;

/** Browser tests run against the production build so base paths and static output are exercised. */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // The 48–64rem band has its own grid; without this project nothing renders it.
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1112 } },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    /*
     * `--ignore-lock` keeps the test server independent of a preview server started for local work.
     * CI has already built `dist/` in an earlier step, so there it only serves the output.
     *
     * `ANALYTICS=on` builds the shape that actually deploys: the consent gate and the analytics tag
     * exist only in that build, and e2e/consent.spec.ts is what holds the promise that nothing
     * reaches Google before a visitor agrees. CI sets it on its own rebuild step, after the link and
     * locale checks have read a default build. Granting consent in a test would send a real hit, so
     * that suite aborts Google's loader.
     */
    command: process.env.CI
      ? `pnpm exec astro preview --port ${PORT} --ignore-lock`
      : `ANALYTICS=on pnpm run build && pnpm exec astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
