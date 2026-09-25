import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Buttons are rectangular with a hairline border rather than pill-shaped, to
 * keep the editorial register. The primary action carries the bridal rose,
 * and the gold accent is reserved for secondary emphasis.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-colors duration-200 ease-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-rose text-ivory hover:bg-rose-deep',
        outline: 'border border-border bg-transparent text-ink hover:border-rose/60 hover:bg-rose-soft/50 hover:text-rose-deep',
        subtle: 'bg-muted text-ink hover:bg-champagne-soft',
        accent: 'bg-gold text-ivory hover:bg-gold-deep',
        ghost: 'text-ink hover:bg-muted',
        link: 'text-ink underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
      },
      size: {
        sm: 'h-9 px-3.5 text-[0.8125rem]',
        default: 'h-11 px-5',
        lg: 'h-12 px-7 text-[0.9375rem]',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
      },
      full: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, full, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
