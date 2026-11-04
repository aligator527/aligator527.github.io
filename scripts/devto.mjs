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
const SERVICES = new URL('../src/content/services/services.yaml', import.meta.url);
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
  'Technical leadership': 'leadership',
  'Engineering management': 'management',
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

/*
 * A line that starts a block of its own, and therefore never joins the line above it: a blank,
 * a heading, a list item, a quote, a table row, a fence, a rule, raw HTML, or an indented block.
 */
const BLOCK = /^(\s*$|#{1,6}\s|[-*+]\s|\d+[.)]\s|>|\||```|~~~|---|___|\*\*\*|<|\s{4,})/;

/**
 * Joins the hard-wrapped lines of each paragraph back into one line.
 *
 * The source files wrap at 100 columns, which `.ai/content/translation.md` requires and which
 * CommonMark renders as a space. DEV does not: it renders a single newline as `<br>`, so every
 * wrap point became a visible line break and an argued paragraph arrived as a column of
 * fragments. Markdown that is correct by the spec and wrong on the platform is still wrong.
 *
 * A line joins the one above it only when neither is a block of its own, so the bullets stay
 * separate bullets and a wrapped one gets its continuation back.
 */
function unwrap(body) {
  const lines = [];
  let fenced = false;
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      lines.push(line);
      continue;
    }
    const previous = lines.at(-1);
    if (!fenced && previous !== undefined && previous.trim() !== '' && !BLOCK.test(line)) {
      lines[lines.length - 1] = `${previous} ${line.trim()}`;
      continue;
    }
    lines.push(line);
  }
  return lines.join('\n');
}

/**
 * Links inside a note are relative to the page — `../../work/x/` out of the notes tree, `../x/`
 * to a sibling note — because nothing applies the deployment base inside rendered Markdown. On
 * DEV there is no page to be relative to. The two-step rewrite has to run longest-prefix first,
 * or the second pattern would eat the first one's `../` and point every link at /notes/.
 */
function absolute(body) {
  return body
    .replace(/\]\(\.\.\/\.\.\/([^)]+)\)/g, `](${SITE}/$1)`)
    .replace(/\]\(\.\.\/([^)./][^)]*)\)/g, `](${SITE}/notes/$1)`);
}

/**
 * The note → engagement edge, read from the file that declares it.
 *
 * A note is evidence for an engagement, the pairing is declared once on the engagement, and the
 * site renders it as the last line of the note. A repost that drops it keeps the argument and
 * loses the only path from the writing to the work it is evidence for — and DEV is where the
 * English notes have readers that the site does not.
 *
 * Parsed by hand for the same reason the frontmatter above is: four fields out of one
 * machine-written file do not justify a YAML dependency in a script that has none.
 */
function engagements() {
  const text = readFileSync(SERVICES, 'utf8');
  const edges = new Map();
  for (const entry of text.split(/^- id: /m).slice(1)) {
    const id = entry.split('\n')[0].trim();
    const code = /^ {2}code: (\S+)$/m.exec(entry)?.[1];
    const title = /^ {2}title:\n {4}en: (.*)$/m.exec(entry)?.[1]?.replace(/^['"]|['"]$/g, '');
    const note = /^ {4}note: (.*)$/m.exec(entry)?.[1];
    if (note && note !== 'null' && code && title) edges.set(note, { id, code, title });
  }
  return edges;
}

const EDGES = engagements();

function payloadFor(file) {
  const { data, body } = frontmatter(readFileSync(new URL(file, NOTES), 'utf8'));
  if (data.draft === 'true') return null;
  const slug = file.replace(/\.md$/, '');
  const tags = [...new Set((data.topics ?? []).map((topic) => TAGS[topic]).filter(Boolean))].slice(
    0,
    4,
  );
  const engagement = EDGES.get(slug);
  const footer = engagement
    ? `\n\n---\n\nThe engagement this note is evidence for: ` +
      `[${engagement.code} · ${engagement.title}](${SITE}/services/#${engagement.id}).\n`
    : '';
  return {
    slug,
    engagement,
    article: {
      title: data.title,
      published: !draft,
      body_markdown: absolute(unwrap(body)).trim() + footer,
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
  for (const { slug, engagement, article } of notes) {
    console.log(`\n${slug}`);
    console.log(`  title     ${article.title}`);
    console.log(`  canonical ${article.canonical_url}`);
    console.log(`  tags      ${article.tags.join(', ') || '(none)'}`);
    console.log(
      `  cites     ${engagement ? `${engagement.code} → ${SITE}/services/#${engagement.id}` : '(no engagement declared)'}`,
    );
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

const wait = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

/**
 * DEV rate-limits article creation hard — publishing four notes in a row returns 429 on the third
 * with "try again in 300 seconds". It says how long to wait, so waiting is the whole fix; the
 * alternative is a half-published set and a human deciding which two to re-run.
 */
async function send(article, id) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify({ article }),
    });
    if (response.status !== 429) return response;
    const body = await response.text();
    const seconds =
      Number(response.headers.get('retry-after')) || /(\d+) seconds/.exec(body)?.[1] || 60;
    console.log(`  rate limited, waiting ${seconds}s (attempt ${attempt})`);
    await wait(Number(seconds) + 5);
  }
  throw new Error('still rate limited after four attempts');
}

for (const { slug, article } of notes) {
  const id = existing.get(article.canonical_url);
  const response = await send(article, id);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`${slug}: ${response.status} ${JSON.stringify(body)}`);
    continue;
  }
  console.log(`${id ? 'updated' : 'published'}  ${slug}  ${body.url ?? ''}`);
  // Space the writes out: the limit is on creation rate, not on the day's total.
  await wait(5);
}
