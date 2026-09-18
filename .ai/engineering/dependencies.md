# Dependency Policy

## Default

Do not add a dependency until the requirement and native alternative have been evaluated.

## Required justification

For every new runtime dependency, record:

- the problem it solves;
- why browser/Astro/CSS functionality is insufficient;
- approximate client or build cost;
- maintenance and security considerations;
- how it is loaded and whether it affects every route.

## Disallowed by default

- shadcn/ui;
- Material UI;
- Ant Design;
- Bootstrap;
- generic template kits;
- large icon packages imported wholesale;
- animation libraries for simple transitions;
- analytics that add cookies or invasive tracking without explicit approval;
- full client-side routers.

## Tailwind

Do not add Tailwind by default. This portfolio’s custom CSS is part of the demonstrated frontend craft. Tailwind requires an ADR explaining why it improves this project without reintroducing generic utility-generated patterns.

## React

React is permitted for interactive islands, not as a reason to turn the whole site into an SPA.

## Fonts and icons

- Self-host minimal font subsets when licensing permits.
- Import individual SVG icons or maintain a small local icon set.
- Do not add an icon library for a handful of symbols.

