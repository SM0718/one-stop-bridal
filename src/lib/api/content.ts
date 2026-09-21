import type { Collection, FaithId, InspirationArticle, InspirationCategoryId, Retailer } from '@/types';
import { COLLECTIONS, INSPIRATION, INSPIRATION_CATEGORIES } from '@/data/inspiration';
import { RETAILERS, getRetailerBySlug } from '@/data/retailers';
import { assertFound, delay } from './client';

/* ==========================================================================
   Editorial
   ========================================================================== */

export interface ArticleQuery {
  category?: InspirationCategoryId;
  faith?: FaithId;
  search?: string;
  limit?: number;
}

export async function getArticles(query: ArticleQuery = {}): Promise<InspirationArticle[]> {
  const term = query.search?.trim().toLowerCase() ?? '';
  let list = [...INSPIRATION];

  if (query.category) list = list.filter((a) => a.categoryId === query.category);
  if (query.faith) list = list.filter((a) => a.faiths.includes(query.faith as FaithId));
  if (term)
    list = list.filter((a) =>
      [a.title, a.standfirst, a.author, ...a.sections.flatMap((s) => s.body)].join(' ').toLowerCase().includes(term),
    );

  list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return delay(query.limit ? list.slice(0, query.limit) : list);
}

export async function getArticle(slug: string): Promise<InspirationArticle> {
  return delay(assertFound(INSPIRATION.find((a) => a.slug === slug), 'Article'));
}

export async function getRelatedArticles(article: InspirationArticle, limit = 3): Promise<InspirationArticle[]> {
  const scored = INSPIRATION.filter((a) => a.id !== article.id)
    .map((a) => ({
      a,
      score:
        (a.categoryId === article.categoryId ? 2 : 0) + a.faiths.filter((f) => article.faiths.includes(f)).length,
    }))
    .sort((x, y) => y.score - x.score);
  return delay(scored.slice(0, limit).map((s) => s.a));
}

export async function getInspirationCategories(): Promise<typeof INSPIRATION_CATEGORIES> {
  return delay(INSPIRATION_CATEGORIES);
}

/* ==========================================================================
   Collections
   ========================================================================== */

export async function getCollections(): Promise<Collection[]> {
  return delay(COLLECTIONS);
}

export async function getCollection(slug: string): Promise<Collection> {
  return delay(assertFound(COLLECTIONS.find((c) => c.slug === slug), 'Collection'));
}

/* ==========================================================================
   Retailers
   ========================================================================== */

export async function getRetailers(): Promise<Retailer[]> {
  return delay(RETAILERS);
}

export async function getRetailer(idOrSlug: string): Promise<Retailer> {
  const found = RETAILERS.find((r) => r.id === idOrSlug) ?? getRetailerBySlug(idOrSlug);
  return delay(assertFound(found, 'Retailer'));
}
