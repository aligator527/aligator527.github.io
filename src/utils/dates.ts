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

/** `2025-07`, `2026-05` → `2025/07–2026/05`; an open end renders as `Present`. */
export function formatRange(start: string, end?: string | null): string {
  return `${formatMonth(start)}–${end ? formatMonth(end) : 'Present'}`;
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

/** Human-readable inclusive duration, e.g. `1 yr 11 mos`. */
export function formatDuration(start: string, end: string): string {
  const total = durationMonths(start, end);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  return parts.join(' ');
}
