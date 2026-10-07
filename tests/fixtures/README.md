# Fixtures

## `indexed-urls.json` — read this before editing it

The site at <https://aligator527.github.io> is **live and indexed**. `indexed-urls.json` is the
list of URLs and files that Google already knows about. It exists so that a refactor — the
upcoming `/ru/` and `/ja/` locales above all — cannot quietly drop or rename one of them.

`scripts/check-i18n.mjs` reads it on every `pnpm check` and fails if an entry is missing from the
build. `pages` are checked as built HTML routes **and** as `<loc>` entries in `sitemap-0.xml`;
`files` are checked as plain files.

It is a **floor, not a whitelist**. Extra pages and extra sitemap entries pass. So:

- **Adding** an entry (a new route that should be indexed) is routine.
- **Removing or renaming** an entry breaks a URL that exists on the public internet. The checker
  will stop complaining the moment you edit the file, which is precisely why editing it has to be
  a conscious decision rather than a way to make a red build green. GitHub Pages serves no
  redirects, so a moved URL is a dead URL unless something else is put in its place.

`/404.html` is listed under `files`, not `pages`: GitHub Pages serves it as the error document, and
its canonical URL is `/404/`, so it is not a route in its own right.

The `origin` field is the canonical production origin. `scripts/check-i18n.mjs` uses it to verify
that every page's `<link rel="canonical">` is absolute and self-referencing.
