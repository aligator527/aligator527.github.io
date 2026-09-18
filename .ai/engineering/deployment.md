# GitHub Pages Deployment

## Required model

- Astro static output.
- GitHub Actions deployment.
- Committed `pnpm-lock.yaml`.
- GitHub Pages source set to **GitHub Actions**.

Use the current official Astro GitHub Pages action rather than copying an old workflow version from this document. Verify action versions against the official Astro deployment guide when implementing or updating the workflow.

## Astro configuration

For a project page:

```js
export default defineConfig({
  site: 'https://<github-user>.github.io',
  base: '/<repository-name>',
  output: 'static',
})
```

For `<github-user>.github.io` or a custom domain, `base` is normally omitted.

## Base-path rule

All internal URLs and asset references must work under a repository subpath. Prefer Astro URL helpers and `import.meta.env.BASE_URL` instead of hardcoded root-relative paths.

## Custom domain

When approved:

- add `public/CNAME` containing only the domain;
- set `site` to the final HTTPS origin;
- remove repository `base` if the custom domain serves from `/`;
- verify DNS and HTTPS before announcing completion.

## Deployment safety

- `/deploy` is manual-only.
- Never deploy uncommitted or failing changes.
- Never modify repository Pages settings without explicit permission.
- Never expose secrets as `PUBLIC_*` variables.
- GitHub Pages is public; treat repository content and generated output as publishable.

## Pre-deploy checks

1. Clean install using the lockfile.
2. Lint and typecheck.
3. Unit and browser tests.
4. Static build.
5. Broken-link and base-path review.
6. Accessibility and visual smoke tests.
7. Inspect the generated output for private data.

