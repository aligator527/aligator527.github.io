# Accessibility Review

## Automated

- Run configured axe checks.
- Run HTML/build validation available in the project.
- Treat automation as defect detection, not proof of compliance.

## Manual keyboard

- Reach every interactive element.
- Confirm logical focus order.
- Confirm focus is always visible.
- Open and close navigation/disclosures without a pointer.
- Ensure no keyboard trap.

## Manual visual

- 200% zoom.
- 320px viewport.
- High text density in case studies.
- Reduced motion.
- System high-contrast/forced-colors spot check where supported.

## Semantics

- Landmarks and one meaningful H1.
- Correct heading sequence.
- Links versus buttons.
- Lists and tables represented semantically.
- Current navigation state available programmatically.

## Media and diagrams

- Alt text matches purpose.
- Decorative images are ignored.
- Architecture diagrams have nearby prose or structured explanation.
- No information is encoded by color alone.

## Output

Classify findings as blocking, serious, moderate, or advisory. Include reproduction steps and affected route/component.

