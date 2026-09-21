import { useMemo } from 'react';
import { Filter, Sort } from 'iconsax-react';
import type { Availability, ProductCategoryId, ProductQuery, ProductSort } from '@/types';
import type { WeddingContext } from '@/data/faiths';
import { useProductFacets, useProducts } from '@/hooks/queries';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useUIStore } from '@/stores/ui';
import { formatCount } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { ProductFilterPanel } from '@/components/filters/ProductFilterPanel';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'name-asc', label: 'Name, A to Z' },
];

const PAGE_SIZE = 12;

interface CatalogueResultsProps {
  /** Category ids this page is scoped to. URL category filters narrow within these. */
  scopeCategoryIds: ProductCategoryId[];
  context: WeddingContext;
  emptyTitle: string;
  emptyDescription: string;
  columns?: 3 | 4;
}

/**
 * The catalogue itself: one component shared by group pages, collection pages
 * and search, so filtering, sorting, pagination and empty states behave
 * identically everywhere and only the header differs.
 */
export function CatalogueResults({
  scopeCategoryIds,
  context,
  emptyTitle,
  emptyDescription,
  columns = 3,
}: CatalogueResultsProps) {
  const filters = useUrlFilters();
  const filtersOpen = useUIStore((s) => s.filtersOpen);
  const setFiltersOpen = useUIStore((s) => s.setFiltersOpen);

  const urlCategories = filters.getList('category') as ProductCategoryId[];

  /* Primitive keys keep the query memo stable across renders; the arrays
     returned by getList are new objects every time. */
  const categoryKey = urlCategories.join(',');
  const eventKey = filters.getList('event').join(',');
  const silhouetteKey = filters.getList('silhouette').join(',');
  const fabricKey = filters.getList('fabric').join(',');
  const colourKey = filters.getList('colour').join(',');
  const designerKey = filters.getList('designer').join(',');
  const sizeKey = filters.getList('size').join(',');
  const availabilityKey = filters.getList('availability').join(',');
  const minKey = filters.get('min');
  const maxKey = filters.get('max');
  const qKey = filters.get('q');
  const sortKey = filters.get('sort');
  const pageKey = filters.get('page');

  const query: ProductQuery = useMemo(
    () => ({
      faith: context.primary.id,
      categories: urlCategories.length > 0 ? urlCategories : scopeCategoryIds,
      events: filters.getList('event'),
      silhouettes: filters.getList('silhouette'),
      fabrics: filters.getList('fabric'),
      colours: filters.getList('colour'),
      designers: filters.getList('designer'),
      sizes: filters.getList('size'),
      availability: filters.getList('availability') as Availability[],
      minPrice: filters.getNumber('min'),
      maxPrice: filters.getNumber('max'),
      search: filters.get('q'),
      sort: (filters.get('sort') as ProductSort) ?? 'featured',
      page: filters.getNumber('page') ?? 1,
      pageSize: PAGE_SIZE,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      context.primary.id,
      scopeCategoryIds,
      categoryKey,
      eventKey,
      silhouetteKey,
      fabricKey,
      colourKey,
      designerKey,
      sizeKey,
      availabilityKey,
      minKey,
      maxKey,
      qKey,
      sortKey,
      pageKey,
    ],
  );

  const { data, isLoading, isError, refetch, isFetching } = useProducts(query);
  const { data: facets } = useProductFacets({ ...query, categories: urlCategories.length ? urlCategories : scopeCategoryIds });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
      {/* Desktop filters */}
      <aside className="hidden lg:block" aria-label="Filters">
        <ProductFilterPanel
          facets={facets}
          context={context}
          relevantEventIds={context.events.map((e) => e.id)}
        />
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-ink-soft" role="status">
            {isLoading ? 'Loading' : data ? formatCount(data.total, 'piece') : '—'}
            {isFetching && !isLoading ? <span className="text-ink-muted"> · updating</span> : null}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter size={16} variant="Linear" />
              Filters
              {filters.activeCount > 0 ? (
                <span className="ml-1 bg-ink px-1.5 text-2xs text-ivory">{filters.activeCount}</span>
              ) : null}
            </Button>

            <label className="relative flex items-center">
              <span className="sr-only">Sort by</span>
              <Sort size={16} variant="Linear" className="pointer-events-none absolute left-3 text-ink-muted" aria-hidden="true" />
              <select
                value={query.sort}
                onChange={(e) => filters.set('sort', e.target.value === 'featured' ? undefined : e.target.value)}
                className="h-9 border border-border bg-pearl pl-9 pr-8 text-[0.8125rem] text-ink focus:border-ink focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8">
          {isError ? (
            <EmptyState
              title="We could not load these pieces"
              description="Something went wrong fetching the catalogue. This is usually temporary."
              action={<Button onClick={() => void refetch()}>Try again</Button>}
            />
          ) : isLoading ? (
            <ProductGridSkeleton count={6} columns={columns} />
          ) : data && data.items.length > 0 ? (
            <>
              <ProductGrid products={data.items} columns={columns} />

              {totalPages > 1 ? (
                <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2 border-t border-border pt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.page <= 1}
                    onClick={() => filters.set('page', data.page - 1 <= 1 ? undefined : String(data.page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="px-3 text-[0.8125rem] text-ink-soft">
                    Page {data.page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.hasMore}
                    onClick={() => filters.set('page', String(data.page + 1))}
                  >
                    Next
                  </Button>
                </nav>
              ) : null}
            </>
          ) : (
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={
                filters.activeCount > 0 ? (
                  <Button variant="outline" onClick={filters.clearAll}>
                    Clear filters
                  </Button>
                ) : null
              }
            />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[88vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <ProductFilterPanel
              facets={facets}
              context={context}
              relevantEventIds={context.events.map((e) => e.id)}
            />
          </SheetBody>
          <SheetFooter>
            <Button full onClick={() => setFiltersOpen(false)}>
              Show {data ? formatCount(data.total, 'piece') : 'results'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { SORT_OPTIONS, PAGE_SIZE };

/** Small helper so headers can render active filter chips consistently. */
export function ActiveFilterSummary({ className }: { className?: string }) {
  const filters = useUrlFilters();
  if (filters.activeCount === 0) return null;
  return (
    <p className={cn('text-xs text-ink-muted', className)}>
      {filters.activeCount} {filters.activeCount === 1 ? 'filter' : 'filters'} applied
    </p>
  );
}
