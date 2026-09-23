import type { FaithId } from '@/types';

/**
 * Regional/cultural context options, keyed by tradition.
 *
 * This is the single source of truth for the "Which regional or cultural
 * traditions are part of your wedding?" question. It is data, not UI: adding a
 * regional option (or a whole tradition) never requires touching a component.
 * All option lists carry an "Other" entry, because no list can describe every
 * family's practice.
 */
export const CULTURAL_CONTEXTS: Record<FaithId, string[]> = {
  HINDU: [
    'Bengali',
    'Punjabi',
    'Tamil',
    'Telugu',
    'Marwari',
    'Gujarati',
    'Marathi',
    'Rajasthani',
    'Malayali',
    'Kannada',
    'Odia',
    'Assamese',
    'Other',
  ],
  MUSLIM: [
    'Bengali Muslim',
    'Hyderabadi',
    'Lucknowi',
    'Malayali Muslim',
    'Punjabi Muslim',
    'Kashmiri',
    'Other',
  ],
  CHRISTIAN: ['Goan', 'Anglo-Indian', 'Kerala Christian', 'North-East Indian', 'Other'],
  SIKH: ['Punjabi', 'Other'],
  PARSI: ['Parsi', 'Other'],
  JAIN: ['Shvetambar', 'Digambar', 'Other'],
  BUDDHIST: ['Tibetan', 'Theravada', 'Vajrayana', 'Other'],
  JEWISH: ['Ashkenazi', 'Sephardi', 'Mizrahi', 'Other'],
  INTERFAITH: ['Combining traditions', 'Other'],
  CUSTOM: ['Other'],
};

/** Distinct cultural options relevant to a set of chosen traditions. */
export function culturalContextsFor(faithIds: FaithId[]): string[] {
  const seen = new Set<string>();
  const options: string[] = [];
  for (const id of faithIds) {
    for (const context of CULTURAL_CONTEXTS[id] ?? []) {
      if (!seen.has(context)) {
        seen.add(context);
        options.push(context);
      }
    }
  }
  return options;
}