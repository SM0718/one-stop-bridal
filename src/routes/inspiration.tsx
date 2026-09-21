import { Link, useParams } from '@tanstack/react-router';
import { useArticles, useArticle, useCollections, useInspirationCategories, useRelatedArticlesFor, useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta, schema } from '@/hooks/useDocumentMeta';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { INSPIRATION_CATEGORIES } from '@/data/inspiration';
import type { InspirationCategoryId } from '@/types';
import { routes } from '@/config/routes';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/ui/breadcrumb';
import { MediaImage, MediaZoom } from '@/components/ui/media';
import { Section, SectionHeader, EditorialSplit } from '@/components/editorial/Section';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { SavedArticleStrip } from '@/components/editorial/SavedArticleStrip';
import { cn } from '@/lib/utils';
import { RouteNotFound } from './status';

/* ==========================================================================
   Index
   ========================================================================== */

export function InspirationIndexPage() {
  const filters = useUrlFilters();
  const activeCategory = (filters.get('category') as InspirationCategoryId | undefined) ?? undefined;
  const context = useWeddingContext();

  const { data: articles, isLoading } = useArticles({ category: activeCategory, faith: context.primary.id });
  const { data: categories } = useInspirationCategories();
  const { data: collections } = useCollections();

  useDocumentMeta({
    title: activeCategory
      ? `${INSPIRATION_CATEGORIES.find((c) => c.id === activeCategory)?.name ?? 'Inspiration'}`
      : 'Inspiration',
    description:
      'Bridal looks, ceremony explainers, cultural guides and real weddings, written across traditions.',
    canonicalPath: routes.inspiration,
  });

  const [lead, ...rest] = articles ?? [];

  return (
    <>
      <div className="container pt-10 lg:pt-14">
        <PageHeader
          eyebrow="Inspiration"
          title="Reading for the wedding you are actually planning"
          standfirst="Explainers for guests who have not attended a ceremony before, practical planning guides, and the detail behind real weddings."
          breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Inspiration' }]}
        />

        <nav aria-label="Categories" className="mt-6">
          <ul className="rail gap-2 pb-1">
            <li className="shrink-0">
              <Link
                to={routes.inspiration}
                className={cn(
                  'block whitespace-nowrap border px-3.5 py-2 text-[0.8125rem] transition-colors',
                  !activeCategory ? 'border-ink bg-ink text-ivory' : 'border-border text-ink-soft hover:border-ink hover:text-ink',
                )}
              >
                Everything
              </Link>
            </li>
            {(categories ?? INSPIRATION_CATEGORIES).map((category) => (
              <li key={category.id} className="shrink-0">
                <Link
                  to={routes.inspiration}
                  search={{ category: category.id }}
                  className={cn(
                    'block whitespace-nowrap border px-3.5 py-2 text-[0.8125rem] transition-colors',
                    activeCategory === category.id
                      ? 'border-ink bg-ink text-ivory'
                      : 'border-border text-ink-soft hover:border-ink hover:text-ink',
                  )}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isLoading ? (
        <div className="container py-14" aria-hidden="true">
          <div className="aspect-banner bg-muted" />
        </div>
      ) : !lead ? (
        <div className="container py-14">
          <EmptyState
            title="Nothing published here yet"
            description="We have not written anything for this category in your wedding context. Try another category, or browse the collections."
            action={
              <Button asChild variant="outline">
                <Link to={routes.collections}>Browse collections</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {/* Lead article, given the space it deserves */}
          <Section className="pt-10">
            <article>
              <Link to={routes.inspirationArticle(lead.slug)} className="group block">
                <MediaZoom>
                  <MediaImage
                    mediaKey={lead.heroMediaKey}
                    aspect="banner"
                    priority
                    sizes="100vw"
                    width={1920}
                    height={820}
                  />
                </MediaZoom>
                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <p className="eyebrow">
                      {INSPIRATION_CATEGORIES.find((c) => c.id === lead.categoryId)?.name} · {lead.readingMinutes} min
                      read
                    </p>
                    <h2 className="mt-3 text-display-sm text-ink lg:text-display-md">{lead.title}</h2>
                  </div>
                  <div className="lg:col-span-5 lg:pt-8">
                    <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{lead.standfirst}</p>
                    <p className="mt-4 text-xs text-ink-muted">
                      {lead.author} · {lead.authorRole} · {formatDate(lead.publishedAt, 'long')}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          </Section>

          {rest.length > 0 ? (
            <Section tone="deep">
              <SectionHeader eyebrow="More reading" title="Also worth your time" />
              <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <li key={article.id}>
                    <Link to={routes.inspirationArticle(article.slug)} className="group block">
                      <MediaImage
                        mediaKey={article.heroMediaKey}
                        aspect="portrait"
                        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                        imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
                      />
                      <p className="eyebrow mt-4">
                        {INSPIRATION_CATEGORIES.find((c) => c.id === article.categoryId)?.name} · {article.readingMinutes}{' '}
                        min
                      </p>
                      <h3 className="mt-2 font-display text-xl leading-snug text-ink">{article.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{article.standfirst}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </>
      )}

      <SavedArticleStrip />

      {collections && collections.length > 0 ? (
        <Section>
          <EditorialSplit
            media={<MediaImage mediaKey="editorial-overlook" aspect="editorial" sizes="(min-width: 1024px) 45vw, 100vw" />}
            eyebrow="From reading to choosing"
            title="Collections built around the same thinking"
            body="Every guide here connects to the pieces and businesses that make it real. Start with a collection and filter it to your ceremonies."
            action={{ label: 'Browse collections', href: routes.collections }}
          />
        </Section>
      ) : null}
    </>
  );
}

/* ==========================================================================
   Article
   ========================================================================== */

export function InspirationDetailPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const slug = params.slug ?? '';
  const { data: article, isLoading, isError } = useArticle(slug);
  const { data: related } = useRelatedArticlesFor(article);

  useDocumentMeta({
    title: article?.title ?? 'Article',
    description: article?.standfirst ?? '',
    canonicalPath: routes.inspirationArticle(slug),
    type: 'article',
    jsonLd: article
      ? schema.article({
          title: article.title,
          description: article.standfirst,
          author: article.author,
          published: article.publishedAt,
        })
      : null,
  });

  if (isError) return <RouteNotFound />;

  if (isLoading || !article) {
    return (
      <div className="container py-14" aria-hidden="true">
        <div className="h-10 w-2/3 bg-muted" />
        <div className="mt-6 aspect-banner bg-muted" />
      </div>
    );
  }

  return (
    <>
      <article>
        <div className="container pt-10 lg:pt-14">
          <PageHeader
            breadcrumbs={[
              { label: 'Home', href: routes.home },
              { label: 'Inspiration', href: routes.inspiration },
              { label: article.title },
            ]}
            eyebrow={INSPIRATION_CATEGORIES.find((c) => c.id === article.categoryId)?.name}
            title={article.title}
            standfirst={article.standfirst}
          />
          <p className="mt-5 text-xs text-ink-muted">
            {article.author} · {article.authorRole} · {formatDate(article.publishedAt, 'long')} ·{' '}
            {article.readingMinutes} min read
          </p>
        </div>

        <div className="container mt-8">
          <MediaImage
            mediaKey={article.heroMediaKey}
            aspect="wide"
            priority
            sizes="100vw"
            width={1600}
            height={900}
          />
        </div>

        <div className="container py-12 lg:py-16">
          <div className="prose-editorial max-w-editorial">
            {article.sections.map((section, index) => (
              <section key={section.heading ?? `section-${index}`}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <p className="mt-12 max-w-editorial border-t border-border pt-6 text-xs leading-relaxed text-ink-muted">
            This article is editorial. It describes common practice, not a requirement, and nothing here should be read as
            guidance on how any individual or family should conduct their wedding.
          </p>
        </div>
      </article>

      {related && related.length > 0 ? (
        <Section tone="deep">
          <SectionHeader eyebrow="Keep reading" title="Related" />
          <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link to={routes.inspirationArticle(item.slug)} className="group block">
                  <MediaImage
                    mediaKey={item.heroMediaKey}
                    aspect="wide"
                    sizes="(min-width: 640px) 32vw, 100vw"
                    imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
                  />
                  <h3 className="mt-3 font-display text-lg text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{item.standfirst}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
