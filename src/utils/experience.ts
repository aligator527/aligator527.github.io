import { getCollection, type CollectionEntry } from 'astro:content';
import { monthIndex } from './dates';
import { DEFAULT_LOCALE, type Locale } from './i18n';
import { assertTranslated, pick } from './localized';
import { getWorkIndex, type WorkEntry } from './work';

type PrincipleEntry = CollectionEntry<'principles'>;

/** A principle as one locale reads it; see `Role` for why the wording is resolved in the loader. */
export type Principle = Omit<PrincipleEntry, 'data'> & {
  data: Omit<PrincipleEntry['data'], 'title' | 'body' | 'evidence'> & {
    title: string;
    body: string;
    evidence: string;
  };
};

type RoleEntry = CollectionEntry<'experience'>;

/**
 * A role as one locale reads it: the collection entry with its translatable fields already resolved
 * to that locale's wording, so no page handles a `{ en, ru, ja }` object.
 */
export type Role = Omit<RoleEntry, 'data'> & {
  data: Omit<RoleEntry['data'], 'summary' | 'scope'> & { summary: string; scope: string[] };
};

/** Resolves one entry's wording, and refuses to publish a locale that is missing any of it. */
function localizeRole(role: RoleEntry, locale: Locale): Role {
  assertTranslated(role.data.summary, `roles.yaml (${role.id})`, 'summary');
  assertTranslated(role.data.scope, `roles.yaml (${role.id})`, 'scope');
  return {
    ...role,
    data: {
      ...role.data,
      summary: pick(role.data.summary, locale),
      scope: pick(role.data.scope, locale),
    },
  };
}

/**
 * Roles, most recent start first, with every `work:` reference resolved.
 *
 * `roles.yaml`'s `work:` field is a foreign key into the work collection, and YAML declares no such
 * thing: a Zod string schema accepts any value, including a slug that no longer exists. Resolving
 * every reference as the roles are loaded turns a typo or a renamed brief into a build failure with
 * a readable message, instead of a link that only the link checker would catch — and only while the
 * page that renders it still exists.
 */
async function loadRoles(locale: Locale): Promise<{ roles: Role[]; work: Map<string, WorkEntry> }> {
  const [unsorted, work, source] = await Promise.all([
    getCollection('experience'),
    getWorkIndex(locale),
    getWorkIndex(DEFAULT_LOCALE),
  ]);
  /*
   * The foreign key is checked against the DEFAULT locale, not the current one. A `work:` value
   * that names no entry at all is a typo and must fail the build; a value whose translation does
   * not exist yet is a locale mid-translation, and that locale simply renders the role without a
   * link. Checking against the current locale conflated the two and broke the build the moment
   * Japanese pages were emitted before Japanese case studies existed.
   */
  for (const role of unsorted) {
    const slug = role.data.work;
    if (slug !== undefined && !source.has(slug)) {
      throw new Error(
        `Role "${role.id}" in roles.yaml references work "${slug}", which is not a work entry. ` +
          `Known slugs: ${[...source.keys()].join(', ')}.`,
      );
    }
  }
  const roles = unsorted
    .sort((a, b) => monthIndex(b.data.startDate) - monthIndex(a.data.startDate))
    .map((role) => localizeRole(role, locale));
  return { roles, work };
}

/** Most recent start first. */
export async function getRoles(locale: Locale): Promise<Role[]> {
  return (await loadRoles(locale)).roles;
}

/**
 * Roles with their referenced work entry attached, so no page re-derives the link between the two.
 * A role whose `work:` is set always has an entry here, because `loadRoles` validated it.
 */
export async function getRolesWithWork(
  locale: Locale,
): Promise<{ role: Role; work: WorkEntry | undefined }[]> {
  const { roles, work } = await loadRoles(locale);
  return roles.map((role) => ({
    role,
    work: role.data.work === undefined ? undefined : work.get(role.data.work),
  }));
}

/**
 * Approved working principles, in order, with their wording resolved for one locale.
 *
 * `approved: false` is how a draft principle stays in the file without reaching a page, so the
 * filter is part of the contract rather than a convenience.
 */
export async function getPrinciples(locale: Locale): Promise<Principle[]> {
  const entries = await getCollection('principles');
  return entries
    .filter((entry) => entry.data.approved)
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => {
      for (const field of ['title', 'body', 'evidence'] as const) {
        assertTranslated(entry.data[field], `principles.yaml (${entry.id})`, field);
      }
      return {
        ...entry,
        data: {
          ...entry.data,
          title: pick(entry.data.title, locale),
          body: pick(entry.data.body, locale),
          evidence: pick(entry.data.evidence, locale),
        },
      };
    });
}
