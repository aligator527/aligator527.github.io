---
paths:
  - "src/**/*.css"
  - "src/**/*.astro"
  - "src/**/*.{ts,tsx}"
---

# Styling Rules

- Read `.ai/design/` before changing visible UI.
- Use semantic CSS variables from the design system.
- Prefer custom CSS, cascade layers, logical properties, modern layout, and container queries.
- Keep specificity low and avoid `!important` except for a documented interoperability edge.
- Follow the restrained radius scale; pills are only for real tags/status/compact controls.
- Do not introduce Tailwind, shadcn/ui, MUI, Bootstrap, or a theme kit without an accepted ADR.
- Avoid generic grids of identical rounded cards.
- Use controlled asymmetry and content-dependent project compositions.
- Verify responsive behavior rather than merely stacking desktop columns.
- Run the anti-AI tests before completing any major visual change.

