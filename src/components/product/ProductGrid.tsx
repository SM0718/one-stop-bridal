import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';

/**
 * Product grid.
 *
 * Only the first row loads images eagerly; everything else is lazy, which
 * matters on the low-end Android devices the brief calls out.
 */
export function ProductGrid({
  products,
  columns = 3,
  className,
  priorityCount = 4,
}: {
  products: Product[];
  columns?: 3 | 4;
  className?: string;
  priorityCount?: number;
}) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < priorityCount}
            sizes={
              columns === 4
                ? '(min-width: 1280px) 22vw, (min-width: 1024px) 23vw, (min-width: 640px) 30vw, 45vw'
                : '(min-width: 1024px) 30vw, (min-width: 640px) 30vw, 45vw'
            }
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Used only while the first page of a catalogue is loading. Deliberately quiet:
 * warm blocks in the final layout, so nothing shifts when data arrives.
 */
export function ProductGridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: 3 | 4 }) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <div className="aspect-editorial bg-muted" />
          <div className="mt-3.5 space-y-2">
            <div className="h-2.5 w-14 bg-muted" />
            <div className="h-4 w-3/4 bg-muted" />
            <div className="h-3 w-1/2 bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}
