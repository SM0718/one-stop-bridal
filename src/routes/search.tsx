import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SearchNormal1 } from 'iconsax-react';
import { useSearch, useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { routes } from '@/config/routes';
import { formatCount } from '@/lib/format';
import { PageHeader } from '@/components/ui/breadcrumb';
import { MediaImage } from '@/components/ui/media';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { getFaith } from '@/data/faiths';

/**
 * Full search page. State lives in the URL so results are shareable, and the
 * ranking is aware of the couple's wedding context.
 */
export function SearchPage() {
  const filters = useUrlFilters();
  const urlTerm = filters.get('q') ?? '';
  const [term, setTerm] = useState(urlTerm);
  const context = useWeddingContext();

  useEffect(() => {
    setTerm(urlTerm);
  }, [urlTerm]);

  const { data, isFetching, isError, refetch } = useSearch(term);
  const hasQuery = term.trim().length >= 2;

  useDocumentMeta({
    title: hasQuery ? `Search: ${term}` : 'Search',
    description:
      'Search pieces, collections and guides across every tradition.',
    canonicalPath: routes.search,
    noIndex: true,
  });

  return (
    <div className="container pt-10 lg:pt-14">
      <PageHeader
        eyebrow="Search"
        title="Search everything"
        standfirst={`Pieces, collections and guides. Results are ranked for your ${context.label} context.`}
        breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Search' }]}
      />

      <form
        className="mt-8 flex flex-wrap items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          filters.set('q', term.trim() || undefined);
        }}
        role="search"
      >
        <label htmlFor="search-input" className="sr-only">
          Search
        </label>
        <div className="relative flex-1 sm:max-w-xl">
          <SearchNormal1
            size={18}
            variant="Linear"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            id="search-input"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Bridal lehenga, bridal saree, wedding gown…"
            className="h-12 w-full border border-input bg-pearl pl-11 pr-4 text-[0.9375rem] text-ink transition-colors placeholder:text-ink-muted/70 focus:border-ink focus:outline-none"
          />
        </div>
        <Button type="submit" size="lg">
          Search
        </Button>
      </form>

      <div className="py-12">
        {isError ? (
          <EmptyState
            title="Search failed"
            description="Something went wrong running that search. This is usually temporary."
            action={<Button onClick={() => void refetch()}>Try again</Button>}
          />
        ) : !hasQuery ? (
          <EmptyState
            title="What are you looking for?"
            description="Searching by silhouette, fabric or piece often works better than a puzzle term — try “lehenga”, “saree” or “gown”."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {['Bridal lehenga', 'Bridal saree', 'Modest bridalwear', 'Wedding gown', 'Made to measure'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setTerm(suggestion);
                        filters.set('q', suggestion);
                      }}
                      className="border border-border px-3.5 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            }
          />
        ) : isFetching && !data ? (
          <p className="text-sm text-ink-muted">Searching…</p>
        ) : data && data.total === 0 ? (
          <EmptyState
            title={`Nothing matched “${term}”`}
            description="Try a shorter phrase. Search covers pieces, collections and guides."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to={routes.collections}>Browse collections</Link>
                </Button>
                {/* The vendor directory has been commented out for this bridal-only build. */}
                {/* <Button asChild variant="outline">
                  <Link to={routes.vendors}>Browse vendors</Link>
                </Button> */}
              </div>
            }
          />
        ) : data ? (
          <div className="space-y-14">
            <p className="text-sm text-ink-soft" role="status">
              {formatCount(data.total, 'result')} for “{data.query}”
              {isFetching ? <span className="text-ink-muted"> · updating</span> : null}
            </p>

            {data.groups.map((group) => (
              <section key={group.kind} aria-labelledby={`group-${group.kind}`}>
                <h2 id={`group-${group.kind}`} className="eyebrow mb-5 border-b border-border pb-3">
                  {group.label}
                </h2>
                <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {group.results.map((result) => (
                    <li key={result.id}>
                      <Link to={result.href} className="group block">
                        {result.mediaKey ? (
                          <MediaImage
                            mediaKey={result.mediaKey}
                            alt=""
                            aspect="square"
                            sizes="(min-width: 1024px) 23vw, 45vw"
                            imgClassName="transition-transform duration-[900ms] ease-editorial motion-safe:can-hover:group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="aspect-square bg-champagne-soft" aria-hidden="true" />
                        )}
                        <h3 className="mt-3 font-display text-lg leading-snug text-ink">{result.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">{result.subtitle}</p>
                        {context.primary && result.faiths.includes(context.primary.id) ? (
                          <Badge variant="gold" className="mt-2.5">
                            {getFaith(context.primary.id).shortName}
                          </Badge>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
