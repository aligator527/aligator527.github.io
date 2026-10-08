import { localeFromPathname, type Locale } from '../../utils/i18n';
import { en, type Dictionary } from './en';
import { ja } from './ja';
import { ru } from './ru';

export type { Dictionary } from './en';

/**
 * The dictionary for each locale.
 *
 * `satisfies Record<Locale, Dictionary>` is the contract: adding a locale to `LOCALES` without a
 * dictionary, or shipping a dictionary that is missing a key English has, fails `astro check`.
 *
 * Every locale now has its own dictionary. A locale is still published separately — see
 * `INDEXABLE_LOCALES` — because a complete dictionary is not a reviewed one.
 */
const dictionaries = { en, ru, ja } satisfies Record<Locale, Dictionary>;

/** The chrome strings for one locale. */
export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Convenience for `.astro` files, which can always see their own URL:
 * `const { locale, t } = localize(Astro.url);`
 *
 * Deriving the locale from the URL rather than threading it through props keeps every component
 * usable from any locale's page without a prop that could be forgotten or passed wrongly.
 */
export function localize(url: URL | { pathname: string }): { locale: Locale; t: Dictionary } {
  const locale = localeFromPathname(url.pathname);
  return { locale, t: useTranslations(locale) };
}
