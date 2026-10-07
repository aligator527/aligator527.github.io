import { withBase } from './url';

/**
 * Locale and URL layer.
 *
 * English is the default locale and is served unprefixed from the site root. The site is live and
 * indexed, so every English URL must keep its exact shape: `/work/packaging-saas/` never becomes
 * `/en/work/packaging-saas/`. Other locales are prefixed with their code (`/ru/work/...`).
 *
 * Conventions used throughout the codebase:
 *
 * - A *logical path* is site-root-relative with neither the deployment base nor a locale prefix:
 *   `/work/`. Content, navigation and `isCurrent()` comparisons are expressed in logical paths.
 * - `localePath()` turns a logical path into a locale path (`/ru/work/`).
 * - `localeHref()` turns a logical path into an href ready for the browser: base plus locale.
 *   Anything in this codebase that takes a `locale` returns a resolved href, so a caller never has
 *   to remember to wrap the result in `withBase()` as well.
 *
 * ASSET RULE. `withBase()` is the only helper that touches asset URLs, and it stays locale-blind:
 * `/og.png`, `/favicon.svg`, `/sitemap-index.xml` and the CV PDF are single files shared by every
 * locale, so they must NEVER gain a locale prefix. `localePath()` therefore refuses a path that
 * looks like a file, which turns a mistaken `localeHref('/og.png', 'ru')` into a build failure
 * instead of a 404. `tests/unit/i18n.test.ts` asserts both halves of this rule.
 */
export const LOCALES = ['en', 'ru', 'ja'] as const;

export type Locale = (typeof LOCALES)[number];

/** Unprefixed, served from the site root, and the target of every `x-default` alternate. */
export const DEFAULT_LOCALE = 'en' satisfies Locale;

/**
 * Locales that may be indexed and advertised through `hreflang`. A locale ships here only once its
 * translation is complete: a half-translated locale in the index competes with the English page it
 * was translated from. Russian joins when its stage lands, Japanese after it.
 */
export const INDEXABLE_LOCALES = ['en'] as const satisfies readonly Locale[];

/**
 * Open Graph expects `language_TERRITORY`, not a bare language code. The site currently emits
 * `og:locale` as `en`, which is not a valid Open Graph value; the locale-rendering stage switches
 * the tag to this map, which is a deliberate, reviewable change to the live English pages.
 */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  ja: 'ja_JP',
};

/** Each locale's own name for itself, for a language switcher. Never translated. */
export const LOCALE_ENDONYM: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  ja: '日本語',
};

/** Paths ending in an extension are assets, which are shared across locales. */
const ASSET_PATH = /\.[a-z\d]+$/i;

/** A scheme (`mailto:`, `https:`) or a bare fragment: never a locale-dependent route. */
const NOT_A_ROUTE = /^([a-z][a-z\d+.-]*:|#)/i;

/** Leading `/ru` or `/ja` — a locale that is actually prefixed, so never `/en`. */
const LOCALE_PREFIX = new RegExp(
  `^/(${LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).join('|')})(?=/|$)`,
);

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Narrows a value — typically a route parameter — to a `Locale`, or throws. Route parameters are
 * strings as far as the type system is concerned, so this is the single place where that string
 * becomes a locale.
 */
export function assertLocale(value: unknown): Locale {
  if (!isLocale(value)) {
    throw new Error(`Unknown locale "${String(value)}"; expected one of ${LOCALES.join(', ')}`);
  }
  return value;
}

function normalizePath(path: string): string {
  return `/${path.replace(/^\/+/, '')}`;
}

/**
 * A logical path as the given locale serves it. English is returned unchanged, because its URLs are
 * already indexed and must not move.
 *
 * Throws rather than guesses when handed something that is not a logical page path: an asset, an
 * external URL, or a path that already carries a locale prefix. The last case is what would
 * otherwise produce `/ru/ru/work/`.
 */
export function localePath(path: string, locale: Locale): string {
  assertLocale(locale);
  if (NOT_A_ROUTE.test(path)) {
    throw new Error(`localePath() expects a site path, received "${path}"`);
  }
  if (ASSET_PATH.test(path)) {
    throw new Error(
      `Assets are shared across locales and must go through withBase(), not localePath(): "${path}"`,
    );
  }
  const normalized = normalizePath(path);
  if (LOCALE_PREFIX.test(normalized)) {
    throw new Error(`localePath() expects a path without a locale prefix, received "${path}"`);
  }
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === '/' ? `/${locale}/` : `/${locale}${normalized}`;
}

/** A logical path as an href: locale prefix plus deployment base. */
export function localeHref(
  path: string,
  locale: Locale,
  base: string = import.meta.env.BASE_URL,
): string {
  return withBase(localePath(path, locale), base);
}

/**
 * Splits a base-free path into its locale and its logical path. `/en/...` is deliberately not
 * recognised: English has no prefix, so treating `/en/work/` as English would invent a second URL
 * for a page that already has one.
 */
export function stripLocale(path: string): { locale: Locale; path: string } {
  const normalized = normalizePath(path);
  const match = LOCALE_PREFIX.exec(normalized);
  const prefix = match?.[1];
  if (!prefix || !isLocale(prefix)) return { locale: DEFAULT_LOCALE, path: normalized };
  const rest = normalized.slice(prefix.length + 1);
  return { locale: prefix, path: rest === '' ? '/' : rest };
}

/** Removes the deployment base from a pathname, leaving a site-root-relative path. */
function withoutBase(pathname: string, base: string): string {
  const prefix = withBase('/', base);
  if (pathname === prefix || `${pathname}/` === prefix) return '/';
  return pathname.startsWith(prefix)
    ? `/${pathname.slice(prefix.length)}`
    : normalizePath(pathname);
}

/**
 * The logical path a rendered URL corresponds to: base and locale prefix removed. This is what
 * navigation compares against, so that `isCurrent()` behaves identically at the site root, under a
 * repository subpath, and inside a localised section.
 */
export function logicalPath(pathname: string, base: string = import.meta.env.BASE_URL): string {
  return stripLocale(withoutBase(pathname, base)).path;
}

/**
 * The locale a rendered URL belongs to — the other half of `logicalPath()`. Components derive their
 * locale from `Astro.url` with this, so a locale never has to be threaded through props.
 */
export function localeFromPathname(
  pathname: string,
  base: string = import.meta.env.BASE_URL,
): Locale {
  return stripLocale(withoutBase(pathname, base)).locale;
}

export interface Alternate {
  /** `hreflang` attribute value: a locale code, or `x-default`. */
  hreflang: string;
  href: string;
}

/**
 * `hreflang` alternates for one logical path.
 *
 * Only indexable locales are advertised, intersected with the locales this particular path actually
 * exists in. Exactly one `x-default` is always emitted, pointing at the English URL: it is the
 * fallback for every language not listed, and duplicating or omitting it is how a localised site
 * loses pages from an index.
 *
 * Alternates — not the canonical tag — are what links the locales together. Each localised page
 * canonicalises to itself, which `scripts/check-i18n.mjs` enforces.
 */
export function alternates(
  path: string,
  availableLocales: readonly Locale[] = LOCALES,
  base: string = import.meta.env.BASE_URL,
): Alternate[] {
  const indexable: ReadonlySet<Locale> = new Set(INDEXABLE_LOCALES);
  const available: ReadonlySet<Locale> = new Set(availableLocales);
  const localized = LOCALES.filter(
    (locale) => indexable.has(locale) && available.has(locale),
  ).map<Alternate>((locale) => ({ hreflang: locale, href: localeHref(path, locale, base) }));
  return [...localized, { hreflang: 'x-default', href: localeHref(path, DEFAULT_LOCALE, base) }];
}
