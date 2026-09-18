# ADR-0004: Self-host fonts through Astro's Fonts API

Status: Accepted
Date: 2026-09-18

## Context

`.ai/design/typography.md` requires Instrument Sans and IBM Plex Mono, self-hosted WOFF2 subsets,
with system fallbacks and no unused weights. `.ai/engineering/dependencies.md` requires a
justification for anything added, and `.ai/engineering/performance.md` forbids font-induced layout
shift.

## Decision

Use Astro's built-in Fonts API with the Fontsource provider, declaring only the weights in use
(Instrument Sans 400/600/700, IBM Plex Mono 400/500), the latin subset, WOFF2, and explicit
fallback stacks. Astro downloads and fingerprints the files at build time, emits the `@font-face`
rules, generates metric-adjusted fallbacks, and preloads only the two critical faces.

## Alternatives

- `@fontsource/*` packages: equivalent output but adds two dependencies and manual per-weight CSS
  imports, and does not generate metric-adjusted fallbacks.
- Google Fonts CSS at runtime: rejected. A third-party request on every route, with privacy and
  performance cost, and no subsetting control.
- Manually committed WOFF2 subsets: most control, but the files and their `@font-face` rules would
  have to be maintained by hand with no build-time verification.

## Consequences

- No font dependency appears in `package.json`; fonts are a build step instead.
- The build needs network access to fetch font files (CI has it; a fully offline build would fail).
- Adding a weight is a one-line configuration change, which also makes accidental weight bloat
  easy to spot in review.

## Revisit when

Licensing requires locally committed files, builds must run offline, or a Japanese or Cyrillic
subset is needed for published content in those scripts.
