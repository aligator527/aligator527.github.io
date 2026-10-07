import { getCollection } from 'astro:content';
import { useTranslations } from '../i18n/ui';
import { localeHref, type Locale } from './i18n';

export interface NavItem {
  label: string;
  /** Ready for the browser: locale prefix and deployment base applied. */
  href: string;
  /** The same target without base or locale, which is what `isCurrent()` compares. */
  path: string;
}

/**
 * Primary navigation. Lab and Notes appear only once they hold published entries, so visitors never
 * land on an empty section from the header.
 *
 * Cached per locale: the collections are read once per locale per build, and the result is a small
 * array of strings.
 */
const cached = new Map<Locale, Promise<NavItem[]>>();

export function getPrimaryNav(locale: Locale): Promise<NavItem[]> {
  let nav = cached.get(locale);
  if (!nav) {
    nav = buildPrimaryNav(locale);
    cached.set(locale, nav);
  }
  return nav;
}

async function buildPrimaryNav(locale: Locale): Promise<NavItem[]> {
  const [lab, notes] = await Promise.all([
    getCollection('lab'),
    getCollection('notes', ({ data }) => !data.draft),
  ]);
  const t = useTranslations(locale);
  const item = (label: string, path: string): NavItem => ({
    label,
    path,
    href: localeHref(path, locale),
  });

  return [
    item(t.navWork, '/work/'),
    ...(lab.length ? [item(t.navLab, '/lab/')] : []),
    item(t.navExperience, '/experience/'),
    ...(notes.length ? [item(t.navNotes, '/notes/')] : []),
    item(t.navAbout, '/about/'),
  ];
}
