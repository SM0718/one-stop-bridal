import { useEffect, useMemo } from 'react';
import { Edit2 } from 'iconsax-react';
import { getBridalRecommendations } from '@/lib/recommendations';
import { useWeddingStore } from '@/stores/wedding';
import { useProducts } from '@/hooks/queries';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import type { ProductCategoryId } from '@/types';
import { BUDGET_LABEL, TIMELINE_LABEL } from '@/data/blueprint/config';
import { eventName } from '@/data/events';
import { Section, SectionHeader } from '@/components/editorial/Section';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { seedDraftFromBlueprint } from '@/components/blueprint/steps';

/**
 * Personalised surface for the Bridal catalogue.
 *
 * Only renders meaningful work when a Wedding Blueprint exists: a header in
 * the couple's own words plus the event / timeline / budget recommendation
 * rails. When the blueprint was skipped this is a no-op so the page reads as
 * the plain collection.
 */
export function BridalPersonalization({
  scopeCategoryIds,
}: {
  scopeCategoryIds: ProductCategoryId[];
}) {
  const blueprint = useWeddingStore((s) => s.blueprint);
  const openBridalBlueprint = useWeddingStore((s) => s.openBridalBlueprint);
  const setBlueprintDraft = useWeddingStore((s) => s.setBlueprintDraft);

  function openForEdit() {
    /* Seed the draft from the saved blueprint so the dialog reopens with
       every answer pre-filled and editable. */
    if (blueprint) setBlueprintDraft(seedDraftFromBlueprint(blueprint));
    openBridalBlueprint();
  }

  const { data } = useProducts({ categories: scopeCategoryIds, sort: 'featured', pageSize: 80 });

  const recommendations = useMemo(
    () => getBridalRecommendations(blueprint, data?.items ?? []),
    [blueprint, data?.items],
  );

  /* Initialise the catalogue filter from the blueprint's first event — only
     once, only when the user hasn't set one themselves, and entirely editable. */
  const filters = useUrlFilters();
  useEffect(() => {
    const eventIds = blueprint?.events.eventIds ?? [];
    if (blueprint?.completed && eventIds.length > 0 && !filters.get('event')) {
      filters.set('event', eventIds[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueprint?.completed, blueprint?.events?.eventIds.join(',')]);

  const completed = Boolean(blueprint?.completed);
  const eventLooks = (recommendations?.eventLooks ?? []).slice(0, 3);
  const timelinePicks = recommendations?.timelinePicks ?? [];
  const budgetPicks = recommendations?.budgetPicks ?? [];

  if (!completed || !recommendations) return null;

  return (
    <>
      {/* Personalized header */}
      <section className="mt-10 border-y border-border py-9 sm:py-11" aria-label="Your wedding blueprint summary">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Your wedding blueprint</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
              {recommendations.summary}
            </h2>
            <p className="mt-3 max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">
              The collection below is ordered around your celebrations and lead time, and your
              budget band helps the first pieces you see sit comfortably within it. Nothing is
              hidden — change any filter and the list responds.
            </p>
          </div>
          <Button variant="outline" onClick={openForEdit} className="shrink-0">
            <Edit2 size={15} variant="Linear" aria-hidden="true" />
            Edit Wedding Blueprint
          </Button>
        </div>

        {blueprint && (
          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6">
            <div>
              <dt className="eyebrow mb-1">Events</dt>
              <dd className="text-sm text-ink">
                {blueprint.events.eventIds.length > 0
                  ? blueprint.events.eventIds.slice(0, 3).map(eventName).join(' · ')
                  : 'None selected'}
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Timeline</dt>
              <dd className="text-sm text-ink">
                {blueprint.timeline.timeframe
                  ? TIMELINE_LABEL[blueprint.timeline.timeframe]
                  : 'Flexible'}
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Budget</dt>
              <dd className="text-sm text-ink">
                {blueprint.budget !== 'prefer-not-to-say' ? BUDGET_LABEL[blueprint.budget] : 'Prefer not to say'}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* Event looks */}
      {eventLooks.length > 0 ? (
        <Section>
          <SectionHeader
            eyebrow="Styled for your celebrations"
            title="Looks for your events"
            description="Pieces labelled for the ceremonies you picked, in the order you'll actually host them."
          />
          <div className="mt-8 space-y-10">
            {eventLooks.map((look) =>
              look.products.length > 0 ? (
                <div key={look.eventId}>
                  <h3 className="mb-4 font-display text-xl text-ink">{look.eventName}</h3>
                  <ul className="rail gap-5 pb-1">
                    {look.products.map((product) => (
                      <li key={product.id} className="w-56 shrink-0">
                        <ProductCard
                          product={product}
                          sizes="(min-width: 1024px) 14vw, 45vw"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}
          </div>
        </Section>
      ) : null}

      {/* Timeline picks */}
      {timelinePicks.length > 0 ? (
        <Section>
          <SectionHeader
            eyebrow="Made for your lead time"
            title="In hand for your timeline"
            description="Ordered so the ready-to-ship pieces lead when your date is close, and couture leads when there is time to commission."
          />
          <ul className="rail mt-8 gap-5 pb-1">
            {timelinePicks.map((product) => (
              <li key={product.id} className="w-56 shrink-0">
                <ProductCard product={product} sizes="(min-width: 1024px) 14vw, 45vw" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Budget picks */}
      {budgetPicks.length > 0 ? (
        <Section>
          <SectionHeader
            eyebrow="Within your band"
            title="Comfortably within your budget"
            description="Steered by the band you shared. Enquiry-only couture still appears here — every price band in the collection stays reachable."
          />
          <ul className="rail mt-8 gap-5 pb-1">
            {budgetPicks.map((product) => (
              <li key={product.id} className="w-56 shrink-0">
                <ProductCard product={product} sizes="(min-width: 1024px) 14vw, 45vw" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}