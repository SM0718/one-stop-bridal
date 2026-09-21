import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Add, Eye, Trash } from 'iconsax-react';
import { z } from 'zod';
import type { Availability, ProductCategoryId } from '@/types';
import { PRODUCT_CATEGORIES } from '@/data/categories';
import { FAITH_IDS } from '@/types';
import { getFaith } from '@/data/faiths';
import { eventName } from '@/data/events';
import { routes } from '@/config/routes';
import {
  demoRetailerId,
  useCreateRetailerProduct,
  useDeleteRetailerProduct,
  useRetailerEnquiries,
  useRetailerOrders,
  useRetailerProducts,
  useRetailerStats,
  useSetApplicationStatus,
} from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useRetailerApplication } from '@/hooks/queries';
import { formatCount, formatPrice, relativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaImage } from '@/components/ui/media';
import { EmptyState } from '@/components/ui/empty-state';
import { Progress } from '@/components/ui/progress';

/* ==========================================================================
   Dashboard
   ========================================================================== */

const STATUS_NOTE: Record<string, string> = {
  pending: 'Received. Our retail team will review your details.',
  'under-review': 'Being reviewed. We check registration and contact details.',
  'needs-information': 'We need something else from you before we can continue.',
  approved: 'Approved. Your account is active and you can publish products.',
  rejected: 'Not accepted at this time. You can apply again after six months.',
};

export function RetailerDashboardPage() {
  useDocumentMeta({
    title: 'Retailer dashboard',
    description: 'Your products, enquiries and orders.',
    canonicalPath: routes.retailersDashboard,
  });

  const retailerId = demoRetailerId();
  const { data: stats, isLoading } = useRetailerStats(retailerId);
  const { data: enquiries } = useRetailerEnquiries();
  const { data: orders } = useRetailerOrders();
  const { data: application } = useRetailerApplication();
  const setStatus = useSetApplicationStatus();

  return (
    <div className="space-y-12">
      {/* Application status */}
      <section aria-labelledby="application-heading">
        <h2 id="application-heading" className="eyebrow mb-4">
          Application status
        </h2>

        {application ? (
          <div className="border border-border bg-background p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl text-ink">
                    {application.businessName}
                  </h3>
                  <Badge
                    variant={
                      application.status === 'approved'
                        ? 'positive'
                        : application.status === 'rejected'
                          ? 'danger'
                          : application.status === 'needs-information'
                            ? 'warning'
                            : 'muted'
                    }
                  >
                    {application.status.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {STATUS_NOTE[application.status]}
                </p>
              </div>
              <div className="text-right text-xs text-ink-muted">
                <p>Submitted {relativeTime(application.submittedAt)}</p>
                <p className="mt-1">{application.categoryIds.length} categories selected</p>
              </div>
            </div>

            <ol className="mt-6 space-y-4 border-t border-border pt-5">
              {application.timeline.map((event) => (
                <li key={event.id} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ink"
                  />
                  <div>
                    <p className="text-sm text-ink">
                      <span className="capitalize">{event.status.replace('-', ' ')}</span>
                      <span className="ml-2 text-xs text-ink-muted">{relativeTime(event.at)}</span>
                    </p>
                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-soft">{event.note}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Demo control, clearly labelled */}
            <div className="mt-6 border border-dashed border-border bg-muted/40 p-4">
              <p className="text-xs leading-relaxed text-ink-muted">
                <strong className="text-ink-soft">Demonstration control.</strong> This build has no back office, so the
                review timeline above is generated locally. Use these buttons to inspect each state.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['pending', 'under-review', 'needs-information', 'approved', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus.mutate(status)}
                    className={cn(
                      'border px-3 py-1.5 text-xs capitalize transition-colors',
                      application.status === status
                        ? 'border-ink bg-ink text-ivory'
                        : 'border-border text-ink-soft hover:border-ink hover:text-ink',
                    )}
                  >
                    {status.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No application on file"
            description="Apply to become a retailer and your review status will appear here."
            action={
              <Button asChild>
                <Link to={routes.retailersApply}>Apply to become a retailer</Link>
              </Button>
            }
          />
        )}
      </section>

      {/* Stats */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="eyebrow mb-4">
          Your workspace
        </h2>
        <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Products',
              value: isLoading ? '—' : String(stats?.products ?? 0),
              note: `${stats?.published ?? 0} published`,
              href: routes.retailersProducts,
            },
            {
              label: 'Enquiries',
              value: isLoading ? '—' : String(stats?.enquiries ?? 0),
              note: `${stats?.newEnquiries ?? 0} new`,
              href: routes.retailersEnquiries,
            },
            {
              label: 'Orders',
              value: isLoading ? '—' : String(stats?.orders ?? 0),
              note: 'All time',
              href: routes.retailersOrders,
            },
            {
              label: 'Profile views',
              value: isLoading ? '—' : String(stats?.views.last30Days ?? 0),
              note: 'Last 30 days · demo data',
              href: routes.retailersAnalytics,
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-5">
              <dt className="eyebrow">{stat.label}</dt>
              <dd className="mt-2">
                <span className="block font-display text-2xl text-ink">{stat.value}</span>
                <span className="mt-1.5 block text-xs text-ink-muted">{stat.note}</span>
                <Link to={stat.href} className="mt-3 inline-block text-xs font-medium text-ink link-quiet">
                  Open
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Recent activity */}
      <div className="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="enquiries-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="enquiries-heading" className="font-display text-2xl text-ink">
              Recent enquiries
            </h2>
            <Link to={routes.retailersEnquiries} className="link-quiet text-xs text-ink-muted hover:text-ink">
              All enquiries
            </Link>
          </div>
          <ul className="mt-5 border-t border-border">
            {(enquiries ?? []).slice(0, 4).map((enquiry) => (
              <li key={enquiry.id} className="border-b border-border py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{enquiry.productName}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {enquiry.customerName} · {enquiry.city} · {enquiry.channel}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-muted">{relativeTime(enquiry.receivedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="orders-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="orders-heading" className="font-display text-2xl text-ink">
              Recent orders
            </h2>
            <Link to={routes.retailersOrders} className="link-quiet text-xs text-ink-muted hover:text-ink">
              All orders
            </Link>
          </div>
          <ul className="mt-5 border-t border-border">
            {(orders ?? []).slice(0, 4).map((order) => (
              <li key={order.id} className="border-b border-border py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{order.reference}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {order.customerName} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-ink">{formatPrice(order.total)}</p>
                    <p className="mt-1 text-xs capitalize text-ink-muted">{order.status}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ==========================================================================
   Products
   ========================================================================== */

export function RetailerProductsPage() {
  useDocumentMeta({
    title: 'Your products',
    description: 'Manage your product catalogue.',
    canonicalPath: routes.retailersProducts,
  });

  const retailerId = demoRetailerId();
  const { data: products, isLoading } = useRetailerProducts(retailerId);
  const deleteProduct = useDeleteRetailerProduct(retailerId);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = (products ?? []).filter((product) => {
    if (categoryFilter !== 'all' && product.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      if (![product.name, product.code].join(' ').toLowerCase().includes(term)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Products</h2>
          <p className="mt-2 text-sm text-ink-soft">
            {isLoading ? 'Loading…' : `${formatCount(products?.length ?? 0, 'product')} in your catalogue.`}
          </p>
        </div>
        <Button asChild>
          <Link to={routes.retailersProductNew}>
            <Add size={16} variant="Linear" />
            Add a product
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Field label="Search" htmlFor="product-search" className="w-full sm:w-64">
          <Input
            id="product-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or product code"
          />
        </Field>
        <Field label="Category" htmlFor="product-category" className="w-full sm:w-56">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="product-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {PRODUCT_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={products?.length === 0 ? 'No products yet' : 'Nothing matches'}
          description={
            products?.length === 0
              ? 'Publish your first piece. Made-to-measure items can be listed without a published price.'
              : 'Try a different search or category.'
          }
          action={
            products?.length === 0 ? (
              <Button asChild>
                <Link to={routes.retailersProductNew}>Add a product</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                }}
              >
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <caption className="sr-only">Your product catalogue</caption>
            <thead className="border-b border-border">
              <tr className="eyebrow">
                <th scope="col" className="py-3 pr-4 font-normal">
                  Product
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Category
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Price
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Availability
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <MediaImage
                        mediaKey={product.images[0]?.mediaKey}
                        alt=""
                        aspect="square"
                        sizes="56px"
                        className="w-12 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{product.name}</p>
                        <p className="mt-0.5 text-xs text-ink-muted">{product.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-ink-soft">
                    {PRODUCT_CATEGORIES.find((c) => c.id === product.categoryId)?.name}
                  </td>
                  <td className="py-4 pr-4 text-ink-soft">{formatPrice(product.price, product.currency)}</td>
                  <td className="py-4 pr-4">
                    <Badge variant={product.availability === 'in-stock' ? 'muted' : 'outline'}>
                      {product.availability.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-1">
                      <Link
                        to={routes.product(product.slug)}
                        aria-label={`View ${product.name} on the site`}
                        className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink"
                      >
                        <Eye size={16} variant="Linear" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          deleteProduct.mutate(product.id);
                          toast.success('Product removed from your catalogue');
                        }}
                        aria-label={`Delete ${product.name}`}
                        className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
                      >
                        <Trash size={16} variant="Linear" />
                      </button>
                    </div>
                  </td>
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
   New product
   ========================================================================== */

const productFormSchema = z.object({
  name: z.string().trim().min(3, 'Give the piece a name'),
  code: z.string().trim().min(2, 'Add your internal product code'),
  categoryId: z.string().min(1, 'Choose a category'),
  description: z.string().trim().min(40, 'Write at least 40 characters so couples know what this is'),
  price: z.string().optional().default(''),
  availability: z.enum(['in-stock', 'made-to-order', 'pre-order', 'enquire']),
  fabric: z.string().trim().min(2, 'Fabric is used by filters'),
  colour: z.string().trim().min(2, 'Colour is used by filters'),
  silhouette: z.string().trim().min(2, 'Silhouette is used by filters'),
  sizes: z.string().trim().min(1, 'List at least one size, or "Made to measure"'),
});

type ProductFormValues = z.input<typeof productFormSchema>;

export function RetailerProductNewPage() {
  useDocumentMeta({
    title: 'Add a product',
    description: 'Publish a new piece to your catalogue.',
    canonicalPath: routes.retailersProductNew,
  });

  const retailerId = demoRetailerId();
  const createProduct = useCreateRetailerProduct(retailerId);
  const [selectedFaiths, setSelectedFaiths] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      availability: 'made-to-order',
      price: '',
    },
  });

  async function onSubmit(values: ProductFormValues) {
    const parsed = productFormSchema.parse(values);
    const priceValue = parsed.price && parsed.price.trim() !== '' ? Number(parsed.price) : null;

    await createProduct.mutateAsync({
      id: `prod-${Date.now()}`,
      code: parsed.code,
      slug: parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: parsed.name,
      retailerId,
      categoryId: parsed.categoryId as ProductCategoryId,
      faiths: selectedFaiths as never,
      eventIds: selectedEvents,
      description: parsed.description,
      details: [],
      materials: [parsed.fabric],
      care: ['Dry clean only, by a specialist'],
      price: Number.isFinite(priceValue) ? priceValue : null,
      currency: 'INR',
      images: [],
      options: [],
      sizes: parsed.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      availability: parsed.availability as Availability,
      badges: parsed.availability === 'in-stock' ? ['in-stock'] : ['made-to-order'],
      customization: [],
      delivery: [
        {
          label: parsed.availability === 'in-stock' ? 'Ready to ship' : 'Made to order',
          detail:
            parsed.availability === 'in-stock'
              ? 'Dispatched within 2 working days.'
              : 'Confirmed at consultation, typically 8–12 weeks.',
        },
      ],
      returns: 'Made-to-measure pieces are non-returnable. Ready-to-wear pieces can be returned unworn within 14 days.',
      silhouette: parsed.silhouette,
      fabric: parsed.fabric,
      colour: parsed.colour,
      styleTags: [],
      featured: false,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    toast.success('Product published', { description: `${parsed.name} is now in the catalogue.` });
    reset();
    setSelectedFaiths([]);
    setSelectedEvents([]);
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h2 className="font-display text-2xl text-ink">Add a product</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Fabric, colour and silhouette are what couples filter by, so they matter more than the write-up. Images are
          handled by your account manager during onboarding.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-10">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Product name" htmlFor="np-name" required error={errors.name?.message}>
            <Input id="np-name" {...register('name')} />
          </Field>
          <Field label="Product code" htmlFor="np-code" required hint="Your own reference." error={errors.code?.message}>
            <Input id="np-code" {...register('code')} placeholder="MV-1130" />
          </Field>
        </div>

        <Field label="Category" htmlFor="np-category" required error={errors.categoryId?.message}>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="np-category">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Description" htmlFor="np-description" required error={errors.description?.message}>
          <Textarea id="np-description" rows={5} {...register('description')} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Fabric" htmlFor="np-fabric" required error={errors.fabric?.message}>
            <Input id="np-fabric" {...register('fabric')} placeholder="Silk dupion" />
          </Field>
          <Field label="Colour" htmlFor="np-colour" required error={errors.colour?.message}>
            <Input id="np-colour" {...register('colour')} placeholder="Ivory" />
          </Field>
          <Field label="Silhouette" htmlFor="np-silhouette" required error={errors.silhouette?.message}>
            <Input id="np-silhouette" {...register('silhouette')} placeholder="A-line" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Availability" htmlFor="np-availability" required>
            <Controller
              control={control}
              name="availability"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="np-availability">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">In stock</SelectItem>
                    <SelectItem value="made-to-order">Made to order</SelectItem>
                    <SelectItem value="pre-order">Pre-order</SelectItem>
                    <SelectItem value="enquire">Price on enquiry</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field
            label="Price"
            htmlFor="np-price"
            hint="Leave blank to show “Price on enquiry”."
          >
            <Input id="np-price" type="number" min={0} step={1000} {...register('price')} placeholder="385000" />
          </Field>
        </div>

        <Field
          label="Sizes"
          htmlFor="np-sizes"
          required
          hint="Comma separated, for example: Made to measure   ·   UK 8, UK 10, UK 12"
          error={errors.sizes?.message}
        >
          <Input id="np-sizes" {...register('sizes')} />
        </Field>

        <fieldset>
          <legend className="text-[0.8125rem] font-medium text-ink">Traditions this suits</legend>
          <p className="mt-1.5 text-xs text-ink-muted">
            Used to surface the piece to couples whose wedding context matches. Select everything that genuinely applies.
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {FAITH_IDS.map((faithId) => (
              <li key={faithId}>
                <Checkbox
                  id={`np-faith-${faithId}`}
                  checked={selectedFaiths.includes(faithId)}
                  onCheckedChange={(checked) =>
                    setSelectedFaiths((prev) =>
                      checked === true ? [...prev, faithId] : prev.filter((f) => f !== faithId),
                    )
                  }
                  label={getFaith(faithId).shortName}
                />
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="text-[0.8125rem] font-medium text-ink">Ceremonies</legend>
          <p className="mt-1.5 text-xs text-ink-muted">
            Enter ceremony ids separated by commas, for example: hindu-vivah, hindu-sangeet
          </p>
          <div className="mt-3">
            <Input
              value={selectedEvents.join(', ')}
              onChange={(e) =>
                setSelectedEvents(
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              placeholder="hindu-vivah"
              aria-label="Ceremony ids"
            />
          </div>
          {selectedEvents.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {selectedEvents.map((id) => (
                <li key={id}>
                  <Badge variant="outline">{eventName(id)}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </fieldset>

        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing…' : isSubmitSuccessful ? 'Published' : 'Publish product'}
          </Button>
          <Button asChild variant="ghost">
            <Link to={routes.retailersProducts}>Back to products</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

export { Progress };
