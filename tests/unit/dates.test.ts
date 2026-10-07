import { describe, expect, it } from 'vitest';
import { en } from '../../src/i18n/ui/en';
import {
  durationMonths,
  formatDuration,
  formatMonth,
  formatRange,
  monthIndex,
} from '../../src/utils/dates';

/*
 * The words come from the dictionary, so these tests pass the real English entries: they assert the
 * published strings, not a fixture that could drift from them. Invariant locales are covered below.
 */
const words = en.dates;

describe('date formatting', () => {
  it('formats months in revision notation', () => {
    expect(formatMonth('2026-09')).toBe('2026/09');
  });

  it('formats closed and open ranges', () => {
    expect(formatRange('2025-07', '2026-05', words)).toBe('2025/07–2026/05');
    expect(formatRange('2026-09', null, words)).toBe('2026/09–Present');
    expect(formatRange('2026-09', undefined, words)).toBe('2026/09–Present');
  });

  it('rejects malformed input instead of guessing', () => {
    expect(() => formatMonth('2026-13')).toThrow();
    expect(() => formatMonth('2026/09')).toThrow();
  });
});

describe('durations', () => {
  it('counts months inclusively', () => {
    expect(durationMonths('2024-12', '2025-12')).toBe(13);
    expect(durationMonths('2026-09', '2026-09')).toBe(1);
  });

  it('orders months across year boundaries', () => {
    expect(monthIndex('2025-01') - monthIndex('2024-12')).toBe(1);
  });

  it('formats years and months, pluralising in English', () => {
    expect(formatDuration('2023-03', '2025-05', words)).toBe('2 yrs 3 mos');
    expect(formatDuration('2025-07', '2026-05', words)).toBe('11 mos');
    expect(formatDuration('2025-01', '2025-12', words)).toBe('1 yr');
    expect(formatDuration('2025-01', '2025-01', words)).toBe('1 mo');
  });

  it('needs no plural rules for locales with invariant abbreviations', () => {
    // 23 months: the shape Russian and Japanese have to produce, from the same arithmetic.
    const russian = {
      year: (count: number) => `${count} г.`,
      month: (count: number) => `${count} мес.`,
      separator: ' ',
    };
    const japanese = {
      year: (count: number) => `${count}年`,
      month: (count: number) => `${count}か月`,
      separator: '',
    };
    expect(formatDuration('2025-01', '2026-11', russian)).toBe('1 г. 11 мес.');
    expect(formatDuration('2025-01', '2026-11', japanese)).toBe('1年11か月');
  });

  it("renders an open range with each locale's own word", () => {
    expect(formatRange('2026-09', null, { present: 'по наст. время' })).toBe(
      '2026/09–по наст. время',
    );
    expect(formatRange('2026-09', null, { present: '現在' })).toBe('2026/09–現在');
  });

  it('rejects inverted ranges', () => {
    expect(() => durationMonths('2025-05', '2025-04')).toThrow();
  });
});
