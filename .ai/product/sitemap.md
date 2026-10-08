# Sitemap

## Public routes

| Route | Purpose | Primary action |
|---|---|---|
| `/` | Executive summary and selected evidence | Open selected work |
| `/work` | Professional project index | Choose a case study |
| `/work/[slug]` | Engineering case study | Inspect decisions and outcome |
| `/lab` | Public code, prototypes, and experiments | Open repository/demo |
| `/experience` | Career chronology and role scope | Download résumé |
| `/notes` | Engineering and architecture writing | Read an article |
| `/notes/[slug]` | Individual article | Continue to related work |
| `/about` | Working principles, background, languages | Contact Ivan |
| `/resume` | Accessible HTML résumé | Download PDF |
| `/404` | Useful recovery with restrained character | Return to work/home |

The table above is the product view. The route table below is the build view: which source file
emits each of these routes, which of them exist once per locale, and which deliberately do not.

## Route table

What the build actually emits. Locale-aware routes live under the `[...locale]` rest parameter, whose
value is `undefined` for English — so English is served unprefixed, exactly where it is already
indexed, and a locale directory is added beside it rather than around it.

`EMITTED_LOCALES` in `src/utils/i18n.ts` decides which locales are built; `INDEXABLE_LOCALES` decides
which are advertised through `hreflang`. A locale is built before it is advertised, never the reverse.
Both are `['en', 'ru', 'ja']` as of 2026-10-08: 30 documents, 27 of them in the sitemap — nine routes
per locale, plus the three English-only sections and the shared error document.

| Source file | English route | Localised routes |
|---|---|---|
| `src/pages/[...locale]/index.astro` | `/` | `/ru/`, `/ja/` |
| `src/pages/[...locale]/work/index.astro` | `/work/` | `/ru/work/`, `/ja/work/` |
| `src/pages/[...locale]/work/[slug].astro` | `/work/<slug>/` | `/ru/work/<slug>/`, `/ja/work/<slug>/` |
| `src/pages/[...locale]/experience.astro` | `/experience/` | `/ru/experience/`, `/ja/experience/` |
| `src/pages/[...locale]/about.astro` | `/about/` | `/ru/about/`, `/ja/about/` |
| `src/pages/[...locale]/resume.astro` | `/resume/` | `/ru/resume/`, `/ja/resume/` |
| `src/pages/lab/index.astro` | `/lab/` | none — English only |
| `src/pages/notes/index.astro` | `/notes/` | none — English only |
| `src/pages/notes/[slug].astro` | `/notes/<slug>/` | none — English only |
| `src/pages/404.astro` | `/404.html` | none — one shared error document |
| `src/pages/robots.txt.ts` | `/robots.txt` | none — one per origin |

A work entry keeps its slug in every locale: the slug is a live indexed URL, and translating a case
study must not move it.

### Deliberately not localised

- **Lab and Notes.** Both sections are still empty, and writing is published in the language it was
  written in. They stay at the site root until there is something to translate.
- **`/404.html`.** GitHub Pages serves one error document for every unmatched path, including
  `/ru/anything`, so a per-locale 404 would be built and never served. The recovery copy is English.
- **`/robots.txt` and the sitemap.** One of each per origin, covering every locale.
- **The CV PDF.** One file, linked from every locale; `/ja/resume/` labels it `CV（英語）`.

### Unknown paths

A rest parameter can match several segments, so `[...locale]` was expected to swallow unknown paths
such as `/typo` in `astro dev` and render the home page instead of the 404. It does not. Astro
constrains the route to the paths `getStaticPaths` returns in dev as well as in the build: measured on
Astro 7.3.3, `/typo`, `/x/y/z`, `/en/`, `/en/work/`, `/ru/` and `/ja/` all return the 404 from the dev
server, while `/work/` and `/about/` return 200. Re-check after an Astro upgrade.

In production this cannot regress regardless: the build writes only the paths `getStaticPaths`
returns, and GitHub Pages serves `404.html` for every unmatched path.

## Primary navigation

`Work / Lab / Experience / Notes / About`

Keep `Résumé ↗` visually separate. Contact can be a persistent footer action instead of a dedicated route.

## Homepage order

1. Identity and positioning.
2. Selected work.
3. Capability matrix.
4. Selected lab or notes.
5. Working principles.
6. Contact/footer.

Each section must earn its presence. Do not add generic logo clouds, testimonials, client marquees, or fake statistics.

