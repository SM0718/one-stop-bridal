import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { type z } from 'zod';
import { MessageText1, TickCircle } from 'iconsax-react';
import { profileSchema } from '@/lib/validations';
import { demoRetailerId, useRetailerEnquiries, useRetailerOrders, useRetailerProducts, useRetailerStats } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { RETAILERS } from '@/data/retailers';
import { formatCount, formatPrice, formatDate, relativeTime } from '@/lib/format';
import { getFaith } from '@/data/faiths';
import { routes } from '@/config/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';
import { MediaImage } from '@/components/ui/media';
import { cn } from '@/lib/utils';

/* ==========================================================================
   Enquiries
   ========================================================================== */

const CHANNEL_LABEL: Record<string, string> = {
  form: 'Enquiry form',
  whatsapp: 'WhatsApp',
  appointment: 'Appointment request',
};

export function RetailerEnquiriesPage() {
  useDocumentMeta({ title: 'Enquiries', canonicalPath: routes.retailersEnquiries });
  const { data: enquiries, isLoading } = useRetailerEnquiries();
  const [status, setStatus] = useState<'all' | 'new' | 'responded' | 'closed'>('all');

  const filtered = (enquiries ?? []).filter((e) => status === 'all' || e.status === status);

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h2 className="font-display text-2xl text-ink">Enquiries</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Every enquiry includes the piece, the customer’s city and — where they gave it — their wedding date, so you can
          answer with a realistic production timeline.
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {(['all', 'new', 'responded', 'closed'] as const).map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => setStatus(option)}
              aria-pressed={status === option}
              className={cn(
                'border px-3.5 py-2 text-[0.8125rem] capitalize transition-colors',
                status === option
                  ? 'border-ink bg-ink text-ivory'
                  : 'border-border text-ink-soft hover:border-ink hover:text-ink',
              )}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      {isLoading ? null : filtered.length === 0 ? (
        <EmptyState
          title="No enquiries here"
          description="When a couple contacts you about a piece, it will appear here with their details."
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filtered.map((enquiry) => (
            <li key={enquiry.id} className="py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-sm font-medium text-ink">{enquiry.customerName}</h3>
                    <Badge variant={enquiry.status === 'new' ? 'gold' : 'outline'}>{enquiry.status}</Badge>
                    <span className="text-xs text-ink-muted">{CHANNEL_LABEL[enquiry.channel]}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-muted">
                    {enquiry.productName} · {enquiry.city} · received {relativeTime(enquiry.receivedAt)}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{enquiry.message}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success('Reply drafted')}>
                    <MessageText1 size={15} variant="Linear" />
                    Reply
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ==========================================================================
   Orders
   ========================================================================== */

export function RetailerOrdersPage() {
  useDocumentMeta({ title: 'Orders', canonicalPath: routes.retailersOrders });
  const { data: orders, isLoading } = useRetailerOrders();

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h2 className="font-display text-2xl text-ink">Orders</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {isLoading ? 'Loading…' : `${formatCount(orders?.length ?? 0, 'order')} in this demonstration dataset.`}
        </p>
      </div>

      {!isLoading && (orders?.length ?? 0) === 0 ? (
        <EmptyState title="No orders yet" description="Confirmed orders will appear here with their production status." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <caption className="sr-only">Your orders</caption>
            <thead className="border-b border-border">
              <tr className="eyebrow">
                <th scope="col" className="py-3 pr-4 font-normal">
                  Reference
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Customer
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Items
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Total
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Status
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Placed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(orders ?? []).map((order) => (
                <tr key={order.id}>
                  <td className="py-4 pr-4 font-medium text-ink">{order.reference}</td>
                  <td className="py-4 pr-4 text-ink-soft">
                    {order.customerName}
                    <span className="mt-0.5 block text-xs text-ink-muted">{order.city}</span>
                  </td>
                  <td className="py-4 pr-4 text-ink-soft">
                    {order.items.map((item) => (
                      <span key={item.productName} className="block">
                        {item.productName}
                        {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                      </span>
                    ))}
                  </td>
                  <td className="py-4 pr-4 text-ink-soft">{formatPrice(order.total)}</td>
                  <td className="py-4 pr-4">
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'positive'
                          : order.status === 'cancelled'
                            ? 'danger'
                            : 'outline'
                      }
                    >
                      {order.status.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">{formatDate(order.placedAt, 'short')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Analytics
   ========================================================================== */

export function RetailerAnalyticsPage() {
  useDocumentMeta({ title: 'Analytics', canonicalPath: routes.retailersAnalytics });

  const retailerId = demoRetailerId();
  const { data: stats } = useRetailerStats(retailerId);
  const { data: products } = useRetailerProducts(retailerId);

  const views = stats?.views ?? { last30Days: 0, previous30Days: 0 };
  const change = views.previous30Days
    ? Math.round(((views.last30Days - views.previous30Days) / views.previous30Days) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h2 className="font-display text-2xl text-ink">Analytics</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          A small, honest set of numbers rather than a dashboard of charts.
        </p>
      </div>

      <div className="border border-dashed border-border bg-muted/40 p-4">
        <p className="text-xs leading-relaxed text-ink-muted">
          <strong className="text-ink-soft">Demonstration data.</strong> These figures are illustrative and are not
          derived from real traffic. A live build would report from your own analytics.
        </p>
      </div>

      <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        {[
          { label: 'Profile views, 30 days', value: views.last30Days.toLocaleString('en-GB'), note: `${change >= 0 ? '+' : ''}${change}% vs previous 30 days` },
          { label: 'Enquiries', value: String(stats?.enquiries ?? 0), note: `${stats?.newEnquiries ?? 0} awaiting reply` },
          { label: 'Products published', value: String(stats?.published ?? 0), note: 'Live on the site' },
        ].map((item) => (
          <div key={item.label} className="bg-background p-5">
            <dt className="eyebrow">{item.label}</dt>
            <dd className="mt-2">
              <span className="block font-display text-2xl text-ink">{item.value}</span>
              <p className="mt-1.5 text-xs text-ink-muted">{item.note}</p>
            </dd>
          </div>
        ))}
      </dl>

      <section>
        <h3 className="eyebrow mb-4">Enquiries by product</h3>
        <ul className="space-y-4">
          {(products ?? []).slice(0, 5).map((product, index) => {
            /* Illustrative weighting so the bars are not all identical */
            const share = Math.max(12, 100 - index * 18);
            return (
              <li key={product.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm text-ink">{product.name}</p>
                  <span className="text-xs text-ink-muted">{share}%</span>
                </div>
                <Progress value={share} className="mt-2" aria-label={`${product.name} enquiry share`} />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* ==========================================================================
   Profile
   ========================================================================== */

type ProfileValues = z.input<typeof profileSchema>;

export function RetailerProfilePage() {
  useDocumentMeta({ title: 'Business profile', canonicalPath: routes.retailersProfile });

  const retailerId = demoRetailerId();
  const retailer = RETAILERS.find((r) => r.id === retailerId) ?? RETAILERS[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Meera',
      lastName: 'Vasant',
      email: 'studio@meeravasant.example',
      phone: '+91 22 0000 0000',
      city: retailer.city,
      country: retailer.country,
      marketingOptIn: false,
    },
  });

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h2 className="font-display text-2xl text-ink">Business profile</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          What couples see when they open your profile.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:gap-12">
        <form
          className="max-w-2xl space-y-8"
          onSubmit={handleSubmit(async () => {
            await new Promise((r) => setTimeout(r, 300));
            toast.success('Profile saved');
          })}
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Contact first name" htmlFor="rp-first" required error={errors.firstName?.message}>
              <Input id="rp-first" {...register('firstName')} />
            </Field>
            <Field label="Contact last name" htmlFor="rp-last" required error={errors.lastName?.message}>
              <Input id="rp-last" {...register('lastName')} />
            </Field>
            <Field label="Email" htmlFor="rp-email" required error={errors.email?.message}>
              <Input id="rp-email" type="email" {...register('email')} />
            </Field>
            <Field label="Phone" htmlFor="rp-phone" error={errors.phone?.message}>
              <Input id="rp-phone" {...register('phone')} />
            </Field>
            <Field label="City" htmlFor="rp-city">
              <Input id="rp-city" {...register('city')} />
            </Field>
            <Field label="Country" htmlFor="rp-country">
              <Input id="rp-country" {...register('country')} />
            </Field>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isSubmitSuccessful ? 'Saved' : 'Save profile'}
          </Button>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-border p-5">
            <MediaImage mediaKey={retailer.coverMediaKey} aspect="wide" sizes="288px" />
            <h3 className="mt-4 font-display text-xl text-ink">{retailer.name}</h3>
            <p className="mt-1 text-xs text-ink-muted">
              {retailer.city}, {retailer.country}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{retailer.summary}</p>

            <div className="mt-4 flex items-center gap-2">
              {retailer.verified ? (
                <span className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-eyebrow text-gold-deep">
                  <TickCircle size={13} variant="Bold" aria-hidden="true" />
                  Verified
                </span>
              ) : null}
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="eyebrow mb-2">Traditions served</p>
              <ul className="flex flex-wrap gap-1.5">
                {retailer.faiths.map((faithId) => (
                  <li key={faithId}>
                    <Badge variant="outline">{getFaith(faithId).shortName}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-ink-muted">
              Editing your public profile, images and traditions is handled by your account manager while verification is
              in progress.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
