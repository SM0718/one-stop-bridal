import { useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Call, Location, MessageText1, TickCircle } from 'iconsax-react';
import { useRelatedVendorsFor, useVendor } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { getVendorCategory } from '@/data/categories';
import { getFaith } from '@/data/faiths';
import { eventName } from '@/data/events';
import { formatPrice } from '@/lib/format';
import { routes } from '@/config/routes';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaImage } from '@/components/ui/media';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SaveButton } from '@/components/product/SaveButton';
import { EnquiryDialog } from '@/components/product/EnquiryDialog';
import { VendorCard } from '@/components/vendor/VendorCard';
import { Section, SectionHeader } from '@/components/editorial/Section';
import { RouteNotFound } from './status';

export function VendorDetailPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const slug = params.slug ?? '';
  const { data: vendor, isLoading, isError } = useVendor(slug);
  const { data: related } = useRelatedVendorsFor(vendor);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useDocumentMeta({
    title: vendor?.name ?? 'Vendor',
    description: vendor?.summary ?? '',
    canonicalPath: routes.vendor(slug),
  });

  if (isError) return <RouteNotFound />;

  if (isLoading || !vendor) {
    return (
      <div className="container py-14" aria-hidden="true">
        <div className="aspect-banner bg-muted" />
        <div className="mt-8 space-y-4">
          <div className="h-8 w-1/3 bg-muted" />
          <div className="h-4 w-2/3 bg-muted" />
        </div>
      </div>
    );
  }

  const gallery = vendor.galleryKeys.length > 0 ? vendor.galleryKeys : [vendor.coverMediaKey];

  return (
    <>
      {/* Cover */}
      <div className="container pt-6">
        <MediaImage
          mediaKey={vendor.coverMediaKey}
          aspect="banner"
          priority
          sizes="100vw"
          width={1920}
          height={820}
        />
      </div>

      <div className="container pt-8">
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: routes.home },
            { label: 'Vendors', href: routes.vendors },
            ...(getVendorCategory(vendor.categoryIds[0])
              ? [
                  {
                    label: getVendorCategory(vendor.categoryIds[0])!.name,
                    href: routes.vendorCategory(getVendorCategory(vendor.categoryIds[0])!.slug),
                  },
                ]
              : []),
            { label: vendor.name },
          ]}
          eyebrow={vendor.categoryIds.map((id) => getVendorCategory(id)?.name).filter(Boolean).join(' · ')}
          title={vendor.name}
          standfirst={vendor.summary}
          actions={
            <>
              <SaveButton kind="vendor" refId={vendor.id} label={vendor.name} variant="plain" className="border border-border" />
              <Button size="lg" onClick={() => setEnquiryOpen(true)}>
                Send an enquiry
              </Button>
            </>
          }
        />

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {vendor.verified ? (
            <span className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-eyebrow text-gold-deep">
              <TickCircle size={14} variant="Bold" aria-hidden="true" />
              Verified business — registration and contact details checked
            </span>
          ) : (
            <span className="text-2xs uppercase tracking-eyebrow text-ink-muted">
              Not yet verified — details not checked by us
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <Location size={14} variant="Linear" aria-hidden="true" />
            {vendor.city}, {vendor.country} · {vendor.coverage}
          </span>
          <span className="text-xs text-ink-muted">{vendor.yearsActive} years in business</span>
          <span className="text-xs text-ink-muted">{vendor.teamSize}</span>
        </div>

        <p className="mt-4 max-w-editorial text-xs leading-relaxed text-ink-muted">
          No rating is shown for this business. We only publish reviews where we hold verifiable customer feedback, and we
          do not yet have it for {vendor.name}. Verification is a check that the business exists — not a recommendation.
        </p>
      </div>

      <div className="container py-10 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          {/* Main column */}
          <div className="min-w-0">
            <section>
              <h2 className="eyebrow mb-4">About</h2>
              <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                {vendor.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <Separator className="my-10" />

            <section>
              <h2 className="eyebrow mb-4">Portfolio</h2>
              <MediaImage
                mediaKey={gallery[activeImage]}
                aspect="wide"
                sizes="(min-width: 1024px) 60vw, 100vw"
                width={1280}
                height={720}
              />
              {gallery.length > 1 ? (
                <ul className="rail mt-3 gap-3" aria-label="Portfolio images">
                  {gallery.map((key, index) => (
                    <li key={key + index} className="w-24 shrink-0 sm:w-28">
                      <button
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`View portfolio image ${index + 1}`}
                        aria-current={index === activeImage}
                        className={
                          index === activeImage
                            ? 'block w-full border border-ink'
                            : 'block w-full border border-transparent transition-colors hover:border-border'
                        }
                      >
                        <MediaImage mediaKey={key} alt="" aspect="square" sizes="112px" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <Separator className="my-10" />

            <section>
              <h2 className="eyebrow mb-4">Services</h2>
              <ul className="divide-y divide-border border-t border-border">
                {vendor.services.map((service) => (
                  <li key={service.name} className="grid gap-2 py-5 sm:grid-cols-[1fr_10rem] sm:gap-6">
                    <div>
                      <h3 className="font-display text-lg text-ink">{service.name}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{service.description}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-ink">{formatPrice(service.priceFrom)}</p>
                      {service.unit ? <p className="text-xs text-ink-muted">{service.unit}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {vendor.packages.length > 0 ? (
              <>
                <Separator className="my-10" />
                <section>
                  <h2 className="eyebrow mb-4">Packages</h2>
                  <ul className="grid gap-6 sm:grid-cols-2">
                    {vendor.packages.map((pkg) => (
                      <li key={pkg.name} className="border border-border p-6">
                        <h3 className="font-display text-xl text-ink">{pkg.name}</h3>
                        <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                          {pkg.includes.map((item) => (
                            <li key={item} className="border-b border-border/60 pb-2 last:border-0">
                              {item}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 text-sm text-ink">From {formatPrice(pkg.priceFrom)}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : null}

            <Separator className="my-10" />

            <section>
              <h2 className="eyebrow mb-4">Traditions and ceremonies</h2>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-ink">Declared experience with</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {vendor.faiths.map((faithId) => (
                      <li key={faithId}>
                        <span className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-[0.8125rem] text-ink-soft">
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: getFaith(faithId).accent.hex }}
                          />
                          {getFaith(faithId).name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">Ceremonies covered</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {vendor.eventIds.map((eventId) => (
                      <li key={eventId}>
                        <span className="border border-border px-3 py-1.5 text-[0.8125rem] text-ink-soft">
                          {eventName(eventId)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border bg-background p-6">
              <h2 className="font-display text-xl text-ink">Enquire</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Tell {vendor.name} your date and ceremony and they will come back with availability.
              </p>
              <Button className="mt-5" full onClick={() => setEnquiryOpen(true)}>
                Send an enquiry
              </Button>
              <a
                href="https://wa.me/910000000000"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 flex items-center justify-center gap-2 border border-border px-4 py-3 text-[0.8125rem] text-ink transition-colors hover:border-ink"
              >
                <MessageText1 size={16} variant="Linear" />
                WhatsApp
              </a>
              <a
                href="tel:+912200000000"
                className="mt-3 flex items-center justify-center gap-2 border border-border px-4 py-3 text-[0.8125rem] text-ink transition-colors hover:border-ink"
              >
                <Call size={16} variant="Linear" />
                Call the studio
              </a>

              <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Price range</dt>
                  <dd className="text-ink capitalize">{vendor.priceRange}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Languages</dt>
                  <dd className="text-right text-ink">{vendor.languages.join(', ')}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Website</dt>
                  <dd className="text-right text-ink">
                    {vendor.website ? (
                      <a href={vendor.website} target="_blank" rel="noreferrer noopener" className="link-quiet">
                        Visit
                      </a>
                    ) : (
                      'Not listed'
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Instagram</dt>
                  <dd className="text-right text-ink">{vendor.instagram ?? 'Not listed'}</dd>
                </div>
              </dl>

              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-ink-muted">
                {vendor.availabilityNote}
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-6 border-t border-border">
              <AccordionItem value="trust">
                <AccordionTrigger headingLevel={2}>How enquiries work</AccordionTrigger>
                <AccordionContent>
                  Your enquiry goes to the business only. We do not sell leads, we do not charge you, and we do not share
                  your details with anyone else. See our{' '}
                  <Link to={routes.privacy} className="text-ink underline decoration-gold/50 underline-offset-2">
                    privacy notice
                  </Link>
                  .
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>
        </div>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-8">
          <Badge variant="outline">{vendor.categoryIds.map((id) => getVendorCategory(id)?.name).filter(Boolean)[0]}</Badge>
          <Badge variant="muted">{vendor.city}</Badge>
          {vendor.verified ? <Badge variant="gold">Verified</Badge> : null}
        </div>
      </div>

      {related && related.length > 0 ? (
        <Section tone="deep">
          <SectionHeader
            eyebrow="Other businesses"
            title="Similar vendors"
            description="Matched on category, shared traditions and the ceremonies they cover."
            action={{ label: 'All vendors', href: routes.vendors }}
          />
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <VendorCard vendor={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        productName={`Enquiry for ${vendor.name}`}
        retailerName={vendor.name}
      />
    </>
  );
}
