import { useCallback, useMemo } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';

/**
 * Filter state lives in the URL, not in a store.
 *
 * That means a filtered catalogue can be shared, bookmarked, and survives a
 * refresh — and it keeps the back button working the way people expect.
 */
export interface UrlFilters {
  /** All active values for a multi-select key */
  getList: (key: string) => string[];
  /** Single value (sort, page) */
  get: (key: string) => string | undefined;
  getNumber: (key: string) => number | undefined;
  isActive: (key: string, value: string) => boolean;
  toggle: (key: string, value: string) => void;
  set: (key: string, value: string | undefined) => void;
  setMany: (patch: Record<string, string | string[] | undefined>) => void;
  /** Number of active filters, excluding sort and pagination */
  activeCount: number;
  clearAll: () => void;
  isEmpty: boolean;
}

const RESERVED = new Set(['sort', 'page', 'q', 'view']);

export function useUrlFilters(): UrlFilters {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(searchStr ?? ''), [searchStr]);

  const commit = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      /* Any filter change resets pagination — continuing on page 4 of a
         narrower result set is confusing. */
      if (!next.get('page')) next.delete('page');
      const query = next.toString();
      void navigate({ href: query ? `${pathname}?${query}` : pathname, replace: true });
    },
    [navigate, params, pathname],
  );

  const getList = useCallback(
    (key: string) => params.get(key)?.split(',').filter(Boolean) ?? [],
    [params],
  );

  const get = useCallback((key: string) => params.get(key) ?? undefined, [params]);

  const getNumber = useCallback(
    (key: string) => {
      const raw = params.get(key);
      if (!raw) return undefined;
      const value = Number(raw);
      return Number.isFinite(value) ? value : undefined;
    },
    [params],
  );

  const isActive = useCallback(
    (key: string, value: string) => getList(key).includes(value),
    [getList],
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      commit((next) => {
        const current = next.get(key)?.split(',').filter(Boolean) ?? [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        if (updated.length) next.set(key, updated.join(','));
        else next.delete(key);
      });
    },
    [commit],
  );

  const set = useCallback(
    (key: string, value: string | undefined) => {
      commit((next) => {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, value);
      });
    },
    [commit],
  );

  const setMany = useCallback(
    (patch: Record<string, string | string[] | undefined>) => {
      commit((next) => {
        for (const [key, value] of Object.entries(patch)) {
          if (value === undefined || (Array.isArray(value) && value.length === 0)) next.delete(key);
          else next.set(key, Array.isArray(value) ? value.join(',') : value);
        }
      });
    },
    [commit],
  );

  const activeCount = useMemo(() => {
    let count = 0;
    for (const [key, value] of params.entries()) {
      if (RESERVED.has(key) || !value) continue;
      count += key === 'min' || key === 'max' ? 1 : value.split(',').filter(Boolean).length;
    }
    /* min and max together count as one price filter */
    if (params.get('min') && params.get('max')) count -= 1;
    return count;
  }, [params]);

  const clearAll = useCallback(() => {
    void navigate({ href: pathname });
  }, [navigate, pathname]);

  return {
    getList,
    get,
    getNumber,
    isActive,
    toggle,
    set,
    setMany,
    activeCount,
    clearAll,
    isEmpty: params.toString().length === 0,
  };
}
