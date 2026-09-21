import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Product, ProductQuery, RetailerApplicationStatus, VendorQuery } from '@/types';
import {
  createRetailerProduct,
  deleteRetailerProduct,
  getApplication,
  getArticle,
  getArticles,
  getCollection,
  getCollections,
  getEnquiries,
  getFeaturedProducts,
  getInspirationCategories,
  getOrders,
  getProduct,
  getProductFacets,
  getProducts,
  getProductsByIds,
  getRelatedArticles,
  getRelatedProducts,
  getRelatedVendors,
  getRetailer,
  getRetailerProducts,
  getRetailerStats,
  getRetailers,
  getSearchSuggestions,
  getVendor,
  getVendorCategoryCounts,
  getVendorFacets,
  getVendors,
  search,
  setApplicationStatus,
  submitApplication,
  withdrawApplication,
} from '@/lib/api';
import type { ArticleQuery } from '@/lib/api/content';
import { useWeddingStore } from '@/stores/wedding';
import { selectContext } from '@/stores/wedding';

export const queryKeys = {
  products: {
    list: (query: ProductQuery) => ['products', 'list', query] as const,
    facets: (query: ProductQuery) => ['products', 'facets', query] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
    related: (id: string) => ['products', 'related', id] as const,
    featured: ['products', 'featured'] as const,
    byIds: (ids: string[]) => ['products', 'byIds', ids] as const,
  },
  vendors: {
    list: (query: VendorQuery) => ['vendors', 'list', query] as const,
    facets: (query: VendorQuery) => ['vendors', 'facets', query] as const,
    detail: (slug: string) => ['vendors', 'detail', slug] as const,
    related: (id: string) => ['vendors', 'related', id] as const,
    categoryCounts: ['vendors', 'categoryCounts'] as const,
  },
  content: {
    articles: (query: ArticleQuery) => ['articles', query] as const,
    article: (slug: string) => ['articles', 'detail', slug] as const,
    relatedArticles: (id: string) => ['articles', 'related', id] as const,
    categories: ['inspiration', 'categories'] as const,
    collections: ['collections'] as const,
    collection: (slug: string) => ['collections', slug] as const,
    retailers: ['retailers'] as const,
    retailer: (idOrSlug: string) => ['retailers', idOrSlug] as const,
  },
  search: {
    query: (term: string, faith: string | null) => ['search', term, faith] as const,
    suggestions: ['search', 'suggestions'] as const,
  },
  retailer: {
    application: ['retailer', 'application'] as const,
    products: (retailerId: string) => ['retailer', 'products', retailerId] as const,
    enquiries: ['retailer', 'enquiries'] as const,
    orders: ['retailer', 'orders'] as const,
    stats: (retailerId: string) => ['retailer', 'stats', retailerId] as const,
  },
};

/* ==========================================================================
   Products
   ========================================================================== */

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products.list(query),
    queryFn: () => getProducts(query),
    placeholderData: keepPreviousData,
  });
}

export function useProductFacets(query: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products.facets(query),
    queryFn: () => getProductFacets(query),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => getProduct(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedProducts(product: Product | undefined) {
  return useQuery({
    queryKey: queryKeys.products.related(product?.id ?? 'none'),
    queryFn: () => getRelatedProducts(product as Product),
    enabled: Boolean(product),
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({ queryKey: queryKeys.products.featured, queryFn: () => getFeaturedProducts(limit) });
}

export function useProductsByIds(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.products.byIds(ids),
    queryFn: () => getProductsByIds(ids),
    enabled: ids.length > 0,
  });
}

/* ==========================================================================
   Vendors
   ========================================================================== */

export function useVendors(query: VendorQuery) {
  return useQuery({
    queryKey: queryKeys.vendors.list(query),
    queryFn: () => getVendors(query),
    placeholderData: keepPreviousData,
  });
}

export function useVendorFacets(query: VendorQuery) {
  return useQuery({
    queryKey: queryKeys.vendors.facets(query),
    queryFn: () => getVendorFacets(query),
    placeholderData: keepPreviousData,
  });
}

export function useVendor(slug: string) {
  return useQuery({
    queryKey: queryKeys.vendors.detail(slug),
    queryFn: () => getVendor(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedVendorsFor(vendor: Parameters<typeof getRelatedVendors>[0] | undefined) {
  return useQuery({
    queryKey: queryKeys.vendors.related(vendor?.id ?? 'none'),
    queryFn: () => getRelatedVendors(vendor!),
    enabled: Boolean(vendor),
  });
}

export function useVendorCategoryCounts() {
  return useQuery({ queryKey: queryKeys.vendors.categoryCounts, queryFn: getVendorCategoryCounts });
}

/* ==========================================================================
   Content
   ========================================================================== */

export function useArticles(query: ArticleQuery = {}) {
  return useQuery({ queryKey: queryKeys.content.articles(query), queryFn: () => getArticles(query) });
}

export function useArticle(slug: string) {
  return useQuery({ queryKey: queryKeys.content.article(slug), queryFn: () => getArticle(slug) });
}

export function useRelatedArticlesFor(article: Parameters<typeof getRelatedArticles>[0] | undefined) {
  return useQuery({
    queryKey: queryKeys.content.relatedArticles(article?.id ?? 'none'),
    queryFn: () => getRelatedArticles(article!),
    enabled: Boolean(article),
  });
}

export function useInspirationCategories() {
  return useQuery({ queryKey: queryKeys.content.categories, queryFn: getInspirationCategories });
}

export function useCollections() {
  return useQuery({ queryKey: queryKeys.content.collections, queryFn: getCollections });
}

export function useCollection(slug: string) {
  return useQuery({ queryKey: queryKeys.content.collection(slug), queryFn: () => getCollection(slug) });
}

export function useRetailers() {
  return useQuery({ queryKey: queryKeys.content.retailers, queryFn: getRetailers });
}

export function useRetailer(idOrSlug: string) {
  return useQuery({ queryKey: queryKeys.content.retailer(idOrSlug), queryFn: () => getRetailer(idOrSlug) });
}

/* ==========================================================================
   Search — ranked against the couple's selected wedding context
   ========================================================================== */

export function useSearch(term: string) {
  const faith = useWeddingStore((s) => s.profile.faith);
  return useQuery({
    queryKey: queryKeys.search.query(term, faith),
    queryFn: () => search(term, faith),
    enabled: term.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}

export function useSearchSuggestions() {
  return useQuery({ queryKey: queryKeys.search.suggestions, queryFn: getSearchSuggestions, staleTime: Infinity });
}

/* ==========================================================================
   Retailer workspace
   ========================================================================== */

export function useRetailerApplication() {
  return useQuery({ queryKey: queryKeys.retailer.application, queryFn: getApplication });
}

export function useSubmitApplication() {
  return useMutation({ mutationFn: submitApplication });
}

export function useSetApplicationStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (status: RetailerApplicationStatus) => setApplicationStatus(status),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.retailer.application }),
  });
}

export function useWithdrawApplication() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.retailer.application }),
  });
}

export function useRetailerProducts(retailerId: string) {
  return useQuery({
    queryKey: queryKeys.retailer.products(retailerId),
    queryFn: () => getRetailerProducts(retailerId),
  });
}

export function useRetailerEnquiries() {
  return useQuery({ queryKey: queryKeys.retailer.enquiries, queryFn: getEnquiries });
}

export function useRetailerOrders() {
  return useQuery({ queryKey: queryKeys.retailer.orders, queryFn: getOrders });
}

export function useRetailerStats(retailerId: string) {
  return useQuery({ queryKey: queryKeys.retailer.stats(retailerId), queryFn: () => getRetailerStats(retailerId) });
}

/** The retailer record used by the demo workspace. */
export { demoRetailerId } from '@/lib/api/retailer';

export function useCreateRetailerProduct(retailerId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createRetailerProduct,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.retailer.products(retailerId) }),
  });
}

export function useDeleteRetailerProduct(retailerId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteRetailerProduct,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.retailer.products(retailerId) }),
  });
}

/* ==========================================================================
   Faith-aware helpers
   ========================================================================== */

/**
 * The resolved wedding context. Every personalisation decision in the UI reads
 * from here, so faith logic never leaks into components.
 */
export function useWeddingContext() {
  return useWeddingStore(selectContext);
}

export function useActiveFaith() {
  return useWeddingStore((s) => s.profile.faith);
}
