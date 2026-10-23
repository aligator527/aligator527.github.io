import { readFileSync, readdirSync } from 'node:fs';
import { logicalPath } from './i18n';

/**
 * `lastmod` for the sitemap, taken from content rather than from the build clock.
 *
 * A sitemap of 54 URLs with no dates asks a crawler to work out for itself which pages are worth
 * fetching again. A sitemap where every URL claims to have changed at build time answers that
 * question dishonestly, and a `lastmod` that search engines learn to distrust is worth less than
 * none — so only pages with a real content date get one, and the rest are left without.
 *
 * Read from the default locale's files, once, at config load: translations of an entry are
 * published together and share its date, which `src/utils/writing.ts` asserts.
 */

const DATE_FIELD = { notes: 'publishedAt', lab: 'date' } as const;

type Collection = keyof typeof DATE_FIELD;

function frontmatterDate(text: string, field: string): string | undefined {
  // `updatedAt` wins when present: it is what the page's own date means to a reader.
  const updated = /^updatedAt:\s*'?(\d{4}-\d{2}-\d{2})/m.exec(text)?.[1];
  if (updated) return updated;
  return new RegExp(`^${field}:\\s*'?(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(text)?.[1];
}

function datesFor(collection: Collection): Map<string, string> {
  const dir = new URL(`../content/${collection}/en/`, import.meta.url);
  const dates = new Map<string, string>();
  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const text = readFileSync(new URL(file, dir), 'utf8');
    if (/^draft:\s*true\s*$/m.test(text)) continue;
    const date = frontmatterDate(text, DATE_FIELD[collection]);
    if (date) dates.set(file.replace(/\.mdx?$/, ''), date);
  }
  return dates;
}

function buildIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const collection of Object.keys(DATE_FIELD) as Collection[]) {
    const dates = datesFor(collection);
    for (const [slug, date] of dates) index.set(`/${collection}/${slug}/`, date);
    // A section index changes when a section gains an entry, so its newest entry is its date.
    const newest = [...dates.values()].sort().pop();
    if (newest) index.set(`/${collection}/`, newest);
  }
  return index;
}

const LASTMOD = buildIndex();

/**
 * The `lastmod` for a built URL, or `undefined` for the pages that have no defensible date:
 * the home page, About, Experience, the résumé, and the work entries, whose frontmatter dates
 * describe when an engagement ran rather than when the page last changed.
 */
export function lastmodFor(pathname: string, base: string): string | undefined {
  return LASTMOD.get(logicalPath(pathname, base));
}
