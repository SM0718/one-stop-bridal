import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'iconsax-react';
import { cn } from '@/lib/utils';
import { ShinyText, SplitText } from '@/components/reactbits';

/**
 * Vertical rhythm and headings for content sections.
 *
 * Sections deliberately do *not* share one card layout. They set spacing and
 * hierarchy only, so pages can vary composition between an editorial split, a
 * product grid and a full-bleed image.
 */
export function Section({
  children,
  className,
  as: Tag = 'section',
  bleed = false,
  tone = 'default',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
  bleed?: boolean;
  tone?: 'default' | 'deep' | 'muted';
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'py-14 lg:py-20',
        tone === 'deep' && 'bg-champagne-soft/60',
        tone === 'muted' && 'bg-muted/40',
        className,
      )}
    >
      {bleed ? children : <div className="container">{children}</div>}
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
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
          tag="h2"
          splitType="words"
          textAlign={align === 'center' ? 'center' : 'left'}
          threshold={0.2}
          delay={40}
          duration={1.1}
          from={{ opacity: 0, y: 34 }}
          className="text-display-sm text-ink"
        />
        {description ? (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          to={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-[0.8125rem] font-medium text-ink"
        >
          {action.label}
          <ArrowRight
            size={15}
            variant="Linear"
            className="transition-transform duration-300 ease-editorial group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
}

/** Horizontal, snap-scrolling rail used for categories and small product sets. */
export function Rail({ children, className, label }: { children: React.ReactNode; className?: string; label: string }) {
  return (
    <div
      className={cn('rail -mx-5 gap-4 px-5 sm:mx-0 sm:px-0', className)}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

/** Two-column editorial block: image on one side, copy on the other. */
export function EditorialSplit({
  media,
  eyebrow,
  title,
  body,
  action,
  reverse = false,
  className,
}: {
  media: React.ReactNode;
  eyebrow?: string;
  title: string;
  body: string;
  action?: { label: string; href: string };
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('grid items-center gap-8 lg:grid-cols-2 lg:gap-16', className)}>
      <div className={cn(reverse && 'lg:order-2')}>{media}</div>
      <div className={cn('max-w-xl', reverse && 'lg:order-1')}>
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
          tag="h2"
          splitType="words"
          textAlign="left"
          threshold={0.2}
          delay={40}
          duration={1.1}
          from={{ opacity: 0, y: 34 }}
          className="text-display-sm text-ink"
        />
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{body}</p>
        {action ? (
          <Link
            to={action.href}
            className="group mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink"
          >
            {action.label}
            <ArrowRight
              size={15}
              variant="Linear"
              className="transition-transform duration-300 ease-editorial group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Full-bleed editorial image with an overlaid line of type. */
export function FullBleedFigure({
  media,
  caption,
  className,
}: {
  media: React.ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn('relative', className)}>
      {media}
      {caption ? (
        <figcaption className="container mt-3 text-xs text-ink-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
