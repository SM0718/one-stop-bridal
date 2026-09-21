import type { FaithId, SearchResult, SearchResponse, SearchResultKind } from '@/types';
import { RETAILERS } from '@/data/retailers';
import { COLLECTIONS, INSPIRATION } from '@/data/inspiration';
import { getFaith } from '@/data/faiths';
import { allProducts } from './products';
import { VENDORS } from '@/data/vendors';
import { delay } from './client';

const GROUP_LABELS: Record<SearchResultKind, string> = {
  product: 'Pieces',
  vendor: 'Wedding professionals',
  collection: 'Collections',
  inspiration: 'Reading',
  guide: 'Planning guides',
  event: 'Ceremonies & events',
};

const GROUP_ORDER: SearchResultKind[] = ['product', 'vendor', 'collection', 'inspiration', 'guide', 'event'];

function scoreText(text: string, term: string, weight = 1): number {
  const lower = text.toLowerCase();
  if (!lower.includes(term)) return 0;
  /* A match at the start of the field is a stronger signal than one buried. */
  return (lower.startsWith(term) ? 3 : 1) * weight;
}

/**
 * Faith-aware search.
 *
 * Results that suit the couple's selected wedding context are ranked above
 * equally-relevant results that do not, so searching "bridal jewellery" in a
 * Sikh context surfaces Sikh-appropriate pieces first without hiding the rest.
 */
export async function search(query: string, faith: FaithId | null = null, limitPerGroup = 6): Promise<SearchResponse> {
  const term = query.trim().toLowerCase();
  if (term.length < 2) {
    return delay({ query, groups: [], total: 0 });
  }

  const results: SearchResult[] = [];

  /* Products */
  for (const p of allProducts()) {
    let score = scoreText(p.name, term, 3) + scoreText(p.description, term, 1) + scoreText(p.code, term, 2);
    score += scoreText([p.fabric, p.colour, p.silhouette, ...p.styleTags].join(' '), term, 1);
    if (score > 0) {
      if (faith && p.faiths.includes(faith)) score += 4;
      const retailer = RETAILERS.find((r) => r.id === p.retailerId);
      results.push({
        id: p.id,
        kind: 'product',
        title: p.name,
        subtitle: retailer ? `${p.code} · ${retailer.name}` : p.code,
        href: `/product/${p.slug}`,
        mediaKey: p.images[0]?.mediaKey ?? null,
        faiths: p.faiths,
        score,
      });
    }
  }

  /* Vendors */
  for (const v of VENDORS) {
    let score = scoreText(v.name, term, 3) + scoreText(v.summary, term, 1);
    score += scoreText([v.city, v.country, ...v.services.map((s) => s.name)].join(' '), term, 1);
    if (score > 0) {
      if (faith && v.faiths.includes(faith)) score += 4;
      results.push({
        id: v.id,
        kind: 'vendor',
        title: v.name,
        subtitle: `${v.city} · ${v.categoryIds.length} service${v.categoryIds.length > 1 ? 's' : ''}`,
        href: `/vendor/${v.slug}`,
        mediaKey: v.coverMediaKey,
        faiths: v.faiths,
        score,
      });
    }
  }

  /* Collections */
  for (const c of COLLECTIONS) {
    const score = scoreText(c.name, term, 3) + scoreText(c.description, term, 1);
    if (score > 0) {
      results.push({
        id: c.id,
        kind: 'collection',
        title: c.name,
        subtitle: c.description,
        href: `/collections/${c.slug}`,
        mediaKey: c.mediaKey,
        faiths: c.faiths,
        score: score + (faith && c.faiths.includes(faith) ? 3 : 0),
      });
    }
  }

  /* Editorial */
  for (const a of INSPIRATION) {
    const score = scoreText(a.title, term, 3) + scoreText(a.standfirst, term, 1);
    if (score > 0) {
      results.push({
        id: a.id,
        kind: 'inspiration',
        title: a.title,
        subtitle: a.standfirst,
        href: `/inspiration/${a.slug}`,
        mediaKey: a.heroMediaKey,
        faiths: a.faiths,
        score: score + (faith && a.faiths.includes(faith) ? 2 : 0),
      });
    }
  }

  /* Ceremonies from the faith configurations themselves */
  for (const faithConfig of [getFaith(faith)]) {
    if (!faithConfig) continue;
    for (const e of faithConfig.events) {
      const score = scoreText(e.name, term, 3) + scoreText(e.summary, term, 1);
      if (score > 0) {
        results.push({
          id: e.id,
          kind: 'event',
          title: e.name,
          subtitle: e.summary,
          href: '/planning/events',
          mediaKey: null,
          faiths: [faithConfig.id],
          score: score + 2,
        });
      }
    }
  }

  const grouped = GROUP_ORDER.map((kind) => {
    const inGroup = results.filter((r) => r.kind === kind).sort((a, b) => b.score - a.score);
    return { kind, label: GROUP_LABELS[kind], results: inGroup.slice(0, limitPerGroup), total: inGroup.length };
  }).filter((g) => g.results.length > 0);

  return delay({
    query,
    groups: grouped.map(({ kind, label, results: r }) => ({ kind, label, results: r })),
    total: results.length,
  });
}

/** Suggestions shown before a query is typed. */
export async function getSearchSuggestions(): Promise<string[]> {
  return delay([
    'Bridal lehenga',
    'Modest bridalwear',
    'Mehendi artist',
    'Nikah looks',
    'Church ceremony',
    'Sherwani',
    'Wedding jewellery',
    'Anand Karaj',
    'Chuppah',
    'Wedding photographer',
  ]);
}
