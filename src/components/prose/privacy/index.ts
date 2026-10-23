import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { Locale } from '../../../utils/i18n';
import en from './en.astro';
import ja from './ja.astro';
import ru from './ru.astro';

/**
 * Per-locale privacy prose, selected exhaustively, so adding a locale without its prose is an
 * `astro check` error — the same contract as `../about`.
 *
 * A privacy notice is the one page where a translation that is vaguer or bolder than the English is
 * a different legal statement, not a style difference. Every number and identifier it names is
 * passed in as a prop from `src/data/analytics.ts` and `src/data/profile.ts`, so no locale can
 * restate a retention period, a cookie name or a measurement ID and quietly disagree.
 */
export const privacyProse = { en, ru, ja } satisfies Record<Locale, AstroComponentFactory>;

export interface PrivacyProseProps {
  /** Which block to render; each sits in its own section of the page. */
  section: 'site' | 'measurement' | 'choice' | 'elsewhere' | 'contact';
  /** The GA4 property named on the page, from `src/data/analytics.ts`. */
  measurementId: string;
  /** Retention configured in that property, in months. */
  retentionMonths: number;
  /** The `localStorage` key the gate writes the choice to. */
  consentKey: string;
  email: string;
  booking: { label: string; href: string };
  /** The publisher named in the controller statement, from `src/data/profile.ts`. */
  name: string;
}
