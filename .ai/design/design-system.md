# Design System

## Color tokens

Starting palette:

```css
--surface-paper: #f2f0e8;
--surface-paper-elevated: #faf9f4;
--surface-ink: #151515;
--text-primary: #151515;
--text-secondary: #595957;
--line-default: #c8c4b8;
--line-strong: #8d897f;
--signal: #e24421;
--signal-soft: #f7d7cf;
--focus: #165dff;
```

The focus color is functional and may differ from the brand signal color to preserve visible focus states.

## Spacing

Use a restrained scale:

```css
--space-1: 0.5rem;   /* 8 */
--space-2: 0.75rem;  /* 12 */
--space-3: 1rem;     /* 16 */
--space-4: 1.5rem;   /* 24 */
--space-5: 2rem;     /* 32 */
--space-6: 3rem;     /* 48 */
--space-7: 4rem;     /* 64 */
--space-8: 6rem;     /* 96 */
```

Use fluid spacing with `clamp()` for section padding. Avoid arbitrary values unless the composition requires a documented optical correction.

## Radius

```css
--radius-0: 0;
--radius-1: 2px;
--radius-2: 4px;
--radius-round: 999px;
```

`--radius-round` is only for genuine pills: tags, statuses, or compact controls whose meaning benefits from the shape.

## Lines and shadows

- Prefer 1px rules and surface contrast over card shadows.
- Use shadows only when elevation communicates layering or temporary UI.
- Never use glow as decoration.

## Components

Create only components justified by repeated behavior:

- site header and mobile navigation;
- text link and action link;
- project index entry;
- metadata list;
- capability row;
- architecture diagram primitives;
- article/case-study navigation;
- accessible disclosure when needed.

Avoid a generic card component that erases meaningful differences among content types.

## Token discipline

- Use CSS custom properties for semantic tokens.
- Components consume semantic tokens, not raw hex values.
- Name by purpose, not appearance: `--text-secondary`, not `--gray-600` at the component layer.
- Any new token needs at least two credible consumers or a clear semantic reason.

