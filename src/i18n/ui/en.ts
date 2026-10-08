/**
 * English UI chrome.
 *
 * This file holds *chrome* only: labels, headings, orientation text, aria-labels and the fixed copy
 * that belongs to the interface rather than to a project. Facts live in `src/data/profile.ts`;
 * project prose lives in the content collections. Neither is duplicated here — anything that is a
 * fact is passed in as an argument instead, which is why several entries are functions.
 *
 * Deliberately NOT declared `as const`: with the literal types widened to `string`, this object's
 * type (`Dictionary`) describes a shape that the Russian and Japanese dictionaries can satisfy.
 * Components read properties (`t.navWork`), so a missing or misspelled key is an `astro check`
 * error rather than an empty string in the page.
 *
 * Interpolated entries are functions rather than templates assembled at the call site: a translator
 * needs the whole sentence, and word order is not a constant across languages.
 */
export const en = {
  // Chrome
  skipToContent: 'Skip to content',
  navLanguage: 'Language',
  navPrimary: 'Primary',
  navWork: 'Work',
  navLab: 'Lab',
  navExperience: 'Experience',
  navNotes: 'Notes',
  navAbout: 'About',
  navResume: 'Résumé',
  /** Revision marker, e.g. `Rev. 2026/10`. The month is already locale-neutral notation. */
  revision: (month: string) => `Rev. ${month}`,

  /*
   * The home page's <title>. A locale may add its own reading of the name here: the tab title is
   * metadata, and a reader searching in Cyrillic or katakana will not find a page whose title is
   * only Latin. The visible wordmark stays Latin everywhere.
   */
  siteTitle: (name: string, descriptor: string) => `${name} — ${descriptor}`,

  // Footer
  footerMark: 'END / CONTACT',
  footerHeading: 'If you have a system to design or ship, write to me.',
  footerEmail: 'Email',
  footerGithub: 'GitHub',
  footerLinkedin: 'LinkedIn',
  footerBase: 'Base',
  footerColophon: 'Static HTML · Astro · no client JavaScript',
  footerCopyright: (year: number, name: string) => `© ${year} ${name}`,

  /*
   * A parenthetical after an organisation's name. Japanese sets brackets full-width and without a
   * leading space, so the punctuation belongs to the locale rather than to the template.
   */
  organizationNote: (note: string) => ` (${note})`,

  // Shared metadata labels. The same slot in a work entry, a case study rail and a résumé row.
  labelRole: 'Role',
  labelOrganization: 'Organization',
  /** Narrow variant of `labelOrganization`, used where the column is a few characters wide. */
  labelOrganizationShort: 'Org',
  labelPeriod: 'Period',
  labelStatus: 'Status',
  labelEngagement: 'Engagement',
  labelTeam: 'Team',
  labelDomain: 'Domain',
  labelStack: 'Stack',
  labelId: 'ID',
  labelProject: 'Project',
  selectedWork: 'Selected work',

  // Work vocabulary. Keyed by the content-schema enums; `src/utils/work.ts` indexes these, so a new
  // enum member in `src/content.config.ts` becomes a type error here rather than a blank label.
  workStatus: { active: 'In progress', complete: 'Completed' },
  /** How much of an engagement is published: a brief states facts, a case study adds reasoning. */
  workDepth: { brief: 'Brief', 'case-study': 'Case study' },
  workRead: { brief: 'Read the brief', 'case-study': 'Read the case study' },
  engagement: { contract: 'Contract', freelance: 'Freelance' },

  // Dates. English pluralises, Russian and Japanese use invariant abbreviations (`1 г. 11 мес.`,
  // `1年11か月`), so the dictionary owns the whole rendering and `src/utils/dates.ts` owns only the
  // arithmetic. No plural-rule library is needed for any of the three locales.
  dates: {
    present: 'Present',
    year: (count: number) => `${count} yr${count > 1 ? 's' : ''}`,
    month: (count: number) => `${count} mo${count > 1 ? 's' : ''}`,
    /** Between the year and month parts: a space in English, nothing in Japanese. */
    separator: ' ',
  },

  // Home
  homeDescription: (descriptor: string, promise: string) => `${descriptor} in Tokyo. ${promise}`,
  heroSheet: 'Sheet 00 / Identity',
  heroProfileSummary: 'Profile summary',
  heroCurrent: 'Current',
  heroExperience: 'Experience',
  heroBase: 'Base',
  heroLanguages: 'Languages',
  heroStatus: 'Status',
  homeWorkNote:
    'Most recent first. Case studies explain decisions; briefs state only role, scope, and system facts that can be published.',
  homeAllWork: 'All work',
  homeChronology: 'Full chronology',
  homeCapabilitiesTitle: 'Capabilities, with evidence',
  homeCapabilitiesNote:
    'Each mark points to a project where the responsibility is documented. Unmarked does not mean unable; it means not shown here.',
  homePrinciplesTitle: 'Working principles',
  homePractice: (evidence: string) => `Practice: ${evidence}`,

  // Work index
  workDescription:
    'Professional engagements: warehouse management architecture, a 0→1 AI chat game platform, a production packaging SaaS, and five client projects across five industries.',
  workSheet: 'Sheet 01 / Work',
  workTitle: 'Work',
  workLead:
    'Professional engagements, most recent first. Case studies cover context, decisions, delivery, and what I would change. Briefs state only the role, scope, and system facts that can be published, and are expanded where more can be cleared.',
  workIndexHeading: 'Project index',

  // Case study
  studyDetails: 'Project details',
  studySections: 'Sections',
  studyContents: 'Contents',
  studyMoreWork: 'More work',
  studyBriefNote:
    'This page covers verified role, scope, and system facts only. Decisions and outcomes are not published here.',
  pagerPrevious: (code: string) => `← Previous · ${code}`,
  pagerNext: (code: string) => `Next · ${code} →`,

  // Experience
  experienceDescription: (name: string) =>
    `Career chronology of ${name}: Tech Lead, project lead, and full-stack engineer roles since 2021, plus education and certifications.`,
  experienceSheet: 'Sheet 02 / Experience',
  experienceTitle: 'Experience',
  experienceLead: (experience: string, location: string) =>
    `${experience} across technical leadership, contract product work, client delivery, and independent practice. Based in ${location}.`,
  chronologyTitle: 'Chronology',
  chronologyNote: 'Scope as stated in my current CV.',
  credentialsTitle: 'Education and certifications',
  educationLabel: 'Education',
  certificationsLabel: 'Certifications',
  languagesLabel: 'Languages',
  timelineFigure: 'Fig. 1',
  timelineCaption:
    'Engagements over time. Contract work overlapped with other roles; the chronology below lists each one in full.',
  timelineNow: 'Now',

  // About
  aboutDescription: (name: string) =>
    `${name} is a Tokyo-based Tech Lead and full-stack engineer working in Russian, Japanese, and English.`,
  aboutSheet: 'Sheet 03 / About',
  aboutTitle: 'About',
  aboutLead:
    'Tech Lead and full-stack engineer in Tokyo, working across requirements, architecture, implementation, and release.',
  aboutBackgroundTitle: 'Background',
  aboutLanguagesTitle: 'Languages',
  aboutLanguagesNote:
    'My day-to-day working environment is Japanese enterprise engineering, and I can run technical work in English or Russian as well.',
  aboutEngageTitle: 'Working together',

  // Résumé
  resumeDescription: (name: string) =>
    `Résumé of ${name}, Tech Lead and full-stack engineer in Tokyo: experience, technologies, education, certifications, and languages.`,
  resumeSheet: (revision: string) => `Résumé · Rev. ${revision}`,
  resumeDownload: 'Download PDF',
  resumeSummaryHeading: 'Summary',
  resumeSummary: (experience: string) =>
    `Tech Lead and full-stack engineer with ${experience} of experience. Technical planning and architecture, requirements definition, code review, and delivery of web systems on React, TypeScript, Go, and AWS, mostly in enterprise contexts. Currently Tech Lead for a warehouse management system in logistics.`,
  resumeExperienceHeading: 'Experience',
  resumeTechnologiesHeading: 'Technologies',
  resumeCredentialsHeading: 'Education and certifications',
  resumeLanguagesHeading: 'Languages',

  // Lab and Notes: built but unlisted until their collections hold entries.
  labDescription: (name: string) => `Public code, prototypes, and experiments by ${name}.`,
  labSheet: 'Lab / Unpublished',
  labTitle: 'Lab',
  labLead: 'Public code, prototypes, and experiments.',
  labEntriesHeading: 'Entries',
  /* Lab entry status, from the content schema's enum — never rendered raw. */
  labStatus: { active: 'Active', complete: 'Complete', archived: 'Archived' },
  labRepository: 'Repository',
  labDemo: 'Demo',
  labEmpty: 'No public entries yet.',
  notesDescription: (name: string) => `Engineering and architecture writing by ${name}.`,
  notesSheet: 'Notes / Unpublished',
  notesTitle: 'Notes',
  notesLead: 'Engineering and architecture writing.',
  notesArticlesHeading: 'Articles',
  notesEmpty: 'No published notes yet.',

  // 404
  notFoundTitle: 'Not found',
  notFoundDescription: 'The requested page does not exist.',
  notFoundStatus: 'Status 404 / Route not found',
  notFoundHeading: 'No page exists at this address.',
  notFoundLead: 'The link may be outdated, or the page may have moved.',
  notFoundRoutes: 'Where to go next',
  notFoundHome: 'Home',

  /*
   * The wording of the profile. The facts it describes live in `src/data/profile.ts`; this is the
   * language they are stated in, keyed by the ids that file carries. `localizedProfile()` joins the
   * two, so a locale cannot render an English credential by accident.
   */
  profile: {
    nameReading: 'Ivan Dolgov',
    supportingLine: 'Web systems · architecture · cloud · enterprise software',
    promise:
      'I design and ship complex web systems — from requirements and architecture to production.',
    experience: '5+ years',
    location: 'Tokyo, Japan',
    availability:
      'Open to selected consulting and contract work: remote from Tokyo, or with teams outside Japan.',
    languages: {
      RU: { name: 'Russian', level: 'Native' },
      JA: { name: 'Japanese', level: 'Professional working proficiency (JLPT N1)' },
      EN: { name: 'English', level: 'Professional working proficiency' },
    },
    education: {
      mba: { title: 'MBA', institution: 'GLOBIS University', status: 'In progress' },
      gci: {
        title: 'Global Consumer Intelligence program',
        institution: 'Matsuo–Iwasawa Laboratory, The University of Tokyo',
        status: 'In progress',
      },
    },
    certifications: {
      fe: { title: 'Fundamental Information Technology Engineer Examination' },
      ism: { title: 'Information Security Management Examination' },
      jlpt: { title: 'Japanese-Language Proficiency Test N1' },
    },
  },

  /* Delivery-flow stages, keyed by `src/data/delivery-flow.ts` ids. */
  deliveryFlow: {
    requirements: {
      stage: 'Requirements',
      detail: 'Defining and documenting what the system has to do, with the client',
    },
    architecture: {
      stage: 'Architecture',
      detail: 'Choosing the technical approach and proving the risky parts first',
    },
    implementation: {
      stage: 'Implementation',
      detail: 'Building the clients, services, and infrastructure',
    },
    release: {
      stage: 'Release',
      detail: 'Code review, engineering standards, and getting releases out',
    },
    operation: {
      stage: 'Operation',
      detail: 'Keeping it running: performance, migrations, production support',
    },
  },

  /* Capability vocabulary, keyed by `src/data/capabilities.ts` ids. */
  capabilities: {
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
    frontend: { label: 'Frontend engineering', detail: 'Web and mobile client applications' },
    backend: { label: 'Backend & APIs', detail: 'Server-side services and APIs' },
    cloud: { label: 'Cloud infrastructure', detail: 'Cloud infrastructure and deployment on AWS' },
    security: {
      label: 'Authentication & security',
      detail: 'Authentication, authorization, and security as an architecture concern',
    },
    integration: { label: 'System integration', detail: 'WMS/WCS integration planning' },
    standards: {
      label: 'Standards & code review',
      detail: 'Engineering guidelines, architecture standards, and code review',
    },
    release: {
      label: 'Release & production support',
      detail: 'Getting changes into production and supporting them there',
    },
  },

  flowFigure: 'Fig. 1',
  flowCaption: 'Where I work in a system’s life, with the projects that show each stage.',
  flowEvidence: 'Evidence: ',
  matrixCaption: 'Capabilities and the selected work that shows each one',
  matrixCapability: 'Capability',
  matrixYes: 'Yes',
  matrixNo: 'No',

  annotationAbout: (term: string) => `About ${term}`,

  /*
   * Glossary wording. Sources are in `src/data/glossary.ts`; each gloss states only what the page
   * it cites actually says. Superlatives an organisation publishes about itself with no stated
   * metric — "Japan's largest homebuilder", "leading WMS vendor", "Japan's largest business
   * school" — are deliberately absent.
   */
  glossary: {
    'daiwa-house':
      'A Japanese construction and real-estate group: ¥5.58 trillion in net sales, and in the Fortune Global 500 for 17 consecutive years.',
    frameworx:
      'A Daiwa House Group company founded in 2007, specialising in logistics systems: warehouse management and control software, and logistics consulting.',
    wms: 'A warehouse management system runs the work inside a warehouse — receiving, inspection, storage, stocktaking, shipping — and instructs the people doing it.',
    wcs: 'A warehouse control system drives the machinery instead: it controls automated equipment directly, where a WMS manages the work and the people.',
    'logistics-shortage':
      'Japan’s transport ministry estimated that, without countermeasures, trucking capacity could fall short by 14.2% in 2024 and 34.1% by 2030.',
    'ipa-exams':
      'A Japanese national examination, run by the Information-technology Promotion Agency under METI, certifying IT knowledge and skills at a defined level.',
    'jlpt-n1':
      'The most advanced level of the Japanese-Language Proficiency Test: the ability to understand Japanese used in a variety of circumstances.',
    globis:
      'A Tokyo graduate business school whose Japanese and English MBA programmes count about 13,180 current students and graduates.',
    'matsuo-lab':
      'A deep-learning laboratory at the University of Tokyo. Its endowed Global Consumer Intelligence course teaches data science and AI foundations.',
  },

  studyContext: 'Context',
  /* How each glossary term is named in running text; the gloss itself is in `glossary`. */
  glossaryTerm: {
    'daiwa-house': 'Daiwa House Group',
    frameworx: 'Frameworx',
    wms: 'WMS',
    wcs: 'WCS',
    'logistics-shortage': 'Japan’s logistics capacity',
    'ipa-exams': 'IPA examinations',
    'jlpt-n1': 'JLPT N1',
    globis: 'GLOBIS University',
    'matsuo-lab': 'Matsuo–Iwasawa Lab',
  },

  // Diagrams
  environmentsInOrder: (unit: string) => `${unit} environments, in promotion order`,
};

/**
 * The shape every locale must provide. English is the source of truth for the key set: a key that
 * exists only in a translation is a dead string, and a key missing from one is a type error.
 */
export type Dictionary = typeof en;
