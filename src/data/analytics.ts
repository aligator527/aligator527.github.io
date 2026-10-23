/**
 * Google Analytics 4, the only third-party request the site makes.
 *
 * The measurement ID is public by construction: it travels in the page source and in every request
 * to Google's collector. So it belongs here, with the other published codes, rather than in CI
 * configuration — a reader of this repository can see that the deployed site is measured, and the
 * property is changed in one place. Source: the GA4 property for aligator527.github.io, supplied by
 * Ivan on 2026-10-24.
 */
export const MEASUREMENT_ID = 'G-THDMME77PX';

/**
 * Opt-in, never opt-out. `ANALYTICS=on` is set by the deploy workflow (.github/workflows/deploy.yml)
 * and by nothing else, so the dev server, a local `pnpm run build`, the CI quality build and the
 * Playwright build all keep the site's usual zero bytes of client JavaScript. Two things follow from
 * that: the `ships no client JavaScript bundles` test still means what it says, and no hit from a
 * developer's own browsing or from a CI run is ever counted as a visitor.
 */
export const measurementId = (
  env: Record<string, string | undefined> = process.env,
): string | undefined => (env.ANALYTICS === 'on' ? MEASUREMENT_ID : undefined);
