#!/usr/bin/env node
/**
 * Tells the IndexNow search engines — Bing, Yandex, Seznam, Naver, Yep — which pages changed.
 * Google does not participate and has no equivalent API, so Google is reached through the sitemap
 * and, a handful of URLs at a time, the Request Indexing button in Search Console.
 *
 * Run after a deployment. It reads the LIVE sitemap rather than a local build, so it can only
 * notify about pages that are actually published, and a failed deploy cannot announce a page that
 * does not exist.
 *
 * What it submits: the URLs whose `lastmod` is within `--days` (default 7). The protocol asks for
 * changed pages rather than whole sites, and `src/utils/sitemap-dates.ts` only dates pages that
 * have a real content date — so a new note is announced, and the home page is never announced by
 * this script at all. `--all` overrides that and submits every URL in the sitemap, which is for
 * the deploy that changes the whole site: a layout, the type system, the dictionaries.
 *
 *   node scripts/indexnow.mjs                  # pages dated within the last 7 days
 *   node scripts/indexnow.mjs --days 1         # today's
 *   node scripts/indexnow.mjs --all            # everything in the sitemap
 *   node scripts/indexnow.mjs --dry-run        # print what would be sent
 */
import { readdirSync } from 'node:fs';
import { argv, exit } from 'node:process';

const SITE = 'https://aligator527.github.io';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const KEY_DIR = new URL('../public/', import.meta.url);

const flags = new Set(argv.slice(2).filter((arg) => arg.startsWith('--')));
const days = Number(argv[argv.indexOf('--days') + 1]) || 7;
const dryRun = flags.has('--dry-run');
const all = flags.has('--all');

/**
 * The key is the name of the file that proves ownership of the host, so the file is the single
 * source of truth for it. It is public by design — hosting it is the whole verification — which
 * is why this needs no secret.
 */
function readKey() {
  const keys = readdirSync(KEY_DIR).filter((file) => /^[0-9a-f]{32}\.txt$/.test(file));
  if (keys.length !== 1) {
    throw new Error(
      `expected exactly one IndexNow key file in public/, found ${keys.length}: ${keys.join(', ')}`,
    );
  }
  return keys[0].replace(/\.txt$/, '');
}

async function readSitemap() {
  // Run straight after a deployment, the new sitemap can take a few seconds to be served.
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(`${SITE}/sitemap-0.xml`, { cache: 'no-store' });
    if (response.ok) break;
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  if (!response?.ok) throw new Error(`sitemap-0.xml returned ${response?.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map(
    (match) => ({ url: match[1], lastmod: match[2] }),
  );
}

const key = readKey();
const entries = await readSitemap();
const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
const urls = all
  ? entries.map((entry) => entry.url)
  : entries
      .filter((entry) => entry.lastmod && Date.parse(entry.lastmod) >= cutoff)
      .map((entry) => entry.url);

const scope = all ? 'submitting all of them' : `${urls.length} dated within ${days} day(s)`;
console.log(`${entries.length} URL(s) in the sitemap, ${scope}.`);

if (urls.length === 0) {
  console.log('Nothing to submit. IndexNow is for changed pages, so this is a success.');
  exit(0);
}

for (const url of urls) console.log(`  ${url}`);

if (dryRun) {
  console.log('\n--dry-run: not submitting.');
  exit(0);
}

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList: urls,
  }),
});

const body = (await response.text()).trim();

/*
 * 200 is accepted, 202 is accepted with the key still being validated. Anything else is a real
 * failure and should be loud: 403 means the key file stopped being served, 422 that a URL does not
 * belong to the host. None of it affects the deployment, which has already succeeded by now.
 */
if (response.status !== 200 && response.status !== 202) {
  console.error(`IndexNow returned ${response.status}${body ? `: ${body}` : ''}`);
  exit(1);
}

console.log(
  `\nIndexNow accepted ${urls.length} URL(s) (HTTP ${response.status}). Accepted is not crawled.`,
);
