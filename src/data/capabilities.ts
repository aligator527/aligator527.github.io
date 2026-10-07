/**
 * Capability vocabulary for the homepage matrix and work frontmatter.
 * Each work entry claims capabilities only where facts.md documents the responsibility.
 */
export const CAPABILITY_IDS = [
  'requirements',
  'architecture',
  'leadership',
  'frontend',
  'backend',
  'cloud',
  'security',
  'integration',
  'standards',
  'release',
] as const;

export type CapabilityId = (typeof CAPABILITY_IDS)[number];

/*
 * The vocabulary itself is a list of ids. Each capability's label and one-line description are
 * wording and live in the dictionaries (`t.capabilities`), keyed by these ids, so that adding a
 * capability without translating it is an `astro check` error.
 */
