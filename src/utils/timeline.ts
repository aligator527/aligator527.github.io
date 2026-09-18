import { monthIndex } from './dates';

export interface TimelineInput {
  id: string;
  start: string;
  /** Inclusive end month; `null` for ongoing work. */
  end: string | null;
}

export interface TimelineBar<T extends TimelineInput> {
  item: T;
  lane: number;
  /** 1-based grid column where the bar starts. */
  column: number;
  /** Number of month columns the bar spans. */
  span: number;
}

export interface Timeline<T extends TimelineInput> {
  startMonth: string;
  months: number;
  lanes: number;
  bars: TimelineBar<T>[];
}

/**
 * Places engagements on the fewest lanes such that overlapping ranges never share a lane.
 * Contract work frequently overlaps, so a single-column chronology would hide concurrency.
 *
 * A lane is only reused after `LANE_REUSE_GAP_MONTHS` of clear space: bar labels are absolutely
 * positioned and so invisible to packing, and two adjacent engagements in one lane collide.
 */
export const LANE_REUSE_GAP_MONTHS = 8;

export function buildTimeline<T extends TimelineInput>(
  items: readonly T[],
  now: string,
): Timeline<T> {
  if (items.length === 0) return { startMonth: now, months: 0, lanes: 0, bars: [] };

  const resolved = items
    .map((item) => ({
      item,
      from: monthIndex(item.start),
      to: monthIndex(item.end ?? now),
    }))
    .sort((a, b) => a.from - b.from || a.to - b.to);

  const origin = resolved[0]!.from;
  const last = Math.max(...resolved.map((entry) => entry.to));
  const laneEnds: number[] = [];

  const bars = resolved.map(({ item, from, to }) => {
    if (to < from) throw new Error(`Timeline item "${item.id}" ends before it starts`);
    let lane = laneEnds.findIndex((end) => end < from - LANE_REUSE_GAP_MONTHS);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(to);
    } else {
      laneEnds[lane] = to;
    }
    return { item, lane, column: from - origin + 1, span: to - from + 1 };
  });

  const startItem = resolved[0]!.item;
  return { startMonth: startItem.start, months: last - origin + 1, lanes: laneEnds.length, bars };
}

/**
 * Calendar years touched by the timeline, with their 1-based starting column and the number of
 * month columns they occupy. First and last years are usually partial, and a tick claiming a full
 * twelve columns would overflow into its neighbour.
 */
export function yearTicks(
  startMonth: string,
  months: number,
): { year: number; column: number; span: number }[] {
  const origin = monthIndex(startMonth);
  const ticks: { year: number; column: number; span: number }[] = [];
  for (let offset = 0; offset < months; offset += 1) {
    const index = origin + offset;
    if (offset === 0 || index % 12 === 0) {
      const span = Math.min(12 - (index % 12), months - offset);
      ticks.push({ year: Math.floor(index / 12), column: offset + 1, span });
    }
  }
  return ticks;
}
