import { getCollection, type CollectionEntry } from 'astro:content';
import { assertTranslated, pick } from './localized';
import { assertLocale, type Locale } from './i18n';
import { noteSlug } from './writing';
import { workSlug } from './work';

export type ServiceEntry = CollectionEntry<'services'>;

/** One engagement, flattened to the locale being rendered. */
export interface Service {
  id: string;
  code: string;
  title: string;
  problem: string;
  work: string;
  deliverable: string;
  duration: string;
  /** A floor in JPY, excluding consumption tax. */
  priceFrom: number;
  evidence: ServiceEntry['data']['evidence'];
}

const TRANSLATABLE = ['title', 'problem', 'work', 'deliverable', 'duration'] as const;

/**
 * Published engagements for one locale, in order.
 *
 * `published: false` keeps a draft offer out of the site without deleting it, the same way
 * `approved` works for principles: an offer that has not been thought through is a promise, and
 * this page is the one place on the site that makes them.
 */
export async function getServices(locale: Locale): Promise<Service[]> {
  assertLocale(locale);
  const entries = (await getCollection('services', ({ data }) => data.published)).sort(
    (a, b) => a.data.order - b.data.order,
  );
  await assertEvidenceResolves(entries);

  return entries.map((entry) => {
    for (const field of TRANSLATABLE) {
      assertTranslated(entry.data[field], `services/${entry.id}`, field);
    }
    return {
      id: entry.id,
      code: entry.data.code,
      title: pick(entry.data.title, locale),
      problem: pick(entry.data.problem, locale),
      work: pick(entry.data.work, locale),
      deliverable: pick(entry.data.deliverable, locale),
      duration: pick(entry.data.duration, locale),
      priceFrom: entry.data.priceFrom,
      evidence: entry.data.evidence,
    };
  });
}

/**
 * Evidence that names nothing renders as no evidence at all: the offer quietly loses the thing
 * that makes it credible, and the note quietly loses its way back. A mistyped slug is invisible on
 * the page it breaks, so it fails the build instead.
 */
async function assertEvidenceResolves(entries: ServiceEntry[]): Promise<void> {
  const [notes, work] = await Promise.all([getCollection('notes'), getCollection('work')]);
  const known = { note: new Set(notes.map(noteSlug)), work: new Set(work.map(workSlug)) };

  for (const entry of entries) {
    for (const kind of ['note', 'work'] as const) {
      const slug = entry.data.evidence[kind];
      if (slug && !known[kind].has(slug)) {
        throw new Error(`services/${entry.id}: evidence.${kind} "${slug}" names no ${kind} entry`);
      }
    }
  }
}

/**
 * The engagement a note is evidence for, if there is one.
 *
 * The pairing is declared once, on the engagement, and read backwards here. A `service:` field in
 * note frontmatter would be the other way round, and would let a note advertise an engagement the
 * services page does not offer — a promise nobody priced.
 */
export async function serviceForNote(slug: string, locale: Locale): Promise<Service | undefined> {
  const services = await getServices(locale);
  return services.find((service) => service.evidence.note === slug);
}
