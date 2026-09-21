import type { VendorFacets } from '@/types';
import { getVendorCategory } from '@/data/categories';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { eventName } from '@/data/events';
import type { WeddingContext } from '@/data/faiths';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const PRICE_LABEL: Record<string, string> = {
  budget: 'Budget friendly',
  mid: 'Mid range',
  premium: 'Premium',
  luxury: 'Luxury',
};

export function VendorFilterPanel({
  facets,
  context,
  relevantEventIds,
}: {
  facets: VendorFacets | undefined;
  context: WeddingContext;
  relevantEventIds: string[];
}) {
  const filters = useUrlFilters();

  const relevant = context.leadVendorCategoryIds;
  const rest = (facets?.categories ?? []).filter((b) => !relevant.includes(b.value));

  return (
    <div>
      <Accordion type="multiple" defaultValue={['categories']} className="border-t border-border">
        {relevant.length > 0 ? (
          <AccordionItem value="categories">
            <AccordionTrigger headingLevel={2} className="py-3.5 text-[0.8125rem]">
              Relevant to {context.primary.shortName} weddings
            </AccordionTrigger>
            <AccordionContent className="pb-4 pr-0">
              <ul className="space-y-2.5">
                {relevant.map((categoryId) => {
                  const category = getVendorCategory(categoryId);
                  if (!category) return null;
                  return (
                    <li key={categoryId}>
                      <Checkbox
                        id={`vcat-${categoryId}`}
                        checked={filters.isActive('category', categoryId)}
                        onCheckedChange={() => filters.toggle('category', categoryId)}
                        label={category.name}
                      />
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {relevantEventIds.length > 0 ? (
          <AccordionItem value="events">
            <AccordionTrigger headingLevel={2} className="py-3.5 text-[0.8125rem]">Ceremony covered</AccordionTrigger>
            <AccordionContent className="pb-4 pr-0">
              <ul className="space-y-2.5">
                {relevantEventIds.map((eventId) => (
                  <li key={eventId}>
                    <Checkbox
                      id={`vevt-${eventId}`}
                      checked={filters.isActive('event', eventId)}
                      onCheckedChange={() => filters.toggle('event', eventId)}
                      label={eventName(eventId)}
                    />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {rest.length > 0 ? (
          <AccordionItem value="all-categories">
            <AccordionTrigger headingLevel={2} className="py-3.5 text-[0.8125rem]">All categories</AccordionTrigger>
            <AccordionContent className="pb-4 pr-0">
              <ul className="space-y-2.5">
                {rest.map((bucket) => (
                  <li key={bucket.value}>
                    <Checkbox
                      id={`vcat-${bucket.value}`}
                      checked={filters.isActive('category', bucket.value)}
                      onCheckedChange={() => filters.toggle('category', bucket.value)}
                      label={
                        <span className="flex w-full items-center justify-between gap-3">
                          <span>{getVendorCategory(bucket.value)?.name ?? bucket.label}</span>
                          <span className="text-2xs text-ink-muted">{bucket.count}</span>
                        </span>
                      }
                    />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {facets && facets.cities.length > 0 ? (
          <AccordionItem value="city">
            <AccordionTrigger headingLevel={2} className="py-3.5 text-[0.8125rem]">Location</AccordionTrigger>
            <AccordionContent className="pb-4 pr-0">
              <ul className="space-y-2.5">
                {facets.cities.map((bucket) => (
                  <li key={bucket.value}>
                    <Checkbox
                      id={`city-${bucket.value}`}
                      checked={filters.isActive('city', bucket.value)}
                      onCheckedChange={() => filters.toggle('city', bucket.value)}
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
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {facets && facets.priceRanges.length > 0 ? (
          <AccordionItem value="price">
            <AccordionTrigger headingLevel={2} className="py-3.5 text-[0.8125rem]">Price range</AccordionTrigger>
            <AccordionContent className="pb-4 pr-0">
              <ul className="space-y-2.5">
                {facets.priceRanges.map((bucket) => (
                  <li key={bucket.value}>
                    <Checkbox
                      id={`vprice-${bucket.value}`}
                      checked={filters.isActive('price', bucket.value)}
                      onCheckedChange={() => filters.toggle('price', bucket.value)}
                      label={PRICE_LABEL[bucket.value] ?? bucket.label}
                    />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ) : null}

        <AccordionItem value="trust">
          <AccordionTrigger headingLevel={2} className="py-3.5 text-[0.8125rem]">Trust</AccordionTrigger>
          <AccordionContent className="pb-4 pr-0">
            <Checkbox
              id="verified-only"
              checked={filters.get('verified') === 'true'}
              onCheckedChange={(checked) => filters.set('verified', checked ? 'true' : undefined)}
              label="Verified businesses only"
            />
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              Verified means we have checked the business registration and contact details. It is not a rating.
            </p>
          </AccordionContent>
        </AccordionItem>
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
