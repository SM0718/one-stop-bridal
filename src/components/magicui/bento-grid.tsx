import { Link } from '@tanstack/react-router';
import { ArrowRight, type Icon } from 'iconsax-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: Icon;
  description: string;
  href: string;
  cta: string;
}

/**
 * A row of cards of varying span, the central one highlighting on hover.
 * From Magic UI's bento-grid (v3 registry), re-themed for the brand
 * (border, background, serif type, iconsax icons, project Button + Link).
 */
export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 md:grid-cols-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) {
  return (
    <div
      key={name}
      className={cn(
        'group relative col-span-1 flex flex-col justify-between overflow-hidden',
        'border border-border bg-background',
        'transition-colors duration-300 hover:border-ink/30',
        className,
      )}
      {...props}
    >
      {background ? <div className="absolute inset-0">{background}</div> : null}
      <div className="pointer-events-none relative z-10 flex flex-col gap-1 p-6 pb-12 transition-transform duration-300 ease-out group-hover:-translate-y-2">
        <Icon size={30} variant="Linear" className="text-gold" aria-hidden="true" />
        <h3 className="mt-3 font-display text-2xl text-ink">{name}</h3>
        <p className="max-w-md text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-6 z-20 flex translate-y-3 flex-row items-center opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="pointer-events-auto px-0 text-gold-deep hover:bg-transparent"
        >
          <Link to={href}>
            {cta}
            <ArrowRight size={14} variant="Linear" aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 transition-colors duration-300 group-hover:bg-muted/40" />
    </div>
  );
}