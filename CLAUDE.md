# Ivan Dolgov Engineering Portfolio

This repository is a public engineering portfolio. Treat the site itself as evidence of engineering quality.

Read and follow:

- @.ai/product/goals.md
- @.ai/product/positioning.md
- @.ai/design/art-direction.md
- @.ai/design/anti-ai.md
- @.ai/content/facts.md
- @.ai/content/translation.md
- @.ai/content/claims.md
- @.ai/engineering/architecture.md
- @.ai/qa/definition-of-done.md

## Core rules

- Build an **Engineering Editorial / Systems Dossier**, not a generic developer landing page.
- Preserve static GitHub Pages compatibility.
- Use Astro and HTML-first rendering; add React only for justified interactive islands.
- Use custom CSS and project tokens. Do not introduce a component library or Tailwind without an approved ADR.
- Do not invent employers, roles, dates, clients, metrics, testimonials, awards, users, or outcomes.
- Treat `.ai/content/facts.md` as the factual source of truth. Mark missing information as `TBD` and ask.
- Never expose secrets, private client details, NDA material, or personal data not approved for publication.
- Accessibility, responsive behavior, semantic HTML, and reduced-motion support are mandatory.
- Keep dependencies minimal and explain every new runtime dependency.
- Inspect existing structure and uncommitted changes before editing. Preserve unrelated work.
- Run the relevant validation commands before declaring a task complete.
- Never deploy, push, force-push, publish, or modify repository settings unless the user explicitly asks.

## Working method

1. Read the relevant `.ai` files and existing implementation.
2. State assumptions and identify missing facts.
3. Make the smallest coherent change.
4. Validate behavior, visuals, accessibility, and the static production build.
5. Report what changed, evidence from validation, and remaining risks.

Use project skills for repeatable workflows: `/design-review`, `/case-study`, `/qa`, and `/deploy`.

