import { describe, expect, it } from 'vitest';
import {
  durationMonths,
  formatDuration,
  formatMonth,
  formatRange,
  monthIndex,
} from '../../src/utils/dates';

describe('date formatting', () => {
  it('formats months in revision notation', () => {
    expect(formatMonth('2026-09')).toBe('2026/09');
  });

  it('formats closed and open ranges', () => {
    expect(formatRange('2025-07', '2026-05')).toBe('2025/07–2026/05');
    expect(formatRange('2026-09', null)).toBe('2026/09–Present');
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

  it('formats years and months', () => {
    expect(formatDuration('2023-03', '2025-05')).toBe('2 yrs 3 mos');
    expect(formatDuration('2025-07', '2026-05')).toBe('11 mos');
    expect(formatDuration('2025-01', '2025-12')).toBe('1 yr');
  });

  it('rejects inverted ranges', () => {
    expect(() => durationMonths('2025-05', '2025-04')).toThrow();
  });
});
