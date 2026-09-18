import { getCollection } from 'astro:content';

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary navigation. Lab and Notes appear only once they hold published entries,
 * so visitors never land on an empty section from the header.
 */
let cached: Promise<NavItem[]> | undefined;

export function getPrimaryNav(): Promise<NavItem[]> {
  cached ??= buildPrimaryNav();
  return cached;
}

async function buildPrimaryNav(): Promise<NavItem[]> {
  const [lab, notes] = await Promise.all([
    getCollection('lab'),
    getCollection('notes', ({ data }) => !data.draft),
  ]);

  return [
    { label: 'Work', href: '/work/' },
    ...(lab.length ? [{ label: 'Lab', href: '/lab/' }] : []),
    { label: 'Experience', href: '/experience/' },
    ...(notes.length ? [{ label: 'Notes', href: '/notes/' }] : []),
    { label: 'About', href: '/about/' },
  ];
}
