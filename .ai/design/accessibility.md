# Accessibility

Target WCAG 2.2 AA as the minimum baseline.

## Structure

- Use landmarks and one meaningful page-level heading.
- Preserve logical heading order.
- Use native elements before ARIA.
- Provide a skip link.
- Ensure navigation has an accessible name and current-page indication.

## Interaction

- Everything interactive must work with keyboard alone.
- Focus must be visible and never removed without replacement.
- Hover-only content must also appear on focus and have a touch/mobile path.
- Do not use color alone to communicate state.
- Maintain adequate target sizes and separation.

## Content and media

- Write useful alt text for informative images.
- Use empty alt text for purely decorative images.
- Explain complex diagrams in nearby text or an accessible data structure.
- Caption video and provide transcripts for meaningful audio.

## Visual

- Validate contrast in default, hover, focus, active, and disabled states.
- Support 200% browser zoom and text resizing without loss of content.
- Avoid fixed heights for text-bearing containers.
- Test at 320px CSS width.

## Motion

- Follow `.ai/design/motion.md`.
- Do not rely on animation to reveal essential content.

## Testing

Combine automated checks with manual keyboard, focus-order, zoom, reduced-motion, and screen-reader spot checks. Automated tools cannot prove accessibility.

