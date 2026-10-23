# ADR-0007: Google Analytics 4, emitted only by the deploy build

Status: Accepted
Date: 2026-10-24

## Context

The site is published to measure interest: `.ai/product/goals.md` makes conversion into
conversations the primary outcome, and the services page now carries price floors and a booking
link. Nothing recorded which pages a visitor reads before mailing or booking, so there was no way to
tell whether the work entries, the notes or the services page carry that path.

Ivan supplied a GA4 property (`G-THDMME77PX`) and asked for its tag on the site. Two project rules
bear on it. `.ai/engineering/dependencies.md` disallows "analytics that add cookies or invasive
tracking without explicit approval" — the request is that approval, recorded here.
`.ai/decisions/README.md` requires an ADR for a material change to analytics.

The constraint that shaped the implementation is `.ai/engineering/architecture.md`: zero client
JavaScript by default, which `e2e/routes.spec.ts` holds as an equality against an empty list of
script requests. gtag.js is the first script the site has ever shipped.

## Decision

Emit the standard gtag.js snippet from `src/components/core/Analytics.astro`, last in `<head>` of
`BaseLayout.astro`, on every route and in all three locales.

Gate it on `ANALYTICS=on`, set in the build step of `.github/workflows/deploy.yml` and nowhere else.
The measurement ID lives in `src/data/analytics.ts` with the other published codes; the flag decides
only whether it is emitted.

Both tags carry `is:inline`, so no bundle enters the build graph and `window.gtag` stays global.

## Alternatives

- **A cookieless analytics service** (Plausible, Umami, GoatCounter). Fewer privacy obligations and
  a smaller script, but a paid subscription or a server to run, and Ivan already has the GA4
  property. Reconsider if a consent banner becomes necessary — see *Revisit when*.
- **GitHub Pages access logs.** Do not exist. There is no server-side alternative on this host.
- **Default on, with an opt-out for tests.** Inverted the failure mode: every CI run, every
  `pnpm run build` and every `astro dev` session would be counted, and the author's own browsing
  would be most of a low-traffic portfolio's data. The opt-in costs one line in one workflow.
- **The ID in CI configuration instead of the repository.** It is public either way — it travels in
  the page source. Keeping it in `src/data/` means the repository, which this portfolio treats as
  evidence, states what the deployed site does.

## Consequences

- The deployed site makes a third-party request and sets `_ga` cookies. It has no consent banner and
  no privacy page, which is an open obligation towards EU and UK visitors under ePrivacy/GDPR and is
  deliberately recorded as unfinished rather than implied to be handled.
- Every other build still ships zero bytes of client JavaScript, so the no-JS test keeps its strict
  assertion and still catches a component that starts shipping JavaScript.
- The analytics tag is untested end to end: Playwright exercises a build without it. `measurementId`
  is unit-tested, and the deploy build's output is verified by hand.
- Enhanced measurement covers outbound clicks and file downloads, so the GitHub, LinkedIn, booking
  and CV-download links are measured without per-link code.

## Revisit when

- EU or UK traffic becomes a material share of visitors, which turns the consent gap into a real
  obligation: either add a consent gate before the tag or move to a cookieless service.
- A second script is needed. The gate and the "only script on the site" comments assume there is
  exactly one.
- Google changes the snippet, or the property is replaced.
