import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { routes } from '@/config/routes';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const POLICY_NAV = [
  { label: 'Privacy notice', to: routes.privacy },
  { label: 'Terms of use', to: routes.terms },
  { label: 'Shipping', to: routes.shipping },
  { label: 'Returns', to: routes.returns },
  { label: 'FAQ', to: routes.faq },
];

function PolicyShell({
  eyebrow,
  title,
  standfirst,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  standfirst: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="container pt-10 lg:pt-14">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        standfirst={standfirst}
        breadcrumbs={[{ label: 'Home', href: routes.home }, { label: title }]}
      />

      <div className="grid gap-12 py-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="eyebrow mb-4">Policies</h2>
          <ul className="space-y-2.5">
            {POLICY_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="link-quiet text-sm text-ink-soft hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Separator className="my-6" />
          <p className="text-xs leading-relaxed text-ink-muted">
            Last updated {updated}. Questions about any of this?{' '}
            <Link to={routes.contact} className="underline decoration-gold/50 underline-offset-2">
              Contact us
            </Link>
            .
          </p>
        </aside>

        <div className="prose-editorial max-w-editorial">{children}</div>
      </div>
    </div>
  );
}

/** Shown at the top of every policy page in this build. */
function DemoNotice() {
  return (
    <div className="mb-8 border border-dashed border-border bg-muted/40 p-4 not-prose">
      <p className="text-xs leading-relaxed text-ink-muted">
        <strong className="text-ink-soft">Demonstration notice.</strong> This build has no backend, no payment
        processing and no user accounts on a server. The policies below describe how a live platform would operate and
        are written as such.
      </p>
    </div>
  );
}

/* ==========================================================================
   Privacy
   ========================================================================== */

export function PrivacyPage() {
  useDocumentMeta({
    title: 'Privacy notice',
    description: 'What we collect, why, how long we keep it, and how to have it deleted.',
    canonicalPath: routes.privacy,
  });

  return (
    <PolicyShell
      eyebrow="Legal"
      title="Privacy notice"
      standfirst="We ask for as little as possible, and only what the planner, your recommendations and an enquiry actually need."
      updated="14 March 2025"
    >
      <DemoNotice />

      <h2>What we collect</h2>
      <p>We collect three kinds of information, and nothing beyond them:</p>
      <ul>
        <li>
          <strong>Wedding profile.</strong> Your faith or cultural context, wedding date, city, guest count, budget
          range and style preferences. These drive your recommendations and planner.
        </li>
        <li>
          <strong>Account details.</strong> Your name, email and optional phone number, if you choose to create an
          account.
        </li>
        <li>
          <strong>Enquiries.</strong> When you contact a retailer or vendor, we pass them your name, contact details,
          city, wedding date and message so they can respond.
        </li>
      </ul>

      <h2>What we do not collect</h2>
      <p>
        We do not ask for your religion as a belief — the wedding context you select is used to personalise the
        platform, and you can leave it blank or change it at any time. We do not collect payment card details: payment
        is arranged with the retailer or vendor directly. We do not buy personal data from third parties.
      </p>

      <h2>Why we are allowed to hold it</h2>
      <p>
        We hold your wedding profile and account details to provide the service you asked for. We share enquiry details
        with a specific business only when you ask us to, which is your instruction rather than our decision. Marketing
        messages are opt-in and separate.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Wedding profile: until you delete it, or 24 months after your wedding date if you do not.</li>
        <li>Account details: until you close your account.</li>
        <li>Enquiries: 24 months, so both sides have a record of what was agreed.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can see, correct, export or delete everything we hold about you. You can do most of this yourself from your
        account, and you can ask us for the rest by writing to privacy@onestopbridal.example. We will respond within 30
        days.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        We use essential cookies for signing in and remembering your wedding context, and optional analytics to
        understand which guides are useful. Analytics is off until you turn it on in your preferences, and we never sell
        it.
      </p>

      <h2>Who we share with</h2>
      <ul>
        <li>Retailers and vendors you send an enquiry to, limited to what they need to respond.</li>
        <li>Our hosting and email providers, who process data on our instructions.</li>
        <li>Nobody else, unless the law requires it.</li>
      </ul>

      <h2>Children</h2>
      <p>
        This platform is for adults planning a wedding. We do not knowingly hold information about anyone under 18.
      </p>

      <h2>Contact</h2>
      <p>
        One Stop Bridal, privacy@onestopbridal.example. This address is illustrative in this build. If we change this
        notice in a way that affects you, we will tell you before the change takes effect.
      </p>
    </PolicyShell>
  );
}

/* ==========================================================================
   Terms
   ========================================================================== */

export function TermsPage() {
  useDocumentMeta({
    title: 'Terms of use',
    description: 'The terms under which you use One Stop Bridal.',
    canonicalPath: routes.terms,
  });

  return (
    <PolicyShell
      eyebrow="Legal"
      title="Terms of use"
      standfirst="What you can expect from us, and what we expect from you."
      updated="14 March 2025"
    >
      <DemoNotice />

      <h2>What we are</h2>
      <p>
        One Stop Bridal is a marketplace and planning platform. We introduce couples to retailers and wedding
        professionals. We are not a party to any contract you make with a business listed on the platform, and we do not
        take payment on their behalf.
      </p>

      <h2>Our role in your purchase</h2>
      <p>
        When you order from or book a retailer, the contract is between you and them. They are responsible for the
        goods or services, including quality, timelines, fit and any refunds. We are responsible for how the platform
        presents them — for example, we must not describe a business as verified unless we have checked it.
      </p>

      <h2>Accuracy of listings</h2>
      <p>
        Retailers and vendors supply their own product details, prices, availability and timelines. We ask them to keep
        these accurate but we cannot guarantee them. Prices quoted on enquiry are estimates until confirmed in writing by
        the business.
      </p>

      <h2>Verification</h2>
      <p>
        A verified badge means we have checked that a business is registered and that its contact details reach a real
        person. It is not a rating, a quality guarantee or a recommendation.
      </p>

      <h2>Your account</h2>
      <p>
        Keep your password to yourself and tell us if you think someone else has access. You are responsible for what
        happens under your account.
      </p>

      <h2>Content and imagery</h2>
      <p>
        Photography, guides and images on the platform belong to us or to the businesses that supplied them, and may not
        be reused commercially without permission. Where you send us images or text, you confirm you have the right to
        share them and you allow us to display them on the platform.
      </p>

      <h2>Reviews and ratings</h2>
      <p>
        We do not publish ratings or reviews unless we hold verifiable customer feedback for that business. Where we
        hold none, the interface says so rather than showing a placeholder score.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not scrape, copy or resell listings or imagery.</li>
        <li>Do not post anything unlawful, misleading or harmful to others.</li>
        <li>Do not impersonate a business or another person.</li>
      </ul>

      <h2>Changes</h2>
      <p>
        We may update these terms. Material changes will be told to you before they take effect, and continuing to use
        the platform means you accept the updated terms.
      </p>

      <h2>Governing law and contact</h2>
      <p>
        These terms are governed by the law of England and Wales. Questions to hello@onestopbridal.example. Jurisdiction
        and contact details are illustrative in this build.
      </p>
    </PolicyShell>
  );
}

/* ==========================================================================
   Shipping
   ========================================================================== */

export function ShippingPage() {
  useDocumentMeta({
    title: 'Shipping',
    description: 'How bridal orders are shipped, insured and delivered, including made-to-measure timelines.',
    canonicalPath: routes.shipping,
  });

  return (
    <PolicyShell
      eyebrow="Help"
      title="Shipping"
      standfirst="Bridal orders are shipped insured and, for made-to-measure pieces, only after a final fitting."
      updated="14 March 2025"
    >
      <DemoNotice />

      <h2>Production before shipping</h2>
      <p>
        Most bridal pieces are not sitting in a warehouse. Ready-to-wear pieces dispatch within two working days.
        Made-to-measure pieces are produced first, typically over eight to twelve weeks including fittings, and only
        ship once you have approved the final fit.
      </p>

      <h2>Shipping options and costs</h2>
      <ul>
        <li>
          <strong>Standard delivery</strong> — 5 to 7 working days once the piece is ready, included in the price.
        </li>
        <li>
          <strong>Express delivery</strong> — 2 working days once ready, charged at cost.
        </li>
        <li>
          <strong>Collection from the retailer</strong> — free, and usual for made-to-measure pieces so the final
          fitting happens in person.
        </li>
      </ul>

      <h2>Insurance and tracking</h2>
      <p>
        Every order ships insured for its full value and requires a signature on delivery. Tracking is sent by the
        retailer when the piece leaves them.
      </p>

      <h2>Customs and duties</h2>
      <p>
        International orders may attract customs duty and import tax, which the recipient pays. This is calculated at
        checkout where the retailer is registered to do so; otherwise the courier collects it.
      </p>

      <h2>Delays</h2>
      <p>
        Bridal timelines are tight, so tell the retailer your wedding date at the point of enquiry rather than at
        checkout. If a delay means a piece will not arrive in time, the retailer must tell you as soon as they know, and
        you are entitled to cancel if the new date does not work.
      </p>

      <h2>Problems in transit</h2>
      <p>
        Check the parcel before signing where you can. Report damage within 48 hours so we can support a claim — contact
        the retailer first, then us if you need help.
      </p>
    </PolicyShell>
  );
}

/* ==========================================================================
   Returns
   ========================================================================== */

export function ReturnsPage() {
  useDocumentMeta({
    title: 'Returns',
    description: 'What can be returned, what cannot, and how to start a return.',
    canonicalPath: routes.returns,
  });

  return (
    <PolicyShell
      eyebrow="Help"
      title="Returns"
      standfirst="Made-to-measure pieces cannot be returned, because they are cut to your measurements. Ready-to-wear pieces can."
      updated="14 March 2025"
    >
      <DemoNotice />

      <h2>Ready-to-wear pieces</h2>
      <p>
        Return within 14 days of delivery, unworn, with all tags and packaging intact. Refunds are issued to the original
        payment method within 14 days of the retailer receiving the item.
      </p>

      <h2>Made-to-measure and personalised pieces</h2>
      <p>
        Pieces cut to your measurements, embroidered to your brief or otherwise personalised cannot be returned. This is
        standard in bridal retail and is why the fitting process matters: you approve the measurements in writing before
        cutting begins.
      </p>

      <h2>What we ask of retailers</h2>
      <ul>
        <li>Show clearly on every product page whether a piece is made to measure.</li>
        <li>Confirm measurements in writing, with your approval, before cutting.</li>
        <li>Fix genuine faults at their cost, whether or not a piece is returnable.</li>
      </ul>

      <h2>Faulty or incorrect items</h2>
      <p>
        Your statutory rights apply regardless of the above. If a piece arrives damaged, faulty or different from what
        was agreed, the retailer must repair, replace or refund it. Tell them within 30 days of discovering the problem.
      </p>

      <h2>How to start a return</h2>
      <ol>
        <li>Contact the retailer you bought from, quoting your order reference.</li>
        <li>They will confirm whether the piece is returnable and send return instructions.</li>
        <li>Send it back tracked and insured — keep the receipt until your refund lands.</li>
      </ol>

      <h2>If a retailer will not help</h2>
      <p>
        Write to us at hello@onestopbridal.example with your order details. We cannot force a business to refund you,
        but we can review whether they are meeting the standards we set, and we will remove listings that repeatedly
        fail them.
      </p>
    </PolicyShell>
  );
}

/* ==========================================================================
   FAQ
   ========================================================================== */

const FAQ_GROUPS: { title: string; items: { q: string; a: ReactNode }[] }[] = [
  {
    title: 'Weddings and faith',
    items: [
      {
        q: 'Do I have to choose a faith to use the platform?',
        a: (
          <p>
            No. You can skip the question entirely or choose “I&rsquo;ll decide later”, and browse everything without a
            filter. Choosing a context narrows what you see first; it never removes anything.
          </p>
        ),
      },
      {
        q: 'How do you handle weddings that combine two traditions?',
        a: (
          <p>
            Select Interfaith and pick the traditions you are combining. Ceremonies, planning tasks, vendor filters and
            collections are then merged from all of them at once, rather than making you choose one.
          </p>
        ),
      },
      {
        q: 'Do you assume I follow every custom you list?',
        a: (
          <p>
            No. Everything we suggest is a starting point. You can rename, reorder or delete any ceremony, and nothing
            in your plan is regenerated once you have edited it.
          </p>
        ),
      },
      {
        q: 'My tradition or region is not listed. Can I still plan here?',
        a: (
          <p>
            Yes. Choose “Other / Build your own” and add your own ceremonies with your own names. Faith configurations
            are data rather than code, so regional variations are straightforward additions.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Buying and enquiries',
    items: [
      {
        q: 'Why do some pieces show “price on enquiry” instead of a price?',
        a: (
          <p>
            Because most bridal commissions are priced to the client. A made-to-measure lehenga depends on embroidery
            hours, fabric and stone count, so the honest answer is a quote rather than a number. Enquiry-only pieces
            appear in every price filter as a result.
          </p>
        ),
      },
      {
        q: 'How do enquiries reach a business?',
        a: (
          <p>
            Your enquiry goes to that business only, with the details you provided so they can respond sensibly. We do
            not sell leads, and we do not take a commission on enquiries.
          </p>
        ),
      },
      {
        q: 'Do you take payment?',
        a: (
          <p>
            No. Payment is arranged with the retailer or vendor directly. That keeps the contract — and the
            responsibility for quality, timelines and refunds — with the business you actually hired.
          </p>
        ),
      },
      {
        q: 'Are the ratings real?',
        a: (
          <p>
            There are no ratings on this platform. We publish reviews only where we hold verifiable customer feedback,
            and we do not yet have it for the businesses listed here. Instead we show whether a business is verified,
            which is a statement about registration and contact details only.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Planning tools',
    items: [
      {
        q: 'Where is my wedding plan stored?',
        a: (
          <p>
            On this device, in your browser, until you sign in — at which point it follows your account. In this
            demonstration build nothing is sent to a server.
          </p>
        ),
      },
      {
        q: 'Can I print my checklist?',
        a: (
          <p>
            Yes. The checklist page has a print action that formats the list without the site navigation, which is handy
            for sharing with family.
          </p>
        ),
      },
      {
        q: 'Can I share my plan with a planner or family member?',
        a: (
          <p>
            Not yet. Sharing a read-only view of the plan is on the roadmap; today you can print the checklist and the
            guest list.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Retailers and vendors',
    items: [
      {
        q: 'How do I list my business?',
        a: (
          <p>
            Apply from the{' '}
            <Link to={routes.retailersApply}>retailer application</Link>. Our team checks your registration and contact
            details, and you will hear from us either way. There is currently no listing fee.
          </p>
        ),
      },
      {
        q: 'What does verification involve?',
        a: (
          <p>
            A check that the business is registered and that the contact details reach a real person. It is not a
            quality endorsement, and we say so wherever the badge appears.
          </p>
        ),
      },
      {
        q: 'Can I list pieces without publishing a price?',
        a: (
          <p>
            Yes. Set availability to “Price on enquiry” and the piece displays without a figure. It will still appear in
            searches and filters.
          </p>
        ),
      },
    ],
  },
];

export function FaqPage() {
  useDocumentMeta({
    title: 'Frequently asked questions',
    description: 'Answers about faith contexts, enquiries, planning tools and listing a business.',
    canonicalPath: routes.faq,
  });

  return (
    <div className="container pt-10 lg:pt-14">
      <PageHeader
        eyebrow="Help"
        title="Questions people ask"
        standfirst="If something is not here, write to us — we add the answers people actually need."
        breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'FAQ' }]}
      />

      <div className="max-w-3xl space-y-12 py-12">
        {FAQ_GROUPS.map((group) => (
          <section key={group.title} aria-labelledby={`faq-${group.title}`}>
            <h2 id={`faq-${group.title}`} className="eyebrow mb-2">
              {group.title}
            </h2>
            <Accordion type="single" collapsible className="border-t border-border">
              {group.items.map((item, index) => (
                <AccordionItem key={item.q} value={`${group.title}-${index}`}>
                  <AccordionTrigger headingLevel={2}>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        <div className="border-t border-border pt-8">
          <h2 className="font-display text-2xl text-ink">Still stuck?</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Send us the detail and we will answer properly, or point you to the person who can.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link to={routes.contact}>Contact us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={routes.shipping}>Shipping and returns</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
