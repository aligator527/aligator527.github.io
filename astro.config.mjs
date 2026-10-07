// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
      filter: (page) => !EMPTY_SECTIONS.some((path) => new URL(page).pathname.endsWith(path)),
    }),
  ],
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
      name: 'IBM Plex Mono',
      cssVariable: '--font-ibm-plex-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
    },
  ],
});
