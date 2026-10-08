import { getCollection, type CollectionEntry } from 'astro:content';
import type { Dictionary } from '../i18n/ui';
import { formatDuration, formatRange, type DurationWords, type RangeWords } from './dates';
import { DEFAULT_LOCALE, assertLocale, localeHref, type Locale } from './i18n';

export type WorkEntry = CollectionEntry<'work'>;

/**
 * The URL slug of a work entry. It is the content file's name, and it is part of a live, indexed
 * URL: renaming a file renames a page that exists on the public internet, where GitHub Pages offers
 * no redirect. Reading it through one function makes that dependency findable.
 */
export function workSlug(entry: WorkEntry): string {
  // The id is the path under the collection root, so a translated file is `ru/packaging-saas`.
  // The slug is the basename: every locale serves the same project at the same slug, which is what
  // makes `/work/x/` and `/ru/work/x/` a translation pair rather than two unrelated pages.
  const name = entry.id.split('/').pop();
  if (!name) throw new Error(`work entry "${entry.id}" has no slug`);
  return name;
}

/** A work entry's href, ready for the browser: locale prefix and deployment base applied. */
export function workHref(entry: WorkEntry, locale: Locale): string {
  return localeHref(`/work/${workSlug(entry)}/`, locale);
}

/**
 * Fields that are facts about the project rather than about its description, so every translation
 * of an entry must carry them identically. A Russian file that says a different team size, ships a
 * different diagram shape or claims a different depth is not a translation — it is a second,
 * divergent claim about the same engagement, which `.ai/content/claims.md` does not allow.
 */
const INVARIANT_FIELDS = [
  'code',
  'order',
  'startDate',
  'endDate',
  'status',
  'featured',
  'capabilities',
  'technologies',
  'publicVisibility',
  'depth',
  'heroVariant',
  'engagementType',
] as const satisfies readonly (keyof WorkEntry['data'])[];

/**
 * Every translation of every entry agrees with the default locale about the facts.
 *
 * Runs at build time, once, inside `getWork()`. A mismatch throws rather than warns: a divergent
 * fact in one language is the failure this whole per-locale content model exists to make visible,
 * and a warning in a build log is not visible.
 */
function assertWorkParity(entries: WorkEntry[]): void {
  const byLocale = new Map<string, Map<Locale, WorkEntry>>();
  for (const entry of entries) {
    const slug = workSlug(entry);
    if (!byLocale.has(slug)) byLocale.set(slug, new Map());
    byLocale.get(slug)!.set(entry.data.locale, entry);
  }

  const problems: string[] = [];
  for (const [slug, translations] of byLocale) {
    const source = translations.get(DEFAULT_LOCALE);
    if (!source) {
      problems.push(`work/${slug} has no ${DEFAULT_LOCALE} entry to translate from`);
      continue;
    }
    for (const [locale, entry] of translations) {
      if (locale === DEFAULT_LOCALE) continue;
      for (const field of INVARIANT_FIELDS) {
        const expected = JSON.stringify(source.data[field] ?? null);
        const actual = JSON.stringify(entry.data[field] ?? null);
        if (expected !== actual) {
          problems.push(
            `work/${locale}/${slug}: ${field} is ${actual}, ${DEFAULT_LOCALE} says ${expected}`,
          );
        }
      }
      const sourceLayers = source.data.diagram.layers.length;
      const entryLayers = entry.data.diagram.layers.length;
      if (sourceLayers !== entryLayers) {
        problems.push(
          `work/${locale}/${slug}: diagram has ${entryLayers} layer(s), ${DEFAULT_LOCALE} has ${sourceLayers}`,
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Work translations disagree with ${DEFAULT_LOCALE}:\n  ${problems.join('\n  ')}`,
    );
  }
}

/**
 * Work entries for one locale, in publication order.
 *
 * Entries live one file per locale under `src/content/work/<locale>/`. A locale with no translation
 * of an entry simply has fewer entries — it never falls back to another language, because a page
 * that silently serves English under a Russian URL is the duplicate-content problem the locale
 * routing exists to avoid.
 */
export async function getWork(locale: Locale): Promise<WorkEntry[]> {
  assertLocale(locale);
  const entries = await getCollection('work');
  assertWorkParity(entries);
  return entries
    .filter((entry) => entry.data.locale === locale)
    .sort((a, b) => a.data.order - b.data.order);
}

/** Work entries by slug, for resolving references such as `roles.yaml`'s `work:` field. */
export async function getWorkIndex(locale: Locale): Promise<Map<string, WorkEntry>> {
  const entries = await getWork(locale);
  return new Map(entries.map((entry) => [workSlug(entry), entry]));
}

/*
 * The three label lookups below index dictionary records with the content-schema enums. If a status,
 * depth or engagement type is added in `src/content.config.ts` without a matching label in every
 * dictionary, `astro check` fails here instead of the site rendering a blank label.
 */

export function statusLabel(t: Dictionary, status: WorkEntry['data']['status']): string {
  return t.workStatus[status];
}

/** How much of an engagement is published: a brief states facts; a case study adds reasoning. */
export function depthLabel(t: Dictionary, depth: WorkEntry['data']['depth']): string {
  return t.workDepth[depth];
}

/** Call to action matching the published depth, e.g. `Read the brief`. */
export function readLabel(t: Dictionary, depth: WorkEntry['data']['depth']): string {
  return t.workRead[depth];
}

export function engagementLabel(
  t: Dictionary,
  engagement: NonNullable<WorkEntry['data']['engagementType']>,
): string {
  return t.engagement[engagement];
}

export function workPeriod(
  entry: WorkEntry,
  now: string,
  words: RangeWords & DurationWords,
): { range: string; duration: string } {
  const { startDate, endDate } = entry.data;
  return {
    range: formatRange(startDate, endDate, words),
    duration: formatDuration(startDate, endDate ?? now, words),
  };
}
