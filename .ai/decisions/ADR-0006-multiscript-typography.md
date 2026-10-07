# ADR-0006: Type families for three scripts

Status: Accepted
Date: 2026-10-07

Supersedes ADR-0004, whose "revisit when" clause named exactly this trigger: *a Japanese or Cyrillic
subset is needed for published content in those scripts*. The mechanism ADR-0004 chose — Astro's
Fonts API with the Fontsource provider, self-hosted WOFF2, metric-adjusted fallbacks, no font
package in `package.json` — is unchanged and is the mechanism this decision is built on.

## Context

The site is adding `/ru/` and `/ja/`. `.ai/design/typography.md` specifies Instrument Sans and IBM
Plex Mono, and `.ai/design/art-direction.md` asks for precise, restrained, editorial typography. Two
facts constrain the work:

- Instrument Sans ships `latin` and `latin-ext` only. It has no Cyrillic and no CJK. Verified
  against the Fontsource API on 2026-10-07: `subsets: ["latin","latin-ext"]`.
- IBM Plex Mono does ship `cyrillic` and `cyrillic-ext`. The metadata labels that carry this site's
  orientation system (`ROLE`, `SYSTEM`, `STATUS`, `REV.01`) are translated, and in Russian they would
  otherwise fall out of the mono into a system fallback mid-label.

`.ai/engineering/performance.md` sets the other constraint: fonts are "only used families, scripts,
and weights", and `BaseLayout` preloaded three Instrument Sans faces on every route unconditionally.
Three high-priority WOFF2 fetches on a page that renders none of them is a measurable LCP cost.

`.ai/design/typography.md` also says not to use more than two families without a recorded decision.
This is that decision: it takes the count to three, one per script.

## Decision

### 1. Russian is set in Golos Text

Golos Text, through the same Fontsource provider, weights 400/600/700, subsets `cyrillic` and
`latin`, declared only on `/ru/` pages. `:root:lang(ru)` in `tokens.css` repoints `--font-sans`;
nothing else about the Russian type system changes.

Five families with Cyrillic were compared on Fontsource — all OFL-1.1, all available through the
existing mechanism, so licence and plumbing did not separate them. Rendered side by side at the
site's own display, heading and body sizes (the comparison sheet is reproducible: the same Russian
hero, headline, paragraph and a mixed `DynamoDB · Node.js 16→20 · P01 · REV.01` line in each face):

| Family | Cyrillic | Character against Instrument Sans | Verdict |
|---|---|---|---|
| **Golos Text** | Cyrillic-first; drawn by Alexandra Korolkova and Vitaly Kuzmin | Closest: flat terminals, squared bowls, tall x-height, tight apertures | **Chosen** |
| Onest | Cyrillic-first | Rounder and softer — the curled `у` tail and open `б` read as a friendlier voice | Runner-up |
| Inter | Latin-first, Cyrillic added | Wider, more neutral, larger counters; competent but generic Cyrillic | Rejected |
| IBM Plex Sans | Cyrillic drawn as part of the Plex programme | Humanist details and wider proportions; a different voice at display sizes | Rejected |
| Manrope | Cyrillic by Mikhail Sharanda | Geometric, round, noticeably un-grotesque next to Instrument Sans | Rejected |

Inter is additionally the face `.ai/design/anti-ai.md` names as the statistically average default.
That did not decide it — the drawing did — but it is not a reason to prefer it either.

Golos Text carries the Latin subset too, so a Russian sentence and the technology names inside it
are one voice, and a Russian page loads one family rather than two.

Measured consequence, recorded because it is counter-intuitive: Golos Text's "0" is 0.62em against
Instrument Sans's 0.67em, so a measure expressed in `ch` is about 7% narrower in pixels on `/ru/`.
That is correct rather than a defect — a measure is a character count, and the two faces hold
roughly the same number of characters in their own `ch`. Onest's "0" is 0.67em, identical to
Instrument Sans, which would have kept measures pixel-identical across locales; that is a tidy
property and not a typographic argument, and it did not outweigh the drawing.

### 2. Japanese is set in a system stack, as a deliberate third family

`:root:lang(ja)` sets `--font-sans` to Instrument Sans followed by Hiragino Sans, Hiragino Kaku
Gothic ProN, Yu Gothic Medium, Yu Gothic, Meiryo, Noto Sans JP and Noto Sans CJK JP. No Japanese
webfont is downloaded.

A subsetted Japanese webfont is not a 20KB decision. A gothic covering JIS level 1 and 2 is
megabytes; even an aggressive per-page subset is an order of magnitude above this site's entire
current font payload, and it would have to be built and verified per page.

**The honest consequence: `/ja/` renders differently on macOS, Windows and Android.** Hiragino Sans
is lower-contrast with a smaller apparent size than Yu Gothic, which is lighter and more open than
Noto Sans JP. The page will not be the same picture on the three platforms, and the design must not
depend on it being so. This is the reason the Japanese block sets leading and measures rather than
optical corrections to one particular face.

Instrument Sans stays first in the stack so Latin runs — `DynamoDB`, `P01`, `REV.01`, `0→1` — keep
the site's Latin voice, but it is declared on `/ja/` **without preload**: those runs are a minority
of a Japanese page, the metric-adjusted fallback paints them immediately with no layout shift, and a
Japanese reader should not wait on three Latin files.

IBM Plex Mono has no CJK, so the Japanese `--font-mono` appends the same gothics. Without them a
translated metadata label falls back to whatever the platform picks for monospace CJK, which on
Linux is usually a serif.

### 3. IBM Plex Mono gains the Cyrillic subset

`subsets: ['latin', 'cyrillic']`. Astro emits one `@font-face` per subset with its own
`unicode-range`, verified in the built HTML, so an English page declares the Cyrillic faces and
never fetches them.

### 4. Preloads are per locale

| Locale | Preloaded | Bytes |
|---|---|---|
| English | Instrument Sans latin 400/600/700 | 51,280 |
| Russian | Golos Text cyrillic 400/600/700 + latin 700 | 33,588 |
| Japanese | nothing | 0 |

The Russian set is measured rather than assumed. Golos Text emits one file per weight *and* subset,
so an unfiltered weight list preloads six files (57,880 bytes); Astro's preload filter takes a
`subset`, which narrows it. The largest-contentful-paint element on the built home page is the
`h1.hero-name` wordmark at 1440px — Latin, weight 700 — and the `p.promise` line at 390px, which is
body text at weight 400. Hence Cyrillic 400/600/700 for the page's own script plus Latin 700 for the
wordmark. `scripts/check-i18n.mjs` now enforces this table per document.

## Alternatives

- **A Cyrillic-capable face to replace Instrument Sans in all locales.** One family, no `:lang()`
  switch. Rejected: it changes every English page, which is the one thing this work must not do, and
  it would trade a face chosen for the design for one chosen for its coverage.
- **Golos Text with the `cyrillic` subset only, falling back to Instrument Sans for Latin.** Saves
  36,672 bytes on disk but makes a Russian page load two families and sets Latin words inside Russian
  sentences in a different grotesque. Rejected.
- **A subsetted Japanese webfont.** Rejected on weight; see above. Revisit if `/ja/` ever becomes
  the primary locale.
- **Noto Sans JP from a CDN.** Rejected by ADR-0004's reasoning, which has not changed: a
  third-party request on every route, with privacy and performance cost.
- **Keeping the unconditional three-face preload.** Simplest, and wrong in exactly the way
  `.ai/engineering/performance.md` names.

## Consequences

- Three families, one per script, which is the recorded decision `.ai/design/typography.md` requires.
- The `_astro` woff2 budget rises from 5 files / 80,876 bytes to 13 files / 155,572 bytes. Six of
  those thirteen are Golos Text and are referenced by no document until `/ru/` is emitted; until
  then they are files on disk that no browser requests.
- A Russian page costs *less* at high priority than an English one: 33,588 bytes against 51,280.
- `/ja/` has no font cost and no font control. Its appearance is the reader's platform's.
- The build still needs network access, and still has no font dependency in `package.json`.
- The Japanese block gives the Latin wordmark the Japanese display tokens (tracking 0, leading
  1.02). That is visible on `/ja/` and is left to the stage that composes the Japanese hero.

## Revisit when

Instrument Sans ships Cyrillic; `/ja/` becomes a primary locale and justifies a subsetted Japanese
face; a fourth script is added; or the largest-contentful-paint element of a locale's home page
changes, which changes the preload table above.
