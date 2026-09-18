---
paths:
  - "src/**/*.{astro,ts,tsx,js,jsx}"
---

# Frontend Rules

- Use Astro for static pages and components.
- Introduce a React island only when stateful interaction cannot be expressed cleanly with HTML, CSS, or a small framework-free script.
- Every hydration directive requires an explicit reason.
- Keep interactive components small and independently testable.
- Preserve semantic HTML and progressive enhancement.
- Links navigate; buttons perform actions.
- Avoid generic `Card`, `Section`, or `Container` abstractions unless repeated semantics justify them.
- Do not add a global client store without an ADR.
- Keep route data in validated content collections or typed modules.
- Confirm all URLs work under the configured GitHub Pages base path.

