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
4. Verify GitHub Pages base-path behavior.
5. Perform or request visual checks at representative desktop and mobile viewports.
6. Perform keyboard, focus, reduced-motion, zoom, and automated accessibility checks where supported.
7. Report exact outcomes and untested areas.

Do not edit tests or implementation merely to hide a failure. Ask before broadening scope into repairs.

