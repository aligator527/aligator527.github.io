/**
 * The homepage flow: stages of a system's life, each tied to the work entries whose documented
 * scope covers that stage. Codes must match work frontmatter.
 *
 * Only the ids and the evidence live here; each stage's name and description are wording, and sit
 * in the dictionaries (`t.deliveryFlow`) so that a Russian page does not announce "Requirements".
 */
export const deliveryFlow = [
  { id: 'requirements', evidence: ['P04'] },
  { id: 'architecture', evidence: ['P01', 'P02'] },
  { id: 'implementation', evidence: ['P02', 'P03', 'P04'] },
  { id: 'release', evidence: ['P02', 'P03'] },
  { id: 'operation', evidence: ['P03', 'P04'] },
] as const;
