import { describe, expect, it } from 'vitest';
import { lastmodFor } from '../../src/utils/sitemap-dates';

/*
 * These assert against the real content rather than a fixture: the function's whole job is to read
 * what is published, and a fixture would pass while the sitemap shipped no dates at all.
 */
describe('lastmodFor', () => {
  it('dates a note from its own frontmatter, in every locale and at every base', () => {
    for (const [pathname, base] of [
      ['/notes/dynamodb-slow-as-data-grew/', '/'],
      ['/ru/notes/dynamodb-slow-as-data-grew/', '/'],
      ['/ja/notes/dynamodb-slow-as-data-grew/', '/'],
      ['/portfolio/notes/dynamodb-slow-as-data-grew/', '/portfolio/'],
      ['/portfolio/ja/notes/dynamodb-slow-as-data-grew/', '/portfolio/'],
    ] as const) {
      expect(lastmodFor(pathname, base), `${base} → ${pathname}`).toBe('2026-10-23');
    }
  });

  it('dates a section index by its newest entry', () => {
    // All three lab entries were rebuilt on 2026-10-23; the index changes when one does.
    expect(lastmodFor('/lab/', '/')).toBe('2026-10-23');
    expect(lastmodFor('/ru/lab/', '/')).toBe('2026-10-23');
    // Notes' newest date is the identity note's retitle, not the newest publication.
    expect(lastmodFor('/notes/', '/')).toBe('2026-11-04');
  });

  /*
   * `lastmod` means last modified, not first published, and the gap between the two is what sends
   * a crawler back. An entry that was changed long after it shipped says so through `updatedAt`,
   * and that is the value the sitemap has to carry — the first test above is the other half, where
   * nothing has been updated and the publication date stands.
   */
  it('prefers updatedAt over the date the entry first carried', () => {
    // L03 shipped 2026-09-25 and was given a page of its own on 2026-10-23.
    expect(lastmodFor('/lab/zairyu-map/', '/')).toBe('2026-10-23');
    // The identity note was retitled in all three locales twelve days after it was published.
    for (const pathname of [
      '/notes/per-user-identity-pricing/',
      '/ru/notes/per-user-identity-pricing/',
      '/ja/notes/per-user-identity-pricing/',
    ]) {
      expect(lastmodFor(pathname, '/'), pathname).toBe('2026-11-04');
    }
  });

  /*
   * The pages deliberately left without a date. A work entry's frontmatter says when an engagement
   * ran, which is not when the page last changed, and the rest have no content date at all.
   */
  it('leaves pages with no defensible date undated', () => {
    for (const pathname of [
      '/',
      '/about/',
      '/experience/',
      '/resume/',
      '/work/',
      '/work/packaging-saas/',
      '/ja/work/packaging-saas/',
    ]) {
      expect(lastmodFor(pathname, '/'), pathname).toBeUndefined();
    }
  });
});
