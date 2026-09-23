import type { EventTemplate, FaithId, ProductCategoryId, VendorCategoryId } from '@/types';
import { resolveWeddingContext } from '@/data/faiths';

/**
 * Centralised event configuration.
 *
 * The celebrations themselves (names, lead times, audiences) already live in
 * the per-faith configs under `src/data/faiths`. This module layers the
 * *recommendation* context on top of those ids — which product and vendor
 * categories a celebration leads with — so no component ever hardcodes what a
 * "Nikah" or a "Mehendi" should surface.
 */

export interface WeddingEventConfig {
  /** Lead product categories for this celebration */
  productCategoryIds: ProductCategoryId[];
  /** Lead vendor categories for this celebration */
  vendorCategoryIds: VendorCategoryId[];
  /** Short line used in personalised rails */
  styleHint: string;
}

const cfg = (
  productCategoryIds: ProductCategoryId[],
  vendorCategoryIds: VendorCategoryId[],
  styleHint: string,
): WeddingEventConfig => ({ productCategoryIds, vendorCategoryIds, styleHint });

export const EVENT_CONFIG: Record<string, WeddingEventConfig> = {
  /* Engagement / roka / mangni */
  'hindu-engagement': cfg(['bridal-anarkali', 'bridal-suit', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Intimate family pieces'),
  'sikh-roka': cfg(['bridal-anarkali', 'bridal-suit', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Intimate family pieces'),
  'jain-engagement': cfg(['bridal-anarkali', 'bridal-suit', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Intimate family pieces'),
  'muslim-engagement': cfg(['bridal-anarkali', 'bridal-suit', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Intimate family pieces'),
  'christian-engagement': cfg(['bridal-gown', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Evening pieces'),
  'jewish-engagement': cfg(['bridal-gown', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Evening pieces'),
  'parsi-engagement': cfg(['bridal-gown', 'bridal-anarkali', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Understated pieces'),
  'buddhist-engagement': cfg(['bridal-anarkali', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Intimate family pieces'),
  'interfaith-engagement': cfg(['bridal-anarkali', 'bridal-gown', 'fine-jewellery'], ['bridalwear', 'jewellery', 'photography'], 'Pieces that travel across both traditions'),

  /* Mehendi / mehndi */
  'hindu-mehendi': cfg(['bridal-anarkali', 'bridal-suit', 'mehendi', 'headpieces'], ['mehendi', 'bridalwear', 'makeup'], 'Bright, light, easy to dance in'),
  'jain-mehendi': cfg(['bridal-anarkali', 'bridal-suit', 'mehendi', 'headpieces'], ['mehendi', 'bridalwear', 'makeup'], 'Bright, light, easy to dance in'),
  'muslim-mehndi': cfg(['bridal-anarkali', 'bridal-suit', 'mehendi', 'headpieces'], ['mehendi', 'bridalwear', 'makeup'], 'Bright, light, easy to dance in'),
  'sikh-mehndi': cfg(['bridal-anarkali', 'bridal-suit', 'mehendi', 'headpieces'], ['mehendi', 'bridalwear', 'makeup'], 'Bright, light, easy to dance in'),
  'interfaith-mehendi': cfg(['bridal-anarkali', 'bridal-suit', 'mehendi', 'headpieces'], ['mehendi', 'bridalwear', 'makeup'], 'Bright, light, easy to dance in'),

  /* Haldi / pre-wedding blessings */
  'hindu-haldi': cfg(['bridal-anarkali', 'bridal-suit', 'shoes'], ['bridalwear', 'decor', 'photography'], 'Easy, covered, practical'),
  'jain-haldi': cfg(['bridal-anarkali', 'bridal-suit', 'shoes'], ['bridalwear', 'decor', 'photography'], 'Easy, covered, practical'),
  'sikh-choora': cfg(['bridal-jewellery', 'bridal-anarkali'], ['jewellery', 'bridalwear'], 'Bangles and bright colour'),
  'buddhist-blessing': cfg(['modest-bridalwear', 'bridal-anarkali', 'ritual-items'], ['bridalwear', 'ritual-services', 'catering'], 'Covered, calm, considered'),

  /* Sangeet / dholki / entertainment */
  'hindu-sangeet': cfg(['bridal-anarkali', 'bridal-suit', 'bridal-jewellery', 'shoes'], ['bridalwear', 'choreographers', 'entertainment', 'makeup'], 'Cut to move — sparkle that survives a dance floor'),
  'jain-sangeet': cfg(['bridal-anarkali', 'bridal-suit', 'bridal-jewellery', 'shoes'], ['bridalwear', 'choreographers', 'entertainment', 'makeup'], 'Cut to move — sparkle that survives a dance floor'),
  'muslim-dholki': cfg(['bridal-anarkali', 'bridal-suit', 'bridal-jewellery'], ['bridalwear', 'entertainment', 'makeup'], 'Cut to move — sparkle that survives a dance floor'),
  'sikh-jaggo': cfg(['bridal-anarkali', 'bridal-suit', 'bridal-jewellery'], ['bridalwear', 'entertainment'], 'Colour and drum of the night'),
  'jewish-kabbalat': cfg(['bridal-gown', 'bridal-anarkali', 'fine-jewellery'], ['bridalwear', 'florists'], 'Guests meet the couple early'),
  'christian-rehearsal': cfg(['bridal-gown', 'groom-suit', 'shoes'], ['bridalwear', 'catering', 'photography'], 'Rehearsal dinner, close family'),
  'jewish-aufruf': cfg(['modest-bridalwear', 'bridal-gown'], ['bridalwear'], 'Quiet, covered, dignified'),

  /* Wedding day ceremonies */
  'hindu-vivah': cfg(['bridal-lehenga', 'bridal-saree', 'bridal-jewellery', 'headpieces', 'shoes', 'ritual-items'], ['bridalwear', 'jewellery', 'makeup', 'hair', 'ritual-services', 'decor'], 'The main day — embroidery, jewellery and the finishing pieces'),
  'jain-vivah': cfg(['bridal-lehenga', 'bridal-saree', 'bridal-jewellery', 'headpieces', 'shoes', 'ritual-items'], ['bridalwear', 'jewellery', 'makeup', 'hair', 'ritual-services', 'decor'], 'The main day — embroidery, jewellery and the finishing pieces'),
  'muslim-nikah': cfg(['modest-bridalwear', 'bridal-suit', 'bridal-jewellery', 'headpieces'], ['bridalwear', 'jewellery', 'makeup', 'hair', 'ritual-services'], 'Modest cuts, fine detail, the nikah look'),
  'sikh-anand-karaj': cfg(['bridal-lehenga', 'bridal-saree', 'bridal-jewellery', 'veils', 'headpieces'], ['bridalwear', 'jewellery', 'makeup', 'hair', 'ritual-services'], 'Covered elegance for the gurdwara'),
  'christian-ceremony': cfg(['bridal-gown', 'veils', 'bridal-jewellery', 'shoes'], ['bridalwear', 'jewellery', 'makeup', 'hair'], 'The gown, the veil, the aisle'),
  'christian-shower': cfg(['bridal-gown', 'bridal-anarkali', 'fine-jewellery'], ['bridalwear', 'florists'], 'Lighter pieces for the shower'),
  'parsi-lagan': cfg(['bridal-saree', 'bridal-gown', 'fine-jewellery', 'headpieces'], ['bridalwear', 'jewellery', 'makeup'], 'The saree or gown, understated and precise'),
  'jewish-chuppah': cfg(['bridal-gown', 'veils', 'bridal-jewellery', 'shoes'], ['bridalwear', 'jewellery', 'florists'], 'The gown, under the chuppah'),
  'buddhist-ceremony': cfg(['bridal-anarkali', 'modest-bridalwear', 'bridal-jewellery'], ['bridalwear', 'jewellery', 'makeup'], 'Considered, covered, ceremonial'),
  'interfaith-ritual-one': cfg(['bridal-lehenga', 'bridal-gown', 'modest-bridalwear', 'bridal-jewellery'], ['bridalwear', 'jewellery', 'makeup', 'ritual-services'], 'The first ceremony, from one side of the family'),
  'interfaith-ritual-two': cfg(['bridal-gown', 'bridal-lehenga', 'modest-bridalwear', 'bridal-jewellery'], ['bridalwear', 'jewellery', 'makeup', 'ritual-services'], 'The second ceremony, from the other side of the family'),
  'custom-wedding': cfg(['bridal-gown', 'bridal-lehenga', 'custom-bridal', 'bridal-jewellery'], ['bridalwear', 'jewellery', 'makeup'], 'Your ceremony — anything goes'),

  /* Receptions */
  'hindu-reception': cfg(['bridal-anarkali', 'bridal-saree', 'bridal-jewellery', 'clutch-bags', 'shoes'], ['bridalwear', 'jewellery', 'makeup', 'hair', 'catering'], 'Statement looks for the celebration night'),
  'jain-reception': cfg(['bridal-anarkali', 'bridal-saree', 'bridal-jewellery', 'clutch-bags'], ['bridalwear', 'jewellery', 'makeup', 'catering'], 'Statement looks for the celebration night'),
  'sikh-reception': cfg(['bridal-anarkali', 'bridal-saree', 'bridal-jewellery', 'clutch-bags', 'shoes'], ['bridalwear', 'jewellery', 'makeup', 'catering'], 'Statement looks for the celebration night'),
  'muslim-walima': cfg(['bridal-anarkali', 'bridal-saree', 'modest-bridalwear', 'bridal-jewellery', 'clutch-bags'], ['bridalwear', 'jewellery', 'makeup', 'catering', 'decor'], 'Statement pieces with coverage'),
  'christian-reception': cfg(['bridal-gown', 'bridal-anarkali', 'fine-jewellery', 'clutch-bags', 'shoes'], ['bridalwear', 'jewellery', 'makeup', 'catering', 'entertainment'], 'Statement looks for the celebration night'),
  'parsi-reception': cfg(['bridal-gown', 'bridal-anarkali', 'fine-jewellery', 'clutch-bags'], ['bridalwear', 'jewellery', 'makeup', 'catering'], 'Understated statement looks'),
  'jewish-seudah': cfg(['bridal-gown', 'bridal-anarkali', 'fine-jewellery', 'clutch-bags'], ['bridalwear', 'jewellery', 'makeup', 'catering'], 'The celebratory meal after the ceremony'),
  'buddhist-reception': cfg(['bridal-anarkali', 'bridal-suit', 'fine-jewellery'], ['bridalwear', 'jewellery', 'catering'], 'Statement looks for the celebration night'),
  'interfaith-reception': cfg(['bridal-gown', 'bridal-anarkali', 'bridal-suit', 'fine-jewellery'], ['bridalwear', 'jewellery', 'makeup', 'catering', 'entertainment'], 'One dress to end both traditions'),
  'custom-reception': cfg(['bridal-gown', 'bridal-anarkali', 'fine-jewellery'], ['bridalwear', 'jewellery', 'makeup', 'catering'], 'Your celebration — anything goes'),

  /* Groom-side events */
  'hindu-griha': cfg(['bridal-anarkali', 'bridal-jewellery', 'shoes'], ['jewellery', 'bridalwear'], 'Welcome-home pieces for the first morning'),
};

const DEFAULT_EVENT_CONFIG: WeddingEventConfig = cfg(
  ['bridal-lehenga', 'bridal-gown', 'bridal-anarkali', 'bridal-jewellery'],
  ['bridalwear', 'jewellery', 'makeup', 'hair'],
  'Pieces for your celebration',
);

export function eventConfig(eventId: string): WeddingEventConfig {
  return EVENT_CONFIG[eventId] ?? DEFAULT_EVENT_CONFIG;
}

export function eventProductCategories(eventId: string): ProductCategoryId[] {
  return eventConfig(eventId).productCategoryIds;
}

/* ==========================================================================
   Building the event list for a blueprint
   ========================================================================== */

/**
 * Merges the celebrations relevant to a couple's chosen traditions, reusing the
 * existing multi-faith merging logic (the same one that powers the planner and
 * catalogue filters). The result is ordered and de-duplicated. When no
 * tradition is named, a neutral interfaith list is used rather than showing
 * nothing.
 */
export function eventsForBlueprint(
  bride: { faithIds: FaithId[]; preferNotToSpecify: boolean; customLabel: string },
  partner?: { faithIds: FaithId[]; preferNotToSpecify: boolean; customLabel?: string },
  partnerMode: 'same' | 'different' | 'interfaith' | 'not-specified' = 'not-specified',
): EventTemplate[] {
  const brideIds = bride.preferNotToSpecify ? [] : bride.faithIds;
  const partnerIds =
    partnerMode === 'same'
      ? brideIds
      : partner && (partnerMode === 'different' || partnerMode === 'interfaith')
        ? partner.preferNotToSpecify
          ? []
          : partner.faithIds
        : [];

  const ids = [...brideIds, ...partnerIds.filter((id) => !brideIds.includes(id))];
  const customLabel = [bride.customLabel, partner?.customLabel ?? ''].filter(Boolean).join(' + ');

  if (ids.length === 0) {
    return resolveWeddingContext('INTERFAITH', [], customLabel).events;
  }

  const [primary, ...secondary] = ids;
  return resolveWeddingContext(primary, secondary, customLabel).events;
}

export type { EventTemplate };