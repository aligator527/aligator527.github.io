# Ivan Dolgov — Engineering Portfolio

Static portfolio site: Astro, TypeScript, custom CSS, no client-side JavaScript.
Deployed to GitHub Pages as a user site (`https://aligator527.github.io`).

The site is meant to be evidence of engineering quality, not only a description of it. The
instruction layer that governs it lives in [`.ai/`](.ai/README.md) (tool-independent source of
truth) and [`.claude/`](.claude/README.md) (Claude Code adapter).

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production static build to `dist/` |
| `pnpm build:subpath` | Build with `BASE_PATH=/portfolio` into `dist-subpath/`, to prove base-path safety |
| `pnpm preview` | Serve the production build (background daemon; `astro preview stop` ends it) |
| `pnpm typecheck` | `astro check` (TypeScript + Astro diagnostics) |
| `pnpm lint` / `pnpm format:check` | ESLint / Prettier |
| `pnpm test:unit` | Vitest unit tests |
| `pnpm test:e2e` | Playwright browser tests, including axe, against a production build |
| `pnpm check:links` | Verifies every internal href, asset and fragment in `dist/` resolves, including same-origin absolute URLs such as `canonical` and `og:url` |
| `pnpm check:i18n` | Holds the indexing and locale contract in `dist/`: the live URLs in `tests/fixtures/indexed-urls.json`, one self-referencing canonical per page, robots meta and sitemap agreeing, no `meta refresh`, nothing served under `/en/`, the `_astro` font budget, the per-locale font preloads of ADR-0006, and every JSON-LD block parsing with a language that matches its page. Prints titles and descriptions over the search-result budget without failing |
| `pnpm check` | Format, lint, typecheck, unit tests, build, link check, indexing check |

Playwright needs its browser once: `pnpm exec playwright install chromium`.

`node scripts/make-og.mjs` regenerates `public/og.png`, the social preview image. It is committed,
so the build never depends on Playwright.

## Architecture

```text
src/
├── components/   core (heading, meta list, action link), navigation, diagrams, work, experience
├── content/      work briefs (Markdown), experience roles (YAML), principles (YAML), lab, notes
├── data/         profile, capability vocabulary, delivery-flow stages
├── i18n/ui/      UI chrome dictionaries, one per locale (en today)
├── layouts/      BaseLayout, CaseStudyLayout
├── pages/        [...locale]/ one route per locale: /, /work, /work/[slug], /experience,
│                 /about, /resume — plus /lab, /notes, 404 and robots.txt at the root
├── styles/       reset, tokens, global, utilities (cascade layers)
└── utils/        url (base-safe links), i18n (locale paths), dates, timeline, work, experience,
                  navigation, resume
```

The site is trilingual. English is served unprefixed at the URLs it was indexed at; Russian lives
under `/ru/` and Japanese under `/ja/`. `src/utils/i18n.ts` owns every locale decision, and the two
arrays at the top of it are the only switches that matter:

- `EMITTED_LOCALES` — which locales produce pages.
- `INDEXABLE_LOCALES` — which locales are advertised. A locale is built, deployed and reviewable at
  its real URL before it joins this list; until then it is `noindex`, absent from the sitemap, and
  absent from every `hreflang` cluster. Publishing one is adding it here; rolling back is removing
  it, and no URL 404s either way.

ADR-0005 records the routing and content model, `.ai/content/translation.md` the editorial rules.

Notes for future changes:

- **Base paths.** Every internal URL goes through `withBase()` in `src/utils/url.ts`. The site
  currently serves from `/`; `pnpm build:subpath` plus `check:links` proves it also survives a
  repository subpath. Both checkers take the output directory as an argument and read `BASE_PATH`,
  so the subpath build is verified by the same code; `check-links.mjs` derives the origin and base
  it expects from the `Sitemap:` line of the built `robots.txt`.
- **Indexed URLs.** `tests/fixtures/indexed-urls.json` lists the URLs and files that Google already
  knows about. It is a floor, not a whitelist: adding routes is routine, removing one breaks a live
  URL. Read `tests/fixtures/README.md` before editing it.
- **Locales and URLs.** `src/utils/i18n.ts` owns the locale layer. English is the default and is
  served unprefixed, because its URLs are indexed; `ru` and `ja` are prefixed (`/ru/work/`). A
  *logical path* (`/work/`) carries neither the deployment base nor a locale, and is what navigation
  and `isCurrent()` compare; `localeHref()` turns one into a finished href, and anything that takes a
  `locale` — `workHref()`, `getPrimaryNav()` — already returns a resolved href, so it is not wrapped
  in `withBase()` again. Shared files (`/og.png`, `/favicon.svg`, `/sitemap-index.xml`, the CV PDF)
  stay on plain `withBase()` and are never localised; `localePath()` throws if handed one.
  `INDEXABLE_LOCALES` is what `hreflang` advertises, and a locale joins it only when its translation
  is complete. UI chrome lives in `src/i18n/ui/<locale>.ts`, read as properties (`t.navWork`) so a
  missing key is an `astro check` error; facts stay in `src/data/profile.ts` and prose in the content
  collections, so dictionary entries that need a fact take it as an argument.
- **Route tree.** Localisable pages live under `src/pages/[...locale]/` and take their
  `getStaticPaths` from `localePaths()`. The rest parameter is `undefined` for English
  (`localeParam()`), so that route emits `/work/` and never `/en/work/` — the indexed URLs are
  unchanged by the locale tree, and `check:i18n` fails the build if an `/en/` document ever appears.
  `EMITTED_LOCALES` decides which locales are built, `INDEXABLE_LOCALES` which are advertised; a
  locale is built first and advertised later, so a translation can be reviewed on a real URL without
  competing with the English page. `/lab`, `/notes`, `404.astro` and `robots.txt.ts` stay at the root
  on purpose: the first two are English-only, GitHub Pages serves one `404.html` for every unmatched
  path including `/ru/anything`, and there is one `robots.txt` per origin. `astro.config.mjs` sets
  `i18n` only so that `Astro.currentLocale` is populated — there is no fallback and no
  `redirectToDefaultLocale`, and components still derive their locale from `Astro.url`.
  `.ai/product/sitemap.md` holds the full route table. A rest parameter can match several segments,
  so this route was expected to swallow unknown paths such as `/typo` in `astro dev`; measured on
  Astro 7.3.3 it does not, because Astro constrains the route to the paths `getStaticPaths` returns in
  dev too. Re-check after an Astro upgrade. Production cannot regress either way: the build writes
  only declared paths and GitHub Pages serves `404.html` for the rest.
- **Locale typography.** `tokens.css` ends with `:root:lang(ru)` and `:root:lang(ja)`, which restate
  the type family and — for Japanese — tracking, leading, the measure scale and three CJK text
  properties. Every `max-inline-size` on running text is a `--measure-*` token for that reason: a
  line length is a property of the script, so the whole scale is restated once per locale instead of
  component by component. `.ai/design/typography.md` has the table and the measurements behind the
  Japanese values; ADR-0006 has the families. Japanese downloads no font, so `/ja/` renders
  differently on macOS, Windows and Android by design.
- **Cascade layers.** The layer order (`reset, tokens, base, layout, components, utilities`) is
  declared in an inline `<style>` in `BaseLayout.astro`, because component-scoped styles are
  emitted ahead of `src/styles/global.css` in the CSS bundle and would otherwise establish the
  order themselves. Relatedly, Astro orders a page's `<link rel="stylesheet">` tags by each CSS
  module's index among its importer's imports, so a new import added *above*
  `import '../styles/global.css'` in `BaseLayout.astro` moves global.css after the page's own
  scoped styles and flips which of two equally specific rules in the same layer wins. Add imports
  below it.
- **Astro scoped-style specificity.** Scoped selectors gain an attribute selector, so a
  `.parent > *` rule outranks a later `.child` rule. Responsive overrides are therefore written
  as `.parent > .child`. Styling a child component's root element needs `:global()`.
- **Lab and Notes** are built but excluded from navigation, the sitemap and indexing until their
  collections contain entries (`src/utils/navigation.ts`, `astro.config.mjs`).
- **Résumé PDF.** `/resume` renders the download link only if `public/resume/ivan-dolgov-cv.pdf`
  exists at build time (`src/utils/resume.ts`). The committed PDF is published as supplied,
  including its phone number and photo — an explicit exception to `.ai/content/facts.md`, recorded
  there and confirmed on 2026-09-18. Replacing it with a redacted version needs no code change.

## Content

Facts come from `.ai/content/facts.md` and are stored once: identity in `src/data/profile.ts`,
career chronology in `src/content/experience/roles.yaml`, projects in `src/content/work/*.md`.
Pages read that data; no fact is duplicated in a template. Frontmatter is validated at build time
by `src/content.config.ts`.

Work pages are currently **briefs**: verified role, scope and system facts, explicitly labelled as
such. Use the `/case-study` workflow to deepen one once the underlying details are cleared for
publication.

## Dependencies

Runtime dependencies are deliberately few; nothing ships JavaScript to the browser.

| Dependency | Why |
|---|---|
| `astro` | Static HTML-first framework with content collections, per ADR-0001 |
| `@astrojs/sitemap` | Build-time sitemap generation; no runtime cost |

`@astrojs/mdx` was removed: the work briefs are plain CommonMark, so it earned nothing. Re-add it
(with a note in this table) when a case study needs to embed a component such as `LayerDiagram`.

Fonts are self-hosted through Astro's built-in Fonts API with the Fontsource provider: only the
subsets and weights in use are downloaded at build time, with metric-adjusted fallbacks to avoid
layout shift. No font package is a runtime dependency. There is one family per script — Instrument
Sans for Latin, Golos Text for Cyrillic, a system gothic stack for Japanese, IBM Plex Mono (latin +
cyrillic) for metadata — and `BaseLayout.astro` emits and preloads only the family a page is set in:
English preloads three Instrument Sans faces, Russian four Golos Text faces, Japanese none.
ADR-0006 records why, and `check:i18n` enforces that table per document.

Dev-only: TypeScript, `@astrojs/check`, Vitest, Playwright, `@axe-core/playwright`, Prettier,
ESLint. React is intentionally absent until an interaction justifies an island.

## Deployment

GitHub Actions only, and manual: the `Deploy to GitHub Pages` workflow runs on
`workflow_dispatch`. CI (`ci.yml`) runs the full quality gate on pushes and pull requests. Set the
repository's Pages source to **GitHub Actions** before the first deployment. See
`.ai/engineering/deployment.md` for the release checklist.
