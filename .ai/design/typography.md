# Typography

## Recommended families

- Display and body: **Instrument Sans**.
- Technical annotations and metadata: **IBM Plex Mono**.

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

