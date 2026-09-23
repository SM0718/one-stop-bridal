/**
 * Central domain model.
 *
 * Every screen in the app reads from these types. Faith-specific behaviour is
 * expressed as *configuration* (see `src/data/faiths`), never as conditionals
 * scattered through components, so a new faith or cultural context can be added
 * by adding data only.
 */

/* ==========================================================================
   Faith & culture
   ========================================================================== */

export const FAITH_IDS = [
  'HINDU',
  'MUSLIM',
  'CHRISTIAN',
  'SIKH',
  'PARSI',
  'JAIN',
  'BUDDHIST',
  'JEWISH',
  'INTERFAITH',
  'CUSTOM',
] as const;

export type FaithId = (typeof FAITH_IDS)[number];

/** Vocabulary a faith uses for the same planning concepts. */
export interface FaithTerminology {
  /** The main wedding day, e.g. "Vivah", "Nikah", "Ceremony", "Anand Karaj" */
  weddingDay: string;
  /** The formal ceremony */
  ceremony: string;
  /** The celebration after */
  reception: string;
  /** The couple */
  couple: string;
  /** Bridal outfit vocabulary, e.g. "Lehenga", "Gown", "Modest bridalwear" */
  bridalOutfit: string;
  /** Groom outfit vocabulary, e.g. "Sherwani", "Suit" */
  groomOutfit: string;
  /** Beings/figures invoked, used only in neutral informational copy */
  blessingTerm?: string;
}

/** A subtle per-faith accent. Deliberately muted: never a loud theme switch. */
export interface FaithAccent {
  label: string;
  /** CSS custom property holding an HSL triplet */
  token: string;
  /** Representative hex used for swatches */
  hex: string;
}

export type EventAudience = 'bride' | 'groom' | 'couple' | 'family';

/** A ceremony or celebration a faith commonly includes. Always editable. */
export interface EventTemplate {
  id: string;
  name: string;
  /** One line explaining what the event is */
  summary: string;
  /** Typical lead time before the wedding day */
  typicalOffsetDays: number;
  audience: EventAudience;
  /** Where it usually happens: home, venue, place of worship */
  setting: 'home' | 'venue' | 'place-of-worship' | 'outdoors' | 'flexible';
  /** Some traditions are regional or optional — surfaced honestly in the UI */
  optional: boolean;
}

/** A data-driven personalised entry point shown on the homepage. */
export interface PersonalizedSection {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  /** Key into the media manifest */
  mediaKey: string;
}

/** A ritual-related service the platform can surface for a faith. */
export interface RitualService {
  id: string;
  name: string;
  description: string;
  vendorCategoryId: VendorCategoryId;
}

/** Seed tasks merged into the planner for a faith. */
export interface ChecklistSeed {
  id: string;
  title: string;
  /** Months before the wedding day */
  monthsBefore: number;
  phase: ChecklistPhaseId;
  audience: EventAudience;
  /** Restrict to a specific event when relevant */
  eventId?: string;
}

export interface GuidanceNote {
  title: string;
  body: string;
}

export interface FaithConfig {
  id: FaithId;
  slug: string;
  name: string;
  shortName: string;
  /** Geographic/cultural anchors, described neutrally */
  regions: string[];
  /** Two-line factual description */
  summary: string;
  /** Longer editorial paragraph for the faith landing experience */
  introduction: string;
  /** Shown as guidance, never as assertion about an individual's practice */
  customisable: true;
  guidance: GuidanceNote[];
  terminology: FaithTerminology;
  accent: FaithAccent;
  /** Default events. `optional: false` ones are still removable by the user. */
  events: EventTemplate[];
  /** Product category ids that lead this faith's experience */
  leadCategoryIds: ProductCategoryId[];
  /** Vendor category ids most relevant to this faith */
  leadVendorCategoryIds: VendorCategoryId[];
  ritualServices: RitualService[];
  personalizedSections: PersonalizedSection[];
  /** Seed checklist, merged with universal tasks */
  checklist: ChecklistSeed[];
}

/* ==========================================================================
   Wedding profile
   ========================================================================== */

export interface WeddingProfile {
  /** Primary faith/cultural context */
  faith: FaithId | null;
  /** Additional traditions for interfaith weddings */
  secondaryFaiths: FaithId[];
  /** Free-text label when faith is CUSTOM */
  customFaithLabel: string;
  weddingDate: string | null; // ISO yyyy-MM-dd
  /** Days remaining is derived, never stored */
  city: string;
  country: string;
  guestCount: number | null;
  budgetTotal: number | null;
  currency: CurrencyCode;
  stylePreferences: string[];
  /** true once the user has completed or skipped onboarding */
  onboarded: boolean;
}

export interface WeddingEventPlan {
  id: string;
  /** Stable id derived from the template, or generated for custom events */
  templateId: string | null;
  name: string;
  /** ISO date, or null when not yet scheduled */
  date: string | null;
  time: string | null;
  venue: string;
  guestCount: number | null;
  budget: number | null;
  notes: string;
  /** Ordered list of child task ids */
  audience: EventAudience;
  custom: boolean;
}

/* ==========================================================================
   Catalog
   ========================================================================== */

export type CategoryGroup = 'bridal' | 'groom' | 'accessories' | 'jewellery' | 'beauty' | 'ceremony';

export type ProductCategoryId =
  | 'bridal-lehenga'
  | 'bridal-saree'
  | 'bridal-gown'
  | 'bridal-anarkali'
  | 'modest-bridalwear'
  | 'bridal-suit'
  | 'veils'
  | 'custom-bridal'
  | 'sherwani'
  | 'groom-suit'
  | 'tuxedo'
  | 'groom-traditional'
  | 'groom-accessories'
  | 'bridal-jewellery'
  | 'fine-jewellery'
  | 'shoes'
  | 'headpieces'
  | 'clutch-bags'
  | 'makeup'
  | 'hair'
  | 'mehendi'
  | 'skincare'
  | 'ritual-items'
  | 'ceremony-essentials';

export interface ProductCategory {
  id: ProductCategoryId;
  name: string;
  slug: string;
  group: CategoryGroup;
  /** Short editorial line used on category tiles */
  description: string;
  mediaKey: string;
}

export type Availability = 'in-stock' | 'made-to-order' | 'pre-order' | 'enquire';
export type ProductBadge = 'new' | 'made-to-order' | 'in-stock' | 'custom' | 'limited';

export interface ProductImage {
  mediaKey: string;
  alt: string;
}

export interface ProductOptionValue {
  value: string;
  /** Optional price delta in the product currency */
  priceDelta?: number;
}

export interface ProductOption {
  id: string;
  label: string;
  values: ProductOptionValue[];
}

export interface DeliveryEstimate {
  label: string;
  detail: string;
}

export interface Product {
  id: string;
  /** Human-facing product code, e.g. B2104 */
  code: string;
  slug: string;
  name: string;
  /** Retailer id */
  retailerId: string;
  categoryId: ProductCategoryId;
  /** Faiths this piece is commonly chosen for — used for personalisation */
  faiths: FaithId[];
  /** Event template ids this piece suits */
  eventIds: string[];
  description: string;
  /** Editorial detail paragraphs */
  details: string[];
  materials: string[];
  care: string[];
  /** null means "contact for price" — common in bridal retail */
  price: number | null;
  currency: CurrencyCode;
  images: ProductImage[];
  options: ProductOption[];
  sizes: string[];
  availability: Availability;
  badges: ProductBadge[];
  customization: string[];
  delivery: DeliveryEstimate[];
  returns: string;
  /** Silhouette / fabric / colour facets used by filters */
  silhouette: string;
  fabric: string;
  colour: string;
  styleTags: string[];
  featured: boolean;
  createdAt: string;
}

export interface ProductQuery {
  faith?: FaithId;
  categories?: ProductCategoryId[];
  events?: string[];
  silhouettes?: string[];
  fabrics?: string[];
  colours?: string[];
  designers?: string[];
  sizes?: string[];
  availability?: Availability[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc';

/* ==========================================================================
   Vendors
   ========================================================================== */

export type VendorCategoryId =
  | 'bridalwear'
  | 'groomwear'
  | 'jewellery'
  | 'makeup'
  | 'hair'
  | 'mehendi'
  | 'photography'
  | 'videography'
  | 'venues'
  | 'decor'
  | 'catering'
  | 'invitations'
  | 'florists'
  | 'planners'
  | 'choreographers'
  | 'entertainment'
  | 'transportation'
  | 'bridal-accessories'
  | 'wedding-cakes'
  | 'ritual-services';

export interface VendorCategory {
  id: VendorCategoryId;
  name: string;
  slug: string;
  description: string;
  mediaKey: string;
}

export interface VendorService {
  name: string;
  description: string;
  /** null means "on enquiry" */
  priceFrom: number | null;
  unit?: string;
}

export interface VendorPackage {
  name: string;
  includes: string[];
  priceFrom: number | null;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  categoryIds: VendorCategoryId[];
  /** Faiths the business explicitly serves or has experience with */
  faiths: FaithId[];
  /** Event template ids the business covers */
  eventIds: string[];
  city: string;
  country: string;
  /** Service radius description */
  coverage: string;
  summary: string;
  about: string[];
  /** Only true where the record genuinely represents a vetted business */
  verified: boolean;
  /** No rating is shown unless real review data exists. Demo: null. */
  rating: { average: number; count: number } | null;
  priceRange: PriceRange;
  /** Cover and portfolio imagery */
  coverMediaKey: string;
  logoMediaKey: string;
  galleryKeys: string[];
  services: VendorService[];
  packages: VendorPackage[];
  availabilityNote: string;
  yearsActive: number;
  website: string | null;
  instagram: string | null;
  teamSize: string;
  languages: string[];
  createdAt: string;
}

export type PriceRange = 'budget' | 'mid' | 'premium' | 'luxury';

export interface VendorQuery {
  faith?: FaithId;
  categories?: VendorCategoryId[];
  events?: string[];
  cities?: string[];
  priceRanges?: PriceRange[];
  verifiedOnly?: boolean;
  search?: string;
  sort?: VendorSort;
  page?: number;
  pageSize?: number;
}

export type VendorSort = 'featured' | 'name-asc' | 'price-asc' | 'price-desc' | 'experience';

/* ==========================================================================
   Retailers
   ========================================================================== */

export type RetailerApplicationStatus =
  | 'pending'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'needs-information';

export interface RetailerApplication {
  id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  website: string;
  instagram: string;
  address: string;
  yearsInBusiness: number;
  categoryIds: ProductCategoryId[];
  faiths: FaithId[];
  priceRange: PriceRange;
  productCount: number;
  about: string;
  logoFileName: string | null;
  documentFileName: string | null;
  status: RetailerApplicationStatus;
  submittedAt: string;
  /** Reviewer messages shown in the status timeline */
  timeline: ApplicationEvent[];
}

export interface ApplicationEvent {
  id: string;
  status: RetailerApplicationStatus;
  at: string;
  note: string;
}

export interface Retailer {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  logoMediaKey: string;
  coverMediaKey: string;
  summary: string;
  about: string[];
  faiths: FaithId[];
  categoryIds: ProductCategoryId[];
  verified: boolean;
  yearsActive: number;
  website: string | null;
  instagram: string | null;
  productCount: number;
}

export interface RetailerEnquiry {
  id: string;
  productId: string | null;
  productName: string;
  customerName: string;
  city: string;
  channel: 'form' | 'whatsapp' | 'appointment';
  message: string;
  status: 'new' | 'responded' | 'closed';
  receivedAt: string;
}

export interface RetailerOrder {
  id: string;
  reference: string;
  customerName: string;
  city: string;
  items: { productName: string; quantity: number; price: number | null }[];
  total: number | null;
  status: 'enquiry' | 'confirmed' | 'in-production' | 'shipped' | 'delivered' | 'cancelled';
  placedAt: string;
}

/* ==========================================================================
   Planning
   ========================================================================== */

export type ChecklistPhaseId =
  | 'twelve-months'
  | 'nine-months'
  | 'six-months'
  | 'three-months'
  | 'one-month'
  | 'wedding-week'
  | 'wedding-day';

export interface ChecklistPhase {
  id: ChecklistPhaseId;
  name: string;
  /** Lower bound in months before the wedding */
  monthsBefore: number;
  description: string;
}

export interface PlanningTask {
  id: string;
  title: string;
  phase: ChecklistPhaseId;
  /** Faith seed this came from, when applicable */
  sourceFaith?: FaithId;
  eventId?: string;
  dueDate: string | null;
  completed: boolean;
  assignee: string;
  notes: string;
  /** Whether this is a user-created task or seeded */
  custom: boolean;
}

export type BudgetCategoryId =
  | 'venue'
  | 'attire'
  | 'jewellery'
  | 'photography'
  | 'decor'
  | 'catering'
  | 'beauty'
  | 'invitations'
  | 'entertainment'
  | 'transportation'
  | 'miscellaneous';

export interface BudgetCategory {
  id: BudgetCategoryId;
  name: string;
  description: string;
}

export interface BudgetLine {
  id: string;
  categoryId: BudgetCategoryId;
  label: string;
  allocated: number;
  spent: number;
  eventId?: string;
}

export interface Guest {
  id: string;
  name: string;
  side: 'bride' | 'groom' | 'shared';
  email: string;
  phone: string;
  city: string;
  invitedTo: string[];
  rsvp: 'pending' | 'attending' | 'declined';
  plusOnes: number;
  dietary: string;
  notes: string;
}

/* ==========================================================================
   Editorial & discovery
   ========================================================================== */

export type InspirationCategoryId =
  | 'bridal-looks'
  | 'wedding-decor'
  | 'jewellery'
  | 'ceremonies'
  | 'beauty'
  | 'real-weddings'
  | 'planning'
  | 'cultural-guides';

export interface InspirationCategory {
  id: InspirationCategoryId;
  name: string;
  slug: string;
  description: string;
}

export interface InspirationArticle {
  id: string;
  slug: string;
  title: string;
  standfirst: string;
  categoryId: InspirationCategoryId;
  faiths: FaithId[];
  author: string;
  authorRole: string;
  publishedAt: string;
  readingMinutes: number;
  heroMediaKey: string;
  sections: { heading?: string; body: string[] }[];
  relatedProductIds: string[];
  relatedVendorIds: string[];
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryIds: ProductCategoryId[];
  faiths: FaithId[];
  mediaKey: string;
  featured: boolean;
}

/* ==========================================================================
   Account & saved items
   ========================================================================== */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  marketingOptIn: boolean;
  /** Retailer account id when the signed-in user also sells on the platform */
  retailerId: string | null;
}

export interface WishlistCollection {
  id: string;
  name: string;
  description: string;
  /** Seeded collections can be renamed or removed by the user */
  system: boolean;
}

export type SavedItemKind = 'product' | 'vendor' | 'inspiration';

export interface SavedItem {
  id: string;
  kind: SavedItemKind;
  refId: string;
  collectionId: string;
  savedAt: string;
}

export interface CartLine {
  id: string;
  productId: string;
  quantity: number;
  size: string | null;
  options: Record<string, string>;
  /** Enquiry-only pieces carry a null price */
  price: number | null;
}

/* ==========================================================================
   Bridal blueprint (personalisation onboarding)
   ========================================================================== */

/**
 * The wedding context a couple builds through the "Wedding Blueprint"
 * onboarding. This is deliberately broader than `WeddingProfile`: it tracks
 * both sides of the family, regional/cultural contexts, a lead-time window and
 * the ordered set of celebrations, so the bridal catalogue can be personalised
 * without ever assuming a single primary religion.
 */

export type BlueprintTimeline =
  | 'under-30-days'
  | '1-3-months'
  | '3-6-months'
  | '6-12-months'
  | '12-plus-months'
  | 'not-decided';

export type BlueprintBudget = 'intimate' | 'classic' | 'grand' | 'prefer-not-to-say';

/** How the partner's side relates to the bride's. */
export type PartnerContextMode = 'same' | 'different' | 'interfaith' | 'not-specified';

export interface BlueprintFaithGroup {
  faithIds: FaithId[];
  culturalContexts: string[];
  /** True when the couple prefers not to name a tradition */
  preferNotToSpecify: boolean;
  /** Free-text label when a custom/regional tradition is used */
  customLabel: string;
}

export interface BlueprintPartner extends BlueprintFaithGroup {
  mode: PartnerContextMode;
}

export interface BlueprintTimelineValue {
  timeframe: BlueprintTimeline | null;
  /** ISO yyyy-MM-dd when a specific date is known */
  weddingDate: string | null;
}

export interface BlueprintEventList {
  /** Ordered event template ids (order matters for the planner/checklist) */
  eventIds: string[];
  /** Ordered names of custom celebrations added by the couple */
  customEventNames: string[];
}

export interface BridalBlueprint {
  id: string;
  bride: BlueprintFaithGroup;
  partner: BlueprintPartner;
  timeline: BlueprintTimelineValue;
  events: BlueprintEventList;
  budget: BlueprintBudget;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
}

/** In-progress answers, kept so a partially-completed onboarding can resume. */
export interface BlueprintDraft {
  /** The user has begun the onboarding — distinct from the current step below */
  started: boolean;
  /** 0 = Cultural Roots, 1 = Timeline, 2 = Events, 3 = Budget */
  step: number;
  bride: BlueprintFaithGroup;
  partner: BlueprintPartner;
  timeline: BlueprintTimelineValue;
  eventIds: string[];
  customEventNames: string[];
  budget: BlueprintBudget;
}

/* ==========================================================================
   Shared primitives
   ========================================================================== */

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type CurrencyCode = 'INR' | 'GBP' | 'USD' | 'AED';

export interface FacetBucket<T extends string = string> {
  value: T;
  label: string;
  count: number;
}

export interface ProductFacets {
  categories: FacetBucket<ProductCategoryId>[];
  silhouettes: FacetBucket[];
  fabrics: FacetBucket[];
  colours: FacetBucket[];
  designers: FacetBucket[];
  sizes: FacetBucket[];
  availability: FacetBucket<Availability>[];
  priceRange: { min: number; max: number };
}

export interface VendorFacets {
  categories: FacetBucket<VendorCategoryId>[];
  cities: FacetBucket[];
  priceRanges: FacetBucket<PriceRange>[];
}

export type SearchResultKind = 'product' | 'vendor' | 'collection' | 'inspiration' | 'guide' | 'event';

export interface SearchResult {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  href: string;
  mediaKey: string | null;
  /** Faiths this result is relevant to, used to rank by the active context */
  faiths: FaithId[];
  score: number;
}

export interface SearchResponse {
  query: string;
  groups: { kind: SearchResultKind; label: string; results: SearchResult[] }[];
  total: number;
}
