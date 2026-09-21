import type {
  FacetBucket,
  Paginated,
  PriceRange,
  Vendor,
  VendorCategoryId,
  VendorFacets,
  VendorQuery,
  VendorSort,
} from '@/types';
import { VENDORS, getVendorBySlug } from '@/data/vendors';
import { assertFound, delay, facetCounts, paginate } from './client';

function matchesSearch(vendor: Vendor, term: string): boolean {
  const haystack = [
    vendor.name,
    vendor.summary,
    vendor.city,
    vendor.country,
    ...vendor.about,
    ...vendor.services.map((s) => s.name),
    ...vendor.categoryIds,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(term);
}

function applyFilters(vendors: Vendor[], query: VendorQuery): Vendor[] {
  const term = query.search?.trim().toLowerCase() ?? '';
  return vendors.filter((v) => {
    if (query.faith && !v.faiths.includes(query.faith)) return false;
    if (query.categories?.length && !v.categoryIds.some((c) => query.categories?.includes(c))) return false;
    if (query.events?.length && !v.eventIds.some((e) => query.events?.includes(e))) return false;
    if (query.cities?.length && !query.cities.includes(v.city)) return false;
    if (query.priceRanges?.length && !query.priceRanges.includes(v.priceRange)) return false;
    if (query.verifiedOnly && !v.verified) return false;
    if (term && !matchesSearch(v, term)) return false;
    return true;
  });
}

function sortVendors(vendors: Vendor[], sort: VendorSort = 'featured'): Vendor[] {
  const list = [...vendors];
  switch (sort) {
    case 'name-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc':
      return list.sort(
        (a, b) => priceRank(a.priceRange) - priceRank(b.priceRange) || a.name.localeCompare(b.name),
      );
    case 'price-desc':
      return list.sort(
        (a, b) => priceRank(b.priceRange) - priceRank(a.priceRange) || a.name.localeCompare(b.name),
      );
    case 'experience':
      return list.sort((a, b) => b.yearsActive - a.yearsActive);
    case 'featured':
    default:
      return list.sort(
        (a, b) =>
          Number(b.verified) - Number(a.verified) ||
          b.categoryIds.length - a.categoryIds.length ||
          b.yearsActive - a.yearsActive,
      );
  }
}

const PRICE_ORDER = ['budget', 'mid', 'premium', 'luxury'];

function priceRank(range: string): number {
  return PRICE_ORDER.indexOf(range);
}

export async function getVendors(query: VendorQuery = {}): Promise<Paginated<Vendor>> {
  const filtered = sortVendors(applyFilters(VENDORS, query), query.sort);
  return delay(paginate(filtered, query.page, query.pageSize ?? 12));
}

export async function getVendorFacets(query: VendorQuery = {}): Promise<VendorFacets> {
  const base = VENDORS;
  return delay({
    categories: facetCounts(
      base.filter((v) => !query.faith || v.faiths.includes(query.faith)).flatMap((v) => v.categoryIds),
    ) as FacetBucket<VendorCategoryId>[],
    cities: facetCounts(base.flatMap((v) => v.city)),
    priceRanges: facetCounts(base.map((v) => v.priceRange)) as FacetBucket<PriceRange>[],
  });
}

export async function getVendor(slug: string): Promise<Vendor> {
  return delay(assertFound(getVendorBySlug(slug), 'Vendor'));
}

/**
 * Related vendors match on category and shared faith experience, which is more
 * useful than proximity alone when a couple needs a tradition understood.
 */
export async function getRelatedVendors(vendor: Vendor, limit = 3): Promise<Vendor[]> {
  const scored = VENDORS.filter((v) => v.id !== vendor.id)
    .map((v) => {
      let score = v.categoryIds.filter((c) => vendor.categoryIds.includes(c)).length * 3;
      score += v.faiths.filter((f) => vendor.faiths.includes(f)).length;
      score += v.eventIds.filter((e) => vendor.eventIds.includes(e)).length * 2;
      if (v.city === vendor.city) score += 1;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score);

  return delay(scored.slice(0, limit).map((s) => s.v));
}

export async function getVendorsByCategory(categoryId: string, limit = 6): Promise<Vendor[]> {
  const matches = VENDORS.filter((v) => v.categoryIds.includes(categoryId as Vendor['categoryIds'][number]));
  return delay(matches.slice(0, limit));
}

/** Vendor counts per category, used on the vendor directory index. */
export async function getVendorCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const v of VENDORS) {
    for (const c of v.categoryIds) counts[c] = (counts[c] ?? 0) + 1;
  }
  return delay(counts);
}
