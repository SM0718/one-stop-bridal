import type { EventTemplate } from '@/types';
import { SELECTABLE_FAITHS } from './faiths';

/**
 * Every event template across every faith, de-duplicated and labelled.
 * Filters and planners reference events by id, so this index is what turns an
 * id back into something a person can read.
 */
const BY_ID = new Map<string, EventTemplate>();
for (const faith of SELECTABLE_FAITHS) {
  for (const event of faith.events) {
    if (!BY_ID.has(event.id)) BY_ID.set(event.id, event);
  }
}

export const ALL_EVENTS: EventTemplate[] = [...BY_ID.values()];

export function getEventById(id: string): EventTemplate | undefined {
  return BY_ID.get(id);
}

export function eventName(id: string): string {
  return BY_ID.get(id)?.name ?? id;
}
