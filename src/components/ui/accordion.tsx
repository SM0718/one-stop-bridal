import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';
import { Add } from 'iconsax-react';
import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b border-border', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  /**
   * Heading level for the trigger. The trigger is a section heading for the
   * panel it opens, so it has to match where the accordion sits in the page
   * outline — otherwise the outline skips a level and screen readers lose the
   * structure.
   */
  headingLevel?: 2 | 3 | 4;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, headingLevel = 3, ...props }, ref) => {
  const Heading = `h${headingLevel}` as const;

  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            'group flex flex-1 items-center justify-between gap-4 py-4 text-left text-[0.9375rem] font-medium text-ink transition-colors hover:text-gold-deep',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className,
          )}
          {...props}
        >
          {children}
          <Add
            size={18}
            variant="Linear"
            className="shrink-0 text-ink-muted transition-transform duration-300 ease-editorial group-data-[state=open]:rotate-45"
          />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-5 pr-8 text-sm leading-relaxed text-ink-soft', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
