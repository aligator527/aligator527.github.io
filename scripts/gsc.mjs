#!/usr/bin/env node
/**
 * Reads Search Console's Search Analytics for this site.
 *
 * The API is free and needs no third-party service. Access is a Google Cloud service account that
 * has been added as a user on the Search Console property; the account's JSON key stays outside
 * this repository — the repository is public — and is named by `GSC_KEY`.
 *
 * There is no dependency here because a service-account grant is a signed JWT exchanged for a
 * token, and `node:crypto` signs RS256. The Google client libraries are several megabytes to do
 * exactly this.
 *
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs --sites        # what the account can read
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs                # queries, last 28 days
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs --dim page
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs --dim query,page --days 90 --limit 50
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs --filter country=usa
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs --json         # raw rows
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs --inspect      # index status of every page
 *   GSC_KEY=~/.gsc-key.json node scripts/gsc.mjs --inspect https://…/services/
 *
 * `--inspect` answers what Search Analytics cannot. A page with no impressions may be ranking for
 * nothing, or may never have been fetched at all; those are different problems with different
 * remedies, and only URL Inspection tells them apart. With no arguments it walks the sitemap.
 *
 * Every analytics run prints the totals beside the sum of the rows. Google withholds rare queries from the
 * query dimension but keeps them in the totals, so on a site this size most of the clicks can sit
 * outside the table — reading the table as if it were the whole period is how you conclude that
 * only your own name converts.
 */
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { argv, env, exit } from 'node:process';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://searchconsole.googleapis.com/webmasters/v3';
const INSPECT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

/** Which options take a value. Guessing from the next argument instead would swallow the URLs. */
const VALUED = new Set(['days', 'dim', 'limit', 'filter', 'site']);

/** `--days 90`, `--dim query,page`, `--filter country=usa`; bare `--sites`, `--json`, `--inspect`. */
function options(args) {
  const opts = { flags: new Set(), rest: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      opts.rest.push(arg);
      continue;
    }
    const name = arg.slice(2);
    if (VALUED.has(name)) {
      opts[name] = args[i + 1];
      i += 1;
    } else {
      opts.flags.add(name);
    }
  }
  return opts;
}

const opts = options(argv.slice(2));
const SITE = opts.site ?? env.GSC_SITE ?? 'https://aligator527.github.io/';
const days = Number(opts.days ?? 28);
const dimensions = (opts.dim ?? 'query').split(',').filter(Boolean);
const rowLimit = Number(opts.limit ?? 25);

/** GSC is ~2 days behind, so a window ending today is a window with two empty days in it. */
function windowOf(count) {
  const end = new Date(Date.now() - 2 * 86_400_000);
  const start = new Date(end.getTime() - (count - 1) * 86_400_000);
  const iso = (date) => date.toISOString().slice(0, 10);
  return { startDate: iso(start), endDate: iso(end) };
}

function keyFile() {
  const path = env.GSC_KEY;
  if (!path) {
    console.error('GSC_KEY is not set. It is the path to the service account JSON key.');
    console.error('Setup: console.cloud.google.com -> enable the Search Console API -> create a');
    console.error('service account -> add its email as a user on the Search Console property.');
    exit(1);
  }
  const resolved = path.startsWith('~') ? path.replace('~', homedir()) : path;
  try {
    return JSON.parse(readFileSync(resolved, 'utf8'));
  } catch (error) {
    console.error(`Could not read ${resolved}: ${error.message}`);
    exit(1);
  }
}

const base64url = (value) => Buffer.from(value).toString('base64url');

/** The service-account grant: a JWT signed with the key, traded for an access token. */
async function accessToken({ client_email, private_key }) {
  if (!client_email || !private_key) {
    console.error('That JSON has no client_email/private_key, so it is not a service account key.');
    console.error(
      'Download it from the service account itself (Keys -> Add key -> JSON), not from',
    );
    console.error('Credentials -> OAuth client, which produces a different file.');
    exit(1);
  }
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64url(
    JSON.stringify(claim),
  )}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  let assertion;
  try {
    assertion = `${unsigned}.${signer.sign(private_key).toString('base64url')}`;
  } catch (error) {
    console.error(`The private_key in that JSON cannot sign: ${error.message}`);
    exit(1);
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const body = await response.json();
  if (!response.ok) {
    console.error(`Token request failed: ${response.status} ${JSON.stringify(body)}`);
    exit(1);
  }
  return body.access_token;
}

async function call(path, token, payload) {
  const response = await fetch(`${API}${path}`, {
    method: payload ? 'POST' : 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      ...(payload ? { 'content-type': 'application/json' } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`${response.status} ${JSON.stringify(body)}`);
    if (response.status === 403) {
      console.error(`\nThe service account cannot read ${SITE}. Add its email as a user on the`);
      console.error('property in Search Console, or set GSC_SITE to a property it can read.');
      console.error('`--sites` lists what it has.');
    }
    exit(1);
  }
  return body;
}

/** Kana and kanji occupy two terminal cells, and a query table is half Japanese. */
const width = (text) =>
  [...text].reduce(
    (total, char) => total + (/[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹯＀-｠￠-￦]/.test(char) ? 2 : 1),
    0,
  );

const pad = (text, size) => text + ' '.repeat(Math.max(0, size - width(text)));

const token = await accessToken(keyFile());

if (opts.flags.has('sites')) {
  const { siteEntry = [] } = await call('/sites', token);
  if (siteEntry.length === 0) console.log('No properties. The service account was not added yet.');
  for (const site of siteEntry) console.log(`${pad(site.permissionLevel, 22)} ${site.siteUrl}`);
  exit(0);
}

/**
 * Four at a time: the quota is thousands a day, but a sitemap walk is dozens of calls and running
 * them all at once is how a free endpoint starts returning 429 instead of answers.
 */
async function inspectAll(urls, token) {
  const verdicts = new Map();
  let cursor = 0;
  const worker = async () => {
    while (cursor < urls.length) {
      const url = urls[cursor];
      cursor += 1;
      const response = await fetch(INSPECT, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        verdicts.set(url, { state: `HTTP ${response.status}`, crawled: '-' });
        continue;
      }
      const status = body.inspectionResult?.indexStatusResult ?? {};
      verdicts.set(url, {
        state: status.coverageState ?? 'no result',
        crawled: status.lastCrawlTime?.slice(0, 10) ?? 'never',
      });
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, urls.length) }, worker));
  return verdicts;
}

/** Every page the site advertises, so a bare `--inspect` audits what the sitemap claims exists. */
async function sitemapUrls() {
  const locs = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Could not read ${url}: ${response.status}`);
      exit(1);
    }
    return [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  };
  const index = await locs(new URL('sitemap-index.xml', SITE).href);
  // A sitemap index lists sitemaps; a plain sitemap lists pages. Accept either.
  if (!index.every((loc) => loc.endsWith('.xml'))) return [...new Set(index)].sort();
  const pages = await Promise.all(index.map(locs));
  return [...new Set(pages.flat())].sort();
}

if (opts.flags.has('inspect')) {
  const urls = opts.rest.length > 0 ? opts.rest : await sitemapUrls();
  console.log(`${urls.length} URL(s) against ${SITE}\n`);
  const verdicts = await inspectAll(urls, token);
  const short = (url) => url.replace(SITE, '/');
  const column = Math.max(...urls.map((url) => short(url).length));

  const groups = new Map();
  for (const url of urls) {
    const { state, crawled } = verdicts.get(url);
    console.log(`${pad(short(url), column)}  ${pad(crawled, 11)} ${state}`);
    groups.set(state, [...(groups.get(state) ?? []), url]);
  }

  console.log();
  const bySize = [...groups].sort((a, b) => b[1].length - a[1].length);
  for (const [state, members] of bySize)
    console.log(`${String(members.length).padStart(4)}  ${state}`);

  // "Indexed, not submitted in sitemap" is fine; "unknown" and "currently not indexed" are not.
  const trouble = bySize.filter(
    ([state]) =>
      !state.toLowerCase().includes('indexed') || state.toLowerCase().includes('not indexed'),
  );
  if (trouble.length > 0) {
    for (const [state, members] of trouble) {
      console.log(`\n${state}:`);
      for (const url of members) console.log(`  ${url}`);
    }
    console.log('\nThere is no API for requesting indexing of an ordinary page — the Indexing API');
    console.log('covers job postings and broadcasts only. Paste these into the Search Console');
    console.log('inspection bar and use Request indexing.');
  }
  exit(0);
}

const period = windowOf(days);
const filters = opts.filter
  ? [
      {
        filters: [
          {
            dimension: opts.filter.split('=')[0],
            operator: 'equals',
            expression: opts.filter.split('=').slice(1).join('='),
          },
        ],
      },
    ]
  : undefined;

const query = (dims, limit) =>
  call(`/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, token, {
    ...period,
    dimensions: dims,
    rowLimit: limit,
    dataState: 'all',
    ...(filters ? { dimensionFilterGroups: filters } : {}),
  });

const [{ rows = [] }, { rows: totalRows = [] }] = await Promise.all([
  query(dimensions, rowLimit),
  query([], 1),
]);

if (opts.flags.has('json')) {
  console.log(
    JSON.stringify({ site: SITE, ...period, dimensions, rows, totals: totalRows[0] }, null, 2),
  );
  exit(0);
}

console.log(`${SITE}  ${period.startDate} .. ${period.endDate}  (${days} days)`);
if (opts.filter) console.log(`filter ${opts.filter}`);
console.log();

const label = (row) => row.keys.join('  ');
const labelWidth = Math.min(78, Math.max(20, ...rows.map((row) => width(label(row)))));
const number = (value, size) => String(value).padStart(size);

console.log(
  `${pad(dimensions.join(' + '), labelWidth)}  ${'clicks'.padStart(7)} ${'impr'.padStart(7)} ${'ctr'.padStart(7)} ${'pos'.padStart(6)}`,
);
for (const row of rows) {
  const text = label(row);
  const shown = width(text) > labelWidth ? `${[...text].slice(0, labelWidth - 1).join('')}…` : text;
  console.log(
    `${pad(shown, labelWidth)}  ${number(row.clicks, 7)} ${number(row.impressions, 7)} ${`${(row.ctr * 100).toFixed(1)}%`.padStart(7)} ${row.position.toFixed(1).padStart(6)}`,
  );
}

const totals = totalRows[0];
if (!totals) exit(0);

const sum = (field) => rows.reduce((total, row) => total + row[field], 0);
const share = (part, whole) => (whole === 0 ? 0 : Math.round((part / whole) * 100));

console.log();
console.log(`rows    ${number(sum('clicks'), 7)} ${number(sum('impressions'), 7)}`);
console.log(
  `total   ${number(totals.clicks, 7)} ${number(totals.impressions, 7)}   ctr ${(totals.ctr * 100).toFixed(1)}%  pos ${totals.position.toFixed(1)}`,
);

const hiddenClicks = totals.clicks - sum('clicks');
const hiddenImpressions = totals.impressions - sum('impressions');
if (hiddenClicks > 0 || hiddenImpressions > 0) {
  console.log();
  console.log(
    `${hiddenClicks} click(s) and ${hiddenImpressions} impression(s) are outside these rows ` +
      `(${share(sum('clicks'), totals.clicks)}% of clicks shown).`,
  );
  if (dimensions.includes('query')) {
    console.log('Rare queries are withheld from the query dimension but counted in the totals.');
  } else if (rows.length >= rowLimit) {
    console.log(`Raise --limit; it is ${rowLimit}.`);
  }
}
