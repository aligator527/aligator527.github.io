import { getCollection, type CollectionEntry } from 'astro:content';
import { assertTranslated, pick } from './localized';
import { assertLocale, type Locale } from './i18n';

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
