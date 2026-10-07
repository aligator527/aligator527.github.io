# Typography

## Recommended families

- Display and body: **Instrument Sans** (Latin and Cyrillic-free; see below).
- Russian display and body: **Golos Text**, under `:lang(ru)`.
- Japanese display and body: a **system gothic stack**, under `:lang(ja)`. Nothing is downloaded.
- Technical annotations and metadata: **IBM Plex Mono**, Latin and Cyrillic.

One family per script, recorded in ADR-0006. Instrument Sans has no Cyrillic and no CJK, which is
what forces the count past two.

Use locally hosted WOFF2 subsets when licensing permits. Provide system fallbacks and avoid loading unused weights.

## Roles

| Role | Family | Direction |
|---|---|---|
| Hero display | Instrument Sans | Bold, tight tracking, fluid 64–128px |
| H1 | Instrument Sans | SemiBold, fluid 44–72px |
| H2 | Instrument Sans | SemiBold, fluid 32–48px |
| Body large | Instrument Sans | Regular, 19–22px |
| Body | Instrument Sans | Regular, 16–18px |
| Meta | IBM Plex Mono | Medium, 11–13px, modest positive tracking |
| Code | IBM Plex Mono | Regular, readable rather than decorative |

## Rules

- Use optical hierarchy before color or decoration.
- Keep body measure near 60–75 characters.
- Avoid centered paragraphs longer than two short lines.
- Preserve comfortable line height: approximately 1.45–1.65 for body text.
- Do not uppercase long sentences. Uppercase is for compact metadata only.
- Do not use monospace for all content.
- Do not use more than two font families without a recorded decision.
- Prevent layout shift by preloading only the critical font subset and defining metric-compatible fallbacks where practical.

## Responsive type

Use `clamp()` with tested bounds. Do not scale every heading mechanically; preserve content hierarchy on small screens. Hero type may wrap intentionally, but individual words must not become narrow vertical threads.


## Measures

Every `max-inline-size` on running text comes from a token in `tokens.css`. A line length is a
property of the script, not of the component, so the whole scale is restated in one place per
locale. Values are in `ch` — the advance of "0" in whichever font renders the element.

| Token | English | Japanese | Sets |
|---|---|---|---|
| `--measure-title` | 16ch | 12ch | Case-study title, work-entry title, 404 heading |
| `--measure-title-wide` | 18ch | 14ch | Page-header title, footer contact heading |
| `--measure-lede-tight` | 34ch | 22ch | Home hero promise |
| `--measure-lede` | 48ch | 30ch | Work-entry summary |
| `--measure-lede-wide` | 52ch | 32ch | Page-header lede, case-study lead |
| `--measure-note-tight` | 40ch | 26ch | Environment-matrix unit role |
| `--measure-note` | 42ch | 27ch | Footer availability |
| `--measure-note-wide` | 44ch | 28ch | Section-heading note |
| `--measure-caption-tight` | 58ch | 36ch | Work-index entry summary |
| `--measure-caption` | 60ch | 38ch | Diagram and timeline captions, experience summary and scope, brief note |
| `--measure` | 68ch | 40ch | Prose (`.prose`), principles, lab and notes |

Russian keeps the English values. Cyrillic takes the same line lengths as Latin, and Golos Text's
narrower "0" already makes each measure about 7% narrower in pixels, which absorbs part of the
length Russian gains over English.

The Japanese column is not the English column doubled. Measured in the built page: with Instrument
Sans still supplying the digits, `1ch` is 0.667em while a CJK glyph is a full em, so the English
68ch measure would run to 45 Japanese characters a line. The Japanese values land between 8 glyphs
for a display title and 27 for body text.

The one `ch` left outside this system is the arrow offset in `EnvironmentMatrix.astro`
(`0.5ch`). It is half a glyph advance used to centre an arrow in a gutter, not a measure, and it is
meant to follow whichever mono renders the stage labels in any locale.

## Japanese setting

`:root:lang(ja)` in `tokens.css` holds the whole Japanese contract, including three real properties
in a file otherwise made of custom properties. Splitting a nine-line contract across two files is
how one of its lines gets lost.

| Decision | Value | Why |
|---|---|---|
| Display and heading tracking | `0` | Negative tracking is a Latin correction. CJK glyphs are drawn on a fixed body; tightening them closes gaps the characters are designed to have. |
| Display leading | `1.02` | Measured at 64px on Noto Sans CJK JP: at the English 0.95 successive lines visually touch, because a CJK glyph fills its em box. 1.02 is still far tighter than the 1.2–1.4 Japanese display type normally takes. |
| Heading leading | `1.25` | Same reason, at heading sizes. |
| Body leading | `1.8` | Dense full-width glyphs need more air between lines, not less. |
| `line-break: strict` | — | Kinsoku shori: do not start a line with a small kana or a closing bracket. Measured on a 40ch line, it moves a break from `アーキテク／チャ` back to `アーキテ／クチャ` rather than leaving `ャ` to open a line. |
| `text-spacing-trim: trim-start` | — | Trims the half-em an opening bracket carries when it lands at the start of a line. Measured against the initial value in Chromium 153: it changes the rendering. Ignored where unsupported. |
| `text-autospace: normal` | — | The quarter-em between CJK and the Latin runs this site is full of. Measured: the spacing is real (a 748px line becomes 759px without it), and `normal` is the initial value, so this declaration is documentation sitting next to the two above it. |

## Recorded decisions for non-Latin text

These were evaluated rather than inherited.

- **`overflow-wrap: break-word` on `p, h1–h4` (`reset.css`): kept.** It only acts on a run with no
  break opportunity, which in Russian means a long URL or a Latin technology token inside a Cyrillic
  sentence — exactly where it helps. It is inert for Japanese, whose line breaking is governed by
  `line-break`, not by word boundaries. The narrower `overflow-wrap: anywhere` on the footer channels
  and the hero email stays for the same reason.
- **`text-wrap: balance` on headings and `pretty` on paragraphs (`global.css`): kept for all
  locales.** Both operate on line boxes, not on words, so they behave in CJK as they do in Latin.
  Balance is the main wrapping aid available to Japanese headings until the item below ships.
- **`word-break: auto-phrase`: evaluated, deferred, and it works.** Measured on a 40ch body line in
  Chromium 153, it moves the break from inside `アーキテクチャ` to in front of it — a phrase
  boundary instead of a character boundary — and it beats `line-break: strict` to the same line. It
  does nothing on a 12ch display title, where no phrase fits the line anyway, and it does nothing at
  all unless the element is in a `lang="ja"` subtree, which is worth knowing before anyone tests it.
  Deferred rather than shipped because it is Chromium-only and because judging Japanese wrapping
  needs real Japanese copy, which arrives with the Japanese content stage. It is then a one-line
  addition to the `:lang(ja)` block.
- **`font-feature-settings: 'ss01' on` on `body` (`global.css`): kept, and measured inert.**
  Rendering the full ASCII set in Instrument Sans, the full Cyrillic alphabet in Golos Text, and a
  mixed Japanese line in the system stack, with the feature on and off, is pixel-identical in every
  case. A stylistic set is family-specific and the property cannot be scoped to one family, so
  re-measure this when a family is added or a variable font replaces a static subset.

## Known handover

The Latin wordmark inherits the Japanese display tokens, so on `/ja/` "Ivan Dolgov" is set with
tracking 0 and leading 1.02. The wordmark stays Latin in every locale, so the stage that composes
the Japanese hero decides whether it keeps its Latin tracking there.

The label columns in the hero rail, the footer channels, the work-entry facts and `MetaList` are
`minmax(<English width>, max-content)`: at least the width they have today, then content-sized,
because a translated label is not guaranteed to fit a track measured against English. The remaining
fixed tracks — the layer-name column in `LayerDiagram`, the unit column in `EnvironmentMatrix`, the
skills column in the résumé, the code columns in the work index — hold content rather than UI
labels, and need real translated content to size.
