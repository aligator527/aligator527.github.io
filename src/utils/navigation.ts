import { getCollection } from 'astro:content';
import { useTranslations } from '../i18n/ui';
import { DEFAULT_LOCALE, localeHref, localesFor, type Locale } from './i18n';

export interface NavItem {
  label: string;
  /** Ready for the browser: locale prefix and deployment base applied. */
  href: string;
  /** The same target without base or locale, which is what `isCurrent()` compares. */
  path: string;
  /**
   * Set when this item leads to a page that does not exist in the current locale, and therefore
   * links to the default one. The header marks it so the language change is visible before the
   * click rather than after it.
   */
  foreignLocale?: Locale;
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
  /*
   * Writing is published in the language it was written in, so Notes and Lab exist in English only
   * — `localesFor()` in src/utils/i18n.ts is the one place that knows which pages those are. A nav
   * item for such a page must link to the locale it exists in: building `/ru/notes/` from the
   * current locale produced nine broken links per locale the moment the first note was published,
   * which `scripts/check-links.mjs` caught.
   */
  const item = (label: string, path: string): NavItem => {
    const available = localesFor(path);
    const target = available.includes(locale) ? locale : DEFAULT_LOCALE;
    return {
      label,
      path,
      href: localeHref(path, target),
      ...(target === locale ? {} : { foreignLocale: target }),
    };
  };

  return [
    item(t.navWork, '/work/'),
    ...(lab.length ? [item(t.navLab, '/lab/')] : []),
    item(t.navExperience, '/experience/'),
    ...(notes.length ? [item(t.navNotes, '/notes/')] : []),
    item(t.navAbout, '/about/'),
  ];
}
