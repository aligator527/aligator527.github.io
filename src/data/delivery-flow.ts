/**
 * The homepage flow: stages of a system's life, each tied to the work entries whose
 * documented scope covers that stage. Codes must match work frontmatter.
 */
export const deliveryFlow = [
  {
    stage: 'Requirements',
    detail: 'Defining and documenting what the system has to do, with the client',
    evidence: ['P04'],
  },
  {
    stage: 'Architecture',
    detail: 'Choosing the technical approach and proving the risky parts first',
    evidence: ['P01', 'P02'],
  },
  {
    stage: 'Implementation',
    detail: 'Building the clients, services, and infrastructure',
    evidence: ['P02', 'P03', 'P04'],
  },
  {
    stage: 'Release',
    detail: 'Code review, engineering standards, and getting releases out',
    evidence: ['P02', 'P03'],
  },
  {
    stage: 'Operation',
    detail: 'Keeping it running: performance, migrations, production support',
    evidence: ['P03', 'P04'],
  },
] as const;
