# Performance Budget

## Targets

| Metric | Target |
|---|---|
| LCP | ≤ 2.0s at the 75th percentile target condition |
| CLS | ≤ 0.05 |
| INP | ≤ 200ms |
| Initial client JS | ≤ 100KB gzip target; prefer materially less |
| Route HTML | Keep purposeful and inspect large increases |
| Fonts | Only used families, scripts, and weights |

These are design constraints, not numbers to game.

## Rules

- Static HTML first.
- Responsive images with explicit dimensions.
- Lazy-load below-the-fold media.
- Do not lazy-load the LCP image.
- Avoid autoplay video.
- No WebGL or continuous canvas loop by default.
- No third-party script without measured value.
- Prevent font-induced layout shift.
- Keep architecture diagrams vector-based and optimized.
- Test the production build, not only development mode.

## Regression review

When adding a dependency, font, video, animation system, or major image:

1. Compare production bundle/output before and after.
2. Explain the cost.
3. Remove unused code and assets.
4. Confirm reduced-motion and low-power behavior.

