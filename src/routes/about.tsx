import { Link } from '@tanstack/react-router';
import { routes } from '@/config/routes';
import { useDocumentMeta, schema } from '@/hooks/useDocumentMeta';
import { SELECTABLE_FAITHS } from '@/data/faiths';
import { PageHeader } from '@/components/ui/breadcrumb';
import { MediaImage } from '@/components/ui/media';
import { Button } from '@/components/ui/button';
import { Section, SectionHeader, EditorialSplit } from '@/components/editorial/Section';
import { cn } from '@/lib/utils';

const PRINCIPLES = [
  {
    title: 'One platform, many traditions',
    body: 'Nine traditions are configured today, plus a custom path for regional, secular and mixed weddings. Nothing about the platform assumes one way of marrying.',
  },
  {
    title: 'Configuration, not stereotype',
    body: 'Every ceremony we suggest can be renamed, reordered or removed. We describe common practice and never assert what your family does.',
  },
  {
    title: 'No invented proof',
    body: 'We do not publish ratings, reviews, awards or customer numbers we cannot substantiate. Where we have no data, the interface says so.',
  },
  {
    title: 'Businesses keep their customer',
    body: 'Enquiries go straight to the retailer or vendor. We do not sit in the middle of the conversation or resell leads.',
  },
];

export function AboutPage() {
  useDocumentMeta({
    title: 'About',
    description:
      'One Stop Bridal is a wedding marketplace and planning platform built across faiths and cultures, with no invented reviews or statistics.',
    canonicalPath: routes.about,
    jsonLd: schema.organization(),
  });

  return (
    <>
      <div className="container pt-10 lg:pt-14">
        <PageHeader
          eyebrow="About"
          title="A wedding platform built for more than one kind of wedding"
          standfirst="Most wedding sites are built for a single tradition and quietly exclude everyone else. We started from the opposite assumption: a couple should be able to tell us what their wedding is, and have the whole platform respond."
          breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'About' }]}
        />
      </div>

      <Section>
        <MediaImage
          mediaKey="editorial-arches"
          aspect="banner"
          priority
          sizes="100vw"
          width={1920}
          height={820}
        />
        <p className="mt-3 text-xs text-ink-muted">
          Placeholder photography is used throughout this build while retailer and brand imagery is licensed.
        </p>
      </Section>

      <Section tone="deep">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">Why we built it</p>
            <h2 className="text-display-sm text-ink">The wedding industry is not one culture</h2>
          </div>
          <div className="prose-editorial lg:col-span-7">
            <p>
              Planning a Hindu wedding and planning a church wedding involve different ceremonies, different vendors,
              different timelines and often different countries. Search for bridalwear on a mainstream platform and you
              will be shown everything at once, with no way to say what your wedding actually involves.
            </p>
            <p>
              The fix is not a filter. It is treating the wedding context as the foundation of the whole site: what the
              homepage recommends, which ceremonies your checklist is built from, which vendors are surfaced for a
              category, and how search ranks what it finds.
            </p>
            <p>
              It also has to work for weddings that combine traditions. An interfaith couple should not have to choose
              between two halves of their wedding. On this platform they select both, and the events, tasks, vendors and
              collections are drawn from all of them at once.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Traditions"
          title="Nine traditions configured, and a way to go beyond them"
          description="Each is a data configuration rather than a code change, which is how new traditions and regional variations get added."
        />
        <ul className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {SELECTABLE_FAITHS.map((faith) => (
            <li key={faith.id} className="bg-background p-6">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: faith.accent.hex }}
                />
                <h3 className="font-display text-xl text-ink">{faith.name}</h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{faith.summary}</p>
              <p className="mt-3 text-2xs uppercase tracking-eyebrow text-ink-muted">
                {faith.regions.slice(0, 3).join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeader eyebrow="How we work" title="Four things we hold to" />
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title} className={cn('border-t border-border pt-5')}>
              <p className="font-display text-2xl text-gold">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 font-display text-xl text-ink">{principle.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{principle.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <EditorialSplit
          media={<MediaImage mediaKey="moment-photography" aspect="editorial" sizes="(min-width: 1024px) 45vw, 100vw" />}
          eyebrow="Trust"
          title="What verification does and does not mean"
          body="A verified badge means we have checked that a business is registered and that its contact details are real. It does not mean we recommend them, and it is not a rating. Where a business is not verified, we say so plainly rather than hiding it."
          action={{ label: 'Browse bridal collections', href: routes.collectionsBridal }}
        />
      </Section>

      <Section tone="deep">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl text-ink">This build is a demonstration</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Retailers, vendors, products and articles are illustrative records created for this build. Photography is
              licensed placeholder imagery. No reviews, ratings, awards or customer statistics have been invented
              anywhere on the site, and where numbers appear they describe this dataset rather than a real business.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <Button asChild>
              <Link to={routes.collections}>Explore the platform</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={routes.contact}>Contact us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
