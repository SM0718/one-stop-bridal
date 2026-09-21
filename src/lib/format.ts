import type { CurrencyCode } from '@/types';

const SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  GBP: '£',
  USD: '$',
  AED: 'AED ',
};

/**
 * Formats a price. Enquiry-only pieces (price === null) return a written
 * phrase rather than a number, because bridal retail often does not publish
 * prices and inventing one would be misleading.
 */
export function formatPrice(amount: number | null, currency: CurrencyCode = 'INR'): string {
  if (amount === null) return 'Price on enquiry';
  return `${SYMBOLS[currency]}${new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-GB', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export function formatPriceShort(amount: number | null, currency: CurrencyCode = 'INR'): string {
  if (amount === null) return 'On enquiry';
  return `${SYMBOLS[currency]}${new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-GB', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)}`;
}

export function currencySymbol(currency: CurrencyCode): string {
  return SYMBOLS[currency];
}

export function formatDate(iso: string | null, pattern: 'long' | 'short' | 'day' = 'long'): string {
  if (!iso) return 'Date not set';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Date not set';
  const options: Intl.DateTimeFormatOptions =
    pattern === 'long'
      ? { day: 'numeric', month: 'long', year: 'numeric' }
      : pattern === 'short'
        ? { day: 'numeric', month: 'short', year: 'numeric' }
        : { day: 'numeric', month: 'short' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

/** Whole days between now and a date. Negative once the date has passed. */
export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Suggests a date for an event given its typical offset from the wedding day. */
export function suggestEventDate(weddingDate: string | null, offsetDays: number): string | null {
  if (!weddingDate) return null;
  const wedding = new Date(weddingDate);
  if (Number.isNaN(wedding.getTime())) return null;
  /* Negative offsets sit after the wedding day (e.g. a reception). */
  return toISODate(addDays(wedding, -offsetDays));
}

export function pluralise(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function formatCount(count: number, singular: string, plural?: string): string {
  return `${new Intl.NumberFormat('en-GB').format(count)} ${pluralise(count, singular, plural)}`;
}

export function initialOf(value: string): string {
  return value.trim().charAt(0).toUpperCase();
}

export function titleCase(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? 'A month ago' : `${months} months ago`;
}

/** Percentage of a budget used, clamped for display. */
export function percentOf(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}
