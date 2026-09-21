import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { Location, TickCircle } from 'iconsax-react';
import type { Vendor } from '@/types';
import { getVendorCategory } from '@/data/categories';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { MediaImage } from '@/components/ui/media';
import { Badge } from '@/components/ui/badge';
import { SaveButton } from '@/components/product/SaveButton';

const PRICE_LABEL: Record<string, string> = {
  budget: 'Budget friendly',
  mid: 'Mid range',
  premium: 'Premium',
  luxury: 'Luxury',
};

/**
 * Vendor card. No rating is rendered because this build has no real review
 * data, and a verification badge appears only where the record is verified.
 */
function VendorCardComponent({
  vendor,
  priority = false,
  className,
}: {
  vendor: Vendor;
  priority?: boolean;
  className?: string;
}) {
  const primaryCategory = getVendorCategory(vendor.categoryIds[0]);
  const extra = vendor.categoryIds.length - 1;

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <Link to={routes.vendor(vendor.slug)} className="block focus-visible:outline-none">
        <MediaImage
          mediaKey={vendor.coverMediaKey}
          aspect="wide"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          width={1200}
          height={675}
          imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
        />
      </Link>

      <SaveButton kind="vendor" refId={vendor.id} label={vendor.name} className="absolute right-2 top-2" />

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <p className="text-2xs uppercase tracking-eyebrow text-ink-muted">
            {primaryCategory?.name}
            {extra > 0 ? ` +${extra}` : ''}
          </p>
          {vendor.verified ? (
            <span className="inline-flex items-center gap-1 text-2xs uppercase tracking-eyebrow text-gold-deep">
              <TickCircle size={13} variant="Bold" aria-hidden="true" />
              Verified
            </span>
          ) : null}
        </div>

        <h3 className="mt-1.5 font-display text-xl leading-snug text-ink">
          <Link to={routes.vendor(vendor.slug)} className="link-quiet">
            {vendor.name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{vendor.summary}</p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
          <Location size={14} variant="Linear" aria-hidden="true" />
          {vendor.city}, {vendor.country}
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
          <Badge variant="outline">{PRICE_LABEL[vendor.priceRange]}</Badge>
          <span className="text-xs text-ink-muted">{vendor.yearsActive} years</span>
        </div>
      </div>
    </article>
  );
}

export const VendorCard = memo(VendorCardComponent);

export function VendorGrid({
  vendors,
  className,
  priorityCount = 3,
}: {
  vendors: Vendor[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <ul className={cn('grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {vendors.map((vendor, index) => (
        <li key={vendor.id}>
          <VendorCard vendor={vendor} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
