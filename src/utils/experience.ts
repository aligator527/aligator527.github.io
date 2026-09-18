import { getCollection, type CollectionEntry } from 'astro:content';
import { monthIndex } from './dates';

export type Role = CollectionEntry<'experience'>;

/** Most recent start first. */
export async function getRoles(): Promise<Role[]> {
  const roles = await getCollection('experience');
  return roles.sort((a, b) => monthIndex(b.data.startDate) - monthIndex(a.data.startDate));
}
