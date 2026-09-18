import { describe, expect, it } from 'vitest';
import { isCurrent, withBase } from '../../src/utils/url';

describe('withBase', () => {
  it('keeps root-served paths unchanged', () => {
    expect(withBase('/work/', '/')).toBe('/work/');
    expect(withBase('/', '/')).toBe('/');
  });

  it('prefixes a repository subpath with or without trailing slash', () => {
    expect(withBase('/work/', '/portfolio')).toBe('/portfolio/work/');
    expect(withBase('work/', '/portfolio/')).toBe('/portfolio/work/');
    expect(withBase('/', '/portfolio')).toBe('/portfolio/');
  });

  it('leaves external, mail and fragment links untouched', () => {
    expect(withBase('https://github.com/aligator527', '/portfolio')).toBe(
      'https://github.com/aligator527',
    );
    expect(withBase('mailto:ivan.d@wanya.group', '/portfolio')).toBe('mailto:ivan.d@wanya.group');
    expect(withBase('#main', '/portfolio')).toBe('#main');
  });
});

describe('isCurrent', () => {
  it('marks exact matches regardless of trailing slash', () => {
    expect(isCurrent('/work/', '/work')).toBe('page');
    expect(isCurrent('/about', '/about/')).toBe('page');
  });

  it('marks a section as current on child routes', () => {
    expect(isCurrent('/work/', '/work/packaging-saas/')).toBe('page');
  });

  it('does not treat home as an ancestor of every route', () => {
    expect(isCurrent('/', '/work/')).toBeUndefined();
    expect(isCurrent('/', '/')).toBe('page');
  });

  it('does not match sibling routes that share a prefix', () => {
    expect(isCurrent('/work', '/workshop')).toBeUndefined();
  });

  it('supports exact-only matching', () => {
    expect(isCurrent('/work/', '/work/packaging-saas/', { exact: true })).toBeUndefined();
  });
});
