import { Link } from '@tanstack/react-router';
import { Trash } from 'iconsax-react';
import { routes } from '@/config/routes';
import { selectCartCount, selectCartTotal, useCartStore } from '@/stores/cart';
import { useProductsByIds } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatPrice } from '@/lib/format';
import { getRetailer } from '@/data/retailers';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaImage } from '@/components/ui/media';
import { EmptyState } from '@/components/ui/empty-state';
import { Separator } from '@/components/ui/separator';

export function CartPage() {
  useDocumentMeta({
    title: 'Your bag',
    description: 'Pieces you are considering, ready to order or enquire about.',
    canonicalPath: routes.cart,
    noIndex: true,
  });

  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const clear = useCartStore((s) => s.clear);
  const count = useCartStore(selectCartCount);
  const { total, hasEnquiryOnly } = useCartStore(selectCartTotal);

  const productIds = [...new Set(lines.map((l) => l.productId))];
  const { data: products } = useProductsByIds(productIds);

  const byId = new Map((products ?? []).map((p) => [p.id, p]));

  return (
    <div className="container pt-10 lg:pt-14">
      <PageHeader
        eyebrow="Your bag"
        title={count === 0 ? 'Your bag is empty' : `Your bag (${count})`}
        standfirst={
          count === 0
            ? 'Pieces you add will collect here. Made-to-measure items are usually ordered after a consultation, not straight from the bag.'
            : 'Nothing is reserved until you check out or a retailer confirms. Made-to-measure pieces are confirmed at consultation.'
        }
        breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Bag' }]}
        actions={
          lines.length > 0 ? (
            <button type="button" onClick={clear} className="link-quiet text-sm text-ink-muted hover:text-ink">
              Empty bag
            </button>
          ) : null
        }
      />

      {lines.length === 0 ? (
        <div className="py-14">
          <EmptyState
            title="Nothing in your bag"
            description="Browse the collections and add pieces you want to order or discuss with a retailer."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to={routes.collectionsBridal}>Explore bridal</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={routes.wishlist}>View saved items</Link>
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <div className="grid gap-12 py-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <section aria-labelledby="bag-lines">
            <h2 id="bag-lines" className="eyebrow mb-5">
              Items
            </h2>
            <ul className="divide-y divide-border border-y border-border">
              {lines.map((line) => {
                const product = byId.get(line.productId);
                const retailer = product ? getRetailer(product.retailerId) : undefined;
                const options = Object.entries(line.options);

                return (
                  <li key={line.id} className="flex gap-5 py-5">
                    <Link to={product ? routes.product(product.slug) : routes.collections} className="shrink-0">
                      <MediaImage
                        mediaKey={product?.images[0]?.mediaKey}
                        alt={product?.name ?? 'Saved piece'}
                        aspect="square"
                        sizes="112px"
                        className="w-24 sm:w-28"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          {product ? (
                            <>
                              <p className="text-2xs uppercase tracking-eyebrow text-ink-muted">{product.code}</p>
                              <h3 className="mt-1 font-display text-lg leading-snug text-ink">
                                <Link to={routes.product(product.slug)} className="link-quiet">
                                  {product.name}
                                </Link>
                              </h3>
                              {retailer ? <p className="mt-0.5 text-xs text-ink-muted">{retailer.name}</p> : null}
                            </>
                          ) : (
                            <h3 className="font-display text-lg text-ink">Item no longer listed</h3>
                          )}

                          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
                            {line.size ? <span>Size: {line.size}</span> : null}
                            {options.map(([key, value]) => (
                              <span key={key}>
                                {key}: {value}
                              </span>
                            ))}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-ink">
                            {line.price === null ? 'On enquiry' : formatPrice(line.price * line.quantity, product?.currency)}
                          </p>
                          {line.price === null ? (
                            <Badge variant="gold" className="mt-1.5">
                              Enquiry
                            </Badge>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            disabled={line.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm text-ink" aria-live="polite">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            disabled={line.quantity >= 20}
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="inline-flex items-center gap-2 text-xs text-ink-muted transition-colors hover:text-destructive"
                        >
                          <Trash size={15} variant="Linear" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside aria-labelledby="bag-summary" className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="bag-summary" className="eyebrow mb-5">
              Summary
            </h2>
            <div className="border border-border p-6">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Items</dt>
                  <dd className="text-ink">{count}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="text-ink">{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Shipping</dt>
                  <dd className="text-ink-muted">Calculated at checkout</dd>
                </div>
              </dl>

              <Separator className="my-5" />

              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-ink-soft">Total</span>
                <span className="font-display text-2xl text-ink">{formatPrice(total)}</span>
              </div>

              {hasEnquiryOnly ? (
                <p className="mt-4 border border-dashed border-border bg-muted/40 p-3 text-xs leading-relaxed text-ink-muted">
                  Some pieces are priced on enquiry, so they are not included in the total. Send an enquiry for those and
                  the retailer will quote you directly.
                </p>
              ) : null}

              <Button asChild size="lg" full className="mt-6">
                <Link to={routes.checkout}>
                  {total === 0 ? 'Continue to enquiry details' : 'Proceed to checkout'}
                </Link>
              </Button>

              <Button asChild variant="outline" full className="mt-3">
                <Link to={routes.collections}>Continue browsing</Link>
              </Button>

              <p className="mt-5 text-xs leading-relaxed text-ink-muted">
                Payment is not taken on this platform in this build. Checkout records your order details and a retailer
                confirms production and payment directly.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
