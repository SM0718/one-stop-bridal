/**
 * Mock API client.
 *
 * Every service in this folder is written as if it were talking to a real
 * backend: asynchronous, paginated, and returning plain data. Swapping in
 * Supabase, Appwrite or a REST API means replacing the bodies of these
 * functions — no component changes.
 */

/** Simulated network latency so loading states behave realistically. */
const MIN_LATENCY = 90;
const MAX_LATENCY = 260;

export function delay<T>(value: T): Promise<T> {
  const ms = MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 500, code = 'internal_error') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/** Thrown by `assertFound` so routes can render a proper not-found state. */
export class NotFoundError extends ApiError {
  constructor(what: string) {
    super(`${what} not found`, 404, 'not_found');
    this.name = 'NotFoundError';
  }
}

export function assertFound<T>(value: T | null | undefined, what: string): T {
  if (value === undefined || value === null) throw new NotFoundError(what);
  return value;
}

export function paginate<T>(items: T[], page = 1, pageSize = 12) {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    total: items.length,
    page: safePage,
    pageSize,
    hasMore: start + slice.length < items.length,
  };
}

/** Counts occurrences and returns the facet buckets in descending order. */
export function facetCounts(values: string[]): { value: string; label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

/* ==========================================================================
   Local persistence for demo writes
   ========================================================================== */

const STORAGE_PREFIX = 'osb:demo:';

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage can be full or blocked; the demo still works in memory */
  }
}
