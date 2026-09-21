import type {
  ChecklistSeed,
  EventTemplate,
  FaithConfig,
  FaithId,
  FaithTerminology,
  GuidanceNote,
  PersonalizedSection,
  ProductCategoryId,
  RitualService,
  VendorCategoryId,
} from '@/types';
import { UNIVERSAL_CHECKLIST } from './shared';
import { hindu } from './hindu';
import { muslim } from './muslim';
import { christian } from './christian';
import { sikh } from './sikh';
import { parsi } from './parsi';
import { jain } from './jain';
import { buddhist } from './buddhist';
import { jewish } from './jewish';
import { interfaith } from './interfaith';
import { custom } from './custom';

/** Faiths a couple can select directly as their primary context. */
export const SELECTABLE_FAITHS: FaithConfig[] = [
  hindu,
  muslim,
  christian,
  sikh,
  parsi,
  jain,
  buddhist,
  jewish,
  interfaith,
  custom,
];

/**
 * Faiths that describe an actual tradition. Used when an interfaith couple
 * picks which traditions to merge.
 */
export const TRADITION_FAITHS: FaithConfig[] = [hindu, muslim, christian, sikh, parsi, jain, buddhist, jewish];

const BY_ID = new Map<FaithId, FaithConfig>(SELECTABLE_FAITHS.map((f) => [f.id, f]));
const BY_SLUG = new Map<string, FaithConfig>(SELECTABLE_FAITHS.map((f) => [f.slug, f]));

export function getFaith(id: FaithId | null | undefined): FaithConfig {
  return (id && BY_ID.get(id)) || custom;
}

export function getFaithBySlug(slug: string | null | undefined): FaithConfig | undefined {
  return slug ? BY_SLUG.get(slug) : undefined;
}

export function isTraditionFaith(id: FaithId): boolean {
  return TRADITION_FAITHS.some((f) => f.id === id);
}

export const DEFAULT_FAITH_ID: FaithId = 'HINDU';

/* ==========================================================================
   Merged wedding context
   ========================================================================== */

export interface WeddingContext {
  /** The faith the couple chose first */
  primary: FaithConfig;
  /** Every configuration feeding this wedding, primary first */
  combined: FaithConfig[];
  /** Merged, de-duplicated event templates */
  events: EventTemplate[];
  leadCategoryIds: ProductCategoryId[];
  leadVendorCategoryIds: VendorCategoryId[];
  /** Terminology follows the primary context */
  terminology: FaithTerminology;
  sections: PersonalizedSection[];
  ritualServices: RitualService[];
  guidance: GuidanceNote[];
  checklist: ChecklistSeed[];
  /** e.g. "Hindu & Christian" — used in the header and planner */
  label: string;
  /** True when more than one tradition feeds this wedding */
  isMultiTradition: boolean;
}

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function buildWeddingContext(
  primaryId: FaithId | null,
  secondaryIds: FaithId[] = [],
  customLabel = '',
): WeddingContext {
  const fallback = getFaith(primaryId);
  const secondaries = secondaryIds.filter((id) => id !== primaryId).map((id) => getFaith(id));

  /* An interfaith couple with traditions chosen plans from those traditions;
     without them we fall back to the generic interfaith scaffolding. */
  const combined =
    fallback.id === 'INTERFAITH' && secondaries.length > 0 ? secondaries : [fallback, ...secondaries];

  const primary = combined[0] ?? fallback;

  const events = uniqueBy(
    combined.flatMap((f) => f.events),
    (e) => e.id,
  );

  const leadCategoryIds = uniqueBy(
    combined.flatMap((f) => f.leadCategoryIds),
    (id) => id,
  );

  const leadVendorCategoryIds = uniqueBy(
    combined.flatMap((f) => f.leadVendorCategoryIds),
    (id) => id,
  );

  const sections = uniqueBy(
    combined.flatMap((f) => f.personalizedSections),
    (s) => s.id,
  );

  const ritualServices = uniqueBy(
    combined.flatMap((f) => f.ritualServices),
    (s) => s.id,
  );

  /* Guidance from the selected traditions, plus the interfaith planner note
     when the couple are combining more than one. */
  const guidance = uniqueBy(
    [...combined.flatMap((f) => f.guidance), ...(secondaries.length > 0 ? interfaith.guidance : [])],
    (g) => g.title,
  );

  const checklist = [...UNIVERSAL_CHECKLIST, ...combined.flatMap((f) => f.checklist)];

  const names = combined.map((f) => f.shortName);
  const label =
    primary.id === 'CUSTOM' && customLabel.trim().length > 0
      ? customLabel.trim()
      : names.length > 2
        ? `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
        : names.join(' & ');

  return {
    primary,
    combined,
    events,
    leadCategoryIds,
    leadVendorCategoryIds,
    terminology: primary.terminology,
    sections,
    ritualServices,
    guidance,
    checklist,
    label,
    isMultiTradition: combined.length > 1,
  };
}

const contextCache = new Map<string, WeddingContext>();

/**
 * Resolves the full planning context for a wedding profile.
 *
 * This is the single place where multi-faith merging happens. Everything
 * downstream — homepage, catalogue filters, planner, vendor filters — reads
 * from the returned context, so adding a faith requires no code changes.
 *
 * The result is memoised on the three inputs. The context is consumed through
 * a store selector, and a selector that builds a new object on every call
 * re-renders without end, so the same inputs must return the same reference.
 */
export function resolveWeddingContext(
  primaryId: FaithId | null,
  secondaryIds: FaithId[] = [],
  customLabel = '',
): WeddingContext {
  const key = `${primaryId ?? ''}|${secondaryIds.join(',')}|${customLabel}`;
  const cached = contextCache.get(key);
  if (cached) return cached;

  /* The key space is small (faith combinations), but clear rather than grow
     without bound if a caller ever varies the custom label freely. */
  if (contextCache.size >= 100) contextCache.clear();

  const context = buildWeddingContext(primaryId, secondaryIds, customLabel);
  contextCache.set(key, context);
  return context;
}
