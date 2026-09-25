import { Link } from '@tanstack/react-router';
import { ArrowRight, Eye, Heart, MessageText1 } from 'iconsax-react';
import { routes } from '@/config/routes';
import { useArticles, useFeaturedProducts, useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta, schema } from '@/hooks/useDocumentMeta';
import { useWeddingStore } from '@/stores/wedding';
import { useUIStore } from '@/stores/ui';
import { productCategoriesInGroup } from '@/data/categories';
import { TRADITION_FAITHS } from '@/data/faiths';
// Vendors and the vendor directory have been commented out for this bridal-only
// build, along with the planning preview section.
// import { useVendors } from '@/hooks/queries';
// import { selectTaskProgress } from '@/stores/wedding';
// import { formatCount } from '@/lib/format';
// import { VENDOR_CATEGORIES } from '@/data/categories';
// import { VENDORS } from '@/data/vendors';
import { PRODUCTS } from '@/data/products';
import { RETAILERS } from '@/data/retailers';
import { FAITH_IDS } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MediaImage, MediaZoom } from '@/components/ui/media';
import { Section, SectionHeader, EditorialSplit } from '@/components/editorial/Section';
import { ProductCard } from '@/components/product/ProductCard';
// import { VendorCard } from '@/components/vendor/VendorCard';
// import { Progress } from '@/components/ui/progress';
import { FaithChooser, type FaithSelection } from '@/components/faith/FaithChooser';
import { FaithBadge } from '@/components/faith/FaithBadge';
import { BlurFade } from '@/components/magicui/blur-fade';
import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid';
import { Marquee } from '@/components/magicui/marquee';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { useEffect, useRef, useState } from 'react';

/* ==========================================================================
   Hero — full-bleed rotating ceremony films. Each clip loops until the
   interval advances to the next, crossfaded over ~1s. The video stack is
   decorative; the section is fully keyboard/AT-accessible through the links
   and the film caption is announced as the reel advances.
   ========================================================================== */
const HERO_VIDEOS = [
  { src: '/hero-mehendi.mp4', label: 'Mehendi' },
  { src: '/hero-haldi-face.mp4', label: 'Haldi' },
  { src: '/hero-haldi-application.mp4', label: 'Haldi, close-up' },
  { src: '/hero-bridal.mp4', label: 'The bride' },
] as const;

const HERO_VIDEO_INTERVAL_MS = 8000;

function HeroSection() {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }

    const interval = window.setInterval(
      () => setActive((index) => (index + 1) % HERO_VIDEOS.length),
      HERO_VIDEO_INTERVAL_MS,
    );
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        if (video.paused) void video.play();
      } else {
        video.pause();
      }
    });
  }, [active]);

  return (
    <section aria-label="Hero">
      <div className="relative isolate overflow-hidden bg-ink">
        {/* Crossfaded ceremony films, looping behind the copy */}
        <div className="absolute inset-0">
          {HERO_VIDEOS.map((video, index) => (
            <video
              key={video.src}
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              src={video.src}
              muted
              loop
              playsInline
              preload="auto"
              autoPlay={index === 0}
              aria-hidden={index !== active}
              tabIndex={-1}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-editorial',
                index === active ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
        </div>

        {/* Legibility scrim — keeps white copy readable over any frame */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/45"
        />

        <div className="relative z-10 container flex min-h-[76vh] flex-col justify-end gap-8 pb-14 pt-28 sm:min-h-[84vh] sm:pb-16 lg:min-h-[92vh]">
          <div className="max-w-2xl">
            <p className="mb-5 text-2xs uppercase tracking-eyebrow text-white/70">
              Weddings across faiths and cultures
            </p>
            <h1 className="text-display-lg text-white lg:text-display-xl">
              Everything for the wedding you imagine
            </h1>
            <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-white/80">
              Bridal collections, curated edits and the ateliers behind them — adapted to your ceremonies.
              Built for weddings across traditions — and for the ones that combine two.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ShimmerButton
                asChild
                className="px-7 py-3.5 text-sm"
                background="hsl(var(--rose))"
              >
                <Link to={routes.collectionsBridal}>Shop bridal</Link>
              </ShimmerButton>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                <Link to={routes.inspiration}>Explore inspiration</Link>
              </Button>
            </div>
          </div>

          {/* Active ceremony film caption + track indicator */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span aria-hidden="true" className="h-px w-10 bg-white/40" />
            <span>Ceremony film — {HERO_VIDEOS[active].label}</span>
            <span aria-hidden="true" className="flex gap-1.5">
              {HERO_VIDEOS.map((video, index) => (
                <span
                  key={video.src}
                  className={cn(
                    'h-1 w-1 rounded-full transition-colors duration-500',
                    index === active ? 'bg-white' : 'bg-white/40',
                  )}
                />
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Honest, countable facts about this build — labelled as such */}
      <div className="container">
        <dl className="grid gap-6 border-t border-border py-7 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="eyebrow">Traditions configured</dt>
            <dd className="mt-1.5 font-display text-2xl text-ink">
              <NumberTicker value={FAITH_IDS.length} className="text-ink" delay={0.1} />
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Pieces in the catalogue</dt>
            <dd className="mt-1.5 font-display text-2xl text-ink">
              <NumberTicker value={PRODUCTS.length} className="text-ink" delay={0.25} />
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Retailers listing</dt>
            <dd className="mt-1.5 font-display text-2xl text-ink">
              <NumberTicker value={RETAILERS.length} className="text-ink" delay={0.4} />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function HomePage() {
  useDocumentMeta({
    title: 'One Stop Bridal — Weddings across faiths and cultures',
    description:
      'Collections and curated edits for Hindu, Muslim, Christian, Sikh, Parsi, Jain, Buddhist, Jewish and interfaith brides. Choose your wedding context and the platform adapts.',
    canonicalPath: routes.home,
    jsonLd: schema.organization(),
  });

  const context = useWeddingContext();
  const faith = useWeddingStore((s) => s.profile.faith);

  const { data: products } = useFeaturedProducts(8);
  const { data: articles } = useArticles({ limit: 3 });

  /* Recommendations fill a single row of equal cards. The column count follows
     the number available, so the row is never left with a dangling gap.
     Non-bridal sections (vendors, planning, jewellery…) are excluded in this
     bridal-only build. */
  const bridalSections = context.sections.filter((s) => s.href.startsWith('/collections/bridal'));
  const recommended = bridalSections.slice(0, 4);
  const recommendedColumns =
    recommended.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

  /* The bridal rail only shows pieces from the bridal collection group. */
  const bridalCategoryIds = new Set(productCategoriesInGroup('bridal').map((c) => c.id));
  const bridalProducts = (products ?? []).filter((p) => bridalCategoryIds.has(p.categoryId));

  return (
    <>
      {/* ================================================================
          1. Hero — full-bleed rotating ceremony films with overlay
          ================================================================ */}
      <HeroSection />

      {/* ================================================================
          1b. Traditions band — decorative marquee
          ================================================================ */}
      <section className="border-b border-border bg-marigold-soft/60" aria-label="Traditions covered">
        <div className="container py-6">
          <p className="eyebrow mb-4 text-center">Traditions we plan for</p>
          <Marquee pauseOnHover className="[--duration:50s]">
            {TRADITION_FAITHS.map((faith) => (
              <span
                key={faith.id}
                className="mx-6 flex items-center gap-3 whitespace-nowrap font-display text-xl text-ink/70"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                {faith.name}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ================================================================
          2. Wedding context — selection, or a summary of the active one
          ================================================================ */}
      {!faith ? <WeddingContextSection /> : <ActiveContextSection />}

      {/* ================================================================
          3. Personalised discovery — driven entirely by faith config
          ================================================================ */}
      {bridalSections.length > 0 ? (
        <Section tone="deep">
          <SectionHeader
            eyebrow="Recommended"
            title={`For a ${context.label} wedding`}
            description="Not a generic list. Each of these comes from the bridal collections your wedding context defines."
            action={{ label: 'See all bridal', href: routes.collectionsBridal }}
          />

          <ul className={`mt-12 grid items-stretch gap-x-8 gap-y-10 ${recommendedColumns}`}>
            {recommended.map((section, index) => (
              <li key={section.id} className="h-full">
                <BlurFade delay={0.1 + index * 0.1} inView className="h-full">
                  <Link to={section.href} className="group flex h-full flex-col">
                    <MediaZoom>
                      <MediaImage
                        mediaKey={section.mediaKey}
                        aspect="editorial"
                        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 100vw"
                      />
                    </MediaZoom>
                    <h3 className="mt-5 font-display text-xl leading-snug text-ink">{section.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{section.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[0.8125rem] font-medium text-ink">
                      {section.ctaLabel}
                      <ArrowRight
                        size={15}
                        variant="Linear"
                        className="transition-transform duration-300 ease-editorial group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </BlurFade>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ================================================================
            4. Ceremonies — planning feature, commented out for bridal-only build
            ================================================================ */}
      {/* The ceremonies/planner section has been commented out for this
          bridal-only build. */}
      {/* <Section>
        <SectionHeader
          eyebrow="Ceremonies"
          title="Plan every celebration in one place"
          description={`Your planner currently includes ${context.events.length} events. Rename them, remove the ones you are not holding, or add your own.`}
          action={{ label: 'Open your events', href: routes.planningEvents }}
        />

        <ol className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {context.events.slice(0, 6).map((event) => (
            <li key={event.id} className="bg-background p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl text-ink">{event.name}</h3>
                {event.optional ? <Badge variant="outline">Optional</Badge> : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{event.summary}</p>
              <p className="mt-4 text-2xs uppercase tracking-eyebrow text-ink-muted">
                Typically {event.typicalOffsetDays > 0 ? `${event.typicalOffsetDays} days before` : 'after the ceremony'}
                {' · '}
                {event.setting.replace('-', ' ')}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-editorial text-xs leading-relaxed text-ink-muted">
          {context.guidance[0]?.title ? <strong className="text-ink-soft">{context.guidance[0].title}. </strong> : null}
          {context.guidance[0]?.body ??
            'Every event here is a starting point. Nothing is assumed about how you practise.'}
        </p>
      </Section> */}

      {/* ================================================================
          5. Bridal collections — product rail
          ================================================================ */}
      {products && bridalProducts.length > 0 ? (
        <Section tone="deep">
          <SectionHeader
            eyebrow="The bridal edit"
            title="Pieces chosen for how they behave on the day"
            description="Fabric that moves, construction that survives a long ceremony, and pricing shown honestly — including where a piece is priced on enquiry."
            action={{ label: 'All bridal', href: routes.collectionsBridal }}
          />
          <ul className="rail mt-12 -mx-5 gap-6 px-5 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {bridalProducts.slice(0, 4).map((product, index) => (
              <li key={product.id} className="w-[68%] shrink-0 sm:w-[46%] lg:w-auto">
                <BlurFade delay={0.15 + index * 0.1} inView className="h-full">
                  <ProductCard product={product} priority={index < 2} />
                </BlurFade>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ================================================================
            6. Vendor discovery — commented out for bridal-only build
            ================================================================ */}
      {/* <Section>
        <SectionHeader
          eyebrow="Vendors"
          title="Wedding professionals who understand your traditions"
          description="Filter by the ceremonies you are holding. Verification tells you a business is real; we do not publish ratings we cannot stand behind."
          action={{ label: 'Browse all vendors', href: routes.vendors }}
        />

        {vendors && vendors.items.length > 0 ? (
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.items.map((vendor, index) => (
              <li key={vendor.id}>
                <VendorCard vendor={vendor} priority={index === 0} />
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="mt-12 flex flex-wrap gap-2">
          {VENDOR_CATEGORIES.slice(0, 12).map((category) => (
            <li key={category.id}>
              <Link
                to={routes.vendorCategory(category.slug)}
                className="block border border-border px-3.5 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section> */}

      {/* ================================================================
            7. Planning preview — commented out for bridal-only build
            ================================================================ */}
      {/* <PlanningPreviewSection /> */}

      {/* ================================================================
          8. Editorial
          ================================================================ */}
      {articles && articles.length > 0 ? (
        <Section tone="deep">
          <SectionHeader
            eyebrow="Reading"
            title="Guidance, explainers and real weddings"
            description="Written for couples planning across traditions, and for guests who want to know what to expect."
            action={{ label: 'All inspiration', href: routes.inspiration }}
          />

          <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <Link to={routes.inspirationArticle(articles[0].slug)} className="group block">
                <MediaZoom>
                  <MediaImage
                    mediaKey={articles[0].heroMediaKey}
                    aspect="wide"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                </MediaZoom>
                <p className="eyebrow mt-5">
                  {articles[0].author} · {articles[0].readingMinutes} min read
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{articles[0].title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{articles[0].standfirst}</p>
              </Link>
            </article>

            <ul className="space-y-8 lg:col-span-5">
              {articles.slice(1, 3).map((article) => (
                <li key={article.id} className="border-t border-border pt-6">
                  <Link to={routes.inspirationArticle(article.slug)} className="group flex gap-5">
                    <MediaImage
                      mediaKey={article.heroMediaKey}
                      aspect="square"
                      sizes="112px"
                      className="w-24 shrink-0"
                    />
                    <span>
                      <p className="eyebrow">{article.readingMinutes} min read</p>
                      <h3 className="mt-1.5 font-display text-lg leading-snug text-ink">{article.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{article.standfirst}</p>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* ================================================================
          9. Retailer ecosystem
          ================================================================ */}
      <Section>
        <EditorialSplit
          media={<MediaImage mediaKey="groom-business" aspect="editorial" sizes="(min-width: 1024px) 45vw, 100vw" />}
          eyebrow="For businesses"
          title="A shopfront built for bridal retail"
          body="Publish made-to-measure pieces without publishing a price, receive enquiries with the customer's city and event date attached, and declare the traditions your atelier actually works with. Applications are reviewed by our retail team."
          action={{ label: 'Become a retailer', href: routes.retailers }}
        />

        <BentoGrid className="mt-14">
          <BentoCard
            name="Enquiries, not just clicks"
            Icon={MessageText1}
            description="Every enquiry arrives with the piece, the customer’s city and their wedding date, so you can answer properly."
            href={routes.retailers}
            cta="How enquiries work"
            className="md:col-span-1"
          />
          <BentoCard
            name="Price on enquiry where you need it"
            Icon={Eye}
            description="Made-to-measure pieces can be listed without a published price, and appear in every price filter as a result."
            href={routes.retailers}
            cta="Listing pieces"
            className="md:col-span-1"
          />
          <BentoCard
            name="Declare your traditions"
            Icon={Heart}
            description="Tell couples which ceremonies you have worked before, and appear when they filter for them."
            href={routes.retailers}
            cta="Add your atelier"
            className="md:col-span-1"
          />
        </BentoGrid>
      </Section>

      {/* ================================================================
          10. Closing CTA — full-bleed image with one decision
          ================================================================ */}
      <section className="border-t border-border">
        <div className="container">
          <div className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
            <div>
              <p className="eyebrow mb-4">Start where you are</p>
              <h2 className="text-display-sm text-ink lg:text-display-md">
                Pick your wedding context and the whole platform changes with it
              </h2>
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-ink-soft">
                Collections, edits and inspiration written around your traditions. Change your mind at any
                time — nothing is locked in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ShimmerButton
                  asChild
                  className="px-7 py-3.5 text-sm"
                  background="hsl(var(--rose))"
                >
                  <Link to={routes.collectionsBridal}>Shop bridal</Link>
                </ShimmerButton>
                <Button asChild variant="outline" size="lg">
                  <Link to={routes.inspiration}>Read inspiration</Link>
                </Button>
              </div>
            </div>
            <MediaImage
              mediaKey="hero-silhouette"
              aspect="editorial"
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="hidden lg:block"
            />
          </div>
        </div>
      </section>
    </>
  );
}

/* ==========================================================================
   Sections with local state
   ========================================================================== */

/** Shown until a wedding context is chosen. */
function WeddingContextSection() {
  const [selection, setSelection] = useState<FaithSelection>({
    faith: null,
    secondaryFaiths: [],
    customFaithLabel: '',
  });
  const setFaith = useWeddingStore((s) => s.setFaith);
  const updateProfile = useWeddingStore((s) => s.updateProfile);

  function apply() {
    updateProfile({
      secondaryFaiths: selection.secondaryFaiths,
      customFaithLabel: selection.customFaithLabel,
    });
    setFaith(selection.faith, { reseedEvents: true });
  }

  return (
    <Section id="wedding-context">
      <SectionHeader
        eyebrow="Your wedding, your way"
        title="What kind of wedding are you planning?"
        description="Choose the tradition closest to your wedding. This is the one question that changes the entire platform — and you can change the answer whenever you like."
      />
      <div className="mt-10">
        <FaithChooser
          value={selection}
          onChange={setSelection}
          onConfirm={apply}
          confirmLabel="Personalise the site"
          compact
        />
      </div>
    </Section>
  );
}

/** Shown once a context is active: a summary, not a second chooser. */
function ActiveContextSection() {
  const context = useWeddingContext();
  const openFaithPicker = useUIStore((s) => s.openFaithPicker);
  const faith = useWeddingStore((s) => s.profile.faith);

  return (
    <Section id="wedding-context" tone="muted">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">Your wedding context</p>
          <h2 className="text-display-sm text-ink">{context.label}</h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
            {context.isMultiTradition
              ? `You are planning across ${context.combined.length} traditions. Events, tasks and vendors are drawn from all of them.`
              : context.primary.introduction.split('. ')[0] + '.'}
          </p>
        </div>
        <Button variant="outline" onClick={() => openFaithPicker('header')}>
          Change wedding context
        </Button>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        {faith ? <FaithBadge faith={faith} prefix="Primary" /> : null}
        {context.combined.slice(1).map((config) => (
          <FaithBadge key={config.id} faith={config.id} prefix="Also" />
        ))}
        <span className="text-2xs uppercase tracking-eyebrow text-ink-muted">
          {context.events.length} ceremonies
        </span>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
        {context.guidance.slice(0, 2).map((note) => (
          <div key={note.title} className="bg-background p-5">
            <h3 className="text-sm font-medium text-ink">{note.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{note.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * The planning preview section has been commented out for this bridal-only build.
 */
/*
function PlanningPreviewSection() {
  const context = useWeddingContext();
  const tasks = useWeddingStore((s) => s.tasks);
  const toggleTask = useWeddingStore((s) => s.toggleTask);
  const syncTasks = useWeddingStore((s) => s.syncTasks);
  const progress = useWeddingStore(selectTaskProgress);

  const preview = tasks.slice(0, 5);

  return (
    <Section tone="muted">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-3">Planning</p>
          <h2 className="text-display-sm text-ink">A checklist that matches your ceremonies</h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
            {tasks.length > 0
              ? `${formatCount(tasks.length, 'task')} seeded from your ${context.label} context, spread across a twelve-month timeline. Tick one here and it updates in your planner.`
              : 'Choose your wedding context and we will seed a timeline with the tasks your ceremonies actually need.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to={routes.planning}>Open your wedding plan</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={routes.planningChecklist}>View the checklist</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          {tasks.length === 0 ? (
            <div className="border border-dashed border-border p-8">
              <p className="font-display text-xl text-ink">No tasks yet</p>
              <p className="mt-2 text-sm text-ink-soft">
                Your checklist is generated from the traditions you select, so it starts empty.
              </p>
              <Button className="mt-5" variant="outline" onClick={syncTasks}>
                Generate from my context
              </Button>
            </div>
          ) : (
            <div className="border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="eyebrow">Checklist</span>
                <span className="text-sm text-ink">
                  {progress.done} of {progress.total}
                </span>
              </div>
              <Progress value={progress.percent} className="rounded-none" aria-label="Checklist progress" />
              <ul className="divide-y divide-border">
                {preview.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-pressed={task.completed}
                      className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
                    >
                      <span
                        aria-hidden="true"
                        className={
                          task.completed
                            ? 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-ink text-ivory'
                            : 'mt-0.5 h-5 w-5 shrink-0 border border-input'
                        }
                      >
                        {task.completed ? <TickCircle size={16} variant="Bold" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={
                            task.completed ? 'block text-sm text-ink-muted line-through' : 'block text-sm text-ink'
                          }
                        >
                          {task.title}
                        </span>
                        {task.dueDate ? (
                          <span className="mt-0.5 block text-xs text-ink-muted">
                            Due {formatDate(task.dueDate, 'short')}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border px-5 py-3.5">
                <Link to={routes.planningChecklist} className="text-xs font-medium text-ink link-quiet">
                  See all {tasks.length} tasks
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
*/

