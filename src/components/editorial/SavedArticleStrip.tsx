import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { useWishlistStore } from '@/stores/wishlist';
import { useProductsByIds } from '@/hooks/queries';
import { INSPIRATION } from '@/data/inspiration';
import { routes } from '@/config/routes';
import { MediaImage } from '@/components/ui/media';
import { Section, SectionHeader } from '@/components/editorial/Section';
import { Button } from '@/components/ui/button';

/**
 * Surfaces articles the visitor has already saved, so reading and saving are
 * connected rather than two separate features.
 */
export function SavedArticleStrip() {
  /* Select the saved items themselves — deriving inside the selector would
     return a new array on every read and re-render without end. */
  const items = useWishlistStore((s) => s.items);

  const savedIds = useMemo(
    () => items.filter((i) => i.kind === 'inspiration').map((i) => i.refId),
    [items],
  );
  const articles = INSPIRATION.filter((a) => savedIds.includes(a.id));

  /* Also show reading saved alongside saved pieces, which is a useful link
     between the editorial and the catalogue. */
  const savedProductIds = useMemo(
    () => items.filter((i) => i.kind === 'product').map((i) => i.refId),
    [items],
  );
  const { data: products } = useProductsByIds(savedProductIds.slice(0, 3));

  if (articles.length === 0 && (!products || products.length === 0)) return null;

  return (
    <Section tone="muted">
      <SectionHeader
        eyebrow="Your reading and saves"
        title="Picked up where you left off"
        description="Articles and pieces you have saved, kept on this device."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {articles.length > 0 ? (
          <div>
            <h3 className="eyebrow mb-4">Saved reading</h3>
            <ul className="space-y-4">
              {articles.slice(0, 3).map((article) => (
                <li key={article.id} className="border-t border-border pt-4">
                  <Link to={routes.inspirationArticle(article.slug)} className="group flex gap-4">
                    <MediaImage mediaKey={article.heroMediaKey} alt="" aspect="square" sizes="80px" className="w-20 shrink-0" />
                    <span>
                      <span className="block font-display text-lg leading-snug text-ink">{article.title}</span>
                      <span className="mt-1 block text-xs text-ink-muted">{article.readingMinutes} min read</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {products && products.length > 0 ? (
          <div>
            <h3 className="eyebrow mb-4">Saved pieces</h3>
            <ul className="space-y-4">
              {products.map((product) => (
                <li key={product.id} className="border-t border-border pt-4">
                  <Link to={routes.product(product.slug)} className="group flex gap-4">
                    <MediaImage
                      mediaKey={product.images[0]?.mediaKey}
                      alt=""
                      aspect="square"
                      sizes="80px"
                      className="w-20 shrink-0"
                    />
                    <span>
                      <span className="block font-display text-lg leading-snug text-ink">{product.name}</span>
                      <span className="mt-1 block text-xs text-ink-muted">{product.code}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-5">
              <Link to={routes.wishlist}>Open your saved items</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
