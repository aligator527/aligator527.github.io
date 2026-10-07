/**
 * Identity and contact data approved for publication.
 * Source: .ai/content/facts.md (reviewed 2026-10-07). Update that file first when anything changes.
 */
export const profile = {
  name: 'Ivan Dolgov',
  descriptor: 'Tech Lead / Full-Stack Engineer',
  supportingLine: 'Web systems · architecture · cloud · enterprise software',
  promise:
    'I design and ship complex web systems — from requirements and architecture to production.',
  experience: '5+ years',
  location: 'Tokyo, Japan',
  timeZone: 'JST (UTC+9)',
  availability: 'Open to selected consulting and contract work, remote or international.',
  revision: '2026-10',
  email: 'ivan.d@wanya.group',
  github: { label: 'github.com/aligator527', href: 'https://github.com/aligator527' },
  linkedin: { label: 'linkedin.com/in/aligator527', href: 'https://linkedin.com/in/aligator527' },
  languages: [
    { code: 'RU', name: 'Russian', level: 'Native' },
    { code: 'JA', name: 'Japanese', level: 'Professional working proficiency (JLPT N1)' },
    { code: 'EN', name: 'English', level: 'Professional working proficiency' },
  ],
  education: [
    { title: 'MBA', institution: 'GLOBIS University', period: '2026/04–', status: 'In progress' },
    {
      title: 'Global Consumer Intelligence program',
      institution: 'Matsuo–Iwasawa Laboratory, The University of Tokyo',
      period: '2026–',
      status: 'In progress',
    },
  ],
  certifications: [
    { title: 'Fundamental Information Technology Engineer Examination', issuer: 'IPA Japan' },
    { title: 'Information Security Management Examination', issuer: 'IPA Japan' },
    { title: 'Japanese-Language Proficiency Test N1', issuer: 'JLPT' },
  ],
  technologies: [
    {
      area: 'Frontend',
      items: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'React Native',
        'TanStack',
        'MUI',
        'Tailwind CSS',
      ],
    },
    { area: 'Backend', items: ['Go', 'Java/Spring', 'PHP/Laravel', 'Python/Django', 'Node.js'] },
    {
      area: 'Cloud & infrastructure',
      items: [
        'AWS',
        'Terraform',
        'Lambda',
        'API Gateway',
        'AppSync',
        'DynamoDB',
        'Amplify',
        'S3',
        'CloudFront',
      ],
    },
    { area: 'Data & security', items: ['PostgreSQL', 'MySQL', 'DynamoDB', 'Keycloak'] },
    { area: 'AI', items: ['LLM integration', 'RAG', 'Workflow automation', 'Prompt engineering'] },
  ],
} as const;

export type Profile = typeof profile;
