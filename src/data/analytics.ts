/**
 * Google Analytics 4, the only third-party request the site makes, and only after consent.
 *
 * The measurement ID is public by construction: it travels in the page source and in every request
 * to Google's collector. So it belongs here, with the other published codes, rather than in CI
 * configuration — a reader of this repository can see that the deployed site is measured, and the
 * property is changed in one place. Source: the GA4 property for aligator527.github.io, supplied by
 * Ivan on 2026-10-24.
 */
export const MEASUREMENT_ID = 'G-THDMME77PX';

/**
 * Where the visitor's choice is kept, and the only two values it ever holds.
 *
 * `localStorage`, not a cookie: remembering a consent decision is covered by the strictly-necessary
 * exemption, and a key that never leaves the browser is easier to say that about than a cookie that
 * rides on every request. The privacy page states it in those words, so the name is a fact shared
 * between the gate script and the prose rather than a string typed twice.
 */
export const CONSENT_STORAGE_KEY = 'analytics-consent';

/**
 * Data retention configured in the GA4 property, in months. Confirmed by Ivan on 2026-10-24.
 *
 * Stated on the privacy page, which is why it is a number here and not a sentence per locale:
 * GDPR Art. 13(2)(a) wants the period, and three translations of a period drift apart. Re-confirm
 * against Admin → Data collection and modification → Data retention when it changes.
 */
export const RETENTION_MONTHS = 14;

/**
 * Opt-in, never opt-out. `ANALYTICS=on` is set by the deploy workflow (.github/workflows/deploy.yml)
 * and by nothing else, so a build without it emits neither the tag nor the consent notice: there is
 * nothing to consent to, and no hit from a developer's own browsing or from a CI run is ever counted
 * as a visitor.
 */
export const measurementId = (
  env: Record<string, string | undefined> = process.env,
): string | undefined => (env.ANALYTICS === 'on' ? MEASUREMENT_ID : undefined);
