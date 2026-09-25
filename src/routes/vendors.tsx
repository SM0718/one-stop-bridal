import { useMemo } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Filter } from 'iconsax-react';
import type { PriceRange, VendorQuery, VendorSort } from '@/types';
import { VENDOR_CATEGORIES, getVendorCategoryBySlug } from '@/data/categories';
import { routes } from '@/config/routes';
import { useVendorFacets, useVendors, useWeddingContext } from '@/hooks/queries';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useUIStore } from '@/stores/ui';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatCount } from '@/lib/format';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { EmptyState } from '@/components/ui/empty-state';
import { VendorGrid } from '@/components/vendor/VendorCard';
import { VendorFilterPanel } from '@/components/filters/VendorFilterPanel';
import { Section, SectionHeader } from '@/components/editorial/Section';
import { SplitText } from '@/components/reactbits';
import { MediaImage } from '@/components/ui/media';
import { RouteNotFound } from './status';

const SORT_OPTIONS: { value: VendorSort; label: string }[] = [
  { value: 'featured', label: 'Recommended' },
  { value: 'experience', label: 'Most experienced' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'name-asc', label: 'Name, A to Z' },
];

const PAGE_SIZE = 9;

/**
 * Shared vendor results. Scope is the only difference between the directory and
 * a category page, so both use this.
 */
function VendorResults({
  scopeCategoryId,
  emptyTitle,
  emptyDescription,
}: {
  scopeCategoryId?: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const filters = useUrlFilters();
  const filtersOpen = useUIStore((s) => s.filtersOpen);
  const setFiltersOpen = useUIStore((s) => s.setFiltersOpen);
  const context = useWeddingContext();

  const urlCategories = filters.getList('category');
  const categories = urlCategories.length > 0 ? urlCategories : scopeCategoryId ? [scopeCategoryId] : [];

  /* Primitive keys keep the query memo stable across renders; the arrays
     returned by getList are new objects every time. */
  const categoryKey = categories.join(',');
  const eventKey = filters.getList('event').join(',');
  const cityKey = filters.getList('city').join(',');
  const priceKey = filters.getList('price').join(',');
  const verifiedKey = filters.get('verified');
  const qKey = filters.get('q');
  const sortKey = filters.get('sort');
  const pageKey = filters.get('page');

  const query: VendorQuery = useMemo(
    () => ({
      faith: context.primary.id,
      categories: categories as VendorQuery['categories'],
      events: filters.getList('event'),
      cities: filters.getList('city'),
      priceRanges: filters.getList('price') as PriceRange[],
      verifiedOnly: filters.get('verified') === 'true',
      search: filters.get('q'),
      sort: (filters.get('sort') as VendorSort) ?? 'featured',
      page: filters.getNumber('page') ?? 1,
      pageSize: PAGE_SIZE,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context.primary.id, scopeCategoryId, categoryKey, eventKey, cityKey, priceKey, verifiedKey, qKey, sortKey, pageKey],
  );

  const { data, isLoading, isError, refetch } = useVendors(query);
  const { data: facets } = useVendorFacets({ faith: context.primary.id });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
      <aside className="hidden lg:block" aria-label="Filters">
        <VendorFilterPanel facets={facets} context={context} relevantEventIds={context.events.map((e) => e.id)} />
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-ink-soft" role="status">
            {isLoading ? 'Loading' : data ? formatCount(data.total, 'business', 'businesses') : '—'}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <Filter size={16} variant="Linear" />
              Filters
              {filters.activeCount > 0 ? (
                <span className="ml-1 bg-ink px-1.5 text-2xs text-ivory">{filters.activeCount}</span>
              ) : null}
            </Button>
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <select
                value={query.sort}
                onChange={(e) => filters.set('sort', e.target.value === 'featured' ? undefined : e.target.value)}
                className="h-9 border border-border bg-pearl px-3 text-[0.8125rem] text-ink focus:border-ink focus:outline-none"
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
              title="We could not load these businesses"
              description="Something went wrong on the way to the directory."
              action={<Button onClick={() => void refetch()}>Try again</Button>}
            />
          ) : isLoading ? (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <li key={index}>
                  <div className="aspect-wide bg-muted" />
                  <div className="mt-4 space-y-2">
                    <div className="h-2.5 w-20 bg-muted" />
                    <div className="h-5 w-2/3 bg-muted" />
                    <div className="h-3 w-full bg-muted" />
                  </div>
                </li>
              ))}
            </ul>
          ) : data && data.items.length > 0 ? (
            <>
              <VendorGrid vendors={data.items} />
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

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[88vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <VendorFilterPanel facets={facets} context={context} relevantEventIds={context.events.map((e) => e.id)} />
          </SheetBody>
          <SheetFooter>
            <Button full onClick={() => setFiltersOpen(false)}>
              Show {data ? formatCount(data.total, 'business', 'businesses') : 'results'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ==========================================================================
   Directory
   ========================================================================== */

export function VendorsIndexPage() {
  useDocumentMeta({
    title: 'Wedding vendors',
    description:
      'Find bridalwear designers, photographers, mehendi artists, venues, decorators, caterers and ritual services. Filter by the ceremonies your wedding includes.',
    canonicalPath: routes.vendors,
  });

  const context = useWeddingContext();

  return (
    <>
      <div className="container pt-10 lg:pt-14">
        <PageHeader
          eyebrow="Vendor directory"
          title="Find wedding professionals who understand your traditions"
          standfirst="Filter by the ceremonies you are holding rather than only by category, so a business that has never worked a nikah or an Anand Karaj does not appear where it does not belong."
          breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Vendors' }]}
        />
      </div>

      <Section>
        <SectionHeader
          eyebrow="Browse by category"
          title="Twenty categories, from bridalwear to ritual services"
          description="Each category lists businesses that have declared experience with the relevant ceremonies."
        />
        <ul className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {VENDOR_CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link to={routes.vendorCategory(category.slug)} className="group block">
                <MediaImage
                  mediaKey={category.mediaKey}
                  aspect="wide"
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                  imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
                />
                <h3 className="mt-3 font-display text-lg text-ink">{category.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{category.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <div className="container pb-section">
        <SplitText
          text="All vendors"
          tag="h2"
          splitType="words"
          className="text-display-sm text-ink"
          textAlign="left"
          threshold={0.15}
          delay={30}
          duration={1.1}
          from={{ opacity: 0, y: 30 }}
        />
        <p className="mt-3 max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">
          {context.label} weddings lead the list. Ratings are not shown on this platform because we do not have genuine
          review data — verification tells you we have checked a business exists, not that we recommend it.
        </p>
        <div className="mt-8">
          <VendorResults
            emptyTitle="No vendors match these filters"
            emptyDescription="Try clearing a filter, or search by city instead of category."
          />
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   Category
   ========================================================================== */

export function VendorCategoryPage() {
  const params = useParams({ strict: false }) as { category?: string };
  const category = getVendorCategoryBySlug(params.category ?? '');
  const context = useWeddingContext();

  useDocumentMeta({
    title: category ? `${category.name} for weddings` : 'Vendors',
    description: category
      ? category.description
      : 'Browse wedding vendors by category, filtered by the ceremonies your wedding includes.',
    canonicalPath: `/vendors/${params.category ?? ''}`,
  });

  if (!category) return <RouteNotFound />;

  return (
    <div className="container pt-8 lg:pt-12">
      <PageHeader
        eyebrow="Vendors"
        title={category.name}
        standfirst={category.description}
        breadcrumbs={[
          { label: 'Home', href: routes.home },
          { label: 'Vendors', href: routes.vendors },
          { label: category.name },
        ]}
      />

      <nav aria-label="Other categories" className="mt-6">
        <ul className="rail gap-2 pb-1">
          {VENDOR_CATEGORIES.map((item) => (
            <li key={item.id} className="shrink-0">
              <Link
                to={routes.vendorCategory(item.slug)}
                className={
                  item.id === category.id
                    ? 'block whitespace-nowrap border border-ink bg-ink px-3.5 py-2 text-[0.8125rem] text-ivory'
                    : 'block whitespace-nowrap border border-border px-3.5 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:border-ink hover:text-ink'
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-6 border-l border-gold pl-4 text-sm text-ink-soft">
        Showing businesses that cover {context.label} ceremonies.
      </p>

      <div className="mt-10 pb-section">
        <VendorResults
          scopeCategoryId={category.id}
          emptyTitle={`No ${category.name.toLowerCase()} match these filters`}
          emptyDescription="Try widening the location or price range, or clear the ceremony filter."
        />
      </div>
    </div>
  );
}
