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
│   ├── core/
│   ├── diagrams/
│   ├── navigation/
│   └── work/
├── content/
│   ├── config.ts
│   ├── work/
│   ├── lab/
│   └── notes/
├── layouts/
├── pages/
├── scripts/
├── styles/
│   ├── reset.css
│   ├── tokens.css
│   ├── global.css
│   └── utilities.css
└── utils/
```

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

