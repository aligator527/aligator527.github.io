# ADR-0005: Serve three locales, English unprefixed, with publication gated per locale

Status: Accepted
Date: 2026-10-08

## Context

The site launched in English and was already indexed. Russian and Japanese were added to reach two
audiences the English pages cannot: Russian-speaking engineers and clients, and the Japanese
enterprise market the work itself comes from.

Two constraints shaped every decision. The English URLs exist on the public internet and GitHub
Pages offers no redirects, so they cannot move. And a translation is finished long before it is
*reviewed* — the author is the only reviewer for Russian and Japanese, and an unreviewed page in a
search index is worse than no page.

## Decision

**English stays at the root; other locales are prefixed.** `/work/packaging-saas/` keeps its URL,
and the same page in Japanese is `/ja/work/packaging-saas/`. Routes live under
`src/pages/[...locale]/`, where the rest parameter is `undefined` for English, which is how a
default locale renders with no segment at all. `src/utils/i18n.ts` owns that rule.

**Building a locale and publishing it are separate switches.** `EMITTED_LOCALES` decides which
locales produce pages; `INDEXABLE_LOCALES` decides which are advertised. A locale under review is
built, deployed, and reachable at its real URL, while `isIndexable()` keeps it out of the sitemap,
out of every `hreflang` cluster, and marked `noindex, follow`. Publishing is adding one locale to
one array; rolling back is removing it, and no URL 404s either way.

**One predicate, three consumers.** `BaseLayout.astro` emits the robots meta, `astro.config.mjs`
filters the sitemap, and `alternates()` builds the `hreflang` set — all from `isIndexable()`.
`scripts/check-i18n.mjs` asserts they agree on every built page, at every base path.

**Prose is per file; data is per field.** Work entries are one Markdown file per locale under
`src/content/work/<locale>/`, because a case study is long prose that has to be reviewed one
language at a time. The YAML data files keep one record per role or principle with the translatable
fields nested by locale (`src/utils/localized.ts`), because splitting them per locale would put the
same role's dates in three files and invite them to drift.

**Facts are invariant; wording is not.** `assertWorkParity()` fails the build when a translation
disagrees with English about a date, a team size, a depth, a capability set or a diagram's shape.
`organization` is deliberately not in that list: a company that publishes its own Japanese name has
two correct names, and 長島梱包株式会社 is not a divergence from "Nagashima Konpo Co., Ltd.".

## Alternatives

- **`/en/` for English too.** Symmetrical, and it would have broken every indexed URL with no
  redirect available. Rejected.
- **Astro's `i18n.fallback`.** It serves the default locale's content under another locale's URL,
  which is duplicate content with the wrong `lang`, and it hides exactly the gap the parity
  assertion exists to surface. The config declares `i18n` only so `Astro.currentLocale` resolves.
- **Translated slugs** (`/ja/jisseki/`). Rejected: the one-to-one mapping between locales is what
  makes the `hreflang` cluster and the language switch trivial, and a slug is not where a reader
  needs their language.
- **A runtime i18n library.** Three locales and a few hundred strings need none, and
  `.ai/engineering/dependencies.md` asks for the platform first. The dictionaries are typed objects;
  a missing or misspelled key is an `astro check` error.
- **Client-side or `Accept-Language` redirection.** Needs JavaScript or a server, and the site has
  neither. The language switch is three links.

## Consequences

- 27 indexed URLs where there was 1 sitemap of 9, and three `hreflang` values plus one `x-default`
  on every page. A single broken link in that cluster makes search engines discard the whole
  cluster, so `check-i18n.mjs` treats reciprocity as a build gate rather than a review item.
- Every new page costs three translations, and the author is the bottleneck for two of them. The
  publication gate exists so that cost never blocks shipping the English page.
- `/404/` is the only page outside the locale tree: GitHub Pages serves one error document for
  every unmatched path, in every language. `localesFor()` encodes that, so nothing advertises a
  translation that does not exist, and navigation to such a page resolves to the default locale and
  says so — `hreflang`, `lang`, and a visible `EN` marker — rather than building a URL that 404s.
  Notes and Lab were in that list until 2026-10-23; see the amendment below.
- A fourth locale is a dictionary, a content folder, and two array entries. Nothing else changes.

## Revisit when

- A locale needs its own slugs, or its own pages, rather than a translation of the English ones.
  That is the point at which the one-to-one mapping this design rests on stops being true.
- A note is written in Russian or Japanese first. Everything so far has been written in English and
  translated, which is what the parity assertion assumes; a note whose source is another language
  needs `translation.source` to mean what it says and the English file to be the translated one.
- A custom domain lands. `site` changes, and every absolute URL — canonical, `hreflang`,
  `x-default`, JSON-LD `@id` — is derived from it, so the cluster must be re-verified in one pass.

## Amendment, 2026-10-23: Notes and Lab are translated

The sections shipped English-only, on the principle that writing is published in the language it
was written in. Three notes and three Lab entries later, that was the wrong trade for this site:
the reader these pages are for is the same reader the rest of the site addresses in three
languages, and a header that links a Japanese reader into English is a worse answer than a
translation.

So both sections moved into `src/pages/[...locale]/`, their content into `src/content/<collection>/<locale>/`,
and `ENGLISH_ONLY_PATHS` shrank to `/404/`. What that buys and what it costs:

- The slug is shared across locales, as it is for work — `/notes/x/` and `/ja/notes/x/` are a
  translation pair. ADR-0005's rejection of translated slugs stands.
- `src/utils/writing.ts` asserts, at build time, that every entry exists in every emitted locale
  and that the translations agree on the facts: a note's date and draft state, a Lab entry's code,
  status, technologies, links and date. It also asserts that a Lab entry has a body in every
  locale or in none, because the body is what decides whether an entry has a page, and a page that
  exists in one language is an `hreflang` pointing at a URL that was never built.
- Every new note now costs three versions before it can ship. That is the real price, and it is
  the same price the work collection already pays.
