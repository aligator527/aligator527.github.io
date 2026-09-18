---
paths:
  - "src/**/*.{ts,tsx,astro}"
  - "tests/**/*"
  - "e2e/**/*"
  - "playwright.config.*"
  - "vitest.config.*"
---

# Testing Rules

- Test behavior and contracts, not implementation trivia.
- Add unit tests for content transforms, URL helpers, filtering, and nontrivial logic.
- Add browser tests for primary navigation, selected work, résumé access, mobile navigation, and the 404 recovery path.
- Include keyboard and automated accessibility checks in browser coverage.
- Use deterministic fixtures; do not depend on live third-party services.
- Run tests against a production-like build when validating base paths and routing.
- Do not weaken assertions merely to make a test pass.

