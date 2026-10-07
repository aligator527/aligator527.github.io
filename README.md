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
| `pnpm check:i18n` | Holds the indexing and locale contract in `dist/`: the live URLs in `tests/fixtures/indexed-urls.json`, one self-referencing canonical per page, no `meta refresh`, and the `_astro` font budget |
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

Fonts (Instrument Sans, IBM Plex Mono) are self-hosted through Astro's built-in Fonts API with the
Fontsource provider: only the latin subset and the weights in use are downloaded at build time,
with metric-adjusted fallbacks to avoid layout shift. No font package is a runtime dependency.

Dev-only: TypeScript, `@astrojs/check`, Vitest, Playwright, `@axe-core/playwright`, Prettier,
ESLint. React is intentionally absent until an interaction justifies an island.

## Deployment

GitHub Actions only, and manual: the `Deploy to GitHub Pages` workflow runs on
`workflow_dispatch`. CI (`ci.yml`) runs the full quality gate on pushes and pull requests. Set the
repository's Pages source to **GitHub Actions** before the first deployment. See
`.ai/engineering/deployment.md` for the release checklist.
