import type { ReactNode } from 'react';
import type { ProductFacets } from '@/types';
import { getProductCategory } from '@/data/categories';
import { eventName } from '@/data/events';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import type { WeddingContext } from '@/data/faiths';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ProductFilterPanelProps {
  facets: ProductFacets | undefined;
  context: WeddingContext;
  /** Ceremony ids relevant to the active wedding context, shown first */
  relevantEventIds: string[];
}

function FilterGroup({
  id,
  title,
  children,
  count,
}: {
  id: string;
  title: string;
  children: ReactNode;
  count?: number;
}) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger headingLevel={2} className="py-3.5 text-[0.8125rem]">
        <span className="flex items-center gap-2">
          {title}
          {count ? <span className="text-2xs text-ink-muted">({count})</span> : null}
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pr-0">{children}</AccordionContent>
    </AccordionItem>
  );
}

/**
 * Catalogue filters.
 *
 * Order is not arbitrary: categories and ceremonies drawn from the couple's
 * wedding context come first, so the most relevant narrowing is the easiest to
 * reach. Facet counts come from the live result set.
 */
export function ProductFilterPanel({ facets, context, relevantEventIds }: ProductFilterPanelProps) {
  const filters = useUrlFilters();

  const relevantCategories = context.leadCategoryIds;
  const otherCategories = (facets?.categories ?? []).filter(
    (bucket) => !relevantCategories.includes(bucket.value),
  );

  const relevantEvents = relevantEventIds.filter((id) => id.length > 0);

  return (
    <div>
      <Accordion type="multiple" defaultValue={['categories', 'events']} className="border-t border-border">
        {relevantCategories.length > 0 ? (
          <FilterGroup id="categories" title={`For a ${context.primary.shortName} wedding`}>
            <ul className="space-y-2.5">
              {relevantCategories.map((categoryId) => {
                const category = getProductCategory(categoryId);
                const bucket = facets?.categories.find((b) => b.value === categoryId);
                if (!category) return null;
                return (
                  <li key={categoryId}>
                    <Checkbox
                      id={`cat-${categoryId}`}
                      checked={filters.isActive('category', categoryId)}
                      onCheckedChange={() => filters.toggle('category', categoryId)}
                      label={
                        <span className="flex w-full items-center justify-between gap-3">
                          <span>{category.name}</span>
                          {bucket ? <span className="text-2xs text-ink-muted">{bucket.count}</span> : null}
                        </span>
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </FilterGroup>
        ) : null}

        {relevantEvents.length > 0 ? (
          <FilterGroup id="events" title="Ceremony">
            <ul className="space-y-2.5">
              {relevantEvents.map((eventId) => (
                <li key={eventId}>
                  <Checkbox
                    id={`evt-${eventId}`}
                    checked={filters.isActive('event', eventId)}
                    onCheckedChange={() => filters.toggle('event', eventId)}
                    label={eventName(eventId)}
                  />
                </li>
              ))}
            </ul>
          </FilterGroup>
        ) : null}

        {otherCategories.length > 0 ? (
          <FilterGroup id="all-categories" title="All categories">
            <ul className="space-y-2.5">
              {otherCategories.map((bucket) => (
                <li key={bucket.value}>
                  <Checkbox
                    id={`cat-${bucket.value}`}
                    checked={filters.isActive('category', bucket.value)}
                    onCheckedChange={() => filters.toggle('category', bucket.value)}
                    label={
                      <span className="flex w-full items-center justify-between gap-3">
                        <span>{getProductCategory(bucket.value)?.name ?? bucket.label}</span>
                        <span className="text-2xs text-ink-muted">{bucket.count}</span>
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </FilterGroup>
        ) : null}

        {facets && facets.silhouettes.length > 0 ? (
          <FilterGroup id="silhouette" title="Silhouette">
            <ul className="space-y-2.5">
              {facets.silhouettes.map((bucket) => (
                <li key={bucket.value}>
                  <Checkbox
                    id={`sil-${bucket.value}`}
                    checked={filters.isActive('silhouette', bucket.value)}
                    onCheckedChange={() => filters.toggle('silhouette', bucket.value)}
                    label={
                      <span className="flex w-full items-center justify-between gap-3">
                        <span>{bucket.label}</span>
                        <span className="text-2xs text-ink-muted">{bucket.count}</span>
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </FilterGroup>
        ) : null}

        {facets && facets.fabrics.length > 0 ? (
          <FilterGroup id="fabric" title="Fabric">
            <ul className="space-y-2.5">
              {facets.fabrics.map((bucket) => (
                <li key={bucket.value}>
                  <Checkbox
                    id={`fab-${bucket.value}`}
                    checked={filters.isActive('fabric', bucket.value)}
                    onCheckedChange={() => filters.toggle('fabric', bucket.value)}
                    label={
                      <span className="flex w-full items-center justify-between gap-3">
                        <span>{bucket.label}</span>
                        <span className="text-2xs text-ink-muted">{bucket.count}</span>
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </FilterGroup>
        ) : null}

        {facets && facets.colours.length > 0 ? (
          <FilterGroup id="colour" title="Colour">
            <ul className="space-y-2.5">
              {facets.colours.map((bucket) => (
                <li key={bucket.value}>
                  <Checkbox
                    id={`col-${bucket.value}`}
                    checked={filters.isActive('colour', bucket.value)}
                    onCheckedChange={() => filters.toggle('colour', bucket.value)}
                    label={
                      <span className="flex w-full items-center justify-between gap-3">
                        <span>{bucket.label}</span>
                        <span className="text-2xs text-ink-muted">{bucket.count}</span>
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </FilterGroup>
        ) : null}

        {facets && facets.designers.length > 0 ? (
          <FilterGroup id="designer" title="Designer / retailer">
            <ul className="space-y-2.5">
              {facets.designers.map((bucket) => (
                <li key={bucket.value}>
                  <Checkbox
                    id={`des-${bucket.value}`}
                    checked={filters.isActive('designer', bucket.value)}
                    onCheckedChange={() => filters.toggle('designer', bucket.value)}
                    label={
                      <span className="flex w-full items-center justify-between gap-3">
                        <span>{bucket.label}</span>
                        <span className="text-2xs text-ink-muted">{bucket.count}</span>
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </FilterGroup>
        ) : null}

        {facets && facets.availability.length > 0 ? (
          <FilterGroup id="availability" title="Availability">
            <ul className="space-y-2.5">
              {facets.availability.map((bucket) => (
                <li key={bucket.value}>
                  <Checkbox
                    id={`av-${bucket.value}`}
                    checked={filters.isActive('availability', bucket.value)}
                    onCheckedChange={() => filters.toggle('availability', bucket.value)}
                    label={
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="capitalize">{bucket.label.replace('-', ' ')}</span>
                        <span className="text-2xs text-ink-muted">{bucket.count}</span>
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </FilterGroup>
        ) : null}

        {facets && facets.priceRange.max > 0 ? (
          <FilterGroup id="price" title="Price">
            <PriceFilter facets={facets} />
          </FilterGroup>
        ) : null}
      </Accordion>

      {filters.activeCount > 0 ? (
        <div className="mt-5 border-t border-border pt-4">
          <Button variant="outline" size="sm" full onClick={filters.clearAll}>
            Clear {filters.activeCount} {filters.activeCount === 1 ? 'filter' : 'filters'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Price is offered as bands rather than a slider: on a catalogue where many
 * pieces are enquiry-only, bands are easier to reason about than a range.
 */
function PriceFilter({ facets }: { facets: ProductFacets }) {
  const filters = useUrlFilters();
  const { min, max } = facets.priceRange;

  const bands = [
    { label: `Under ${formatPrice(Math.round(max * 0.25))}`, min: undefined, max: Math.round(max * 0.25) },
    {
      label: `${formatPrice(Math.round(max * 0.25))} – ${formatPrice(Math.round(max * 0.6))}`,
      min: Math.round(max * 0.25),
      max: Math.round(max * 0.6),
    },
    {
      label: `${formatPrice(Math.round(max * 0.6))} – ${formatPrice(Math.round(max * 0.85))}`,
      min: Math.round(max * 0.6),
      max: Math.round(max * 0.85),
    },
    { label: `${formatPrice(Math.round(max * 0.85))} and above`, min: Math.round(max * 0.85), max: undefined },
  ];

  return (
    <div className="space-y-2.5">
      <ul className="space-y-2.5">
        {bands.map((band) => {
          const active =
            (band.min === undefined ? !filters.get('min') : filters.get('min') === String(band.min)) &&
            (band.max === undefined ? !filters.get('max') : filters.get('max') === String(band.max));
          return (
            <li key={band.label}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() =>
                  filters.setMany({
                    min: active ? undefined : band.min !== undefined ? String(band.min) : undefined,
                    max: active ? undefined : band.max !== undefined ? String(band.max) : undefined,
                  })
                }
                className={cn(
                  'w-full text-left text-[0.8125rem] transition-colors',
                  active ? 'text-ink' : 'text-ink-soft hover:text-ink',
                )}
              >
                {band.label}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="pt-1 text-xs leading-relaxed text-ink-muted">
        Pieces priced on enquiry are shown in every band, since their price is not published. Catalogue range{' '}
        {formatPrice(min)}–{formatPrice(max)}.
      </p>
    </div>
  );
}
