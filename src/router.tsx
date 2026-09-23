import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';
import { RootLayout } from '@/components/layout/RootLayout';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { RetailerLayout } from '@/components/layout/RetailerLayout';
import { MarketplaceLayout } from '@/components/layout/MarketplaceLayout';
// import { PlanningLayout } from '@/components/planning/PlanningLayout';
import { RouteError, RouteNotFound } from '@/routes/status';

/**
 * Route tree.
 *
 * Filter state is read from the URL, so catalogue routes declare a pass-through
 * search validator: without it the router would drop unknown query parameters
 * and filters would silently reset.
 */
const passthroughSearch = (search: Record<string, unknown>): Record<string, unknown> => search;

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: RouteNotFound,
  errorComponent: RouteError,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('@/routes/home'), 'HomePage'),
});

// const onboardingRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/onboarding',
//   component: lazyRouteComponent(() => import('@/routes/onboarding'), 'OnboardingPage'),
// });

/* ==========================================================================
   Collections
   ========================================================================== */

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collections',
  component: MarketplaceLayout,
});

const collectionsIndexRoute = createRoute({
  getParentRoute: () => collectionsRoute,
  path: '/',
  component: lazyRouteComponent(() => import('@/routes/collections'), 'CollectionsIndexPage'),
});

/** Bride, groom, accessories, jewellery, beauty and ceremony all share one page. */
const collectionGroupRoute = createRoute({
  getParentRoute: () => collectionsRoute,
  path: '$group',
  validateSearch: passthroughSearch,
  component: lazyRouteComponent(() => import('@/routes/collections'), 'CollectionGroupPage'),
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$slug',
  component: lazyRouteComponent(() => import('@/routes/product'), 'ProductDetailPage'),
});

/* ==========================================================================
   Vendors
   ========================================================================== */

/* Vendor directory and vendor detail pages have been commented out for this
   bridal-only build. The route files remain in the repository but are not
   registered, so their URLs resolve to the 404 page. */
// const vendorsRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/vendors',
//   component: MarketplaceLayout,
// });

// const vendorsIndexRoute = createRoute({
//   getParentRoute: () => vendorsRoute,
//   path: '/',
//   validateSearch: passthroughSearch,
//   component: lazyRouteComponent(() => import('@/routes/vendors'), 'VendorsIndexPage'),
// });

// const vendorCategoryRoute = createRoute({
//   getParentRoute: () => vendorsRoute,
//   path: '$category',
//   validateSearch: passthroughSearch,
//   component: lazyRouteComponent(() => import('@/routes/vendors'), 'VendorCategoryPage'),
// });

// const vendorRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/vendor/$slug',
//   component: lazyRouteComponent(() => import('@/routes/vendor'), 'VendorDetailPage'),
// });

/* ==========================================================================
   Planning
   ========================================================================== */

/* Planning dashboards and tools have been commented out for this bridal-only
   build. The route files remain in the repository but are not registered. */
// const planningRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/planning',
//   component: PlanningLayout,
// });

// const planningIndexRoute = createRoute({
//   getParentRoute: () => planningRoute,
//   path: '/',
//   component: lazyRouteComponent(() => import('@/routes/planning/index'), 'PlanningDashboardPage'),
// });

// const planningChecklistRoute = createRoute({
//   getParentRoute: () => planningRoute,
//   path: 'checklist',
//   validateSearch: passthroughSearch,
//   component: lazyRouteComponent(() => import('@/routes/planning/checklist'), 'PlanningChecklistPage'),
// });

// const planningTimelineRoute = createRoute({
//   getParentRoute: () => planningRoute,
//   path: 'timeline',
//   component: lazyRouteComponent(() => import('@/routes/planning/timeline'), 'PlanningTimelinePage'),
// });

// const planningBudgetRoute = createRoute({
//   getParentRoute: () => planningRoute,
//   path: 'budget',
//   component: lazyRouteComponent(() => import('@/routes/planning/budget'), 'PlanningBudgetPage'),
// });

// const planningGuestsRoute = createRoute({
//   getParentRoute: () => planningRoute,
//   path: 'guests',
//   component: lazyRouteComponent(() => import('@/routes/planning/guests'), 'PlanningGuestsPage'),
// });

// const planningEventsRoute = createRoute({
//   getParentRoute: () => planningRoute,
//   path: 'events',
//   component: lazyRouteComponent(() => import('@/routes/planning/events'), 'PlanningEventsPage'),
// });

/* ==========================================================================
   Editorial
   ========================================================================== */

const inspirationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inspiration',
  validateSearch: passthroughSearch,
  component: lazyRouteComponent(() => import('@/routes/inspiration'), 'InspirationIndexPage'),
});

const inspirationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inspiration/$slug',
  component: lazyRouteComponent(() => import('@/routes/inspiration'), 'InspirationDetailPage'),
});

/* ==========================================================================
   Retailers
   ========================================================================== */

const retailersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailers',
  component: lazyRouteComponent(() => import('@/routes/retailers'), 'RetailersLandingPage'),
});

const retailersApplyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailers/apply',
  component: lazyRouteComponent(() => import('@/routes/retailers'), 'RetailerApplyPage'),
});

const retailersLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailers/login',
  component: lazyRouteComponent(() => import('@/routes/retailers'), 'RetailerLoginPage'),
});

/* Pathless layout route so every workspace screen shares one shell */
const retailerWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'retailer-workspace',
  component: RetailerLayout,
});

const retailerDashboardRoute = createRoute({
  getParentRoute: () => retailerWorkspaceRoute,
  path: '/retailers/dashboard',
  component: lazyRouteComponent(() => import('@/routes/retailers/workspace'), 'RetailerDashboardPage'),
});

const retailerProductsRoute = createRoute({
  getParentRoute: () => retailerWorkspaceRoute,
  path: '/retailers/products',
  component: lazyRouteComponent(() => import('@/routes/retailers/workspace'), 'RetailerProductsPage'),
});

const retailerProductNewRoute = createRoute({
  getParentRoute: () => retailerWorkspaceRoute,
  path: '/retailers/products/new',
  component: lazyRouteComponent(() => import('@/routes/retailers/workspace'), 'RetailerProductNewPage'),
});

const retailerEnquiriesRoute = createRoute({
  getParentRoute: () => retailerWorkspaceRoute,
  path: '/retailers/enquiries',
  component: lazyRouteComponent(() => import('@/routes/retailers/operations'), 'RetailerEnquiriesPage'),
});

const retailerOrdersRoute = createRoute({
  getParentRoute: () => retailerWorkspaceRoute,
  path: '/retailers/orders',
  component: lazyRouteComponent(() => import('@/routes/retailers/operations'), 'RetailerOrdersPage'),
});

const retailerAnalyticsRoute = createRoute({
  getParentRoute: () => retailerWorkspaceRoute,
  path: '/retailers/analytics',
  component: lazyRouteComponent(() => import('@/routes/retailers/operations'), 'RetailerAnalyticsPage'),
});

const retailerProfileRoute = createRoute({
  getParentRoute: () => retailerWorkspaceRoute,
  path: '/retailers/profile',
  component: lazyRouteComponent(() => import('@/routes/retailers/operations'), 'RetailerProfilePage'),
});

/* ==========================================================================
   Account
   ========================================================================== */

const accountWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'account-workspace',
  component: AccountLayout,
});

const accountOverviewRoute = createRoute({
  getParentRoute: () => accountWorkspaceRoute,
  path: '/account',
  component: lazyRouteComponent(() => import('@/routes/account'), 'AccountOverviewPage'),
});

const accountProfileRoute = createRoute({
  getParentRoute: () => accountWorkspaceRoute,
  path: '/account/profile',
  component: lazyRouteComponent(() => import('@/routes/account'), 'AccountProfilePage'),
});

const accountWishlistRoute = createRoute({
  getParentRoute: () => accountWorkspaceRoute,
  path: '/account/wishlist',
  component: lazyRouteComponent(() => import('@/routes/account'), 'AccountWishlistPage'),
});

const accountSavedRoute = createRoute({
  getParentRoute: () => accountWorkspaceRoute,
  path: '/account/saved',
  component: lazyRouteComponent(() => import('@/routes/account'), 'AccountSavedPage'),
});

const accountPreferencesRoute = createRoute({
  getParentRoute: () => accountWorkspaceRoute,
  path: '/account/preferences',
  component: lazyRouteComponent(() => import('@/routes/account'), 'AccountPreferencesPage'),
});

/* ==========================================================================
   Commerce & content
   ========================================================================== */

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  validateSearch: passthroughSearch,
  component: lazyRouteComponent(() => import('@/routes/search'), 'SearchPage'),
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: lazyRouteComponent(() => import('@/routes/wishlist'), 'WishlistPage'),
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: lazyRouteComponent(() => import('@/routes/cart'), 'CartPage'),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: lazyRouteComponent(() => import('@/routes/checkout'), 'CheckoutPage'),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: lazyRouteComponent(() => import('@/routes/about'), 'AboutPage'),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: lazyRouteComponent(() => import('@/routes/contact'), 'ContactPage'),
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: lazyRouteComponent(() => import('@/routes/policies'), 'PrivacyPage'),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: lazyRouteComponent(() => import('@/routes/policies'), 'TermsPage'),
});

const shippingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shipping',
  component: lazyRouteComponent(() => import('@/routes/policies'), 'ShippingPage'),
});

const returnsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/returns',
  component: lazyRouteComponent(() => import('@/routes/policies'), 'ReturnsPage'),
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: lazyRouteComponent(() => import('@/routes/policies'), 'FaqPage'),
});

/* ==========================================================================
   Tree
   ========================================================================== */

const routeTree = rootRoute.addChildren([
  homeRoute,
  collectionsRoute.addChildren([collectionsIndexRoute, collectionGroupRoute]),
  productRoute,
  inspirationRoute,
  inspirationDetailRoute,
  retailersRoute,
  retailersApplyRoute,
  retailersLoginRoute,
  retailerWorkspaceRoute.addChildren([
    retailerDashboardRoute,
    retailerProductsRoute,
    retailerProductNewRoute,
    retailerEnquiriesRoute,
    retailerOrdersRoute,
    retailerAnalyticsRoute,
    retailerProfileRoute,
  ]),
  accountWorkspaceRoute.addChildren([
    accountOverviewRoute,
    accountProfileRoute,
    accountWishlistRoute,
    accountSavedRoute,
    accountPreferencesRoute,
  ]),
  searchRoute,
  wishlistRoute,
  cartRoute,
  checkoutRoute,
  aboutRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  shippingRoute,
  returnsRoute,
  faqRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 30 * 1000,
  scrollRestoration: true,
});

export { routeTree };
