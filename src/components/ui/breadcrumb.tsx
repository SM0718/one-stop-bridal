import * as React from 'react';
import { ArrowRight2 } from 'iconsax-react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { FadeContent, ShinyText, SplitText } from '@/components/reactbits';

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
          {eyebrow ? (
            <p className="eyebrow mb-3">
              <ShinyText
                text={eyebrow}
                speed={2}
                spread={260}
                color="hsl(var(--gold-deep))"
                shineColor="hsl(var(--champagne))"
                direction="left"
              />
            </p>
          ) : null}
          <SplitText
            text={title}
            tag="h1"
            splitType="words, chars"
            className="text-display-sm text-ink sm:text-display-md"
            textAlign="left"
            threshold={0.1}
            delay={20}
            duration={1.1}
            from={{ opacity: 0, y: 36 }}
          />
          {standfirst ? (
            <FadeContent blur duration={850} delay={0.15} className="mt-4 max-w-editorial">
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{standfirst}</p>
            </FadeContent>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}
