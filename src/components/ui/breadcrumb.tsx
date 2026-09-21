import * as React from 'react';
import { ArrowRight2 } from 'iconsax-react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumbs are shown on every catalogue and detail page: they help people
 * who arrive from search understand where they have landed.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <>
                  <Link
                    to={item.href}
                    className="text-xs text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                  <ArrowRight2 size={12} variant="Linear" className="text-ink-muted/60" aria-hidden="true" />
                </>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-xs text-ink-soft">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  standfirst,
  breadcrumbs,
  actions,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  standfirst?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn('border-b border-border pb-8', className)}>
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-6" /> : null}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
          <h1 className="text-display-sm text-ink sm:text-display-md">{title}</h1>
          {standfirst ? (
            <p className="mt-4 max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">{standfirst}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}
