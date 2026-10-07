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
    test(`${route} is in Russian, declares it, and is published`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(route);

      await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
      await expect(page.locator('h1')).toHaveCount(1);
      // Russian is published, so it must NOT ask to be left out of the index.
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
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
   * The switch keeps the reader on the page they are reading. Switching language from a case study
   * must land on the same case study, not on the other locale's home page — the single most common
   * way a language switch wastes the reader's time.
   */
  test('the language switch is a round trip from a deep route', async ({ page }) => {
    await page.goto('/work/packaging-saas/');
    const switcher = page.getByRole('navigation', { name: /language|язык/i });
    await expect(switcher).toBeVisible();

    await switcher.getByRole('link', { name: 'Русский' }).click();
    await expect(page).toHaveURL(/\/ru\/work\/packaging-saas\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');

    await switcher.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/(?<!\/ru)\/work\/packaging-saas\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  /*
   * hreflang is the one piece of this that is actively harmful when wrong: Google discards a whole
   * cluster if a single link is missing or not reciprocated. The per-page facts are checked for
   * every built page by scripts/check-i18n.mjs; this covers the rendered relationship end to end.
   */
  test('each page advertises both locales and one x-default', async ({ page }) => {
    for (const route of ['/work/packaging-saas/', '/ru/work/packaging-saas/']) {
      await page.goto(route);
      const alternates = page.locator('link[rel="alternate"][hreflang]');
      await expect(alternates).toHaveCount(3);
      const expected: { hreflang: string; href: string }[] = [
        { hreflang: 'en', href: '/work/packaging-saas/' },
        { hreflang: 'ru', href: '/ru/work/packaging-saas/' },
        { hreflang: 'x-default', href: '/work/packaging-saas/' },
      ];
      for (const { hreflang, href } of expected) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveAttribute(
          'href',
          new RegExp(`${href.replace(/\//g, '\\/')}$`),
        );
      }
    }
  });
});

/**
 * Annotations: the same markup reads two ways, and both have to keep working without script.
 *
 * The regression this guards against is specific and was real: a `display` declaration on the note
 * overrode the browser's own `[popover]:not(:popover-open) { display: none }`, so on a phone every
 * note sat in the page with a `?` button beside it that appeared to do nothing.
 */
test.describe('context annotations', () => {
  test('are open beside the text on a wide screen, and closed behind a marker on a narrow one', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/work/next-generation-wms/');
    const notes = page.locator('.context [popover]');
    await expect(notes.first()).toBeVisible();
    await expect(page.locator('.context button.marker').first()).toBeHidden();

    await page.setViewportSize({ width: 390, height: 760 });
    await page.reload();
    await expect(notes.first()).toBeHidden();

    const marker = page.locator('.context button.marker').first();
    await expect(marker).toBeVisible();
    await marker.click();
    await expect(notes.first()).toBeVisible();

    // One at a time, and Escape closes it: the popover behaviour, not a script's imitation of it.
    await page.keyboard.press('Escape');
    await expect(notes.first()).toBeHidden();
  });

  test('every annotation cites a source', async ({ page }) => {
    await page.goto('/work/next-generation-wms/');
    const notes = page.locator('.context [popover]');
    const count = await notes.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index++) {
      await expect(notes.nth(index).locator('a[href^="https://"]')).toHaveCount(1);
    }
  });
});
