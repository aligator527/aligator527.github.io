# Motion

## Principle

Motion explains state, hierarchy, causality, or navigation. It is not a substitute for composition.

## Allowed patterns

- A restrained project-preview transition tied to hover/focus.
- Architecture lines activating to explain data flow.
- Layout elements moving consistently during route or state transitions.
- Reading progress on long case studies.
- Small feedback transitions for navigation and controls.

## Constraints

- Prefer CSS transitions and Web Animations before adding a runtime library.
- Keep common interface transitions near 120–240ms.
- Avoid elastic easing for ordinary UI.
- Never delay access to content for an entrance animation.
- Never animate every section with the same fade-up preset.
- Do not hijack scrolling.
- No autoplay audio or video.
- No cursor replacement.

## Reduced motion

Honor `prefers-reduced-motion: reduce` by removing nonessential transforms, parallax, stagger, and animated diagram sequences. Preserve state changes without relying on motion alone.

## Performance

Animate opacity and transform when possible. Measure before using filter, blur, large fixed layers, canvas, WebGL, or continuous pointer tracking.

