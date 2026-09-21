import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { routes } from '@/config/routes';
import { useWishlistStore } from '@/stores/wishlist';
import { useProductsByIds, useVendors, useArticles } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatCount } from '@/lib/format';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductCard } from '@/components/product/ProductCard';
import { VendorCard } from '@/components/vendor/VendorCard';
import { MediaImage } from '@/components/ui/media';
import { cn } from '@/lib/utils';
import { INSPIRATION } from '@/data/inspiration';

type Tab = 'all' | 'product' | 'vendor' | 'inspiration';

/**
 * Saved items as cards, filterable by kind. Collections can be created on the
 * account screens; this view is about looking at what you have saved.
 */
export function WishlistPage() {
  useDocumentMeta({
    title: 'Saved items',
    description: 'Pieces, vendors and reading you have saved.',
    canonicalPath: routes.wishlist,
    noIndex: true,
  });

  const items = useWishlistStore((s) => s.items);
  const collections = useWishlistStore((s) => s.collections);
  const [tab, setTab] = useState<Tab>('all');
  const [collectionId, setCollectionId] = useState<string>('all');

  const inScope = items.filter((item) => collectionId === 'all' || item.collectionId === collectionId);

  const productIds = inScope.filter((i) => i.kind === 'product').map((i) => i.refId);
  const vendorIds = inScope.filter((i) => i.kind === 'vendor').map((i) => i.refId);
  const articleIds = inScope.filter((i) => i.kind === 'inspiration').map((i) => i.refId);

  const { data: products } = useProductsByIds(productIds);
  const { data: vendorPage } = useVendors({ pageSize: 50 });
  const { data: articles } = useArticles({});

  const savedVendors = (vendorPage?.items ?? []).filter((v) => vendorIds.includes(v.id));
  const savedArticles = (articles ?? INSPIRATION).filter((a) => articleIds.includes(a.id));

  const showProducts = tab === 'all' || tab === 'product';
  const showVendors = tab === 'all' || tab === 'vendor';
  const showArticles = tab === 'all' || tab === 'inspiration';

  const hasAnything =
    (showProducts && (products?.length ?? 0) > 0) ||
    (showVendors && savedVendors.length > 0) ||
    (showArticles && savedArticles.length > 0);

  return (
    <div className="container pt-10 lg:pt-14">
      <PageHeader
        eyebrow="Saved"
        title="Your saved items"
        standfirst={
          items.length === 0
            ? 'Save pieces, vendors and guides as you browse. Nothing is shared with anyone until you send an enquiry.'
            : `${formatCount(items.length, 'item')} saved across ${formatCount(collections.length, 'collection')}.`
        }
        breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Saved' }]}
        actions={
          items.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link to={routes.accountWishlist}>Manage collections</Link>
            </Button>
          ) : null
        }
      />

      {items.length === 0 ? (
        <div className="py-14">
          <EmptyState
            title="Nothing saved yet"
            description="Tap the heart on any piece or business to keep it here. Saved items stay on this device until you sign in."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to={routes.collections}>Browse collections</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={routes.vendors}>Browse vendors</Link>
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap gap-2">
              {(
                [
                  { key: 'all', label: 'Everything' },
                  { key: 'product', label: 'Pieces' },
                  { key: 'vendor', label: 'Vendors' },
                  { key: 'inspiration', label: 'Reading' },
                ] as const
              ).map((option) => (
                <li key={option.key}>
                  <button
                    type="button"
                    onClick={() => setTab(option.key)}
                    aria-pressed={tab === option.key}
                    className={cn(
                      'border px-3.5 py-2 text-[0.8125rem] transition-colors',
                      tab === option.key
                        ? 'border-ink bg-ink text-ivory'
                        : 'border-border text-ink-soft hover:border-ink hover:text-ink',
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <label htmlFor="collection-filter" className="text-xs text-ink-muted">
                Collection
              </label>
              <select
                id="collection-filter"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="border border-border bg-pearl px-2.5 py-1.5 text-xs text-ink-soft focus:border-ink focus:outline-none"
              >
                <option value="all">All collections</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-14 py-12">
            {!hasAnything ? (
              <EmptyState
                title="Nothing in this view"
                description="Try a different tab or collection."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTab('all');
                      setCollectionId('all');
                    }}
                  >
                    Show everything
                  </Button>
                }
              />
            ) : null}

            {showProducts && products && products.length > 0 ? (
              <section aria-labelledby="saved-pieces">
                <h2 id="saved-pieces" className="eyebrow mb-6">
                  Saved pieces ({products.length})
                </h2>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
                  {products.map((product) => (
                    <li key={product.id}>
                      <ProductCard product={product} sizes="(min-width: 1024px) 23vw, 45vw" />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {showVendors && savedVendors.length > 0 ? (
              <section aria-labelledby="saved-vendors">
                <h2 id="saved-vendors" className="eyebrow mb-6">
                  Saved vendors ({savedVendors.length})
                </h2>
                <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {savedVendors.map((vendor) => (
                    <li key={vendor.id}>
                      <VendorCard vendor={vendor} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {showArticles && savedArticles.length > 0 ? (
              <section aria-labelledby="saved-reading">
                <h2 id="saved-reading" className="eyebrow mb-6">
                  Saved reading ({savedArticles.length})
                </h2>
                <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
                  {savedArticles.map((article) => (
                    <li key={article.id}>
                      <Link to={routes.inspirationArticle(article.slug)} className="group block">
                        <MediaImage
                          mediaKey={article.heroMediaKey}
                          aspect="wide"
                          sizes="(min-width: 640px) 32vw, 100vw"
                          imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
                        />
                        <h3 className="mt-3 font-display text-lg text-ink">{article.title}</h3>
                        <p className="mt-1.5 text-sm text-ink-soft">{article.standfirst}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <p className="border-t border-border py-8 text-xs leading-relaxed text-ink-muted">
            Saved items are stored on this device. When you sign in, they follow your account. We never tell a retailer
            that you saved their piece until you send an enquiry.
          </p>
        </>
      )}
    </div>
  );
}
