import { describe, expect, it } from 'vitest';
import { en } from '../../src/i18n/ui/en';
import { useTranslations } from '../../src/i18n/ui';
import {
  DEFAULT_LOCALE,
  EMITTED_LOCALES,
  INDEXABLE_LOCALES,
  LOCALES,
  LOCALE_ENDONYM,
  OG_LOCALE,
  alternates,
  assertLocale,
  isIndexable,
  localeFromPathname,
  localeHref,
  localeParam,
  localesFor,
  localePath,
  localePaths,
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

  /*
   * Asserted as a rule rather than a list: a locale may only be advertised once it is emitted and
   * translated, and English — the x-default target — is never absent. Hard-coding the membership
   * made this test fail the moment Russian was published, which is noise, not a regression.
   */
  it('advertises only locales that are also emitted, English among them', () => {
    expect([...INDEXABLE_LOCALES]).toContain(DEFAULT_LOCALE);
    for (const locale of INDEXABLE_LOCALES) {
      expect(EMITTED_LOCALES).toContain(locale);
    }
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
  it('lists every indexable locale, then exactly one x-default on the English URL', () => {
    for (const [base, prefix] of [
      ['/', ''],
      ['/portfolio', '/portfolio'],
    ] as const) {
      expect(alternates('/work/', LOCALES, base)).toEqual([
        ...INDEXABLE_LOCALES.map((locale) => ({
          hreflang: locale,
          href: locale === DEFAULT_LOCALE ? `${prefix}/work/` : `${prefix}/${locale}/work/`,
        })),
        { hreflang: 'x-default', href: `${prefix}/work/` },
      ]);
    }
  });

  it('intersects with the locales a page actually exists in', () => {
    /*
     * The set is availability ∩ indexable, plus one x-default — never the wish list. Asserted
     * with a page that exists in English only, because which locales are published changes as
     * each one ships, and a test pinned to that churns for no reason.
     */
    expect(alternates('/about/', [DEFAULT_LOCALE], '/')).toEqual([
      { hreflang: DEFAULT_LOCALE, href: '/about/' },
      { hreflang: 'x-default', href: '/about/' },
    ]);
    for (const locale of LOCALES) {
      const list = alternates('/about/', [locale], '/');
      expect(list.filter((alternate) => alternate.hreflang === 'x-default')).toHaveLength(1);
      expect(list.length).toBe(isIndexable(locale) ? 2 : 1);
    }
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

describe('route generation', () => {
  it('maps the default locale to an absent rest parameter, so English URLs keep their shape', () => {
    expect(localeParam('en')).toBeUndefined();
    expect(localeParam('ru')).toBe('ru');
    expect(localeParam('ja')).toBe('ja');
  });

  it('rejects an unknown locale rather than emitting a route for it', () => {
    expect(() => localeParam('de' as Locale)).toThrow(/Unknown locale/);
  });

  it('emits one route per emitted locale, English first and unprefixed', () => {
    // Derived from EMITTED_LOCALES rather than hard-coded: this asserts the rule — English has no
    // segment, every other locale is its own code — and keeps passing as locales are added.
    expect(localePaths()).toEqual(
      EMITTED_LOCALES.map((locale) => ({
        params: { locale: locale === DEFAULT_LOCALE ? undefined : locale },
        props: { locale },
      })),
    );
    expect(localePaths()[0]?.props.locale).toBe(DEFAULT_LOCALE);
  });

  it('emits every locale it builds and never a locale it does not know', () => {
    for (const locale of EMITTED_LOCALES) {
      expect(LOCALES).toContain(locale);
    }
    expect(localePaths().map(({ props }) => props.locale)).toEqual([...EMITTED_LOCALES]);
  });

  /*
   * A locale is built before it is advertised, never the other way round: an indexable locale with
   * no emitted routes would put URLs in `hreflang` that return 404.
   */
  it('advertises only locales it also emits', () => {
    for (const locale of INDEXABLE_LOCALES) {
      expect(EMITTED_LOCALES).toContain(locale);
    }
  });

  it('turns its own params back into the route each page renders at', () => {
    for (const { params, props } of localePaths()) {
      const prefix = params.locale === undefined ? '' : `/${params.locale}`;
      for (const route of ROUTES) {
        expect(`${prefix}${route}`).toBe(localePath(route, props.locale));
      }
    }
  });
});

/*
 * The indexing gate. `isIndexable()` decides two things that must never disagree: whether a page
 * says `noindex`, and whether the sitemap lists it. The sitemap filter in `astro.config.mjs` is the
 * one caller that sees a full pathname including the deployment base, so the base-path cases below
 * are the ones that matter: an earlier version of that filter stripped the base with an off-by-one
 * slice, which classified every `/portfolio/ru/...` page as English, and therefore as indexable,
 * and put nine `noindex` pages into the sitemap under the subpath build.
 */
describe('the indexing gate', () => {
  it('admits exactly the locales declared indexable', () => {
    for (const locale of LOCALES) {
      expect(isIndexable(locale)).toBe((INDEXABLE_LOCALES as readonly Locale[]).includes(locale));
    }
  });

  it('rejects a value that is not a locale', () => {
    // @ts-expect-error — the runtime guard is the point: a bad locale must not silently be indexable.
    expect(() => isIndexable('de')).toThrow();
  });

  it.each([
    ['/', '/', 'en'],
    ['/', '/work/', 'en'],
    ['/', '/ru/', 'ru'],
    ['/', '/ru/work/packaging-saas/', 'ru'],
    ['/', '/ja/about/', 'ja'],
    ['/portfolio/', '/portfolio/', 'en'],
    ['/portfolio/', '/portfolio/work/', 'en'],
    ['/portfolio/', '/portfolio/ru/', 'ru'],
    ['/portfolio/', '/portfolio/ru/work/packaging-saas/', 'ru'],
    ['/portfolio/', '/portfolio/ja/about/', 'ja'],
  ])(
    'reads the locale of %s%s as %s, which is what the sitemap filter asks it',
    (base, pathname, expected) => {
      expect(localeFromPathname(pathname, base)).toBe(expected);
    },
  );

  it.each(['/', '/portfolio/'])(
    'agrees with itself about every emitted route at base %s',
    (base) => {
      for (const locale of EMITTED_LOCALES) {
        for (const route of ROUTES) {
          const pathname = withBase(localePath(route, locale), base);
          expect(localeFromPathname(pathname, base)).toBe(locale);
          expect(isIndexable(localeFromPathname(pathname, base))).toBe(isIndexable(locale));
        }
      }
    },
  );
});

/*
 * English-only routes. `/lab/`, `/notes/` and `/404/` live outside the `[...locale]` tree, so no
 * Russian or Japanese document exists for them. Advertising one is a link to a 404 — which is what
 * `scripts/check-links.mjs` found when the language switch offered `/ru/lab/`.
 */
describe('pages that exist in English only', () => {
  it.each(['/lab/', '/notes/', '/404/'])('offers no other locale for %s', (path) => {
    expect([...localesFor(path)]).toEqual([DEFAULT_LOCALE]);
    // English still references itself; what must not appear is a second locale. Two entries is
    // the signal `BaseLayout.astro` uses to render no hreflang block at all.
    expect(alternates(path, localesFor(path), '/')).toEqual([
      { hreflang: DEFAULT_LOCALE, href: path },
      { hreflang: 'x-default', href: path },
    ]);
  });

  it.each(['/', '/work/', '/work/packaging-saas/', '/about/'])(
    'offers every locale for %s',
    (path) => {
      expect([...localesFor(path)]).toEqual([...LOCALES]);
    },
  );
});
