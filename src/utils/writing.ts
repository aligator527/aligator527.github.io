import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, EMITTED_LOCALES, assertLocale, localeHref, type Locale } from './i18n';

/**
 * Notes and Lab: two collections with the same localisation shape as `work`, and the same reason
 * for it. One file per locale per entry, the slug shared across locales, and the facts asserted
 * identical between translations — see `src/utils/work.ts`, which this mirrors deliberately rather
 * than abstracting, because the three collections differ in exactly which fields are facts.
 */

export type NoteEntry = CollectionEntry<'notes'>;
export type LabEntry = CollectionEntry<'lab'>;

/**
 * The URL slug of an entry: the content file's basename, never translated. `/notes/x/` and
 * `/ru/notes/x/` are a translation pair because they share it — ADR-0005 rejected translated slugs.
 */
function slugOf(id: string, collection: string): string {
  const name = id.split('/').pop();
  if (!name) throw new Error(`${collection} entry "${id}" has no slug`);
  return name;
}

export function noteSlug(entry: NoteEntry): string {
  return slugOf(entry.id, 'notes');
}

export function labSlug(entry: LabEntry): string {
  return slugOf(entry.id, 'lab');
}

export function noteHref(entry: NoteEntry, locale: Locale): string {
  return localeHref(`/notes/${noteSlug(entry)}/`, locale);
}

export function labHref(entry: LabEntry, locale: Locale): string {
  return localeHref(`/lab/${labSlug(entry)}/`, locale);
}

/**
 * A Lab entry has a page of its own when it has a body. That has to be the same answer in every
 * locale: `localesFor()` advertises a translation of every entry page, so a body present in one
 * language and absent in another is an `hreflang` pointing at a page that was never built.
 */
export function hasPage(entry: LabEntry): boolean {
  return Boolean(entry.body?.trim());
}

/**
 * Facts, as opposed to wording. A translation that disagrees about one of these is not a
 * translation but a second claim — `.ai/content/claims.md` applies to it in full.
 */
const NOTE_INVARIANTS = [
  'publishedAt',
  'updatedAt',
  'draft',
] as const satisfies readonly (keyof NoteEntry['data'])[];

const LAB_INVARIANTS = [
  'code',
  'status',
  'technologies',
  'repository',
  'demo',
  'date',
  'featured',
] as const satisfies readonly (keyof LabEntry['data'])[];

interface Translatable {
  id: string;
  data: { locale: Locale } & Record<string, unknown>;
}

/**
 * Every translation agrees with the default locale about the facts, and every entry exists in
 * every locale. The second half matters as much as the first: nothing here knows, per entry, which
 * locales it was translated into, so a missing translation is a link to a page that does not exist.
 */
function assertParity<T extends Translatable>(
  collection: string,
  entries: T[],
  invariants: readonly string[],
  extra?: (source: T, entry: T) => string | undefined,
): void {
  const bySlug = new Map<string, Map<Locale, T>>();
  for (const entry of entries) {
    const slug = slugOf(entry.id, collection);
    if (!bySlug.has(slug)) bySlug.set(slug, new Map());
    bySlug.get(slug)!.set(entry.data.locale, entry);
  }

  const problems: string[] = [];
  for (const [slug, translations] of bySlug) {
    const source = translations.get(DEFAULT_LOCALE);
    if (!source) {
      problems.push(`${collection}/${slug} has no ${DEFAULT_LOCALE} entry to translate from`);
      continue;
    }
    for (const locale of EMITTED_LOCALES) {
      if (locale === DEFAULT_LOCALE) continue;
      const entry = translations.get(locale);
      if (!entry) {
        problems.push(`${collection}/${slug} is missing its ${locale} translation`);
        continue;
      }
      for (const field of invariants) {
        const expected = JSON.stringify(source.data[field] ?? null);
        const actual = JSON.stringify(entry.data[field] ?? null);
        if (expected !== actual) {
          problems.push(
            `${collection}/${locale}/${slug}: ${field} is ${actual}, ${DEFAULT_LOCALE} says ${expected}`,
          );
        }
      }
      const problem = extra?.(source, entry);
      if (problem) problems.push(`${collection}/${locale}/${slug}: ${problem}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `${collection} translations disagree with ${DEFAULT_LOCALE}:\n  ${problems.join('\n  ')}`,
    );
  }
}

/**
 * A figure's shape, as a string to compare: how many rows, how many steps in each, and whether a
 * row has a way back. The wording is the translation's own; the structure is the claim.
 */
function figureShape(figure: NoteEntry['data']['figure']): string {
  if (!figure) return 'none';
  if (figure.kind === 'layers') {
    // The prefix is part of the shape: layer IDs are a coordinate system, and one that changes
    // per locale is not one.
    return `layers:${figure.variant}:${figure.prefix ?? 'L'}:${figure.layers
      .map((layer) => layer.items.length)
      .join(',')}`;
  }
  return `steps:${figure.rows
    .map((row) => `${row.steps.length}${row.back ? '+back' : ''}${row.point ? '+point' : ''}`)
    .join(',')}`;
}

/** Published notes for one locale, newest first. */
export async function getNotes(locale: Locale): Promise<NoteEntry[]> {
  assertLocale(locale);
  const entries = await getCollection('notes');
  assertParity('notes', entries, NOTE_INVARIANTS, (source, entry) => {
    if (source.data.topics.length !== entry.data.topics.length) {
      return `has ${entry.data.topics.length} topic(s), ${DEFAULT_LOCALE} has ${source.data.topics.length}`;
    }
    return figureShape(source.data.figure) === figureShape(entry.data.figure)
      ? undefined
      : `figure is ${figureShape(entry.data.figure)}, ${DEFAULT_LOCALE} has ${figureShape(source.data.figure)}`;
  });
  return entries
    .filter((entry) => entry.data.locale === locale && !entry.data.draft)
    .sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt));
}

/** Lab entries for one locale, newest first. */
export async function getLab(locale: Locale): Promise<LabEntry[]> {
  assertLocale(locale);
  const entries = await getCollection('lab');
  assertParity('lab', entries, LAB_INVARIANTS, (source, entry) =>
    hasPage(source) === hasPage(entry)
      ? undefined
      : `${hasPage(entry) ? 'has' : 'has no'} body, ${DEFAULT_LOCALE} ${hasPage(source) ? 'has' : 'has not'}`,
  );
  return entries
    .filter((entry) => entry.data.locale === locale)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
}
