import { expect, test } from '@playwright/test';

test('primary navigation marks the current section', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByRole('link', { name: 'Work' }).click();
  await expect(page).toHaveURL(/\/work\/?$/);
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');

  // A case study keeps the section marked as current.
  await page.getByRole('link', { name: 'AI Chat Game Platform' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI Chat Game Platform');
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
});

test('a section appears in the navigation once it has an entry', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  // Lab has no entries yet, so `EMPTY_SECTIONS` keeps it out entirely.
  await expect(nav.getByRole('link', { name: 'Lab' })).toHaveCount(0);
  // Notes got its first entry, so it links — and says that it links into English.
  const notes = nav.getByRole('link', { name: 'Notes' });
  await expect(notes).toHaveAttribute('href', '/notes/');
  await expect(notes).not.toHaveAttribute('hreflang', /.+/);
});

test('an English-only section links out of a translated page in English', async ({ page }) => {
  await page.goto('/ja/');
  // The landmark label and the link label are both Japanese; only the destination is English.
  const notes = page.getByRole('navigation', { name: 'メインナビゲーション' }).getByRole('link', {
    name: /ノート/,
  });
  // `/ja/notes/` does not exist. The link resolves to the default locale rather than 404,
  // and carries the language change so a screen reader announces it.
  await expect(notes).toHaveAttribute('href', '/notes/');
  await expect(notes).toHaveAttribute('hreflang', 'en');
  await expect(notes).toContainText('EN');
});

test('every work page is reachable from the index', async ({ page }) => {
  await page.goto('/work/');
  const links = page.locator('.index .title a');
  await expect(links).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) {
    const name = await links.nth(index).innerText();
    await links.nth(index).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await page.goBack();
  }
});

test('case studies link to the previous and next project', async ({ page }) => {
  await page.goto('/work/packaging-saas/');
  const pager = page.getByRole('navigation', { name: 'More work' });
  await expect(pager.getByRole('link')).toHaveCount(2);
  await pager.getByRole('link', { name: /Next/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Client Project Delivery');
});

test('the résumé route offers the PDF only when the file exists', async ({ page, request }) => {
  await page.goto('/resume/');
  const download = page.getByTestId('resume-pdf');
  if ((await download.count()) === 0) test.skip(true, 'No PDF committed yet');
  const href = await download.getAttribute('href');
  expect((await request.get(href!)).status()).toBe(200);
});

test('skip link moves focus to the main landmark', async ({ page, browserName }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Keyboard navigation is a desktop concern');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await skip.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(browserName).toBe('chromium');
});
