import { expect, test } from '@playwright/test';

/**
 * The consent gate, against a build that carries it.
 *
 * This is the one suite whose subject is a promise rather than a rendering: nothing third-party is
 * requested before a visitor agrees. It only means anything against an `ANALYTICS=on` build, which
 * is what the Playwright web server builds — see playwright.config.ts.
 *
 * Google's loader is aborted in every test. Letting it through would send a hit from every CI run,
 * on three viewports, into the live property — and a suite that pollutes the data it is protecting
 * has missed the point. Aborting still proves what matters: that the browser asked.
 */
const GOOGLE = 'https://www.googletagmanager.com/**';
const KEY = 'analytics-consent';

/** Requests the page made to Google, whether or not they were allowed to complete. */
function trackLoader(page: import('@playwright/test').Page): string[] {
  const asked: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('googletagmanager.com')) asked.push(request.url());
  });
  return asked;
}

test.beforeEach(async ({ page }) => {
  await page.route(GOOGLE, (route) => route.abort());
});

test.describe('the consent gate', () => {
  test('asks first, and loads nothing while the answer is missing', async ({ page }) => {
    const asked = trackLoader(page);
    await page.goto('/');

    await expect(page.locator('#consent-notice')).toBeVisible();
    expect(asked).toEqual([]);
    const cookies = await page.context().cookies();
    expect(cookies.filter((cookie) => cookie.name.startsWith('_ga'))).toEqual([]);
  });

  test('the choice comes before the page, for a keyboard', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-consent="allow"]')).toBeFocused();
  });

  test('allowing loads the tag, moves focus to the content, and is remembered', async ({
    page,
  }) => {
    const asked = trackLoader(page);
    await page.goto('/');
    await page.locator('[data-consent="allow"]').click();

    await expect(page.locator('#consent-notice')).toBeHidden();
    expect(asked.length).toBeGreaterThan(0);
    expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('granted');
    // The control that had focus is gone, so focus goes where the skip link sends a reader.
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main');

    // A second page view asks nothing and loads the tag on its own.
    asked.length = 0;
    await page.goto('/work/');
    await expect(page.locator('#consent-notice')).toBeHidden();
    expect(asked.length).toBeGreaterThan(0);
  });

  test('declining loads nothing, then or later', async ({ page }) => {
    const asked = trackLoader(page);
    await page.goto('/');
    await page.locator('[data-consent="decline"]').click();

    await expect(page.locator('#consent-notice')).toBeHidden();
    expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('denied');

    await page.goto('/about/');
    await expect(page.locator('#consent-notice')).toBeHidden();
    expect(asked).toEqual([]);
  });

  test('the privacy page states the stored choice and withdraws it', async ({ page }) => {
    /*
     * Seeded through the page rather than with `addInitScript`, which re-runs on every navigation:
     * it would rewrite the key on the reload that withdrawal triggers, and the test would be
     * fighting the behaviour it is there to check.
     */
    await page.goto('/privacy/');
    await page.evaluate((key) => localStorage.setItem(key, 'granted'), KEY);
    // A cookie GA would have set, so that withdrawal has something real to clear.
    await page
      .context()
      .addCookies([{ name: '_ga', value: 'GA1.1.test', domain: 'localhost', path: '/' }]);
    await page.reload();

    await expect(page.locator('#consent-state')).toHaveText('Measurement allowed');
    await expect(page.locator('#consent-revoke')).toBeVisible();
    await expect(page.locator('#consent-grant')).toBeHidden();

    const asked = trackLoader(page);
    await page.locator('#consent-revoke').click();
    await expect(page.locator('#consent-state')).toHaveText('Measurement declined');
    expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('denied');
    expect(asked).toEqual([]);
    const cookies = await page.context().cookies();
    expect(cookies.filter((cookie) => cookie.name.startsWith('_ga'))).toEqual([]);
  });

  test('the privacy page can give consent that was never asked for', async ({ page }) => {
    const asked = trackLoader(page);
    await page.goto('/privacy/');
    await expect(page.locator('#consent-state')).toHaveText('Nothing chosen yet');

    await page.locator('#consent-grant').click();
    await expect(page.locator('#consent-state')).toHaveText('Measurement allowed');
    expect(asked.length).toBeGreaterThan(0);
  });

  /* The route exists in all three locales, and the footer reaches it from every page. */
  test('every locale reaches the privacy page from its footer', async ({ page }) => {
    const pairs: [route: string, privacy: string][] = [
      ['/', '/privacy/'],
      ['/ru/', '/ru/privacy/'],
      ['/ja/', '/ja/privacy/'],
    ];
    for (const [route, expected] of pairs) {
      await page.goto(route);
      const link = page.locator('.colophon a');
      await expect(link).toHaveAttribute('href', expected);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${expected}$`));
      await expect(page.locator('h1')).toHaveCount(1);
    }
  });
});
