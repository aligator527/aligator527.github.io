import { describe, expect, it } from 'vitest';
import { MEASUREMENT_ID, measurementId } from '../../src/data/analytics';

describe('measurementId', () => {
  it('returns the measurement ID only for a build that opted in', () => {
    expect(measurementId({ ANALYTICS: 'on' })).toBe(MEASUREMENT_ID);
  });

  it('returns nothing when the flag is absent, empty or anything else', () => {
    expect(measurementId({})).toBeUndefined();
    expect(measurementId({ ANALYTICS: '' })).toBeUndefined();
    /*
     * `ANALYTICS: on` unquoted in a workflow is YAML's boolean true, which reaches the process as
     * the string "true". The flag is exact-match for that reason: a half-configured deploy emits no
     * tag at all, rather than a tag the author cannot see in the output and did not intend.
     */
    expect(measurementId({ ANALYTICS: 'true' })).toBeUndefined();
    expect(measurementId({ ANALYTICS: '1' })).toBeUndefined();
    expect(measurementId({ ANALYTICS: 'ON' })).toBeUndefined();
  });

  it('reads the ambient environment when no environment is passed', () => {
    // What the component calls. The test process has no flag set, so the site's default holds.
    expect(measurementId()).toBeUndefined();
  });
});

describe('MEASUREMENT_ID', () => {
  it('is a GA4 measurement ID, not a Universal Analytics or container ID', () => {
    expect(MEASUREMENT_ID).toMatch(/^G-[A-Z0-9]+$/);
  });
});
