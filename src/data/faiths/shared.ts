import type { ChecklistSeed, EventTemplate } from '@/types';

/** Small helper so event templates stay readable and consistent. */
export function event(
  id: string,
  name: string,
  summary: string,
  typicalOffsetDays: number,
  audience: EventTemplate['audience'],
  setting: EventTemplate['setting'],
  optional = false,
): EventTemplate {
  return { id, name, summary, typicalOffsetDays, audience, setting, optional };
}

export function seed(
  id: string,
  title: string,
  monthsBefore: number,
  phase: ChecklistSeed['phase'],
  audience: ChecklistSeed['audience'],
  eventId?: string,
): ChecklistSeed {
  return { id, title, monthsBefore, phase, audience, ...(eventId ? { eventId } : {}) };
}

/**
 * Tasks every wedding needs regardless of faith or culture. Faith-specific
 * seeds are merged on top of these by the registry.
 */
export const UNIVERSAL_CHECKLIST: ChecklistSeed[] = [
  seed('u-venue', 'Shortlist and book the venue', 12, 'twelve-months', 'couple'),
  seed('u-budget', 'Agree the overall budget and who contributes', 12, 'twelve-months', 'couple'),
  seed('u-guestlist', 'Draft the first guest list', 12, 'twelve-months', 'couple'),
  seed('u-date', 'Confirm the wedding date', 12, 'twelve-months', 'couple'),
  seed('u-photographer', 'Book photographer and videographer', 9, 'nine-months', 'couple'),
  seed('u-caterer', 'Book catering and agree the menu', 9, 'nine-months', 'couple'),
  seed('u-attire-fitting', 'First attire fittings', 6, 'six-months', 'couple'),
  seed('u-invitations-design', 'Design and order invitations', 6, 'six-months', 'couple'),
  seed('u-decor', 'Book decor and florals', 6, 'six-months', 'couple'),
  seed('u-transport', 'Arrange guest transport and accommodation', 3, 'three-months', 'couple'),
  seed('u-invitations-send', 'Send invitations', 3, 'three-months', 'couple'),
  seed('u-timings', 'Agree the running order for the day', 1, 'one-month', 'couple'),
  seed('u-seating', 'Finalise the seating plan', 1, 'one-month', 'couple'),
  seed('u-final-fittings', 'Final attire fittings and collection', 1, 'one-month', 'couple'),
  seed('u-vendor-contacts', 'Share the vendor contact sheet with the family', 1, 'one-month', 'family'),
  seed('u-packing', 'Pack for the wedding and the days around it', 0, 'wedding-week', 'couple'),
  seed('u-payments', 'Settle outstanding vendor payments', 0, 'wedding-week', 'couple'),
  seed('u-emergency-kit', 'Prepare a day-of emergency kit', 0, 'wedding-week', 'bride'),
  seed('u-rings', 'Give the rings to whoever is holding them', 0, 'wedding-day', 'couple'),
  seed('u-vendor-meals', 'Confirm meals for vendors and crew', 0, 'wedding-day', 'family'),
];
