import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/work/',
  '/work/next-generation-wms/',
  '/experience/',
  '/about/',
  '/resume/',
  '/404/',
];

for (const route of ROUTES) {
  test(`axe reports no serious or critical violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blocking = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    );
    expect(
      blocking.map((violation) => `${violation.id}: ${violation.nodes.length} node(s)`),
    ).toEqual([]);
  });
}

test('content fits a 320px viewport without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const route of ['/', '/work/ai-chat-platform/', '/experience/']) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
  }
});

test('headings follow a single, ordered outline', async ({ page }) => {
  await page.goto('/');
  const levels = await page
    .locator('h1, h2, h3')
    .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))));
  expect(levels[0]).toBe(1);
  for (let index = 1; index < levels.length; index += 1) {
    expect(levels[index]! - levels[index - 1]!).toBeLessThanOrEqual(1);
  }
});

test('reduced motion removes transitions on interactive elements', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const duration = await page
    .locator('.action-link .arrow')
    .first()
    .evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(parseFloat(duration)).toBeLessThan(0.05);
});

test('focus is visible on navigation links', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Keyboard focus is a desktop concern');
  await page.goto('/');
  const link = page.getByRole('navigation', { name: 'Primary' }).getByRole('link').first();
  await link.focus();
  const outline = await link.evaluate((node) => getComputedStyle(node).outlineWidth);
  expect(parseFloat(outline)).toBeGreaterThan(0);
});
