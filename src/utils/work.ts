import { getCollection, type CollectionEntry } from 'astro:content';
import type { Dictionary } from '../i18n/ui';
import { formatDuration, formatRange, type DurationWords, type RangeWords } from './dates';
import { assertLocale, localeHref, type Locale } from './i18n';

export type WorkEntry = CollectionEntry<'work'>;

/**
 * The URL slug of a work entry. It is the content file's name, and it is part of a live, indexed
 * URL: renaming a file renames a page that exists on the public internet, where GitHub Pages offers
 * no redirect. Reading it through one function makes that dependency findable.
 */
export function workSlug(entry: WorkEntry): string {
  return entry.id;
}

/** A work entry's href, ready for the browser: locale prefix and deployment base applied. */
export function workHref(entry: WorkEntry, locale: Locale): string {
  return localeHref(`/work/${workSlug(entry)}/`, locale);
}

/**
 * Work entries in publication order.
 *
 * Every locale currently reads the same collection, because the entries are not translated yet. The
 * parameter exists so that call sites are already locale-aware and the switch to per-locale content
 * is confined to this function; `assertLocale` keeps a route parameter from reaching it unchecked.
 */
export async function getWork(locale: Locale): Promise<WorkEntry[]> {
  assertLocale(locale);
  const entries = await getCollection('work');
  return entries.sort((a, b) => a.data.order - b.data.order);
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
