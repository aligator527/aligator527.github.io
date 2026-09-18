---
name: design-review
description: Audits a portfolio route or component against Engineering Editorial art direction, anti-AI constraints, responsive design, typography, motion, and accessibility. Use when asked to review or improve visual design.
allowed-tools: Read Grep Glob Bash
---

# Design Review

Review target: `$ARGUMENTS`

1. Read `.ai/design/` and `.ai/qa/visual-review.md` completely.
2. Identify the implementation files and existing screenshots or preview method.
3. Inspect desktop and mobile behavior when available.
4. Run every anti-AI originality test.
5. Review hierarchy, composition, typography, spacing, states, motion, accessibility, and content density.
6. Return PASS, NEEDS WORK, or FAIL with evidence.
7. Recommend the smallest set of high-impact corrections.

Do not modify files unless the user explicitly asks for fixes.

