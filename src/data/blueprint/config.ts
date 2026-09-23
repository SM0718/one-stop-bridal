import type {
  Availability,
  BlueprintBudget,
  BlueprintTimeline,
  ProductCategoryId,
} from '@/types';

/* ==========================================================================
   Timeline
   ========================================================================== */

export interface TimelineOption {
  value: BlueprintTimeline;
  label: string;
  /** What the platform prioritises for this lead time */
  priorities: string[];
  /** Product availability the catalogue leans towards for this lead time */
  availability: Availability[];
}

export const TIMELINE_OPTIONS: TimelineOption[] = [
  {
    value: 'under-30-days',
    label: 'Under 30 days',
    priorities: ['Ready-to-ship pieces', 'In-stock bridalwear', 'Fast delivery', 'Local appointments'],
    availability: ['in-stock'],
  },
  {
    value: '1-3-months',
    label: '1–3 months',
    priorities: ['Boutique dispatch', 'Minor customisation', 'Alterations', 'Accessories'],
    availability: ['in-stock', 'made-to-order'],
  },
  {
    value: '3-6-months',
    label: '3–6 months',
    priorities: ['Made-to-order', 'Custom bridalwear', 'Designer collections', 'Studio appointments'],
    availability: ['made-to-order', 'in-stock', 'pre-order'],
  },
  {
    value: '6-12-months',
    label: '6–12 months',
    priorities: ['Couture', 'Custom designs', 'Long-lead commissions', 'Bespoke services'],
    availability: ['made-to-order', 'pre-order', 'enquire'],
  },
  {
    value: '12-plus-months',
    label: '12+ months',
    priorities: ['Couture', 'Custom designs', 'The full commissioning process'],
    availability: ['made-to-order', 'pre-order', 'enquire'],
  },
  {
    value: 'not-decided',
    label: 'Not decided yet',
    priorities: ['The whole collection', 'Inspiration across lead times'],
    availability: ['in-stock', 'made-to-order', 'pre-order', 'enquire'],
  },
];

export function timelineConfig(value: BlueprintTimeline | null): TimelineOption | undefined {
  return TIMELINE_OPTIONS.find((t) => t.value === value);
}

export const TIMELINE_LABEL: Record<BlueprintTimeline, string> = {
  'under-30-days': 'Under 30 days',
  '1-3-months': '1–3 months',
  '3-6-months': '3–6 months',
  '6-12-months': '6–12 months',
  '12-plus-months': '12+ months',
  'not-decided': 'Not decided yet',
};

/* ==========================================================================
   Wardrobe & accessory budget
   ========================================================================== */

export interface BudgetTier {
  value: BlueprintBudget;
  name: string;
  range: string;
  /** Product lead categories emphasised for this band — never a judgement */
  leadCategoryIds: ProductCategoryId[];
}

export const BUDGET_TIERS: BudgetTier[] = [
  {
    value: 'intimate',
    name: 'Intimate & Thoughtful',
    range: '₹25,000 – ₹60,000',
    leadCategoryIds: ['bridal-anarkali', 'bridal-suit', 'bridal-gown', 'shoes', 'makeup'],
  },
  {
    value: 'classic',
    name: 'Classic Celebration',
    range: '₹60,000 – ₹1.5 lakh',
    leadCategoryIds: ['bridal-lehenga', 'bridal-saree', 'bridal-jewellery', 'headpieces', 'clutch-bags'],
  },
  {
    value: 'grand',
    name: 'Grand Heritage',
    range: '₹1.5 lakh – ₹3.5 lakh+',
    leadCategoryIds: ['bridal-lehenga', 'bridal-saree', 'custom-bridal', 'fine-jewellery', 'bridal-jewellery'],
  },
  {
    value: 'prefer-not-to-say',
    name: 'Prefer not to say',
    range: '',
    leadCategoryIds: [],
  },
];

export function budgetTier(value: BlueprintBudget): BudgetTier {
  return BUDGET_TIERS.find((t) => t.value === value) ?? BUDGET_TIERS[3];
}

export const BUDGET_LABEL: Record<BlueprintBudget, string> = {
  intimate: 'Intimate & Thoughtful',
  classic: 'Classic Celebration',
  grand: 'Grand Heritage',
  'prefer-not-to-say': 'Prefer not to say',
};

/** Price band used to steer recommendations, or null when declared off. */
export function budgetPriceBand(value: BlueprintBudget): { min: number; max: number } | null {
  switch (value) {
    case 'intimate':
      return { min: 25_000, max: 60_000 };
    case 'classic':
      return { min: 60_000, max: 150_000 };
    case 'grand':
      return { min: 150_000, max: 350_000 };
    default:
      return null;
  }
}