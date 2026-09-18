---
paths:
  - "astro.config.*"
  - ".github/workflows/**/*"
  - "public/**/*"
  - "src/**/*.{astro,ts,tsx,css}"
---

# GitHub Pages Rules

- Preserve Astro static output.
- Use the current official Astro GitHub Pages action and verify version numbers against official documentation when editing the workflow.
- Commit the pnpm lockfile.
- Configure `site` and, for a repository project page, `base`.
- Do not hardcode root-relative internal links that break under a repository base path.
- Treat everything in the repository and generated site as publicly accessible.
- Never place secrets in `PUBLIC_*` variables.
- Do not deploy or alter GitHub Pages settings unless explicitly requested.
- Before deployment, run the full release checklist in `.ai/engineering/deployment.md`.

