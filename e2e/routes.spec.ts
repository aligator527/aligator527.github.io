import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/work/',
  '/work/next-generation-wms/',
  '/work/ai-chat-platform/',
  '/work/packaging-saas/',
  '/work/client-delivery/',
  '/experience/',
  '/about/',
  '/resume/',
];

test.describe('routes', () => {
  for (const route of ROUTES) {
    test(`${route} renders one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));

      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('serves a 404 page with recovery links', async ({ page }) => {
    await page.goto('/404/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('No page exists');
    await expect(
      page.getByRole('list', { name: 'Where to go next' }).getByRole('link', { name: 'Work' }),
    ).toBeVisible();
  });

  test('ships no client JavaScript bundles', async ({ page }) => {
    const scripts: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'script') scripts.push(request.url());
    });
    await page.goto('/');
    await page.goto('/work/ai-chat-platform/');
    expect(scripts).toEqual([]);
  });
});

/**
 * The cascade-layer order is declared inline in <head> because component-scoped styles are bundled
 * before global.css and would otherwise establish the order themselves. If that inline block stops
 * being first, or a component declares a layer name outside the known list, component rules lose to
 * base rules silently — links would grow underlines and grid overrides would stop applying.
 */
test.describe('cascade layers', () => {
  test('the layer order is declared before the first stylesheet', async ({ page }) => {
    await page.goto('/');
    const order = await page.evaluate(() => {
      const nodes = [...document.head.children];
      const declaration = nodes.findIndex(
        (node) => node.tagName === 'STYLE' && node.textContent?.includes('@layer reset'),
      );
      const stylesheet = nodes.findIndex(
        (node) => node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet',
      );
      return { declaration, stylesheet };
    });
    expect(order.declaration).toBeGreaterThanOrEqual(0);
    expect(order.stylesheet).toBeGreaterThan(order.declaration);
  });

  test('component rules still beat base rules', async ({ page }) => {
    await page.goto('/');
    // `a { text-decoration-line: underline }` lives in the base layer; the components layer removes
    // it from the wordmark. If the layer order breaks, this reverts to "underline".
    const decoration = await page
      .locator('.wordmark')
      .evaluate((node) => getComputedStyle(node).textDecorationLine);
    expect(decoration).toBe('none');
  });
});
