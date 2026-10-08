# Content Review

## Accuracy

- Compare claims with `.ai/content/facts.md` and source notes.
- Flag unsupported dates, scope, technologies, team sizes, metrics, and outcomes.
- Distinguish completed, current, and planned work.

## Attribution

- Separate personal contribution from team output.
- Avoid “built” when “contributed to,” “led,” or “implemented” is more accurate.
- Preserve collaborators and context.

## Clarity

- The opening paragraph answers what the page is about.
- Headings are informative rather than clever.
- Technical terms are explained when the audience may not know them.
- Paragraphs are concise and concrete.

## Credibility

- No generic self-praise.
- No buzzword chains.
- No fake precision.
- Tradeoffs and limitations appear where relevant.

## International English

- Avoid unexplained Japanese corporate abbreviations.
- Translate role titles by actual scope, not literal status inflation.
- Use consistent spelling and date formatting.

## Translated pages

Two passes, kept separate, because a reader checking that a sentence sounds natural does not notice
a missing hedge. `.ai/content/translation.md` holds the terminology and register rules; this is the
order to apply them in.

1. **Facts, against `facts.md`.** Numbers, dates, team sizes, every hedge («примерно», 約,
   "during the engagement"), every NDA disclaimer. Nothing present that `CLAUDE.local.md` holds
   back. A translation that is more confident than the English is a different claim.
2. **Register, read aloud.** Russian: a sentence you could not say out loud is канцелярит.
   Japanese: if it reads like 社内資料 or 就活 copy, reject it.

A locale joins `INDEXABLE_LOCALES` only after both passes. The build already guarantees the
mechanical half — parity of facts across locales, no untranslated string left on a translated page —
so a review that only checks those is a review that found nothing the build would not have.
