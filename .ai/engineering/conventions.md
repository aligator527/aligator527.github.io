# Engineering Conventions

## TypeScript

- Enable strict mode.
- Avoid `any`; explain unavoidable boundaries.
- Prefer narrow domain types over generic object maps.
- Validate external or content data at boundaries.
- Do not export implementation details without a consumer.

## Astro and React

- Use `.astro` for pages, layouts, and static components.
- Use `.tsx` only for justified islands or reusable interactive logic.
- Every `client:*` directive must have a reason.
- Do not hydrate content that is already present in HTML.
- Avoid global state unless the product requirement genuinely spans islands.

## CSS

- Use semantic tokens from `tokens.css`.
- Prefer logical properties.
- Use container queries when component context matters.
- Keep selector specificity low.
- Avoid styling through generated or brittle DOM structure.
- No inline magic-number style objects for layout.
- Document deliberate optical exceptions.

## HTML

- Use native semantic elements.
- Links navigate; buttons perform actions.
- Preserve heading hierarchy.
- Use lists, tables, figures, and descriptions when their semantics fit.

## Naming

- Components: PascalCase.
- Functions and variables: camelCase.
- Content slugs and CSS files: kebab-case.
- CSS custom properties: semantic kebab-case.
- Tests mirror the subject name.

## Comments

Explain why a non-obvious constraint exists. Do not narrate obvious syntax.

## Git discipline

- Keep changes scoped.
- Do not rewrite unrelated files.
- Do not force-push or rewrite history.
- Do not commit generated build output unless the deployment model explicitly requires it.

