import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { Locale } from '../../../utils/i18n';
import en from './en.astro';
import ja from './ja.astro';
import ru from './ru.astro';

/**
 * Per-locale page prose.
 *
 * Narrative paragraphs with inline links cannot live in the string dictionary: a translator needs
 * whole sentences, and the links must stay base- and locale-correct, which a flat string can only
 * do through `set:html`. Each locale writes the prose as a component instead, and this map selects
 * one — exhaustively, so adding a locale without its prose is an `astro check` error.
 *
 */
export const aboutProse = { en, ru, ja } satisfies Record<Locale, AstroComponentFactory>;

export interface AboutProseProps {
  /** Which narrative block to render; the two sit in different sections of the page. */
  section: 'background' | 'engage';
  /** Stated once in `profile`, passed in so no locale restates a fact. */
  experience: string;
  email: string;
  /** Builds a locale- and base-correct href for a work slug. */
  workHref: (slug: string) => string;
}
