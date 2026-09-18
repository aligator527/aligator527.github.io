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

export const capabilities: Record<CapabilityId, { label: string; detail: string }> = {
  requirements: {
    label: 'Requirements & client coordination',
    detail: 'Defining and documenting what a system has to do, with the client',
  },
  architecture: {
    label: 'Architecture & technology selection',
    detail: 'Technical planning and technology decisions',
  },
  leadership: {
    label: 'Project leadership',
    detail: 'Planning and coordination of delivery teams',
  },
  frontend: {
    label: 'Frontend engineering',
    detail: 'Web and mobile client applications',
  },
  backend: {
    label: 'Backend & APIs',
    detail: 'Server-side services and APIs',
  },
  cloud: {
    label: 'Cloud infrastructure',
    detail: 'Cloud infrastructure and deployment on AWS',
  },
  security: {
    label: 'Authentication & security',
    detail: 'Authentication, authorization, and security as an architecture concern',
  },
  integration: {
    label: 'System integration',
    detail: 'WMS/WCS integration planning',
  },
  standards: {
    label: 'Standards & code review',
    detail: 'Engineering guidelines, architecture standards, and code review',
  },
  release: {
    label: 'Release & production support',
    detail: 'Getting changes into production and supporting them there',
  },
};
