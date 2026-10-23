#!/usr/bin/env node
/**
 * Publishes the English notes to DEV (dev.to) with a canonical URL pointing back here.
 *
 * Unlike Zenn, DEV honours `canonical_url`, so these are the same text rather than a rewrite: the
 * canonical is what stops a second copy on a stronger domain from taking the search result the
 * original was written to win.
 *
 * The API key is read from `DEV_API_KEY` and never stored. Get one at
 * https://dev.to/settings/extensions → DEV Community API Keys.
 *
 *   DEV_API_KEY=... node scripts/devto.mjs --dry-run   # print what would be sent
 *   DEV_API_KEY=... node scripts/devto.mjs             # create or update each note
 *   DEV_API_KEY=... node scripts/devto.mjs --draft     # create them unpublished
 *
 * Re-running is safe: an article whose canonical matches a note is updated in place rather than
 * published again, so this is also how an edit on the site reaches DEV.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { argv, env, exit } from 'node:process';

const SITE = 'https://aligator527.github.io';
const NOTES = new URL('../src/content/notes/en/', import.meta.url);
const API = 'https://dev.to/api/articles';

const flags = new Set(argv.slice(2).filter((arg) => arg.startsWith('--')));
const dryRun = flags.has('--dry-run');
const draft = flags.has('--draft');

/**
 * DEV tags are alphanumeric, lowercase, and at most four. The site's topics are prose — "Technology
 * selection" is not a tag anywhere — so they are mapped rather than slugified, and anything without
 * a sensible DEV equivalent is dropped instead of invented.
 */
const TAGS = {
  AWS: 'aws',
  DynamoDB: 'dynamodb',
  AppSync: 'aws',
  Performance: 'performance',
  Architecture: 'architecture',
  Identity: 'security',
  Keycloak: 'security',
  Releases: 'devops',
  Migrations: 'database',
  'Technology selection': 'architecture',
  Go: 'go',
  'AI-assisted development': 'ai',
};

function frontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error('no frontmatter');
  const data = {};
  for (const line of match[1].split('\n')) {
    const field = /^(\w+):\s*(.*)$/.exec(line);
    if (!field) continue;
    const [, key, raw] = field;
    if (key === 'topics') {
      data.topics = raw
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((topic) => topic.trim())
        .filter(Boolean);
    } else {
      data[key] = raw.replace(/^['"]|['"]$/g, '');
    }
  }
  return { data, body: match[2] };
}

/**
 * Links inside a note are relative to the page — `../../work/x/` — because nothing applies the
 * deployment base inside rendered Markdown. On DEV there is no page to be relative to.
 */
function absolute(body) {
  return body.replace(/\]\(\.\.\/\.\.\/([^)]+)\)/g, `](${SITE}/$1)`);
}

function payloadFor(file) {
  const { data, body } = frontmatter(readFileSync(new URL(file, NOTES), 'utf8'));
  if (data.draft === 'true') return null;
  const slug = file.replace(/\.md$/, '');
  const tags = [...new Set((data.topics ?? []).map((topic) => TAGS[topic]).filter(Boolean))].slice(
    0,
    4,
  );
  return {
    slug,
    article: {
      title: data.title,
      published: !draft,
      body_markdown: absolute(body).trim(),
      canonical_url: `${SITE}/notes/${slug}/`,
      description: data.summary,
      tags,
    },
  };
}

const notes = readdirSync(NOTES)
  .filter((file) => file.endsWith('.md'))
  .map(payloadFor)
  .filter(Boolean);

console.log(`${notes.length} note(s) to publish.`);

if (dryRun) {
  for (const { slug, article } of notes) {
    console.log(`\n${slug}`);
    console.log(`  title     ${article.title}`);
    console.log(`  canonical ${article.canonical_url}`);
    console.log(`  tags      ${article.tags.join(', ') || '(none)'}`);
    console.log(
      `  body      ${article.body_markdown.length} chars, published: ${article.published}`,
    );
    const relative = /\]\(\.\.\//.test(article.body_markdown);
    if (relative) console.log('  WARNING   a relative link survived the rewrite');
  }
  exit(0);
}

const key = env.DEV_API_KEY;
if (!key) {
  console.error('DEV_API_KEY is not set. Create one at https://dev.to/settings/extensions.');
  exit(1);
}

const headers = { 'api-key': key, 'content-type': 'application/json' };

/** Articles already on DEV, by canonical URL — this is what makes a re-run an update. */
const mine = await fetch(`${API}/me/all?per_page=1000`, { headers });
if (!mine.ok) {
  console.error(`Could not list existing articles: ${mine.status} ${await mine.text()}`);
  exit(1);
}
const existing = new Map((await mine.json()).map((article) => [article.canonical_url, article.id]));

for (const { slug, article } of notes) {
  const id = existing.get(article.canonical_url);
  const response = await fetch(id ? `${API}/${id}` : API, {
    method: id ? 'PUT' : 'POST',
    headers,
    body: JSON.stringify({ article }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`${slug}: ${response.status} ${JSON.stringify(body)}`);
    continue;
  }
  console.log(`${id ? 'updated' : 'published'}  ${slug}  ${body.url ?? ''}`);
}
