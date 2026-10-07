import { describe, expect, it } from 'vitest';
import { en } from '../../src/i18n/ui/en';
import { useTranslations } from '../../src/i18n/ui';
import {
  DEFAULT_LOCALE,
  INDEXABLE_LOCALES,
  LOCALES,
  LOCALE_ENDONYM,
  OG_LOCALE,
  alternates,
  assertLocale,
  localeFromPathname,
  localeHref,
  localePath,
  logicalPath,
  stripLocale,
  type Locale,
} from '../../src/utils/i18n';
import { RESUME_PDF_PATH } from '../../src/utils/resume';
import { withBase } from '../../src/utils/url';

/** Every page route the site builds today, as logical paths. */
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
  '/lab/',
  '/notes/',
];

/** The site root and a repository subpath: the two bases `pnpm build` and `build:subpath` use. */
const BASES = ['/', '/portfolio'];

/** Shared, locale-blind files. None of them may ever gain a locale prefix. */
const ASSETS = ['/og.png', '/favicon.svg', '/sitemap-index.xml', `/${RESUME_PDF_PATH}`];

describe('locale set', () => {
  it('serves English unprefixed and lists the planned locales', () => {
    expect(LOCALES).toEqual(['en', 'ru', 'ja']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('advertises only locales whose translation is complete', () => {
    expect([...INDEXABLE_LOCALES]).toEqual(['en']);
  });

  it('uses valid Open Graph locale values, not bare language codes', () => {
    for (const locale of LOCALES) {
      expect(OG_LOCALE[locale]).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    }
    expect(OG_LOCALE.en).toBe('en_US');
  });

  it('names every locale in its own language', () => {
    expect(LOCALE_ENDONYM).toEqual({ en: 'English', ru: 'Русский', ja: '日本語' });
  });

  it('narrows known locales and rejects anything else', () => {
    for (const locale of LOCALES) expect(assertLocale(locale)).toBe(locale);
    expect(() => assertLocale('de')).toThrow();
    expect(() => assertLocale('EN')).toThrow();
    expect(() => assertLocale(undefined)).toThrow();
  });
});

describe('localePath', () => {
  it('leaves every indexed English URL exactly as it is', () => {
    for (const route of ROUTES) expect(localePath(route, 'en')).toBe(route);
  });

  it('prefixes the other locales', () => {
    expect(localePath('/', 'ru')).toBe('/ru/');
    expect(localePath('/', 'ja')).toBe('/ja/');
    expect(localePath('/work/', 'ru')).toBe('/ru/work/');
    expect(localePath('/work/packaging-saas/', 'ja')).toBe('/ja/work/packaging-saas/');
  });

  it('refuses a path that already carries a locale, instead of producing /ru/ru/', () => {
    expect(() => localePath('/ru/work/', 'ru')).toThrow();
    expect(() => localePath('/ja/', 'en')).toThrow();
  });

  it('refuses external links and fragments', () => {
    expect(() => localePath('https://github.com/aligator527', 'ru')).toThrow();
    expect(() => localePath('mailto:ivan.d@wanya.group', 'ru')).toThrow();
    expect(() => localePath('#main', 'ru')).toThrow();
  });
});

describe('localeHref', () => {
  it('resolves the home page for every locale and base', () => {
    expect(localeHref('/', 'en', '/')).toBe('/');
    expect(localeHref('/', 'en', '/portfolio')).toBe('/portfolio/');
    expect(localeHref('/', 'ru', '/')).toBe('/ru/');
    expect(localeHref('/', 'ru', '/portfolio')).toBe('/portfolio/ru/');
    expect(localeHref('/', 'ja', '/')).toBe('/ja/');
    expect(localeHref('/', 'ja', '/portfolio')).toBe('/portfolio/ja/');
  });

  it('resolves a nested route for every locale and base', () => {
    expect(localeHref('/work/packaging-saas/', 'en', '/')).toBe('/work/packaging-saas/');
    expect(localeHref('/work/packaging-saas/', 'en', '/portfolio')).toBe(
      '/portfolio/work/packaging-saas/',
    );
    expect(localeHref('/work/packaging-saas/', 'ru', '/')).toBe('/ru/work/packaging-saas/');
    expect(localeHref('/work/packaging-saas/', 'ru', '/portfolio')).toBe(
      '/portfolio/ru/work/packaging-saas/',
    );
    expect(localeHref('/work/packaging-saas/', 'ja', '/')).toBe('/ja/work/packaging-saas/');
    expect(localeHref('/work/packaging-saas/', 'ja', '/portfolio')).toBe(
      '/portfolio/ja/work/packaging-saas/',
    );
  });

  it('never doubles a base or a locale segment, on any route', () => {
    for (const base of BASES) {
      for (const locale of LOCALES) {
        for (const route of ROUTES) {
          const href = localeHref(route, locale, base);
          expect(href).not.toContain('/portfolio/portfolio/');
          expect(href).not.toContain(`/${locale}/${locale}/`);
          expect(href).not.toContain('//');
          expect(href.startsWith(withBase('/', base))).toBe(true);
        }
      }
    }
  });
});

describe('asset paths', () => {
  /*
   * /og.png, /favicon.svg, /sitemap-index.xml and the CV PDF are single files shared by every
   * locale. withBase() is the only helper allowed near them, and it stays locale-blind.
   */
  it('keep their exact URL under every base, with no locale segment', () => {
    for (const asset of ASSETS) {
      expect(withBase(asset, '/')).toBe(asset);
      expect(withBase(asset, '/portfolio')).toBe(`/portfolio${asset}`);
      for (const locale of LOCALES) {
        expect(withBase(asset, '/')).not.toContain(`/${locale}/`);
        expect(withBase(asset, '/portfolio')).not.toContain(`/${locale}/`);
      }
    }
  });

  it('cannot be localised by mistake: the locale helpers reject them', () => {
    for (const asset of ASSETS) {
      for (const locale of LOCALES) {
        expect(() => localePath(asset, locale)).toThrow();
        expect(() => localeHref(asset, locale, '/portfolio')).toThrow();
      }
    }
  });
});

describe('stripLocale and logicalPath', () => {
  it('round-trips every route in every locale', () => {
    for (const locale of LOCALES) {
      for (const route of ROUTES) {
        expect(stripLocale(localePath(route, locale))).toEqual({ locale, path: route });
      }
    }
  });

  it('treats an unprefixed path as English', () => {
    expect(stripLocale('/work/')).toEqual({ locale: 'en', path: '/work/' });
  });

  it('does not recognise /en/, which would invent a second URL for an indexed page', () => {
    expect(stripLocale('/en/work/')).toEqual({ locale: 'en', path: '/en/work/' });
  });

  it('removes base and locale from a rendered pathname', () => {
    expect(logicalPath('/work/', '/')).toBe('/work/');
    expect(logicalPath('/ru/work/', '/')).toBe('/work/');
    expect(logicalPath('/portfolio/work/', '/portfolio')).toBe('/work/');
    expect(logicalPath('/portfolio/ja/work/', '/portfolio')).toBe('/work/');
    expect(logicalPath('/', '/')).toBe('/');
    expect(logicalPath('/ru/', '/')).toBe('/');
    expect(logicalPath('/portfolio/', '/portfolio')).toBe('/');
    expect(logicalPath('/portfolio', '/portfolio')).toBe('/');
    expect(logicalPath('/portfolio/ru/', '/portfolio')).toBe('/');
  });

  it('reads the locale back out of a rendered pathname', () => {
    for (const base of BASES) {
      for (const locale of LOCALES) {
        for (const route of ROUTES) {
          const pathname = localeHref(route, locale, base);
          expect(localeFromPathname(pathname, base)).toBe(locale);
          expect(logicalPath(pathname, base)).toBe(route);
        }
      }
    }
  });
});

describe('alternates', () => {
  it('lists only indexable locales and exactly one x-default on the English URL', () => {
    expect(alternates('/work/', LOCALES, '/')).toEqual([
      { hreflang: 'en', href: '/work/' },
      { hreflang: 'x-default', href: '/work/' },
    ]);
    expect(alternates('/work/', LOCALES, '/portfolio')).toEqual([
      { hreflang: 'en', href: '/portfolio/work/' },
      { hreflang: 'x-default', href: '/portfolio/work/' },
    ]);
  });

  it('intersects with the locales a page actually exists in', () => {
    expect(alternates('/about/', ['ru'], '/')).toEqual([
      { hreflang: 'x-default', href: '/about/' },
    ]);
  });

  it('keeps exactly one x-default, pointing at English, for every route and base', () => {
    for (const base of BASES) {
      for (const route of ROUTES) {
        const list = alternates(route, LOCALES, base);
        const defaults = list.filter((alternate) => alternate.hreflang === 'x-default');
        expect(defaults).toHaveLength(1);
        expect(defaults[0]?.href).toBe(localeHref(route, DEFAULT_LOCALE, base));
        expect(new Set(list.map((alternate) => alternate.hreflang)).size).toBe(list.length);
      }
    }
  });
});

describe('dictionaries', () => {
  it('provides every English key for every locale', () => {
    const expected = Object.keys(en).sort();
    for (const locale of LOCALES) {
      expect(Object.keys(useTranslations(locale)).sort()).toEqual(expected);
    }
  });

  it('is indexed by locale, so a new locale needs a dictionary', () => {
    const locale: Locale = 'ja';
    expect(typeof useTranslations(locale).navWork).toBe('string');
  });
});
