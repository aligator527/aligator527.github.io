/**
 * Context an international reader does not have.
 *
 * Several facts on this site are load-bearing in Japan and invisible outside it: the scale of the
 * group behind an employer, what a national examination certifies, why a warehouse system is worth
 * building well. Spelling them out in the body would bloat sentences that are already dense, so
 * they are annotations instead — see `src/components/core/Annotation.astro`.
 *
 * This module holds only what is invariant: the id, and the source the claim rests on. The wording
 * of each gloss is translated, so it lives in the dictionaries under `t.glossary`, keyed by the
 * same ids.
 *
 * `.ai/content/claims.md` applies to these as hard as to anything else, and more carefully: a
 * gloss is a claim about somebody else's organisation. Two rules follow, and both have already
 * caught mistakes here:
 *
 * 1. **The source must actually contain the claim.** An earlier version of this file pointed the
 *    WMS and WCS glosses at Daiwa House's corporate-position page, which defines neither term.
 * 2. **The source must exist.** The same version cited `frameworx.co.jp`, a domain inferred from
 *    the company's name that does not resolve.
 *
 * Several claims that would have been flattering were dropped for want of a source: that Daiwa
 * House is Japan's largest homebuilder, that Frameworx is a leading WMS vendor, that GLOBIS is
 * Japan's largest business school. Each is published by the organisation itself with no stated
 * metric, which makes it a self-description rather than a fact.
 */
export const GLOSSARY_IDS = [
  'daiwa-house',
  'frameworx',
  'wms',
  'wcs',
  'logistics-shortage',
  'ipa-exams',
  'jlpt-n1',
  'globis',
  'matsuo-lab',
] as const;

export type GlossaryId = (typeof GLOSSARY_IDS)[number];

export const glossarySources: Record<GlossaryId, { href: string; label: string }> = {
  /* "Daiwa House listed in Fortune Global 500 for 17 consecutive years (2010-2026)"; net sales. */
  'daiwa-house': {
    href: 'https://www.daiwahouse.com/English/global/position/',
    label: 'daiwahouse.com',
  },
  /* The parent group's company profile: incorporation, business, and the group relationship. */
  frameworx: {
    href: 'https://www.daiwahousegroup.com/frameworx/corp/',
    label: 'daiwahousegroup.com',
  },
  /* Hitachi's logistics glossary defines both terms and states the division of labour between them. */
  wms: {
    href: 'https://www.hitachi.co.jp/products/infrastructure/product_site/logistics_center/term/warehouse-management-system.html',
    label: 'hitachi.co.jp',
  },
  wcs: {
    href: 'https://www.hitachi.co.jp/products/infrastructure/product_site/logistics_center/term/warehouse-control-system.html',
    label: 'hitachi.co.jp',
  },
  /* MLIT regional bureau, December 2023: the transport-capacity estimates behind the "2024 problem". */
  'logistics-shortage': {
    href: 'https://wwwtb.mlit.go.jp/kanto/content/000321639.pdf',
    label: 'mlit.go.jp',
  },
  /* The page that states the legal basis and the national-examination status; Japanese only. */
  'ipa-exams': { href: 'https://www.ipa.go.jp/shiken/about/gaiyou.html', label: 'ipa.go.jp' },
  'jlpt-n1': { href: 'https://www.jlpt.jp/e/about/levelsummary.html', label: 'jlpt.jp' },
  /* The Japanese page carries the student and graduate figure; the English one does not. */
  globis: { href: 'https://mba.globis.ac.jp/about/', label: 'globis.ac.jp' },
  'matsuo-lab': { href: 'https://gci2.t.u-tokyo.ac.jp/', label: 'u-tokyo.ac.jp' },
};
