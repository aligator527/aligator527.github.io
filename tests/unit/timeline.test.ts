import { describe, expect, it } from 'vitest';
import { LANE_REUSE_GAP_MONTHS, buildTimeline, yearTicks } from '../../src/utils/timeline';

const roles = [
  { id: 'freelance', start: '2021-08', end: '2023-01' },
  { id: 'flaretech', start: '2023-03', end: '2025-05' },
  { id: 'nagashima', start: '2024-12', end: '2025-12' },
  { id: 'ikigai', start: '2025-07', end: '2026-05' },
  { id: 'frameworx', start: '2026-09', end: null },
];

describe('buildTimeline', () => {
  const timeline = buildTimeline(roles, '2026-09');
  const laneOf = (id: string) => timeline.bars.find((bar) => bar.item.id === id)?.lane;

  it('spans from the earliest start to the current month', () => {
    expect(timeline.startMonth).toBe('2021-08');
    expect(timeline.months).toBe(62);
  });

  it('puts overlapping engagements on different lanes', () => {
    expect(laneOf('flaretech')).not.toBe(laneOf('nagashima'));
    expect(laneOf('nagashima')).not.toBe(laneOf('ikigai'));
  });

  it('keeps a lane clear until a label has room, rather than reusing it immediately', () => {
    // Flaretech starts 2 months after freelance ends, which is inside the label gap.
    expect(laneOf('flaretech')).not.toBe(laneOf('freelance'));
    expect(timeline.lanes).toBe(3);
  });

  it('reuses a lane once the gap is wide enough for a label', () => {
    const spaced = buildTimeline(
      [
        { id: 'first', start: '2021-01', end: '2021-12' },
        {
          id: 'second',
          start: `2022-${String(1 + LANE_REUSE_GAP_MONTHS).padStart(2, '0')}`,
          end: '2023-06',
        },
      ],
      '2023-06',
    );
    expect(spaced.lanes).toBe(1);
  });

  it('computes grid placement for open-ended work', () => {
    const current = timeline.bars.find((bar) => bar.item.id === 'frameworx');
    expect(current).toMatchObject({ column: 62, span: 1 });
  });

  it('handles an empty list', () => {
    expect(buildTimeline([], '2026-09')).toMatchObject({ months: 0, lanes: 0, bars: [] });
  });
});

describe('yearTicks', () => {
  it('marks the first month and every January', () => {
    expect(yearTicks('2025-11', 4)).toEqual([
      { year: 2025, column: 1, span: 2 },
      { year: 2026, column: 3, span: 2 },
    ]);
  });

  it('gives each tick only the months it actually covers', () => {
    // A tick spanning a full twelve columns would overflow its neighbour on a partial year.
    const ticks = yearTicks('2021-08', 62);
    expect(ticks[0]).toEqual({ year: 2021, column: 1, span: 5 });
    expect(ticks[1]).toEqual({ year: 2022, column: 6, span: 12 });
    expect(ticks.at(-1)).toEqual({ year: 2026, column: 54, span: 9 });
    expect(ticks.reduce((total, tick) => total + tick.span, 0)).toBe(62);
  });
});
