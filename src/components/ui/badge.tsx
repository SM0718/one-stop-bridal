import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badges are used sparingly and only where they carry real information:
 * availability, verification, or a status the couple needs to understand.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 border px-2 py-0.5 text-2xs font-medium uppercase tracking-wider2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-ink text-ivory',
        outline: 'border-border bg-transparent text-ink-muted',
        muted: 'border-transparent bg-muted text-ink-soft',
        gold: 'border-transparent bg-marigold-soft text-marigold-deep',
        positive: 'border-transparent bg-blush/70 text-rose-deep',
        warning: 'border-marigold/40 bg-transparent text-marigold-deep',
        danger: 'border-destructive/40 bg-transparent text-destructive',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
