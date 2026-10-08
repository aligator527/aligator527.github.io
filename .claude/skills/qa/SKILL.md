---
name: qa
description: Runs the portfolio quality gate: formatting, linting, type checks, tests, static build, accessibility, base-path, links, and visual smoke review. Use before declaring implementation complete.
allowed-tools: Read Grep Glob Bash
---

# Quality Gate

Scope: `$ARGUMENTS`

1. Read `.ai/qa/definition-of-done.md` and relevant review files.
2. Inspect package scripts before running commands.
3. Run available checks in this order: format check, lint, typecheck, unit tests, production build, browser tests.
4. Verify GitHub Pages base-path behavior, including `pnpm build:subpath` with `check:links` and `check:i18n` run against `dist-subpath`.
5. Run `pnpm check:i18n` against both builds. It holds the indexing contract — live URLs, canonicals, robots/sitemap agreement, `hreflang`, font budgets, JSON-LD — and a locale regression is invisible in a screenshot.
6. Perform or request visual checks at representative desktop and mobile viewports, in every published locale: Russian runs longer than English, and Japanese breaks lines where English has no spaces.
7. Perform keyboard, focus, reduced-motion, zoom, and automated accessibility checks where supported.
8. Report exact outcomes and untested areas.

Do not edit tests or implementation merely to hide a failure. Ask before broadening scope into repairs.

