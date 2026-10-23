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
    // Lab's newest entry is L01, last touched 2026-10-21; the index changes when one is added.
    expect(lastmodFor('/lab/', '/')).toBe('2026-10-21');
    expect(lastmodFor('/ru/lab/', '/')).toBe('2026-10-21');
  });

  it('dates a lab entry from its own date', () => {
    expect(lastmodFor('/lab/zairyu-map/', '/')).toBe('2026-09-25');
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
