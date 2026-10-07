/** Year-month in ISO form, e.g. `2026-09`. */
export type YearMonth = `${number}-${number}`;

const YEAR_MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function parseYearMonth(value: string): { year: number; month: number } {
  const match = YEAR_MONTH.exec(value);
  if (!match) throw new Error(`Expected YYYY-MM, received "${value}"`);
  return { year: Number(match[1]), month: Number(match[2]) };
}

/** `2026-09` → `2026/09`, matching the site's revision-sheet notation. */
export function formatMonth(value: string): string {
  const { year, month } = parseYearMonth(value);
  return `${year}/${String(month).padStart(2, '0')}`;
}

/**
 * Words a range or a duration is rendered with. They come from the dictionary (`t.dates`) rather
 * than from this module, because they are the only locale-dependent part of a date on this site:
 * `2026/09` is written the same way in all three locales, while `Present` is not.
 */
export interface RangeWords {
  present: string;
}

export interface DurationWords {
  /** Whole rendering of a year count, e.g. `2 yrs`. English pluralises; `1 г.` and `1年` do not. */
  year: (count: number) => string;
  month: (count: number) => string;
  /** Between the year and the month part: a space in English, nothing in Japanese. */
  separator: string;
}

/** `2025-07`, `2026-05` → `2025/07–2026/05`; an open end renders as `words.present`. */
export function formatRange(
  start: string,
  end: string | null | undefined,
  words: RangeWords,
): string {
  return `${formatMonth(start)}–${end ? formatMonth(end) : words.present}`;
}

/** Month index counted from year zero; useful for ordering and grid placement. */
export function monthIndex(value: string): number {
  const { year, month } = parseYearMonth(value);
  return year * 12 + (month - 1);
}

/** Inclusive number of calendar months covered by a range. */
export function durationMonths(start: string, end: string): number {
  const months = monthIndex(end) - monthIndex(start) + 1;
  if (months < 1) throw new Error(`Range ends before it starts: ${start}–${end}`);
  return months;
}

/**
 * Human-readable inclusive duration, e.g. `1 yr 11 mos`, `1 г. 11 мес.`, `1年11か月`.
 *
 * Which parts are shown is a shared decision and stays here; how each part reads belongs to the
 * dictionary, so no locale needs a plural-rule table.
 */
export function formatDuration(start: string, end: string, words: DurationWords): string {
  const total = durationMonths(start, end);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(words.year(years));
  if (months) parts.push(words.month(months));
  return parts.join(words.separator);
}
