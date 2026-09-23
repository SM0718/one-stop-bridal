import { Link, useParams } from '@tanstack/react-router';
import { ArrowRight } from 'iconsax-react';
import { CATEGORY_GROUPS, PRODUCT_CATEGORIES, productCategoriesInGroup, getProductCategory } from '@/data/categories';
import { COLLECTIONS } from '@/data/inspiration';
import { getFaithBySlug } from '@/data/faiths';
import { routes } from '@/config/routes';
import { useCollections, useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/ui/breadcrumb';
import { MediaImage } from '@/components/ui/media';
import { Section, SectionHeader, EditorialSplit } from '@/components/editorial/Section';
import { BlurFade } from '@/components/magicui/blur-fade';
import { CatalogueResults } from '@/components/product/CatalogueResults';
import { BridalBlueprintGate } from '@/components/blueprint/BridalBlueprintGate';
import { BridalPersonalization } from '@/components/blueprint/BridalPersonalization';
// The 'plan your wedding' button was commented out for this bridal-only build.
// import { Button } from '@/components/ui/button';
import { RouteNotFound } from './status';

/* ==========================================================================
   Index
   ========================================================================== */

export function CollectionsIndexPage() {
  useDocumentMeta({
    title: 'Collections',
    description:
      'Browse bridal collections and curated edits, organised by the ceremonies your wedding actually includes.',
    canonicalPath: routes.collections,
  });

  const context = useWeddingContext();
  const { data: collections } = useCollections();

  const bridalGroups = CATEGORY_GROUPS.filter((g) => g.id === 'bridal');
  const bridalCategoryIds = new Set(productCategoriesInGroup('bridal').map((c) => c.id));
  const bridalEdits = (collections ?? COLLECTIONS).filter((c) =>
    c.categoryIds.some((id) => bridalCategoryIds.has(id)),
  );

  return (
    <>
      <div className="container pt-10 lg:pt-14">
        <PageHeader
          eyebrow="Collections"
          title="Browse bridal, organised by what it is"
          standfirst="Groups covering the pieces a wedding involves. Your selections narrow every list to what is relevant to your ceremonies and traditions."
          breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Collections' }]}
        />
      </div>

      {/* Category groups: uneven editorial grid rather than a row of equal cards */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-12">
          {bridalGroups.map((group, index) => {
            const categories = productCategoriesInGroup(group.id);
            const lead = categories[0];
            const wide = index % 3 === 0;

            return (
              <BlurFade
                key={group.id}
                delay={index * 0.12}
                inView
                className={wide ? 'lg:col-span-7' : 'lg:col-span-5'}
              >
                <article className="h-full">
                <Link to={routes.collection(group.slug)} className="group block">
                  <MediaImage
                    mediaKey={lead?.mediaKey ?? 'editorial-pillars'}
                    aspect={wide ? 'wide' : 'portrait'}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    priority={index < 2}
                    imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
                  />
                  <div className="mt-4 flex items-start justify-between gap-6">
                    <div>
                      <h2 className="font-display text-2xl text-ink sm:text-3xl">{group.name}</h2>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{group.description}</p>
                      <p className="mt-3 text-xs text-ink-muted">
                        {categories.map((c) => c.name).join(' · ')}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      variant="Linear"
                      className="mt-2 shrink-0 text-ink-muted transition-transform duration-300 ease-editorial group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
                </article>
              </BlurFade>
            );
          })}
        </div>
      </Section>

      {/* Editor's collections */}
      <Section tone="deep">
        <SectionHeader
          eyebrow="Edits"
          title="Collections we keep coming back to"
          description="Curated around a specific wedding, ceremony or constraint rather than a season."
        />
        <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {bridalEdits.map((collection, index) => (
            <li key={collection.id}>
              <BlurFade delay={index * 0.1} inView className="h-full">
                <Link to={routes.collection(collection.slug)} className="group block">
                <MediaImage
                  mediaKey={collection.mediaKey}
                  aspect="portrait"
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                  imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
                />
                <h3 className="mt-4 font-display text-xl text-ink">{collection.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{collection.description}</p>
                </Link>
              </BlurFade>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <EditorialSplit
          media={
            <MediaImage
              mediaKey={context.sections[0]?.mediaKey ?? 'editorial-arches'}
              aspect="editorial"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          }
          eyebrow={`Selected for a ${context.primary.shortName} wedding`}
          title="Everything narrows to your wedding"
          body={`Your collections currently lead with ${context.leadCategoryIds
            .slice(0, 3)
            .map((id) => getProductCategory(id)?.name.toLowerCase())
            .filter(Boolean)
            .join(', ')}. Change your wedding context from the header at any time and every list re-orders around it.`}
          action={{ label: 'Browse all bridal', href: routes.collectionsBridal }}
        />
      </Section>
    </>
  );
}

/* ==========================================================================
   Group or collection detail
   ========================================================================== */

/**
 * `/collections/$slug` serves two things: the six category groups and the
 * editor's collections. Groups are resolved first because they are the
 * structural navigation; anything else is looked up as a collection.
 */
export function CollectionGroupPage() {
  const params = useParams({ strict: false }) as { group?: string; slug?: string; faith?: string };
  const slug = params.group ?? params.slug ?? '';
  const context = useWeddingContext();

  const group = CATEGORY_GROUPS.find((g) => g.slug === slug);
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  const requestedFaith = getFaithBySlug(params.faith ?? '');

  const scopeCategoryIds = group
    ? productCategoriesInGroup(group.id).map((c) => c.id)
    : (collection?.categoryIds ?? []);

  useDocumentMeta({
    title: group?.name ?? collection?.name ?? 'Collection',
    description:
      group?.description ??
      collection?.description ??
      'Browse pieces selected for weddings across faiths and cultures.',
    canonicalPath: `/collections/${slug}`,
  });

  if (!group && !collection) {
    return <RouteNotFound />;
  }
  if (group && group.id !== 'bridal') {
    return <RouteNotFound />;
  }

  const title = group?.name ?? collection?.name ?? '';
  const description =
    group?.description ??
    `${collection?.description ?? ''} Relevant to ${collection?.faiths.length ?? 0} wedding traditions.`;

  return (
    <div className="container pt-8 lg:pt-12">
      <PageHeader
        eyebrow={group ? 'Collection group' : 'Edit'}
        title={title}
        standfirst={description}
        breadcrumbs={[
          { label: 'Home', href: routes.home },
          { label: 'Collections', href: routes.collections },
          { label: title },
        ]}
      />

      {/* The category rail below is bridal-only too; groups other than bridal
          are rejected above. The 'plan your wedding' button at the bottom of
          this page was commented out along with the planning feature. */}
      {group ? (
        <nav aria-label="Categories in this group" className="mt-6">
          <ul className="rail gap-2 pb-1">
            {productCategoriesInGroup(group.id).map((category) => (
              <li key={category.id} className="shrink-0">
                <Link
                  to={routes.collection(group.slug)}
                  search={{ category: category.id }}
                  className="block whitespace-nowrap border border-border px-3.5 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {!group && collection ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {collection.categoryIds.slice(0, 6).map((categoryId) => {
            const category = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
            if (!category) return null;
            return (
              <Link
                key={categoryId}
                to={routes.collection(collection.slug)}
                search={{ category: categoryId }}
                className="border border-border px-3.5 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      ) : null}

      {requestedFaith ? (
        <p className="mt-6 border-l border-gold pl-4 text-sm text-ink-soft">
          Showing pieces suited to {requestedFaith.name} weddings first — selected from the header.
        </p>
      ) : null}

      {/* Bridal-only personalisation: the Wedding Blueprint gate + the rails
          it drives appear solely on the bridal group page. */}
      {group?.id === 'bridal' ? <BridalBlueprintGate /> : null}

      {group?.id === 'bridal' ? <BridalPersonalization scopeCategoryIds={scopeCategoryIds} /> : null}

      <div className="mt-10 pb-section">
        <CatalogueResults
          scopeCategoryIds={scopeCategoryIds}
          context={context}
          emptyTitle="No pieces match these filters"
          emptyDescription="Try removing a filter, or widening the price range. Pieces priced on enquiry appear in every price band."
          columns={group?.id === 'bridal' ? 3 : 4}
        />
      </div>

      {/* The 'plan your wedding around these pieces' button was commented out
          for this bridal-only build. */}
    </div>
  );
}
