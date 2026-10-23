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

## IndexNow

`public/754bed99eb2a2c59dba2f702cb2429b6.txt` holds an IndexNow key and nothing else. IndexNow
notifies Bing, Yandex, Seznam and Naver that pages changed; Google does not participate and has no
equivalent API, so Google is reached through the sitemap and, for a handful of URLs at a time, the
Request Indexing button in Search Console.

The protocol verifies ownership by fetching that file from the host root, so deleting or renaming
it silently invalidates every future submission. Submissions are a POST to `api.indexnow.org`
carrying the host, the key, the key's URL and the changed URLs — they are a notification, not a
promise, and a 200 means accepted rather than crawled.

`scripts/indexnow.mjs` does the submitting, and the deploy workflow runs it after the deployment
job. It reads the *live* sitemap, so it can only announce pages that are actually published, and
by default submits the URLs dated within the last seven days — the protocol asks for changed
pages, not whole sites, and `lastmod` is only set where there is a real content date. The
workflow's `indexnow` input switches that to `all` for a deploy that changes every page, or to
`skip`. The key is public by design, so no secret is involved: the script finds it by filename in
`public/`.

## DEV (dev.to)

`scripts/devto.mjs` publishes the English notes to DEV with `canonical_url` pointing back here, so
the copy on the stronger domain does not take the search result the original was written to win.
DEV honours that field; Zenn does not, which is why the Japanese articles in
`aligator527/zenn-content` are rewrites rather than copies.

The key is read from `DEV_API_KEY` at run time and is never committed or stored. Re-running is an
update, not a second post: the script lists the account's articles and matches on canonical URL,
so an edit here reaches DEV by running it again.

```bash
DEV_API_KEY=... node scripts/devto.mjs --dry-run
DEV_API_KEY=... node scripts/devto.mjs
```

A note's `figure` lives in frontmatter rather than in the body, so the diagrams stay on this site
— which is one more reason for a reader to follow the canonical link.

## Pre-deploy checks

1. Clean install using the lockfile.
2. Lint and typecheck.
3. Unit and browser tests.
4. Static build.
5. Broken-link and base-path review.
6. Accessibility and visual smoke tests.
7. Inspect the generated output for private data.

