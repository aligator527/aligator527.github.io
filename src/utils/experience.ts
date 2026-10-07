import { getCollection, type CollectionEntry } from 'astro:content';
import { monthIndex } from './dates';
import type { Locale } from './i18n';
import { getWorkIndex, type WorkEntry } from './work';

export type Role = CollectionEntry<'experience'>;

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
  const [unsorted, work] = await Promise.all([getCollection('experience'), getWorkIndex(locale)]);
  for (const role of unsorted) {
    const slug = role.data.work;
    if (slug !== undefined && !work.has(slug)) {
      throw new Error(
        `Role "${role.id}" in roles.yaml references work "${slug}", which is not a work entry. ` +
          `Known slugs: ${[...work.keys()].join(', ')}.`,
      );
    }
  }
  const roles = unsorted.sort(
    (a, b) => monthIndex(b.data.startDate) - monthIndex(a.data.startDate),
  );
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
