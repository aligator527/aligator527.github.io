#!/usr/bin/env node
/**
 * Locale and indexing contract for a built site.
 *
 * Version 1 is deliberately single-locale. The site is live and indexed, and the /ru/ and /ja/
 * locales are about to be added around the existing English routes; this script pins the facts that
 * must survive that work, so a regression surfaces as a failing build instead of as a Search
 * Console report weeks later.
 *
 * Checks:
 *   1. Every page and file in tests/fixtures/indexed-urls.json is still in the build, and every
 *      page is still in sitemap-0.xml. The fixture is a floor, not a whitelist: extra routes pass.
 *   2. Exactly one <link rel="canonical"> per page, absolute, and pointing at the page itself.
 *      Duplicate or cross-referencing canonicals are how localised sites lose pages from an index.
 *   3. No <meta http-equiv="refresh"> anywhere. Locale handling has to stay static and
 *      JavaScript-free; a meta refresh is a client-side redirect that costs both indexability and
 *      accessibility, and it is the first shortcut a language switcher reaches for.
 *   4. Nothing is served under /en/. English is the unprefixed default locale, so an `/en/...`
 *      document means the locale route started emitting a second URL for a page that is already
 *      indexed at its unprefixed path — duplicate content, and a silent one.
 *   5. A woff2 budget over dist/_astro, counted RECURSIVELY. Astro emits font files into
 *      _astro/fonts/, so a non-recursive glob matches nothing and would pass however many faces
 *      were added. Russian needs a second Cyrillic-capable family; this is the tripwire that makes
 *      the cost of that visible and deliberate rather than accidental.
 *   6. The per-document preload contract from ADR-0006: a page may preload only faces of the family
 *      it is actually set in. The repository budget in 5 counts files on disk, which says nothing
 *      about what a single page makes the browser fetch at high priority — and a locale page
 *      preloading a family it cannot render a word of is an LCP regression no other check sees.
 *
 * Usage: node scripts/check-i18n.mjs <dist-dir>   (BASE_PATH is honoured, as in check-links.mjs)
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, posix, relative, resolve, sep } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const base = process.env.BASE_PATH ?? '/';
const basePrefix = base.endsWith('/') ? base : `${base}/`;
const fixturePath = resolve(import.meta.dirname, '..', 'tests', 'fixtures', 'indexed-urls.json');

/*
 * Measured from the current build (`find dist/_astro -name '*.woff2' -printf '%s\n'`): 13 files,
 * 155572 bytes. Raised from 5 files / 80876 bytes by ADR-0006, and the increase breaks down as:
 *
 *   Instrument Sans latin 400/600/700   3 files   51280 bytes  (unchanged, English and Latin runs)
 *   IBM Plex Mono latin 400/500         2 files   29596 bytes  (unchanged)
 *   IBM Plex Mono cyrillic 400/500      2 files   16816 bytes  (new: translated metadata labels)
 *   Golos Text cyrillic 400/600/700     3 files   21208 bytes  (new: the Russian text face)
 *   Golos Text latin 400/600/700        3 files   36672 bytes  (new: Latin runs inside Russian)
 *
 * The six Golos files are on disk but referenced by no document until /ru/ is emitted, and the two
 * Cyrillic mono files have a Cyrillic unicode-range, so an English visitor still downloads exactly
 * the three Instrument Sans files and, if a page uses it, the Latin mono it did before.
 *
 * Raising these numbers is allowed; doing it without noticing is not. Re-measure and update both
 * values in the same commit that adds or removes a font face, and say in the message why.
 */
const FONT_BUDGET = { maxFiles: 13, maxBytes: 155_572 };

/*
 * Which family each locale may preload, per ADR-0006. English is set in Instrument Sans, Russian in
 * Golos Text, and Japanese in a system stack that downloads nothing — a preload there would be a
 * high-priority fetch for a face the page barely paints. `max` is a ceiling, not the current count.
 */
const PRELOAD_CONTRACT = {
  en: { families: ['Instrument Sans'], max: 3 },
  ru: { families: ['Golos Text'], max: 4 },
  ja: { families: [], max: 0 },
};

/** The locale a built document belongs to, from its path: `/ja/about/index.html` is Japanese. */
function localeOf(file) {
  return /(^|\/)(ru|ja)\//.exec(toPosix(file))?.[2] ?? 'en';
}

/* Google's Search Console verification file is 53 bytes of plain text, not an HTML document. */
const NOT_A_DOCUMENT = /(^|\/)google[^/]*\.html$/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return files.flat();
}

function toPosix(file) {
  return relative(dist, file).split(sep).join('/');
}

/*
 * Routes that are legitimately outside the sitemap while still being indexable documents: the error
 * document, which no sitemap lists, and the sections whose placeholder pages `astro.config.mjs`
 * filters out until they have entries.
 */
const PLACEHOLDER_ROUTES = [/(^|\/)404\.html$/, /(^|\/)lab\//, /(^|\/)notes\//];

function isPlaceholderRoute(file) {
  return PLACEHOLDER_ROUTES.some((pattern) => pattern.test(toPosix(file)));
}

/**
 * The route a built file is served as, which is what Astro used for its canonical URL.
 * `index.html` → `/`, `about/index.html` → `/about/`, and the error document `404.html` → `/404/`.
 */
function routeOf(file) {
  const rel = toPosix(file);
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.slice(0, -'.html'.length)}/`;
}

function absolute(origin, path) {
  return `${origin}${basePrefix}${path.replace(/^\/+/, '')}`;
}

const failures = [];
const fail = (message) => failures.push(message);

if (!existsSync(fixturePath)) {
  console.error(`Missing ${relative(process.cwd(), fixturePath)}; nothing to check against.`);
  process.exit(1);
}
const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));
const { origin, pages, files } = fixture;

// 1. The indexed-URL contract.
for (const page of pages) {
  const file = join(dist, page.replace(/^\/+/, ''), 'index.html');
  if (!existsSync(file))
    fail(`indexed page ${page} is not in the build (expected ${toPosix(file)})`);
}
for (const path of files) {
  const file = join(dist, path.replace(/^\/+/, ''));
  if (!existsSync(file) || !(await stat(file)).isFile()) {
    fail(`indexed file ${path} is not in the build`);
  }
}

const sitemapPath = join(dist, 'sitemap-0.xml');
let locs = null;
if (existsSync(sitemapPath)) {
  locs = new Set(
    [...(await readFile(sitemapPath, 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    ),
  );
  for (const page of pages) {
    const url = absolute(origin, page);
    if (!locs.has(url)) fail(`indexed page ${page} is missing from sitemap-0.xml (${url})`);
  }
} else {
  fail('sitemap-0.xml is not in the build');
}

// 2–3. Per-document checks.
const htmlFiles = (await walk(dist))
  .filter((file) => file.endsWith('.html'))
  .filter((file) => !NOT_A_DOCUMENT.test(toPosix(file)));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = toPosix(file);

  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map(
    (match) => match[1],
  );
  if (canonicals.length !== 1) {
    fail(`${name} has ${canonicals.length} <link rel="canonical">, expected exactly 1`);
  } else {
    const expected = absolute(origin, routeOf(file));
    if (canonicals[0] !== expected) {
      fail(`${name} canonical is "${canonicals[0]}", expected self-reference "${expected}"`);
    }
  }

  if (/<meta[^>]+http-equiv="refresh"/i.test(html)) {
    fail(`${name} contains <meta http-equiv="refresh">; redirects must not be client-side`);
  }

  /*
   * 2b. The page's own robots meta and the sitemap must agree. A locale is built before it is
   * published, so during a rollout half the build is deliberately `noindex` — the failure mode
   * worth catching is the two halves disagreeing: a page asking to be indexed while absent from the
   * sitemap, or listed in the sitemap while asking not to be. Both are how a localised site ends up
   * with pages Search Console reports as "Excluded by 'noindex' tag" after it was told to crawl
   * them. `isIndexable()` in src/utils/i18n.ts is the single source both sides are generated from.
   */
  if (locs) {
    const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
    const inSitemap = locs.has(absolute(origin, routeOf(file)));
    if (noindex && inSitemap) {
      fail(`${name} is noindex but is listed in sitemap-0.xml`);
    }
    if (!noindex && !inSitemap && !isPlaceholderRoute(file)) {
      fail(`${name} is indexable but missing from sitemap-0.xml`);
    }
  }
}

/*
 * 4. English must never gain a prefix. `localePath()` refuses to build an `/en/` URL and
 * `localeParam()` maps English to the `undefined` rest parameter; this is the same rule checked
 * against what was actually written to disk, which is what search engines see.
 */
for (const file of htmlFiles) {
  const route = routeOf(file);
  if (route === '/en/' || route.startsWith('/en/')) {
    fail(
      `${toPosix(file)} is served at ${route}; English is unprefixed and must stay at ${route.slice('/en'.length)}`,
    );
  }
}

// 5. Font budget, recursive on purpose.
const assets = join(dist, '_astro');
const fonts = existsSync(assets)
  ? (await walk(assets)).filter((file) => file.endsWith('.woff2'))
  : [];
const fontBytes = (await Promise.all(fonts.map(async (file) => (await stat(file)).size))).reduce(
  (total, size) => total + size,
  0,
);
if (fonts.length > FONT_BUDGET.maxFiles) {
  fail(`${fonts.length} woff2 file(s) in _astro, budget is ${FONT_BUDGET.maxFiles}`);
}
if (fontBytes > FONT_BUDGET.maxBytes) {
  fail(`${fontBytes} woff2 byte(s) in _astro, budget is ${FONT_BUDGET.maxBytes}`);
}

/*
 * 6. Per-document preloads. The font family names Astro emits carry a build hash
 * (`Instrument Sans-c05ce52b…`); the @font-face rules in the document itself are what maps a
 * preloaded file back to its family, so the check reads the page rather than guessing from config.
 */
const FAMILY_HASH = /-[\da-f]{16}$/;
let preloadCount = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = toPosix(file);
  const locale = localeOf(file);
  const contract = PRELOAD_CONTRACT[locale];

  const familyByUrl = new Map();
  for (const [, family, url] of html.matchAll(
    /@font-face\{font-family:"([^"]+)";src:url\("([^"]+)"\)/g,
  )) {
    familyByUrl.set(url, family.replace(FAMILY_HASH, ''));
  }

  const preloads = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].map(
    (match) => match[1],
  );
  preloadCount += preloads.length;

  if (preloads.length > contract.max) {
    fail(
      `${name} preloads ${preloads.length} font file(s); ${locale} may preload at most ${contract.max}`,
    );
  }
  for (const url of preloads) {
    const family = familyByUrl.get(url) ?? '(no @font-face in this document)';
    if (!contract.families.includes(family)) {
      fail(
        `${name} preloads ${family} — ${locale} pages are set in ` +
          `${contract.families.join(', ') || 'system fonts and preload nothing'}`,
      );
    }
  }
}

/*
 * 7. Structured data. Every JSON-LD block parses, declares a context, and — where it names a
 *    language — agrees with the document it sits in. A JSON-LD block is invisible on the page, so
 *    a syntax error or a stale language tag is the kind of defect nobody notices until Search
 *    Console reports the markup as unreadable. The shape is not validated here beyond that: the
 *    vocabulary is schema.org's business, not this script's.
 *
 *    The title and description budgets are PRINTED, never failed. A character cap enforced by a
 *    build is how "during the engagement" and "approximately" get cut out of a title, and those
 *    qualifiers are what `.ai/content/claims.md` makes load-bearing.
 */
const SEO_BUDGET = { title: { en: 60, ru: 60, ja: 30 }, description: { en: 160, ru: 160, ja: 90 } };
let jsonLdCount = 0;
const longMeta = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = toPosix(file);
  const locale = localeOf(file);

  for (const [, block] of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    jsonLdCount += 1;
    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch (error) {
      fail(`${name} has JSON-LD that does not parse: ${error.message}`);
      continue;
    }
    if (parsed['@context'] !== 'https://schema.org') {
      fail(`${name} has JSON-LD without a schema.org @context`);
    }
    for (const node of parsed['@graph'] ?? [parsed]) {
      if (node.inLanguage !== undefined && node.inLanguage !== locale) {
        fail(`${name} declares inLanguage "${node.inLanguage}" on a ${locale} page`);
      }
    }
  }

  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
  const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
  if (title.length > SEO_BUDGET.title[locale]) {
    longMeta.push(
      `${name} title is ${title.length} chars (${locale} budget ${SEO_BUDGET.title[locale]})`,
    );
  }
  if (description.length > SEO_BUDGET.description[locale]) {
    longMeta.push(
      `${name} description is ${description.length} chars (${locale} budget ${SEO_BUDGET.description[locale]})`,
    );
  }
}

console.log(
  `Checked ${htmlFiles.length} document(s) in ${posix.normalize(relative(process.cwd(), dist))} ` +
    `with base "${basePrefix}": ${pages.length} indexed page(s), ${files.length} indexed file(s), ` +
    `${fonts.length}/${FONT_BUDGET.maxFiles} woff2 file(s), ${fontBytes}/${FONT_BUDGET.maxBytes} font byte(s), ` +
    `${preloadCount} font preload(s) across all documents, ${jsonLdCount} JSON-LD block(s).`,
);
if (longMeta.length > 0) {
  console.warn(`\n${longMeta.length} title(s)/description(s) over the search-result budget:`);
  for (const item of longMeta) console.warn(`  ${item}`);
  console.warn('  Not a failure: shortening these is an editorial decision, not a build rule.');
}
if (failures.length > 0) {
  console.error(`\n${failures.length} i18n/indexing contract failure(s):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log('Indexing and locale contract holds.');
