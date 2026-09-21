/**
 * Central route paths.
 *
 * Keeping every path in one place means internal links stay consistent and a
 * route can be renamed without hunting through components.
 */
export const routes = {
  home: '/',
  onboarding: '/onboarding',

  collections: '/collections',
  collectionsBridal: '/collections/bridal',
  collectionsGroom: '/collections/groom',
  collectionsAccessories: '/collections/accessories',
  collectionsJewellery: '/collections/jewellery',
  collectionsBeauty: '/collections/beauty',
  collectionsCeremony: '/collections/ceremony',
  collection: (slug: string) => `/collections/${slug}`,

  product: (slug: string) => `/product/${slug}`,

  vendors: '/vendors',
  vendorCategory: (slug: string) => `/vendors/${slug}`,
  vendor: (slug: string) => `/vendor/${slug}`,

  planning: '/planning',
  planningChecklist: '/planning/checklist',
  planningTimeline: '/planning/timeline',
  planningBudget: '/planning/budget',
  planningGuests: '/planning/guests',
  planningEvents: '/planning/events',

  inspiration: '/inspiration',
  inspirationArticle: (slug: string) => `/inspiration/${slug}`,

  about: '/about',
  contact: '/contact',

  retailers: '/retailers',
  retailersApply: '/retailers/apply',
  retailersLogin: '/retailers/login',
  retailersDashboard: '/retailers/dashboard',
  retailersProducts: '/retailers/products',
  retailersProductNew: '/retailers/products/new',
  retailersOrders: '/retailers/orders',
  retailersEnquiries: '/retailers/enquiries',
  retailersAnalytics: '/retailers/analytics',
  retailersProfile: '/retailers/profile',

  account: '/account',
  accountProfile: '/account/profile',
  accountWishlist: '/account/wishlist',
  accountSaved: '/account/saved',
  accountPreferences: '/account/preferences',

  search: '/search',
  wishlist: '/wishlist',
  cart: '/cart',
  checkout: '/checkout',

  privacy: '/privacy',
  terms: '/terms',
  shipping: '/shipping',
  returns: '/returns',
  faq: '/faq',
} as const;

/** Builds a product listing URL with filters, keeping the URL shareable. */
export function collectionUrl(
  base: string,
  filters: Partial<{
    faith: string;
    category: string[];
    event: string[];
    sort: string;
    q: string;
    page: number;
  }>,
): string {
  const params = new URLSearchParams();
  if (filters.faith) params.set('faith', filters.faith);
  if (filters.category?.length) params.set('category', filters.category.join(','));
  if (filters.event?.length) params.set('event', filters.event.join(','));
  if (filters.sort && filters.sort !== 'featured') params.set('sort', filters.sort);
  if (filters.q) params.set('q', filters.q);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
