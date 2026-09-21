import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2.5', className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { label?: React.ReactNode; hint?: string }
>(({ className, label, hint, id, ...props }, ref) => {
  const control = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={id}
      className={cn(
        'h-5 w-5 shrink-0 rounded-full border border-input bg-pearl transition-colors',
        'data-[state=checked]:border-ink',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex h-full w-full items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-ink" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (!label) return control;

  return (
    <div className="flex items-start gap-2.5">
      {control}
      <div className="grid gap-0.5">
        <label htmlFor={id} className="cursor-pointer select-none text-sm leading-5 text-ink">
          {label}
        </label>
        {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      </div>
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
