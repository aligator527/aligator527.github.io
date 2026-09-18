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

function resolveTarget(url, fromFile) {
  const [path] = url.split('#');
  if (!path) return null;
  if (path.startsWith('/')) {
    if (!path.startsWith(basePrefix)) return { path, reason: `missing base prefix ${basePrefix}` };
    return { path, file: join(dist, path.slice(basePrefix.length)) };
  }
  const dir = fromFile.replace(/\/[^/]*$/, '');
  return { path, file: join(dir, path) };
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));
const problems = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const url of urls) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    const target = resolveTarget(url, file);
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
  `Checked ${htmlFiles.length} HTML file(s) in ${posix.normalize(relative(process.cwd(), dist))} with base "${basePrefix}".`,
);
if (all.length > 0) {
  console.error(`\n${all.length} broken reference(s):`);
  for (const problem of all) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('No broken internal references.');
