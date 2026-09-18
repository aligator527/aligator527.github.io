import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDuration, formatRange } from './dates';

export type WorkEntry = CollectionEntry<'work'>;

export async function getWork(): Promise<WorkEntry[]> {
  const entries = await getCollection('work');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export function workHref(entry: WorkEntry): string {
  return `/work/${entry.id}/`;
}

export const STATUS_LABEL: Record<WorkEntry['data']['status'], string> = {
  active: 'In progress',
  complete: 'Completed',
};

/** How much of an engagement is published: a brief states facts; a case study adds reasoning. */
export const DEPTH_LABEL: Record<WorkEntry['data']['depth'], string> = {
  brief: 'Brief',
  'case-study': 'Case study',
};

export const ENGAGEMENT_LABEL = {
  contract: 'Contract',
  freelance: 'Freelance',
} as const;

export function workPeriod(entry: WorkEntry, now: string): { range: string; duration: string } {
  const { startDate, endDate } = entry.data;
  return {
    range: formatRange(startDate, endDate),
    duration: formatDuration(startDate, endDate ?? now),
  };
}
