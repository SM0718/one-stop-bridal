import { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SearchNormal1 } from 'iconsax-react';
import { useSearch, useSearchSuggestions } from '@/hooks/queries';
import { useUIStore } from '@/stores/ui';
import { useWeddingStore } from '@/stores/wedding';
import { MediaImage } from '@/components/ui/media';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/** Debounces a value so typing does not fire a request on every keystroke. */
function useDebounced<T>(value: T, delay = 220): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * Global search. Results are ranked against the couple's wedding context, so
 * the same query returns different leads depending on the faith selected.
 */
export function SearchOverlay() {
  const open = useUIStore((s) => s.searchOpen);
  const close = useUIStore((s) => s.closeSearch);
  const seed = useUIStore((s) => s.searchSeed);
  const faithLabel = useWeddingStore((s) => s.profile.faith);

  const [term, setTerm] = useState(seed);
  useEffect(() => {
    if (open) setTerm(seed);
  }, [open, seed]);

  const debounced = useDebounced(term);
  const { data, isFetching } = useSearch(debounced);
  const { data: suggestions } = useSearchSuggestions();

  const total = data?.total ?? 0;

  const statusMessage = useMemo(() => {
    if (debounced.trim().length < 2) return '';
    if (isFetching) return 'Searching';
    if (total === 0) return 'No results';
    return `${total} ${total === 1 ? 'result' : 'results'}`;
  }, [debounced, isFetching, total]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="top-[8%] max-w-3xl translate-y-0" hideClose>
        <DialogTitle className="sr-only">Search</DialogTitle>

        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <SearchNormal1 size={20} variant="Linear" className="shrink-0 text-ink-muted" aria-hidden="true" />
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search collections, vendors, ceremonies or guides"
            aria-label="Search"
            className="h-8 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-muted/70"
          />
          <button
            type="button"
            onClick={close}
            className="shrink-0 text-2xs uppercase tracking-eyebrow text-ink-muted transition-colors hover:text-ink"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 py-5">
          {statusMessage ? (
            <p className="eyebrow mb-4" role="status">
              {statusMessage}
              {faithLabel ? ' · ranked for your wedding context' : ''}
            </p>
          ) : null}

          {debounced.trim().length < 2 ? (
            <div>
              <p className="eyebrow mb-4">Common searches</p>
              <ul className="flex flex-wrap gap-2">
                {(suggestions ?? []).map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => setTerm(s)}
                      className="border border-border px-3 py-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data && data.total === 0 && debounced.trim().length >= 2 ? (
            <div className="py-6">
              <p className="font-display text-xl text-ink">Nothing matched &ldquo;{debounced}&rdquo;</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                Try a shorter phrase, or browse the collections. Searching by ceremony name often works better than by
                product name.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/collections" onClick={close} className="text-sm font-medium text-ink link-quiet">
                  Browse collections
                </Link>
                <Link to="/vendors" onClick={close} className="text-sm font-medium text-ink link-quiet">
                  Browse vendors
                </Link>
              </div>
            </div>
          ) : null}

          <div className="space-y-7">
            {(data?.groups ?? []).map((group) => (
              <section key={group.kind}>
                <h2 className="eyebrow mb-3 border-b border-border pb-2">{group.label}</h2>
                <ul className="divide-y divide-border/70">
                  {group.results.map((result) => (
                    <li key={result.id}>
                      <Link
                        to={result.href}
                        onClick={close}
                        className="flex items-center gap-4 py-3 transition-colors hover:bg-muted/40"
                      >
                        {result.mediaKey ? (
                          <MediaImage
                            mediaKey={result.mediaKey}
                            aspect="square"
                            sizes="56px"
                            width={112}
                            height={112}
                            className={cn('w-14 shrink-0')}
                          />
                        ) : (
                          <span className="h-14 w-14 shrink-0 bg-muted" aria-hidden="true" />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-ink">{result.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-ink-muted">{result.subtitle}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
