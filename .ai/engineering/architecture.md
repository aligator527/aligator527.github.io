# Architecture

## Baseline stack

| Layer | Decision |
|---|---|
| Framework | Astro, static output |
| Language | TypeScript with strict checking |
| Interactive UI | React islands only when justified |
| Content | Astro Content Collections using MD/MDX |
| Styling | Custom CSS, cascade layers, semantic custom properties |
| Unit tests | Vitest |
| Browser tests | Playwright |
| Accessibility | axe automation plus manual review |
| Package manager | pnpm with committed lockfile |
| Deployment | GitHub Pages via GitHub Actions |

## Principles

- HTML-first output.
- Zero client JavaScript by default.
- Islands are narrow, independently justified, and lazy where appropriate.
- Static routes must build without a server runtime.
- Content and presentation remain separate.
- Prefer platform features over dependencies.
- Prefer progressive enhancement over JavaScript-only behavior.

## Suggested source structure

```text
src/
├── assets/
├── components/
│   ├── core/          # headings, metadata, annotations, structured data
│   ├── diagrams/
│   ├── navigation/    # header, footer, language switch
│   ├── prose/         # page narrative that cannot be a dictionary string, one file per locale
│   └── work/
├── content/
│   ├── work/<locale>/ # one Markdown file per locale per entry
│   ├── experience/    # YAML; translatable fields nested by locale
│   ├── principles/    # YAML; same shape
│   ├── lab/
│   └── notes/
├── content.config.ts
├── data/              # facts with no wording: ids, codes, sources, periods
├── i18n/ui/           # en.ts, ru.ts, ja.ts — every UI string, typed against English
├── layouts/
├── pages/
│   ├── [...locale]/   # every localised route; English renders unprefixed
│   ├── lab/, notes/   # English only, deliberately outside the locale tree
│   ├── 404.astro
│   └── robots.txt.ts
├── styles/
│   ├── reset.css
│   ├── tokens.css     # includes the :lang(ru) and :lang(ja) type systems
│   ├── global.css
│   └── utilities.css
└── utils/             # i18n, localized, url, work, experience, dates, navigation, resume
```

## Locale policy

Three locales, English unprefixed — ADR-0005 holds the reasoning, `.ai/content/translation.md` the
editorial rules. The parts that constrain code:

- `src/utils/i18n.ts` owns every locale decision: which locales exist, which are built
  (`EMITTED_LOCALES`), which are advertised (`INDEXABLE_LOCALES`, through `isIndexable()`), what a
  page's URL is in another locale, and which locales a given page exists in (`localesFor()`).
- Nothing else may decide whether a locale is public. The robots meta, the sitemap filter and the
  `hreflang` set all read `isIndexable()`, and `scripts/check-i18n.mjs` asserts they agree.
- Strings live in `src/i18n/ui/`, typed against English, so a missing key fails `astro check`.
  Facts live in `src/data/` and the content collections, and are never duplicated into a dictionary.
- A build-time check belongs against the DEFAULT locale, not the current one: an untranslated entry
  is a gap, a missing entry is a bug, and conflating them turns the first into a build failure.

## Component policy

- A component represents repeated semantics or behavior, not merely a rectangular region.
- Default to Astro components for static UI.
- Use React when interaction requires state that Astro and browser primitives cannot express cleanly.
- Keep content-specific compositions distinct; do not force all projects through one generic card.

## Data policy

- Validate content frontmatter at build time.
- Keep facts in content data, not duplicated across templates.
- Keep private drafting sources outside the public repository.
- Never fetch sensitive data client-side.

