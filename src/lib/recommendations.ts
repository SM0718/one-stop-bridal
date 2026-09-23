import type {
  Availability,
  BlueprintBudget,
  BridalBlueprint,
  FaithId,
  Product,
} from '@/types';
import { getFaith } from '@/data/faiths';
import { eventName } from '@/data/events';
import { budgetPriceBand } from '@/data/blueprint/config';
import { eventProductCategories } from '@/data/blueprint/events';
import { formatDate } from '@/lib/format';

/**
 * Simple rule-based recommendation engine for the bridal catalogue.
 *
 * This is intentionally replaceable: it lives outside the UI and takes the
 * catalogue as an argument, so a proper scoring/ML engine can drop in behind
 * `getBridalRecommendations` without touching any component.
 *
 * Every rule maps a blueprint answer to a demonstrable behaviour:
 *   - faiths        → prioritise pieces tagged for those traditions
 *   - timeline      → prioritise an availability band
 *   - events        → prioritise pieces tied to the selected celebrations
 *   - budget        → prioritise the price band, without hiding anything
 */

export interface BlueprintEventLook {
  eventId: string;
  eventName: string;
  products: Product[];
}

export interface BridalRecommendations {
  contextLabel: string;
  timelineLabel: string;
  budgetLabel: string;
  summary: string;
  eventLooks: BlueprintEventLook[];
  weddingDay: Product[];
  timelinePicks: Product[];
  budgetPicks: Product[];
}

const NO_IDS = [] as const;

function selectedFaiths(blueprint: BridalBlueprint): FaithId[] {
  const bride = blueprint.bride.preferNotToSpecify ? [] : blueprint.bride.faithIds;
  const partner =
    blueprint.partner.mode === 'same'
      ? bride
      : blueprint.partner.mode === 'different' || blueprint.partner.mode === 'interfaith'
        ? blueprint.partner.preferNotToSpecify
          ? []
          : blueprint.partner.faithIds
        : [];
  return [...new Set([...bride, ...partner])];
}

function contextLabelFor(blueprint: BridalBlueprint): string {
  if (blueprint.bride.preferNotToSpecify && blueprint.bride.faithIds.length === 0) {
    return 'Your wedding';
  }
  const faithLabel = blueprint.bride.faithIds.map((id) => getFaith(id).shortName).join(' + ');
  const cultureLabel = blueprint.bride.culturalContexts.join(', ');
  return [cultureLabel, faithLabel].filter(Boolean).join(' ') || 'Your wedding';
}

function timelineLabelFor(blueprint: BridalBlueprint): string {
  const { timeline } = blueprint;
  if (timeline.timeframe && timeline.timeframe !== 'not-decided') {
    return `Wedding in ${timeline.timeframe.replace(/-/g, ' ')}`;
  }
  if (timeline.weddingDate) {
    return `Wedding on ${formatDate(timeline.weddingDate, 'short')}`;
  }
  return 'Wedding date flexible';
}

function availabilityFor(blueprint: BridalBlueprint): Availability[] {
  const map: Record<string, Availability[]> = {
    'under-30-days': ['in-stock'],
    '1-3-months': ['in-stock', 'made-to-order'],
    '3-6-months': ['made-to-order', 'in-stock'],
    '6-12-months': ['made-to-order', 'pre-order', 'enquire'],
    '12-plus-months': ['made-to-order', 'pre-order', 'enquire'],
    'not-decided': ['in-stock', 'made-to-order', 'pre-order', 'enquire'],
  };
  return blueprint.timeline.timeframe ? map[blueprint.timeline.timeframe] ?? NO_IDS : [];
}

function scoreProduct(product: Product, faithIds: FaithId[], band: { min: number; max: number } | null, availability: Availability[]): number {
  let score = 0;

  if (faithIds.length) {
    const matches = product.faiths.filter((f) => faithIds.includes(f)).length;
    score += product.faiths.length ? (matches / product.faiths.length) * 3 : 1.2;
  }
  if (band) {
    if (product.price === null) score += 1.2;
    else if (product.price >= band.min && product.price <= band.max) score += 2.5;
    else if (product.price <= band.max * 1.6) score += 1;
  }
  if (availability.length && availability.includes(product.availability)) score += 1.5;
  if (product.featured) score += 0.4;

  return score;
}

function pick(
  products: Product[],
  faithIds: FaithId[],
  band: { min: number; max: number } | null,
  availability: Availability[],
  limit: number,
): Product[] {
  return [...products].sort((a, b) => scoreProduct(b, faithIds, band, availability) - scoreProduct(a, faithIds, band, availability)).slice(0, limit);
}

export function getBridalRecommendations(
  blueprint: BridalBlueprint | null,
  products: Product[],
): BridalRecommendations | null {
  if (!blueprint?.completed) return null;

  const faithIds = selectedFaiths(blueprint);
  const band = budgetPriceBand(blueprint.budget);
  const availability = availabilityFor(blueprint);

  const eventLooks: BlueprintEventLook[] = [];
  for (const eventId of blueprint.events.eventIds) {
    const exact = products.filter((p) => p.eventIds.includes(eventId));
    const fallback = products.filter((p) => eventProductCategories(eventId).includes(p.categoryId));
    const pool = exact.length >= 2 ? exact : fallback;
    if (pool.length === 0) continue;
    eventLooks.push({ eventId, eventName: eventName(eventId), products: pick(pool, faithIds, band, availability, 4) });
  }

  /* Wedding day: prefer a ceremony with zero lead-time offset (the main day) */
  const weddingDayEvent =
    blueprint.events.eventIds.find((id) => id.endsWith('-vivah') || id.endsWith('-nikah') || id.endsWith('-ceremony') || id.endsWith('-karaj') || id.endsWith('-lagan') || id.endsWith('-chuppah') || id === 'custom-wedding') ??
    blueprint.events.eventIds[0];

  const weddingDay = weddingDayEvent
    ? products.filter((p) => p.eventIds.includes(weddingDayEvent) || (p.eventIds.length > 0 && faithIds.some((f) => p.faiths.includes(f))))
    : [];
  const timelinePicks = pick(products, faithIds, band, availability, 4);

  const budgetPicks =
    blueprint.budget === 'prefer-not-to-say'
      ? []
      : pick(products, faithIds, band, [], 4);

  return {
    contextLabel: contextLabelFor(blueprint),
    timelineLabel: timelineLabelFor(blueprint),
    budgetLabel: blueprint.budget === 'prefer-not-to-say' ? '' : bandRangeLabel(blueprint.budget),
    summary: [contextLabelFor(blueprint), timelineLabelFor(blueprint)].join(' · '),
    eventLooks,
    weddingDay: pick(weddingDay, faithIds, band, availability, 4),
    timelinePicks,
    budgetPicks,
  };
}

function bandRangeLabel(budget: BlueprintBudget): string {
  const band = budgetPriceBand(budget);
  if (!band) return '';
  const inr = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
  return `₹${inr(band.min)} – ₹${inr(band.max)}`;
}