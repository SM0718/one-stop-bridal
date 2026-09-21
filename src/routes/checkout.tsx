import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { TickCircle } from 'iconsax-react';
import { type z } from 'zod';
import { checkoutSchema } from '@/lib/validations';
import { routes } from '@/config/routes';
import { selectCartCount, selectCartTotal, useCartStore } from '@/stores/cart';
import { useProductsByIds } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatPrice } from '@/lib/format';
import { CURRENCIES } from '@/data/planning';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/ui/empty-state';
import { MediaImage } from '@/components/ui/media';

type CheckoutValues = z.input<typeof checkoutSchema>;

const SHIPPING_OPTIONS = [
  { value: 'standard', label: 'Standard delivery — 5 to 7 working days', price: 0 },
  { value: 'express', label: 'Express delivery — 2 working days', price: 1800 },
  { value: 'collection', label: 'Collect from the retailer', price: 0 },
] as const;

export function CheckoutPage() {
  useDocumentMeta({
    title: 'Checkout',
    description: 'Provide delivery details and confirm your order.',
    canonicalPath: routes.checkout,
    noIndex: true,
  });

  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const count = useCartStore(selectCartCount);
  const { total, hasEnquiryOnly } = useCartStore(selectCartTotal);
  const { data: products } = useProductsByIds([...new Set(lines.map((l) => l.productId))]);
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingMethod: 'standard' },
  });

  const shippingMethod = watch('shippingMethod');
  const shippingCost = SHIPPING_OPTIONS.find((o) => o.value === shippingMethod)?.price ?? 0;

  if (lines.length === 0 && !placed) {
    return (
      <div className="container py-14">
        <EmptyState
          title="Nothing to check out"
          description="Your bag is empty. Add a piece you want to order, or send an enquiry for a made-to-measure commission."
          action={
            <Button asChild>
              <Link to={routes.collections}>Browse collections</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container py-16 lg:py-24">
        <div className="max-w-2xl">
          <TickCircle size={40} variant="Linear" className="text-gold-deep" aria-hidden="true" />
          <h1 className="mt-6 text-display-sm text-ink">Order recorded</h1>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
            In a live build you would now receive an email confirmation, and the retailer would confirm production
            timelines and take payment directly. Nothing has been charged and no order has been sent, because this is a
            demonstration build.
          </p>

          <div className="mt-8 border border-border p-5">
            <p className="eyebrow mb-3">What would happen next</p>
            <ol className="space-y-3 text-sm text-ink-soft">
              <li>1. The retailer confirms availability and, for made-to-measure pieces, books a fitting.</li>
              <li>2. You approve the final measurements and the quote in writing.</li>
              <li>3. Payment is taken by the retailer, not by us.</li>
              <li>4. Delivery or collection is arranged against the confirmed timeline.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to={routes.collections}>Keep browsing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={routes.planning}>Open your wedding plan</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-10 lg:pt-14">
      <PageHeader
        eyebrow="Checkout"
        title="Delivery details"
        standfirst="We ask for what a retailer needs to fulfil an order and nothing more. Payment is arranged with the retailer directly."
        breadcrumbs={[
          { label: 'Home', href: routes.home },
          { label: 'Bag', href: routes.cart },
          { label: 'Checkout' },
        ]}
      />

      <form
        className="grid gap-12 py-12 lg:grid-cols-[1fr_22rem] lg:gap-16"
        onSubmit={handleSubmit(async () => {
          await new Promise((r) => setTimeout(r, 400));
          clear();
          setPlaced(true);
          toast.success('Order recorded', { description: 'Demonstration only — nothing was sent or charged.' });
          void navigate({ href: routes.checkout });
        })}
        noValidate
      >
        <div className="space-y-12">
          <fieldset className="space-y-5">
            <legend className="font-display text-xl text-ink">Who is this for</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" htmlFor="co-first" required error={errors.firstName?.message}>
                <Input id="co-first" {...register('firstName')} autoComplete="given-name" />
              </Field>
              <Field label="Last name" htmlFor="co-last" required error={errors.lastName?.message}>
                <Input id="co-last" {...register('lastName')} autoComplete="family-name" />
              </Field>
              <Field label="Email" htmlFor="co-email" required error={errors.email?.message}>
                <Input id="co-email" type="email" {...register('email')} autoComplete="email" />
              </Field>
              <Field label="Phone" htmlFor="co-phone" required error={errors.phone?.message}>
                <Input id="co-phone" {...register('phone')} autoComplete="tel" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-5 border-t border-border pt-10">
            <legend className="font-display text-xl text-ink">Delivery address</legend>
            <Field label="Address" htmlFor="co-address1" required error={errors.addressLine1?.message}>
              <Input id="co-address1" {...register('addressLine1')} autoComplete="address-line1" />
            </Field>
            <Field label="Address line 2" htmlFor="co-address2" hint="Optional.">
              <Input id="co-address2" {...register('addressLine2')} autoComplete="address-line2" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="City" htmlFor="co-city" required error={errors.city?.message}>
                <Input id="co-city" {...register('city')} autoComplete="address-level2" />
              </Field>
              <Field label="Postcode" htmlFor="co-postcode" required error={errors.postcode?.message}>
                <Input id="co-postcode" {...register('postcode')} autoComplete="postal-code" />
              </Field>
              <Field label="Country" htmlFor="co-country" required error={errors.country?.message}>
                <Input id="co-country" {...register('country')} autoComplete="country-name" />
              </Field>
            </div>

            <Field label="Delivery notes" htmlFor="co-notes" hint="Anything the courier needs to know.">
              <Textarea id="co-notes" rows={2} {...register('deliveryNotes')} />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 border-t border-border pt-10">
            <legend className="font-display text-xl text-ink">Delivery method</legend>
            <Controller
              control={control}
              name="shippingMethod"
              render={({ field }) => (
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center justify-between gap-4 border border-border p-4 transition-colors hover:border-ink"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.value}
                          checked={field.value === option.value}
                          onChange={() => field.onChange(option.value)}
                          className="h-4 w-4 accent-[hsl(var(--ink))]"
                        />
                        <span className="text-sm text-ink">{option.label}</span>
                      </span>
                      <span className="text-sm text-ink-soft">
                        {option.price === 0 ? 'Included' : formatPrice(option.price)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
          </fieldset>

          <div className="border-t border-border pt-8">
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field }) => (
                <div>
                  <Checkbox
                    id="co-terms"
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                    label={
                      <>
                        I accept the{' '}
                        <Link to={routes.terms} className="underline decoration-gold/50 underline-offset-2">
                          terms
                        </Link>
                        ,{' '}
                        <Link to={routes.shipping} className="underline decoration-gold/50 underline-offset-2">
                          shipping
                        </Link>{' '}
                        and{' '}
                        <Link to={routes.returns} className="underline decoration-gold/50 underline-offset-2">
                          returns
                        </Link>{' '}
                        policies, and understand that made-to-measure pieces cannot be returned.
                      </>
                    }
                  />
                  {errors.acceptTerms ? (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">
                      {errors.acceptTerms.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>
        </div>

        <aside aria-labelledby="order-summary" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="order-summary" className="eyebrow mb-5">
            Order summary
          </h2>
          <div className="border border-border p-5">
            <ul className="space-y-4">
              {(products ?? []).map((product) => {
                const line = lines.find((l) => l.productId === product.id);
                if (!line) return null;
                return (
                  <li key={line.id} className="flex gap-3">
                    <MediaImage
                      mediaKey={product.images[0]?.mediaKey}
                      alt=""
                      aspect="square"
                      sizes="56px"
                      className="w-14 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{product.name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {line.quantity} ×{' '}
                        {line.price === null ? 'on enquiry' : formatPrice(line.price, product.currency)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Separator className="my-5" />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Items</dt>
                <dd className="text-ink">{count}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="text-ink">{formatPrice(total, CURRENCIES[0].code)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="text-ink">{shippingCost === 0 ? 'Included' : formatPrice(shippingCost)}</dd>
              </div>
            </dl>

            <Separator className="my-5" />

            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="font-display text-2xl text-ink">{formatPrice(total + shippingCost)}</span>
            </div>

            {hasEnquiryOnly ? (
              <p className="mt-4 border border-dashed border-border bg-muted/40 p-3 text-xs leading-relaxed text-ink-muted">
                Enquiry-only pieces are excluded from this total. The retailer will quote separately.
              </p>
            ) : null}

            <Button type="submit" size="lg" full className="mt-6" disabled={isSubmitting}>
              {isSubmitting ? 'Recording…' : 'Place order'}
            </Button>

            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              No payment is taken. This build records your order details locally so the flow can be reviewed end to end.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
