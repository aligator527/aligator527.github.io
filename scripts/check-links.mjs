#!/usr/bin/env node
/**
 * Verifies that every internal href and asset reference in a built site resolves to a file.
 * Catches base-path mistakes that only appear when the site is served from a subpath.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, posix, relative, resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const base = process.env.BASE_PATH ?? '/';
const basePrefix = base.endsWith('/') ? base : `${base}/`;

/**
 * The built `robots.txt` ends with `Sitemap: <site><base>sitemap-index.xml`, produced from the
 * configured `site` plus `withBase()`. It is therefore the one artefact in the output that encodes
 * both the production origin and the base the site was actually built for, without this script
 * having to re-read astro.config.mjs or trust an environment variable on its own.
 */
async function readSiteFromRobots() {
  const robots = join(dist, 'robots.txt');
  if (!existsSync(robots)) {
    throw new Error(
      `${relative(process.cwd(), robots)} is missing; cannot derive the site origin.`,
    );
  }
  const line = (await readFile(robots, 'utf8')).match(/^Sitemap:\s*(\S+)$/m);
  if (!line) throw new Error(`No "Sitemap:" line in ${relative(process.cwd(), robots)}.`);
  const sitemap = new URL(line[1]);
  const derivedBase = sitemap.pathname.replace(/sitemap-index\.xml$/, '');
  return { origin: sitemap.origin, base: derivedBase };
}

const site = await readSiteFromRobots();

/**
 * Absolute URLs used to be skipped wholesale, which meant `<link rel="canonical">` and `og:url`
 * were never checked at all — the two references most likely to point at a stale path. Ones on our
 * own origin are internal references and resolve like any other. Genuinely external URLs stay
 * skipped: confirming them would need a network request, which this check deliberately avoids.
 */
function internalPathOf(url) {
  let parsed;
  try {
    parsed = new URL(url, site.origin);
  } catch {
    return null;
  }
  if (parsed.origin !== site.origin) return null;
  return `${parsed.pathname}${parsed.hash}`;
}

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

/*
 * Astro emits the error page as `404.html`, which is the file GitHub Pages serves as the error
 * document, while the route it was built from — and therefore its own canonical URL — is `/404/`.
 * That single path resolves to a file rather than to a directory by design; nothing else may.
 */
const errorDocumentRoute = `${basePrefix}404/`;

function resolveTarget(url, fromFile) {
  const [path] = url.split('#');
  if (!path) return null;
  if (path.startsWith('/')) {
    if (!path.startsWith(basePrefix)) return { path, reason: `missing base prefix ${basePrefix}` };
    if (path === errorDocumentRoute) return { path, file: join(dist, '404.html') };
    return { path, file: join(dist, path.slice(basePrefix.length)) };
  }
  const dir = fromFile.replace(/\/[^/]*$/, '');
  return { path, file: join(dir, path) };
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));
const problems = [];

// A disagreement here means the output was built for one base and is being checked against another,
// so every result below would be meaningless.
if (site.base !== basePrefix) {
  problems.push(
    `robots.txt reports base "${site.base}" but BASE_PATH gives "${basePrefix}" (build and check disagree)`,
  );
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const urls = [
    ...[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
    // `og:url` and `og:image` carry absolute URLs in `content`, so the href/src sweep misses them.
    ...[...html.matchAll(/<meta property="og:(?:url|image)" content="([^"]+)"/g)].map(
      (match) => match[1],
    ),
  ];
  for (const url of urls) {
    if (url.startsWith('#')) continue;
    let reference = url;
    if (/^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('//')) {
      const internal = internalPathOf(url);
      if (internal === null) continue;
      reference = internal;
    }
    const target = resolveTarget(reference, file);
    if (!target) continue;
    if (target.reason) {
      problems.push(`${relative(dist, file)} → ${url} (${target.reason})`);
      continue;
    }
    // A directory only resolves through its index.html, which is what a static host serves.
    const candidates = [join(target.file, 'index.html'), target.file, `${target.file}.html`];
    let resolved = false;
    for (const candidate of candidates) {
      if (!existsSync(candidate)) continue;
      if ((await stat(candidate)).isFile()) {
        resolved = true;
        break;
      }
    }
    if (!resolved) problems.push(`${relative(dist, file)} → ${url} (not found)`);
  }
}

const anchors = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(match[1])) anchors.push(`${relative(dist, file)} → #${match[1]} (no such id)`);
  }
}

const all = [...problems, ...anchors];
console.log(
  `Checked ${htmlFiles.length} HTML file(s) in ${posix.normalize(relative(process.cwd(), dist))} with base "${basePrefix}", origin "${site.origin}".`,
);
if (all.length > 0) {
  console.error(`\n${all.length} broken reference(s):`);
  for (const problem of all) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('No broken internal references.');
