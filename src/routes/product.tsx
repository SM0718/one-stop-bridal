import { useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft2, ArrowRight2, Heart, MessageText1, SearchNormal1, Share } from 'iconsax-react';
import { useProduct, useRelatedProducts, useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta, schema } from '@/hooks/useDocumentMeta';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { formatPrice, formatDate } from '@/lib/format';
import { getRetailer } from '@/data/retailers';
import { getProductCategory } from '@/data/categories';
import { getFaith } from '@/data/faiths';
import { eventName } from '@/data/events';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaImage } from '@/components/ui/media';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductCard } from '@/components/product/ProductCard';
import { SaveButton } from '@/components/product/SaveButton';
import { EnquiryDialog } from '@/components/product/EnquiryDialog';
import { SizeGuide } from '@/components/product/SizeGuide';
import { Section, SectionHeader } from '@/components/editorial/Section';
import { RouteNotFound } from './status';

const AVAILABILITY_LABEL: Record<string, string> = {
  'in-stock': 'Ready to ship',
  'made-to-order': 'Made to order',
  'pre-order': 'Pre-order',
  enquire: 'By consultation',
};

export function ProductDetailPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const slug = params.slug ?? '';
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: related } = useRelatedProducts(product);
  const context = useWeddingContext();
  const addProduct = useCartStore((s) => s.addProduct);
  const save = useWishlistStore((s) => s.save);

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const retailer = product ? getRetailer(product.retailerId) : undefined;
  const category = product ? getProductCategory(product.categoryId) : undefined;

  useDocumentMeta({
    title: product?.name ?? 'Product',
    description: product?.description ?? '',
    canonicalPath: routes.product(slug),
    type: 'product',
    jsonLd: product
      ? schema.product({
          name: product.name,
          description: product.description,
          code: product.code,
          retailer: retailer?.name ?? '',
          price: product.price,
          currency: product.currency,
          available: product.availability === 'in-stock',
        })
      : null,
  });

  if (isError) return <RouteNotFound />;

  if (isLoading || !product) {
    return (
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16" aria-hidden="true">
          <div className="aspect-editorial bg-muted" />
          <div className="space-y-4">
            <div className="h-3 w-24 bg-muted" />
            <div className="h-8 w-3/4 bg-muted" />
            <div className="h-4 w-1/3 bg-muted" />
            <div className="h-6 w-28 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  const chosenSize = size ?? product.sizes[0] ?? null;
  const effectivePrice = product.price === null ? null : product.price + sumDeltas(product, selected);

  return (
    <>
      <div className="container pt-8">
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: routes.home },
            { label: 'Collections', href: routes.collections },
            ...(category ? [{ label: category.name, href: routes.collection(category.group) }] : []),
            { label: product.name },
          ]}
          eyebrow={product.code}
          title={product.name}
          standfirst={product.description}
        />
      </div>

      <div className="container py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="min-w-0">
            <MediaImage
              mediaKey={product.images[activeImage]?.mediaKey}
              alt={product.images[activeImage]?.alt ?? product.name}
              aspect="editorial"
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              width={1000}
              height={1250}
            />

            {product.images.length > 1 ? (
              <ul className="rail mt-3 gap-3" aria-label="Product images">
                {product.images.map((image, index) => (
                  <li key={image.mediaKey + index} className="w-20 shrink-0 sm:w-24">
                    <button
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1} of ${product.images.length}`}
                      aria-current={index === activeImage}
                      className={cn(
                        'block w-full border transition-colors',
                        index === activeImage ? 'border-ink' : 'border-transparent hover:border-border',
                      )}
                    >
                      <MediaImage
                        mediaKey={image.mediaKey}
                        alt=""
                        aspect="square"
                        sizes="96px"
                        width={192}
                        height={192}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Information */}
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                {retailer ? (
                  <Link to={routes.vendors} className="link-quiet text-sm text-ink-soft">
                    {retailer.name}
                  </Link>
                ) : null}
                <p className="mt-3 text-2xl text-ink">{formatPrice(effectivePrice, product.currency)}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {product.price === null
                    ? 'This piece is made to order. Enquire for a quote and a timeline.'
                    : 'Includes all taxes. Shipping calculated at checkout.'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <SaveButton
                  kind="product"
                  refId={product.id}
                  label={product.name}
                  variant="plain"
                  size={22}
                />
                <button
                  type="button"
                  aria-label="Share this piece"
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) void navigator.share({ title: product.name, url });
                    else void navigator.clipboard?.writeText(url);
                  }}
                  className="flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-ink"
                >
                  <Share size={20} variant="Linear" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="muted">{AVAILABILITY_LABEL[product.availability]}</Badge>
              {product.badges.includes('custom') ? <Badge variant="outline">Customisable</Badge> : null}
              {product.badges.includes('new') ? <Badge variant="gold">New</Badge> : null}
            </div>

            {/* Options */}
            {product.options.map((option) => (
              <fieldset key={option.id} className="mt-8">
                <legend className="text-[0.8125rem] font-medium text-ink">
                  {option.label}
                  {selected[option.id] ? (
                    <span className="ml-2 font-normal text-ink-muted">{selected[option.id]}</span>
                  ) : null}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const active = selected[option.id] === value.value;
                    return (
                      <button
                        key={value.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelected((prev) => ({ ...prev, [option.id]: value.value }))}
                        className={cn(
                          'border px-3.5 py-2 text-[0.8125rem] transition-colors',
                          active
                            ? 'border-ink bg-ink text-ivory'
                            : 'border-border text-ink-soft hover:border-ink hover:text-ink',
                        )}
                      >
                        {value.value}
                        {value.priceDelta ? (
                          <span className="ml-1.5 text-xs opacity-80">
                            {value.priceDelta > 0 ? '+' : ''}
                            {formatPrice(Math.abs(value.priceDelta), product.currency).replace('+', '')}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {/* Sizes */}
            <fieldset className="mt-8">
              <legend className="flex w-full items-center justify-between text-[0.8125rem] font-medium text-ink">
                <span>Size</span>
                <SizeGuide />
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={chosenSize === option}
                    onClick={() => setSize(option)}
                    className={cn(
                      'border px-3.5 py-2 text-[0.8125rem] transition-colors',
                      chosenSize === option
                        ? 'border-ink bg-ink text-ivory'
                        : 'border-border text-ink-soft hover:border-ink hover:text-ink',
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Actions */}
            <div className="mt-9 space-y-3">
              {product.price === null ? (
                <Button size="lg" full onClick={() => setEnquiryOpen(true)}>
                  Enquire about this piece
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    full
                    onClick={() => {
                      addProduct(product, { size: chosenSize, options: selected });
                      setAdded(true);
                    }}
                  >
                    {added ? 'Added to bag' : 'Add to bag'}
                  </Button>
                  <Button size="lg" variant="outline" full onClick={() => setEnquiryOpen(true)}>
                    Request an appointment
                  </Button>
                </>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => save('product', product.id, 'col-bridal-looks')}
                  className="inline-flex items-center gap-2 text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
                >
                  <Heart size={16} variant="Linear" />
                  Save to my bridal looks
                </button>
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
                >
                  <MessageText1 size={16} variant="Linear" />
                  WhatsApp the retailer
                </a>
              </div>
            </div>

            <p className="mt-6 border border-border bg-muted/40 p-4 text-xs leading-relaxed text-ink-soft">
              Enquiries go directly to {retailer?.name ?? 'the retailer'}. We do not take a commission on enquiries and do
              not pass your details to anyone else. Read our{' '}
              <Link to={routes.privacy} className="underline decoration-gold/50 underline-offset-2">
                privacy notice
              </Link>
              .
            </p>

            {/* Detail accordions */}
            <Accordion type="multiple" defaultValue={['description']} className="mt-9 border-t border-border">
              <AccordionItem value="description">
                <AccordionTrigger headingLevel={2}>Description</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {product.details.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="materials">
                <AccordionTrigger headingLevel={2}>Materials</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5">
                    {product.materials.map((material) => (
                      <li key={material}>{material}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="custom">
                <AccordionTrigger headingLevel={2}>Customisation</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5">
                    {product.customization.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery">
                <AccordionTrigger headingLevel={2}>Delivery</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-3">
                    {product.delivery.map((entry) => (
                      <div key={entry.label}>
                        <dt className="font-medium text-ink">{entry.label}</dt>
                        <dd>{entry.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="care">
                <AccordionTrigger headingLevel={2}>Care</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5">
                    {product.care.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns">
                <AccordionTrigger headingLevel={2}>Returns</AccordionTrigger>
                <AccordionContent>
                  <p>{product.returns}</p>
                  <Link
                    to={routes.returns}
                    className="mt-3 inline-block text-ink underline decoration-gold/50 underline-offset-2"
                  >
                    Read the full returns policy
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="spec">
                <AccordionTrigger headingLevel={2}>Specification</AccordionTrigger>
                <AccordionContent>
                  <dl className="grid grid-cols-2 gap-y-2.5 text-[0.8125rem]">
                    <dt className="text-ink-muted">Product code</dt>
                    <dd className="text-ink">{product.code}</dd>
                    <dt className="text-ink-muted">Silhouette</dt>
                    <dd className="text-ink">{product.silhouette}</dd>
                    <dt className="text-ink-muted">Fabric</dt>
                    <dd className="text-ink">{product.fabric}</dd>
                    <dt className="text-ink-muted">Colour</dt>
                    <dd className="text-ink">{product.colour}</dd>
                    {category ? (
                      <>
                        <dt className="text-ink-muted">Category</dt>
                        <dd className="text-ink">{category.name}</dd>
                      </>
                    ) : null}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Faith and ceremony relevance — the reason this piece surfaced */}
        <Separator className="my-14" />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="eyebrow mb-3">Suited to</h2>
            <ul className="flex flex-wrap gap-2">
              {product.faiths.map((faithId) => (
                <li key={faithId}>
                  <span className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-[0.8125rem] text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getFaith(faithId).accent.hex }}
                    />
                    {getFaith(faithId).name}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              These indicate the traditions this piece is commonly chosen for. They are not requirements, and nothing on
              the platform is restricted to one tradition.
            </p>
          </div>

          {product.eventIds.length > 0 ? (
            <div>
              <h2 className="eyebrow mb-3">Ceremonies</h2>
              <ul className="flex flex-wrap gap-2">
                {product.eventIds.map((eventId) => (
                  <li key={eventId}>
                    <span className="border border-border px-3 py-1.5 text-[0.8125rem] text-ink-soft">
                      {eventName(eventId)}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to={routes.planningEvents}
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-ink link-quiet"
              >
                Add to your wedding plan
                <ArrowRight2 size={13} variant="Linear" />
              </Link>
            </div>
          ) : null}
        </div>

        <p className="mt-8 text-xs text-ink-muted">
          Listed {formatDate(product.createdAt, 'long')} · Your context: {context.label}
        </p>
      </div>

      {related && related.length > 0 ? (
        <Section tone="deep">
          <SectionHeader
            eyebrow="Complete the look"
            title="Pairs well with this piece"
            description="Chosen by shared ceremony, category and price band rather than by what is left in stock."
          />
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} sizes="(min-width: 1024px) 23vw, 45vw" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <div className="container py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <Link
            to={routes.collectionsBridal}
            className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft2 size={16} variant="Linear" />
            Back to collections
          </Link>
          <Link
            to={routes.search}
            className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <SearchNormal1 size={16} variant="Linear" />
            Search for something else
          </Link>
        </div>
      </div>

      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        productName={product.name}
        retailerName={retailer?.name ?? 'the retailer'}
      />
    </>
  );
}

/** Sums the price deltas of the currently selected options. */
function sumDeltas(product: NonNullable<ReturnType<typeof useProduct>['data']>, selected: Record<string, string>): number {
  let total = 0;
  for (const option of product.options) {
    const value = option.values.find((v) => v.value === selected[option.id]);
    if (value?.priceDelta) total += value.priceDelta;
  }
  return total;
}

