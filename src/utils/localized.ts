import { z } from 'astro/zod';
import { DEFAULT_LOCALE, INDEXABLE_LOCALES, LOCALES, type Locale } from './i18n';

/**
 * Translatable values inside a data file.
 *
 * The work collection keeps one Markdown file per locale, because a case study is long prose that
 * has to be reviewed one language at a time. The YAML data files are the opposite case: short
 * strings whose structure is the fact and whose wording is the translation. Splitting those per
 * locale would put the same role's dates in three files and invite them to drift, so here the
 * locale lives one level down instead:
 *
 * ```yaml
 * startDate: '2026-09'          # a fact: one value, no locale
 * summary:                      # wording: one value per locale
 *   en: Technical direction for a next-generation warehouse management system.
 *   ru: Техническое руководство системой управления складом нового поколения.
 * ```
 *
 * The default locale is required; the others are optional so that a translation can land file by
 * file while its locale is still unpublished. `assertTranslated()` is what stops that state from
 * reaching the index.
 */
export function localized<T extends z.ZodTypeAny>(inner: T) {
  return z.object({
    en: inner,
    ...Object.fromEntries(
      LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => [
        locale,
        inner.optional(),
      ]),
    ),
  }) as z.ZodObject<{ en: T } & { [K in Exclude<Locale, 'en'>]: z.ZodOptional<T> }>;
}

export type Localized<T> = { en: T } & { [K in Exclude<Locale, 'en'>]?: T | undefined };

/*
 * `NoInfer` on the optional locales is load-bearing: without it, TypeScript infers `T` from both
 * `en: string` and `ru?: string | undefined` and lands on `string | undefined`, which would make
 * every caller handle an absence that `pick()` has already resolved.
 */

/**
 * One locale's wording, falling back to the default locale when the translation does not exist yet.
 *
 * The fallback is deliberate and narrow: it keeps an unpublished locale readable while it is being
 * translated, so a reviewer sees a Russian page with the untranslated lines still in English rather
 * than a build error. It never reaches a published locale, because `assertTranslated()` fails the
 * build for any locale in `INDEXABLE_LOCALES` that is missing a value.
 */
export function pick<T>(
  value: { en: T } & { [K in Exclude<Locale, 'en'>]?: NoInfer<T> | undefined },
  locale: Locale,
): T {
  const translated = (value as Record<string, T | undefined>)[locale];
  return translated ?? value[DEFAULT_LOCALE];
}

/**
 * Every published locale has every translatable value in a data file.
 *
 * Called at build time by the loaders in `src/utils/`. `label` identifies the file and `path` the
 * field, so the error names what to translate rather than that something is missing.
 */
export function assertTranslated(value: Localized<unknown>, label: string, path: string): void {
  for (const locale of INDEXABLE_LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (value[locale as Exclude<Locale, 'en'>] === undefined) {
      throw new Error(
        `${label}: ${path} has no ${locale} translation, but ${locale} is published. ` +
          `Translate it, or remove ${locale} from INDEXABLE_LOCALES until it is translated.`,
      );
    }
  }
}
