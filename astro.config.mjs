// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { isIndexable, localeFromPathname } from './src/utils/i18n.ts';

// The production site is a GitHub user site served from `/`.
// BASE_PATH lets CI build under a repository subpath to prove every link is base-safe.
const base = process.env.BASE_PATH ?? '/';

// Sections with no published entries yet. `src/utils/navigation.ts` derives the same emptiness from
// the collections themselves; this list keeps their placeholder routes out of the sitemap. Both
// must be updated when a section gets its first entry.
const EMPTY_SECTIONS = ['/lab/', '/notes/'];

export default defineConfig({
  site: 'https://aligator527.github.io',
  base,
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'ja'],
    routing: { prefixDefaultLocale: false },
  },
  build: { format: 'directory' },
  integrations: [
    sitemap({
      /*
       * Two reasons a built page stays out of the sitemap, and both must match what the page itself
       * says in its robots meta: the section has no entries yet, or its locale is built but not
       * published. `isIndexable()` is the shared predicate — see src/utils/i18n.ts.
       */
      filter: (page) => {
        const { pathname } = new URL(page);
        if (EMPTY_SECTIONS.some((path) => pathname.endsWith(path))) return false;
        // `localeFromPathname` strips the base itself; it must be passed explicitly here because
        // `import.meta.env.BASE_URL` is not defined in the config's own module scope.
        return isIndexable(localeFromPathname(pathname, base));
      },
    }),
  ],
  /*
   * Three scripts, two webfont families, one system stack — see ADR-0006.
   * Instrument Sans has no Cyrillic (Fontsource ships it as latin + latin-ext only), so Russian is
   * set in Golos Text, which is drawn Cyrillic-first. Japanese takes a system stack and downloads
   * nothing. `BaseLayout.astro` decides per locale which family is emitted and preloaded; a family
   * listed here is only fetched by a page that renders its <Font>.
   */
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Instrument Sans',
      cssVariable: '--font-instrument-sans',
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Golos Text',
      cssVariable: '--font-golos-text',
      weights: [400, 600, 700],
      styles: ['normal'],
      // Latin as well as Cyrillic: a Russian page is set in one voice, including the technology
      // names and project IDs inside its sentences, and loads one family rather than two.
      subsets: ['cyrillic', 'latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-ibm-plex-mono',
      weights: [400, 500],
      styles: ['normal'],
      // Metadata labels (ROLE, SYSTEM, STATUS) are translated; the Cyrillic subset keeps them in
      // the intended mono instead of a system fallback. Each subset is a separate @font-face with
      // its own unicode-range, so an English page never fetches the Cyrillic file.
      subsets: ['latin', 'cyrillic'],
      fallbacks: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
    },
  ],
});
