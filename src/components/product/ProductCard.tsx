import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { getRetailer } from '@/data/retailers';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { MediaImage } from '@/components/ui/media';
import { Badge } from '@/components/ui/badge';
import { SaveButton } from './SaveButton';

const BADGE_LABEL: Record<string, string> = {
  new: 'New',
  'made-to-order': 'Made to order',
  'in-stock': 'In stock',
  custom: 'Custom',
  limited: 'Limited',
};

/**
 * Product card.
 *
 * Images dominate and the card has no chrome: no border, no rounded corners,
 * no drop shadow. The hover state swaps to the second image where one exists
 * and only on devices with a real pointer.
 */
function ProductCardComponent({
  product,
  priority = false,
  sizes = '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw',
  className,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const retailer = getRetailer(product.retailerId);
  const primary = product.images[0];
  const secondary = product.images[1];
  const badge = product.badges[0];

  return (
    <article className={cn('group relative', className)}>
      <Link to={routes.product(product.slug)} className="block focus-visible:outline-none">
        <div className="relative">
          <MediaImage
            mediaKey={primary?.mediaKey}
            alt={primary?.alt ?? product.name}
            aspect="editorial"
            sizes={sizes}
            priority={priority}
            width={800}
            height={1000}
            imgClassName={cn(
              'transition-transform duration-[900ms] ease-editorial',
              'motion-safe:can-hover:group-hover:scale-[1.02]',
            )}
          />

          {secondary ? (
            <div className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 ease-editorial can-hover:block can-hover:group-hover:opacity-100">
              <MediaImage
                mediaKey={secondary.mediaKey}
                alt={secondary.alt}
                aspect="none"
                className="h-full w-full"
                sizes={sizes}
                width={800}
                height={1000}
              />
            </div>
          ) : null}

          {badge ? (
            <Badge
              variant={badge === 'in-stock' ? 'muted' : 'gold'}
              className="absolute left-0 top-0 bg-background/90 backdrop-blur-sm"
            >
              {BADGE_LABEL[badge] ?? badge}
            </Badge>
          ) : null}
        </div>
      </Link>

      <SaveButton
        kind="product"
        refId={product.id}
        label={product.name}
        className="absolute right-2 top-2"
      />

      <div className="mt-3.5">
        <p className="text-2xs uppercase tracking-eyebrow text-ink-muted">{product.code}</p>
        <h3 className="mt-1 font-display text-lg leading-snug text-ink">
          <Link to={routes.product(product.slug)} className="link-quiet">
            {product.name}
          </Link>
        </h3>
        {retailer ? (
          <p className="mt-0.5 text-xs text-ink-muted">{retailer.name}</p>
        ) : null}
        <p className="mt-2 text-sm text-ink">{formatPrice(product.price, product.currency)}</p>
      </div>
    </article>
  );
}

/* Product grids re-render on filter changes; memoising the card keeps a page
   of 24 tiles from re-rendering when only the sort order changes. */
export const ProductCard = memo(ProductCardComponent);
