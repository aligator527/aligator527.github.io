import { localeFromPathname, type Locale } from '../../utils/i18n';
import { en, type Dictionary } from './en';
import { ru } from './ru';

export type { Dictionary } from './en';

/**
 * The dictionary for each locale.
 *
 * `satisfies Record<Locale, Dictionary>` is the contract: adding a locale to `LOCALES` without a
 * dictionary, or shipping a dictionary that is missing a key English has, fails `astro check`.
 *
 * Japanese deliberately points at the English dictionary until its translation stage lands. The
 * fallback is visible here rather than hidden inside `useTranslations()`, so that it is a line to
 * delete rather than a behaviour to discover: as long as a locale aliases `en`, its pages render
 * English chrome, which is also why it is absent from `INDEXABLE_LOCALES`.
 */
const dictionaries = {
  en,
  ru,
  ja: en,
} satisfies Record<Locale, Dictionary>;

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
