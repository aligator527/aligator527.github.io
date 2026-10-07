import { expect, test } from '@playwright/test';

/**
 * Locale behaviour that only a browser can establish.
 *
 * Per-page HTML facts — canonical, hreflang reciprocity, robots/sitemap agreement, the font preload
 * contract — are checked for every built page by `scripts/check-i18n.mjs`, which reads the whole
 * build in under a second. Running those in a browser across every route × locale × viewport buys
 * nothing and costs the whole suite, so this file deliberately covers only what rendering decides:
 * what the reader sees, and what reflows.
 */

const RU_ROUTES = [
  '/ru/',
  '/ru/work/',
  '/ru/work/packaging-saas/',
  '/ru/experience/',
  '/ru/about/',
];

test.describe('the Russian locale', () => {
  for (const route of RU_ROUTES) {
    test(`${route} is in Russian, declares it, and asks not to be indexed yet`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(route);

      await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
      await expect(page.locator('h1')).toHaveCount(1);
      // Russian is built for review before it is published; see INDEXABLE_LOCALES.
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      expect(errors).toEqual([]);
    });
  }

  /*
   * The leak this catches is a string that was never routed through the dictionary: a label left
   * in a component, or a data module whose wording was not moved. It looks for a run of two or
   * more Latin words in a text node with no Cyrillic in it, which passes over the things that are
   * legitimately Latin on a Russian page — `DynamoDB`, `P01`, `Tech Lead`, `github.com/...` — and
   * fails on an English sentence.
   */
  test('no English sentence survives on a Russian page', async ({ page }) => {
    for (const route of RU_ROUTES) {
      await page.goto(route);
      const leaks = await page.evaluate(() => {
        const found = new Set<string>();
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let node = walk.nextNode(); node; node = walk.nextNode()) {
          const parent = node.parentElement;
          if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue;
          const text = (node.textContent ?? '').trim();
          if (!text || /[А-Яа-яЁё]/.test(text)) continue;
          if (/[A-Za-z]{3,}\s+[a-z]{3,}/.test(text)) found.add(text.slice(0, 80));
        }
        return [...found];
      });
      expect(leaks, `untranslated text on ${route}`).toEqual([]);
    }
  });

  test('Russian reflows at 320px without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    for (const route of RU_ROUTES) {
      await page.goto(route);
      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(overflow.scroll, `horizontal overflow on ${route}`).toBeLessThanOrEqual(
        overflow.client,
      );
    }
  });

  /*
   * The switch advertises published locales only, so with Russian still unpublished there is
   * nothing to switch between and the component renders nothing. Asserting the absence keeps the
   * rule honest: if a future change starts advertising an unreviewed locale, this fails.
   */
  test('the language switch stays hidden while only one locale is published', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: /language|язык/i })).toHaveCount(0);
  });
});
