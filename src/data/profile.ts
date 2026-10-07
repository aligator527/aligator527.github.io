import type { Dictionary } from '../i18n/ui';

/**
 * Identity and contact data approved for publication.
 * Source: .ai/content/facts.md (reviewed 2026-10-07). Update that file first when anything changes.
 */
export const profile = {
  name: 'Ivan Dolgov',
  /*
   * Latin in every locale, by the author's decision: this is how he is addressed professionally in
   * all three languages, and the Russian and Japanese renderings of the title either inflate it
   * towards CTO or deflate it towards implementation — see `src/i18n/ui/ru.ts`.
   */
  descriptor: 'Tech Lead / Full-Stack Engineer',
  timeZone: 'JST (UTC+9)',
  revision: '2026-10',
  email: 'ivan.d@wanya.group',
  github: { label: 'github.com/aligator527', href: 'https://github.com/aligator527' },
  linkedin: { label: 'linkedin.com/in/aligator527', href: 'https://linkedin.com/in/aligator527' },
  /*
   * Below: the invariant half of each record — codes, periods and issuers. The words a reader sees
   * (a language's name and level, a programme's title, an institution) live in the dictionaries and
   * are joined to these by id in `localizedProfile()`. Facts stay here once; their wording is
   * translated once per locale.
   */
  languages: [{ code: 'RU' }, { code: 'JA' }, { code: 'EN' }] as const,
  education: [
    { id: 'mba', period: '2026/04–', glossary: 'globis' },
    { id: 'gci', period: '2026–', glossary: 'matsuo-lab' },
  ] as const,
  certifications: [
    { id: 'fe', issuer: 'IPA Japan', glossary: 'ipa-exams' },
    { id: 'ism', issuer: 'IPA Japan', glossary: 'ipa-exams' },
    { id: 'jlpt', issuer: 'JLPT', glossary: 'jlpt-n1' },
  ] as const,
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

/**
 * The profile as a locale renders it: the invariant data above joined to the current dictionary's
 * wording. Components take this instead of `profile` wherever a string is user-visible, which is
 * why a missing translation is an `astro check` error rather than an English sentence on a Russian
 * page.
 */
export function localizedProfile(t: Dictionary) {
  return {
    ...profile,
    ...t.profile,
    languages: profile.languages.map((language) => ({
      ...language,
      ...t.profile.languages[language.code],
    })),
    education: profile.education.map((entry) => ({ ...entry, ...t.profile.education[entry.id] })),
    certifications: profile.certifications.map((entry) => ({
      ...entry,
      ...t.profile.certifications[entry.id],
    })),
  };
}

export type LocalizedProfile = ReturnType<typeof localizedProfile>;
