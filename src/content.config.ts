import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CAPABILITY_IDS } from './data/capabilities';
import { LOCALES, DEFAULT_LOCALE } from './utils/i18n';

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

const capability = z.enum(CAPABILITY_IDS);

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z
    .object({
      /**
       * The language this file is written in, and the folder it lives in: `work/en/...`,
       * `work/ru/...`. Required with no default — a default would let a translated file silently
       * claim to be English, and the locale is what decides which pages it builds.
       */
      locale: z.enum(LOCALES),
      /**
       * Where a translation came from and whether a human has read it. Required on every file that
       * is not in the default locale; `reviewedOn` stays absent until the author has actually read
       * the translation, which is the gate `INDEXABLE_LOCALES` is released against.
       */
      translation: z.object({ source: z.enum(LOCALES), reviewedOn: isoDate.optional() }).optional(),
      code: z.string().regex(/^P\d{2}$/),
      title: z.string(),
      summary: z.string(),
      role: z.string(),
      organization: z.string().optional(),
      // Omitted when the source does not state the engagement type.
      engagementType: z.enum(['contract', 'freelance']).optional(),
      startDate: yearMonth,
      endDate: yearMonth.nullable(),
      status: z.enum(['active', 'complete']),
      domains: z.array(z.string()).min(1),
      capabilities: z.array(capability).min(1),
      technologies: z.array(z.string()),
      featured: z.boolean().default(false),
      order: z.number().int(),
      publicVisibility: z.enum(['public', 'anonymized', 'private']),
      depth: z.enum(['brief', 'case-study']),
      heroVariant: z.enum(['scope-map', 'stack-left', 'stack-right', 'delivery']),
      teamSize: z.string().optional(),
      /** Diagram data. Layers group responsibilities or technologies; they are not a runtime topology. */
      diagram: z.object({
        caption: z.string(),
        layers: z.array(z.object({ label: z.string(), items: z.array(z.string()).min(1) })).min(2),
      }),
      /**
       * Optional deployment topology: separately deployed units, each promoted through the same
       * environments. Drawn instead of the layer diagram on the case-study page.
       */
      environments: z
        .object({
          caption: z.string(),
          stages: z.array(z.string()).min(2),
          units: z
            .array(z.object({ name: z.string(), role: z.string(), items: z.array(z.string()) }))
            .min(2),
          shared: z.object({ label: z.string(), items: z.array(z.string()).min(1) }).optional(),
        })
        .optional(),
      /** Internal provenance, deliberately never rendered: it records where each fact came from. */
      sourceNote: z.string(),
      /** Optional per content-model.md; no entry uses it yet. */
      links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
    })
    .refine((entry) => entry.publicVisibility !== 'private', {
      message: 'Private work must not be committed to the public content collection',
    })
    .refine((entry) => entry.locale === DEFAULT_LOCALE || entry.translation !== undefined, {
      message: 'A translated entry must record where it was translated from',
    }),
});

const experience = defineCollection({
  loader: file('./src/content/experience/roles.yaml'),
  schema: z.object({
    organization: z.string(),
    organizationNote: z.string().optional(),
    role: z.string(),
    engagementType: z.enum(['contract', 'freelance']).optional(),
    startDate: yearMonth,
    endDate: yearMonth.nullable(),
    summary: z.string(),
    scope: z.array(z.string()).min(1),
    technologies: z.array(z.string()),
    work: z.string().optional(),
  }),
});

const principles = defineCollection({
  loader: file('./src/content/principles/principles.yaml'),
  schema: z.object({
    order: z.number().int(),
    title: z.string(),
    body: z.string(),
    evidence: z.string(),
    approved: z.boolean(),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['active', 'complete', 'archived']),
    technologies: z.array(z.string()),
    repository: z.url().optional(),
    demo: z.url().optional(),
    date: isoDate,
    featured: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    topics: z.array(z.string()),
    draft: z.boolean().default(true),
  }),
});

export const collections = { work, experience, principles, lab, notes };
