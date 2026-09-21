import type { BudgetCategory, ChecklistPhase } from '@/types';

export const CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: 'twelve-months',
    name: '12 months before',
    monthsBefore: 12,
    description: 'Lock the essentials: date, venue, budget and the shape of the wedding.',
  },
  {
    id: 'nine-months',
    name: '9 months before',
    monthsBefore: 9,
    description: 'Book the suppliers who only take a limited number of weddings.',
  },
  {
    id: 'six-months',
    name: '6 months before',
    monthsBefore: 6,
    description: 'Attire, stationery and decor. The plan starts to look like a wedding.',
  },
  {
    id: 'three-months',
    name: '3 months before',
    monthsBefore: 3,
    description: 'Send invitations and settle the details guests will notice.',
  },
  {
    id: 'one-month',
    name: '1 month before',
    monthsBefore: 1,
    description: 'Timings, seating and the final fittings.',
  },
  {
    id: 'wedding-week',
    name: 'Wedding week',
    monthsBefore: 0,
    description: 'Confirmations, payments and packing.',
  },
  {
    id: 'wedding-day',
    name: 'Wedding day',
    monthsBefore: 0,
    description: 'Everything that has to happen today.',
  },
];

const PHASE_MAP = new Map(CHECKLIST_PHASES.map((p) => [p.id, p]));

export function getChecklistPhase(id: string): ChecklistPhase | undefined {
  return PHASE_MAP.get(id as ChecklistPhase['id']);
}

export function phaseFromMonthsBefore(months: number): ChecklistPhase['id'] {
  if (months >= 12) return 'twelve-months';
  if (months >= 9) return 'nine-months';
  if (months >= 6) return 'six-months';
  if (months >= 3) return 'three-months';
  if (months >= 1) return 'one-month';
  return 'wedding-week';
}

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: 'venue', name: 'Venue', description: 'Hire, ceremony fee, accommodation and service charges.' },
  { id: 'attire', name: 'Attire', description: 'Bridal, groom and family outfits, plus alterations.' },
  { id: 'jewellery', name: 'Jewellery', description: 'Bridal sets, fine jewellery and rentals.' },
  { id: 'photography', name: 'Photography & Film', description: 'Photography, videography and albums.' },
  { id: 'decor', name: 'Decor & Florals', description: 'Structures, flowers, lighting and styling.' },
  { id: 'catering', name: 'Catering', description: 'Food, drink and service staff.' },
  { id: 'beauty', name: 'Beauty', description: 'Makeup, hair, mehendi and treatments.' },
  { id: 'invitations', name: 'Invitations', description: 'Stationery, printing and calligraphy.' },
  { id: 'entertainment', name: 'Entertainment', description: 'Music, performers and choreography.' },
  { id: 'transportation', name: 'Transportation', description: 'Wedding cars and guest transport.' },
  { id: 'miscellaneous', name: 'Miscellaneous', description: 'Favours, gifts, licenses and the unforeseen.' },
];

const BUDGET_MAP = new Map(BUDGET_CATEGORIES.map((c) => [c.id, c]));

export function getBudgetCategory(id: string): BudgetCategory | undefined {
  return BUDGET_MAP.get(id as BudgetCategory['id']);
}

/** Indicative split used to seed a budget the couple can then adjust. */
export const DEFAULT_BUDGET_SPLIT: { categoryId: BudgetCategory['id']; weight: number }[] = [
  { categoryId: 'venue', weight: 0.22 },
  { categoryId: 'catering', weight: 0.2 },
  { categoryId: 'attire', weight: 0.12 },
  { categoryId: 'photography', weight: 0.1 },
  { categoryId: 'decor', weight: 0.11 },
  { categoryId: 'jewellery', weight: 0.07 },
  { categoryId: 'beauty', weight: 0.04 },
  { categoryId: 'invitations', weight: 0.02 },
  { categoryId: 'entertainment', weight: 0.04 },
  { categoryId: 'transportation', weight: 0.03 },
  { categoryId: 'miscellaneous', weight: 0.05 },
];

/** Cities offered in filters. Demo data only. */
export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Jaipur',
  'Ahmedabad',
  'Pune',
  'London',
  'Birmingham',
  'Leicester',
  'Manchester',
  'Toronto',
  'New Jersey',
  'Dubai',
  'Nairobi',
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'GBP', symbol: '£', label: 'Pound Sterling' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham' },
] as const;

export const STYLE_PREFERENCES = [
  'Traditional',
  'Contemporary',
  'Minimal',
  'Maximalist',
  'Handcrafted',
  'Vintage',
  'Modern tailoring',
  'Heritage textiles',
  'Neutral palette',
  'Colour-forward',
];
