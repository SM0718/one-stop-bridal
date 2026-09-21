import type {
  Availability,
  FacetBucket,
  Paginated,
  Product,
  ProductCategoryId,
  ProductFacets,
  ProductQuery,
  ProductSort,
} from '@/types';
import { PRODUCTS, getProductBySlug, getProductById } from '@/data/products';
import { RETAILERS } from '@/data/retailers';
import { assertFound, delay, facetCounts, paginate, readLocal, unique, writeLocal } from './client';

const USER_PRODUCTS_KEY = 'user-products';

/** Retailer-created demo products, persisted so the dashboard feels real. */
function userProducts(): Product[] {
  return readLocal<Product[]>(USER_PRODUCTS_KEY, []);
}

export function allProducts(): Product[] {
  return [...userProducts(), ...PRODUCTS];
}

function matchesSearch(product: Product, term: string): boolean {
  const haystack = [
    product.name,
    product.code,
    product.description,
    product.fabric,
    product.colour,
    product.silhouette,
    ...product.styleTags,
    ...product.materials,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(term);
}

function inPriceBand(product: Product, min?: number, max?: number): boolean {
  if (min === undefined && max === undefined) return true;
  /* Enquiry-only pieces are treated as always matching a price filter, since
     we cannot know their price. Hiding them would be misleading. */
  if (product.price === null) return true;
  if (min !== undefined && product.price < min) return false;
  if (max !== undefined && product.price > max) return false;
  return true;
}

type FacetDimension =
  | 'categories'
  | 'silhouettes'
  | 'fabrics'
  | 'colours'
  | 'designers'
  | 'sizes'
  | 'availability'
  | 'price';

function applyFilters(products: Product[], query: ProductQuery, omit?: FacetDimension): Product[] {
  const term = query.search?.trim().toLowerCase() ?? '';

  return products.filter((p) => {
    if (query.faith && !p.faiths.includes(query.faith)) return false;

    if (omit !== 'categories' && query.categories?.length && !query.categories.includes(p.categoryId)) return false;
    if (omit !== 'silhouettes' && query.silhouettes?.length && !query.silhouettes.includes(p.silhouette)) return false;
    if (omit !== 'fabrics' && query.fabrics?.length && !query.fabrics.includes(p.fabric)) return false;
    if (omit !== 'colours' && query.colours?.length && !query.colours.includes(p.colour)) return false;
    if (omit !== 'designers' && query.designers?.length && !query.designers.includes(p.retailerId)) return false;
    if (omit !== 'availability' && query.availability?.length && !query.availability.includes(p.availability))
      return false;

    if (omit !== 'sizes' && query.sizes?.length && !p.sizes.some((s) => query.sizes?.includes(s))) return false;

    if (query.events?.length && !p.eventIds.some((e) => query.events?.includes(e))) return false;

    if (omit !== 'price' && !inPriceBand(p, query.minPrice, query.maxPrice)) return false;

    if (term && !matchesSearch(p, term)) return false;

    return true;
  });
}

function sortProducts(products: Product[], sort: ProductSort = 'featured'): Product[] {
  const list = [...products];
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    case 'price-desc':
      return list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    case 'newest':
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'name-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt));
  }
}

const CATEGORY_LABELS = new Map<string, string>();

export function registerCategoryLabels(labels: Map<string, string>): void {
  for (const [k, v] of labels) CATEGORY_LABELS.set(k, v);
}

export async function getProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
  const filtered = sortProducts(applyFilters(allProducts(), query), query.sort);
  return delay(paginate(filtered, query.page, query.pageSize ?? 12));
}

export async function getProductFacets(query: ProductQuery = {}): Promise<ProductFacets> {
  const base = allProducts();

  const categoryBuckets = facetCounts(
    applyFilters(base, query, 'categories').map((p) => p.categoryId),
  ) as FacetBucket<ProductCategoryId>[];

  const availabilityBuckets = facetCounts(
    applyFilters(base, query, 'availability').map((p) => p.availability),
  ) as FacetBucket<Availability>[];

  const priced = base.filter((p) => p.price !== null).map((p) => p.price as number);

  return delay({
    categories: categoryBuckets,
    silhouettes: facetCounts(applyFilters(base, query, 'silhouettes').map((p) => p.silhouette)),
    fabrics: facetCounts(applyFilters(base, query, 'fabrics').map((p) => p.fabric)),
    colours: facetCounts(applyFilters(base, query, 'colours').map((p) => p.colour)),
    designers: facetCounts(applyFilters(base, query, 'designers').map((p) => p.retailerId)).map((b) => ({
      ...b,
      label: RETAILERS.find((r) => r.id === b.value)?.name ?? b.label,
    })),
    sizes: facetCounts(applyFilters(base, query, 'sizes').flatMap((p) => p.sizes)),
    availability: availabilityBuckets,
    priceRange: {
      min: priced.length ? Math.min(...priced) : 0,
      max: priced.length ? Math.max(...priced) : 0,
    },
  });
}

export async function getProduct(slug: string): Promise<Product> {
  return delay(assertFound(getProductBySlug(slug), 'Product'));
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return delay(ids.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p)));
}

/**
 * Related products are chosen by shared faith context and event first, then by
 * category — so a Hindu bride sees pieces for her ceremonies rather than a
 * generic "you may also like" list.
 */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const scored = allProducts()
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.categoryId === product.categoryId) score += 3;
      if (p.retailerId === product.retailerId) score += 2;
      score += p.faiths.filter((f) => product.faiths.includes(f)).length;
      score += p.eventIds.filter((e) => product.eventIds.includes(e)).length * 2;
      if (p.price !== null && product.price !== null && Math.abs(p.price - product.price) < product.price * 0.5)
        score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || Number(b.p.featured) - Number(a.p.featured));

  return delay(scored.slice(0, limit).map((s) => s.p));
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const featured = allProducts().filter((p) => p.featured);
  return delay(featured.slice(0, limit));
}

/** Products tied to a specific wedding event, used on the planner. */
export async function getProductsForEvents(eventIds: string[], limit = 8): Promise<Product[]> {
  const matches = allProducts().filter((p) => p.eventIds.some((e) => eventIds.includes(e)));
  return delay(matches.slice(0, limit));
}

/* ==========================================================================
   Retailer product management (demo writes)
   ========================================================================== */

export async function getRetailerProducts(retailerId: string): Promise<Product[]> {
  return delay(allProducts().filter((p) => p.retailerId === retailerId));
}

export async function createRetailerProduct(product: Product): Promise<Product> {
  const next = [product, ...userProducts()];
  writeLocal(USER_PRODUCTS_KEY, next);
  return delay(product);
}

export async function updateRetailerProduct(product: Product): Promise<Product> {
  const own = userProducts();
  const exists = own.some((p) => p.id === product.id);
  if (exists) {
    writeLocal(
      USER_PRODUCTS_KEY,
      own.map((p) => (p.id === product.id ? product : p)),
    );
  }
  return delay(product);
}

export async function deleteRetailerProduct(productId: string): Promise<void> {
  writeLocal(
    USER_PRODUCTS_KEY,
    userProducts().filter((p) => p.id !== productId),
  );
  return delay(undefined);
}

/** Distinct facet values for filter UIs that need the full vocabulary. */
export function productVocabulary() {
  const base = allProducts();
  return {
    silhouettes: unique(base.map((p) => p.silhouette)).sort(),
    fabrics: unique(base.map((p) => p.fabric)).sort(),
    colours: unique(base.map((p) => p.colour)).sort(),
    sizes: unique(base.flatMap((p) => p.sizes)),
  };
}
