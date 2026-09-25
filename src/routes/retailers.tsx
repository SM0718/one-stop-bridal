import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { DocumentUpload, TickCircle } from 'iconsax-react';
import { type z } from 'zod';
import { FAITH_IDS, type FaithId, type ProductCategoryId } from '@/types';
import { retailerApplicationSchema } from '@/lib/validations';
import { PRODUCT_CATEGORIES } from '@/data/categories';
import { getFaith } from '@/data/faiths';
import { routes } from '@/config/routes';
import { useSubmitApplication } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { MediaImage } from '@/components/ui/media';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Section, SectionHeader, EditorialSplit } from '@/components/editorial/Section';
import { SplitText } from '@/components/reactbits';
import { useAuthStore } from '@/stores/auth';

type ApplicationValues = z.input<typeof retailerApplicationSchema>;

/* ==========================================================================
   Landing
   ========================================================================== */

export function RetailersLandingPage() {
  useDocumentMeta({
    title: 'Become a retailer',
    description:
      'List your bridal, groom or jewellery business on a platform built for weddings across faiths. Publish products, receive enquiries and declare the traditions you serve.',
    canonicalPath: routes.retailers,
  });

  return (
    <>
      <div className="container pt-10 lg:pt-14">
        <PageHeader
          eyebrow="For businesses"
          title="Sell to couples who are ready to book"
          standfirst="A shopfront built for bridal retail: made-to-measure pieces, enquiry-led pricing, and couples who have already chosen their wedding context — so your work reaches the people it is actually for."
          breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Become a retailer' }]}
          actions={
            <Button asChild size="lg">
              <Link to={routes.retailersApply}>Apply to become a retailer</Link>
            </Button>
          }
        />
      </div>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <MediaImage mediaKey="editorial-pillars" aspect="editorial" priority sizes="(min-width: 1024px) 48vw, 100vw" />
          <div>
            <p className="eyebrow mb-3">Why join</p>
            <SplitText
              text="Your work, in front of the right wedding"
              tag="h2"
              splitType="words"
              className="text-display-sm text-ink"
              textAlign="left"
              threshold={0.15}
              delay={30}
              duration={1.1}
              from={{ opacity: 0, y: 30 }}
            />
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
              Most marketplaces send you everyone. Couples here tell us their wedding context before they browse, so a
              lehenga atelier is not competing with a gown house for the same search — and the enquiries you receive are
              from couples whose ceremonies you actually work with.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Publish made-to-measure pieces without publishing a price.',
                'Receive enquiries with the customer’s city and wedding date attached.',
                'Declare which traditions and ceremonies you have worked with before.',
                'Manage your catalogue, availability and profile yourself.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                  <TickCircle size={17} variant="Linear" className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="deep">
        <SectionHeader
          eyebrow="How it works"
          title="Four steps, and no listing fee while we build"
          description="We are not charging retailers during this period. Nothing about fees is hidden behind a sales conversation — the current terms are that there are none."
        />
        <ol className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Apply',
              body: 'Tell us about your business, your categories and the traditions you serve. It takes about ten minutes.',
            },
            {
              title: 'We review',
              body: 'Our retail team checks your registration and contact details. You will hear from us either way.',
            },
            {
              title: 'Add your work',
              body: 'Publish products with images, materials, sizing and your production timelines.',
            },
            {
              title: 'Receive enquiries',
              body: 'Couples contact you directly. You reply, quote and book on your own terms.',
            },
          ].map((step, index) => (
            <li key={step.title} className="bg-background p-6 lg:p-7">
              <p className="font-display text-3xl text-gold">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-display text-xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="What you can sell"
          title="Six groups, twenty-four categories"
          description="If your work does not fit neatly into one of these, say so in your application and we will add a category for it."
        />
        <ul className="mt-10 flex flex-wrap gap-2">
          {PRODUCT_CATEGORIES.map((category) => (
            <li key={category.id}>
              <span className="block border border-border px-3.5 py-2 text-[0.8125rem] text-ink-soft">
                {category.name}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <EditorialSplit
          media={<MediaImage mediaKey="groom-business" aspect="editorial" sizes="(min-width: 1024px) 45vw, 100vw" />}
          eyebrow="Trust"
          title="Verification means something specific here"
          body="A verified badge means we have checked that the business is registered and that the contact details are real. It is not a rating and it is not a recommendation, and we will not invent reviews to make a listing look busier than it is."
          action={{ label: 'Read our terms', href: routes.terms }}
        />

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8">
          <div>
            <h2 className="font-display text-2xl text-ink">Ready to apply?</h2>
            <p className="mt-2 text-sm text-ink-soft">
              You will need your business registration details and a rough idea of your product range.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={routes.retailersApply}>Apply to become a retailer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={routes.retailersLogin}>Retailer login</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ==========================================================================
   Application
   ========================================================================== */

export function RetailerApplyPage() {
  useDocumentMeta({
    title: 'Retailer application',
    description: 'Apply to list your bridal, groom, jewellery or wedding service business.',
    canonicalPath: routes.retailersApply,
  });

  const submit = useSubmitApplication();
  const navigate = useNavigate();
  const [logoName, setLogoName] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(retailerApplicationSchema),
    defaultValues: {
      categoryIds: [],
      faiths: [],
      businessType: 'designer',
      priceRange: 'premium',
      productCount: 10,
      yearsInBusiness: 1,
      logoFileName: null,
      documentFileName: null,
    },
  });

  async function onSubmit(values: ApplicationValues) {
    const parsed = retailerApplicationSchema.parse(values);
    const application = await submit.mutateAsync({
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      businessName: parsed.businessName,
      businessType: parsed.businessType,
      email: parsed.email,
      phone: parsed.phone,
      country: parsed.country,
      city: parsed.city,
      website: parsed.website,
      instagram: parsed.instagram,
      address: parsed.address,
      yearsInBusiness: parsed.yearsInBusiness,
      categoryIds: parsed.categoryIds as ProductCategoryId[],
      faiths: parsed.faiths,
      priceRange: parsed.priceRange,
      productCount: parsed.productCount,
      about: parsed.about,
      logoFileName: logoName,
      documentFileName: docName,
    });

    toast.success('Application submitted', {
      description: 'This is a demonstration build — no review is actually taking place.',
    });
    void navigate({ href: `/retailers/dashboard?application=${application.id}` });
  }

  return (
    <div className="container pt-10 lg:pt-14">
      <PageHeader
        eyebrow="Retailer application"
        title="Tell us about your business"
        standfirst="Roughly ten minutes. Everything except the file uploads is required, and you can save nothing — so have your registration details nearby."
        breadcrumbs={[
          { label: 'Home', href: routes.home },
          { label: 'Become a retailer', href: routes.retailers },
          { label: 'Apply' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 max-w-4xl space-y-14 pb-section">
        {/* Contact */}
        <fieldset className="space-y-6">
          <legend className="font-display text-2xl text-ink">Contact</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" htmlFor="app-first" required error={errors.firstName?.message}>
              <Input id="app-first" {...register('firstName')} autoComplete="given-name" />
            </Field>
            <Field label="Last name" htmlFor="app-last" required error={errors.lastName?.message}>
              <Input id="app-last" {...register('lastName')} autoComplete="family-name" />
            </Field>
            <Field label="Email" htmlFor="app-email" required error={errors.email?.message}>
              <Input id="app-email" type="email" {...register('email')} autoComplete="email" />
            </Field>
            <Field label="Phone or WhatsApp" htmlFor="app-phone" required error={errors.phone?.message}>
              <Input id="app-phone" {...register('phone')} autoComplete="tel" />
            </Field>
          </div>
        </fieldset>

        {/* Business */}
        <fieldset className="space-y-6 border-t border-border pt-10">
          <legend className="font-display text-2xl text-ink">Your business</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name" htmlFor="app-business" required error={errors.businessName?.message}>
              <Input id="app-business" {...register('businessName')} />
            </Field>

            <Field label="Business type" htmlFor="app-type" required error={errors.businessType?.message}>
              <Controller
                control={control}
                name="businessType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="app-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="boutique">Boutique</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="atelier">Atelier</SelectItem>
                      <SelectItem value="tailor">Tailor</SelectItem>
                      <SelectItem value="jeweller">Jeweller</SelectItem>
                      <SelectItem value="service">Service business</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field label="Country" htmlFor="app-country" required error={errors.country?.message}>
              <Input id="app-country" {...register('country')} autoComplete="country-name" />
            </Field>

            <Field label="City" htmlFor="app-city" required error={errors.city?.message}>
              <Input id="app-city" {...register('city')} autoComplete="address-level2" />
            </Field>

            <Field label="Website" htmlFor="app-website" hint="Optional. Include https://" error={errors.website?.message}>
              <Input id="app-website" {...register('website')} placeholder="https://" />
            </Field>

            <Field label="Instagram" htmlFor="app-instagram" hint="Optional." error={errors.instagram?.message}>
              <Input id="app-instagram" {...register('instagram')} placeholder="@yourstudio" />
            </Field>

            <Field label="Years in business" htmlFor="app-years" required error={errors.yearsInBusiness?.message}>
              <Input id="app-years" type="number" min={0} max={200} {...register('yearsInBusiness')} />
            </Field>

            <Field
              label="Number of products"
              htmlFor="app-products"
              required
              hint="A rough figure for the first listing."
              error={errors.productCount?.message}
            >
              <Input id="app-products" type="number" min={1} {...register('productCount')} />
            </Field>
          </div>

          <Field label="Business address" htmlFor="app-address" required error={errors.address?.message}>
            <Input id="app-address" {...register('address')} autoComplete="street-address" />
          </Field>

          <Field label="About your business" htmlFor="app-about" required error={errors.about?.message}>
            <Textarea
              id="app-about"
              rows={6}
              {...register('about')}
              placeholder="What you make, how you work with clients, and how long a commission usually takes."
            />
          </Field>
        </fieldset>

        {/* Categories */}
        <fieldset className="border-t border-border pt-10">
          <legend className="font-display text-2xl text-ink">What you sell</legend>
          <div className="mt-6">
            <Controller
              control={control}
              name="categoryIds"
              render={({ field }) => (
                <div>
                  <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {PRODUCT_CATEGORIES.map((category) => {
                      const checked = field.value.includes(category.id);
                      return (
                        <li key={category.id}>
                          <Checkbox
                            id={`app-cat-${category.id}`}
                            checked={checked}
                            onCheckedChange={(next) =>
                              field.onChange(
                                next === true
                                  ? [...field.value, category.id]
                                  : field.value.filter((id) => id !== category.id),
                              )
                            }
                            label={category.name}
                          />
                        </li>
                      );
                    })}
                  </ul>
                  {errors.categoryIds ? (
                    <p role="alert" className="mt-3 text-xs text-destructive">
                      {errors.categoryIds.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>
        </fieldset>

        {/* Faiths */}
        <fieldset className="border-t border-border pt-10">
          <legend className="font-display text-2xl text-ink">Traditions you serve</legend>
          <p className="mt-3 max-w-editorial text-sm leading-relaxed text-ink-soft">
            Be honest here. Declaring a tradition you have not worked with will lead to enquiries you cannot serve, and
            couples will notice. Select everything that genuinely applies.
          </p>
          <div className="mt-6">
            <Controller
              control={control}
              name="faiths"
              render={({ field }) => (
                <div>
                  <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {FAITH_IDS.map((faithId) => {
                      const checked = field.value.includes(faithId);
                      return (
                        <li key={faithId}>
                          <Checkbox
                            id={`app-faith-${faithId}`}
                            checked={checked}
                            onCheckedChange={(next) =>
                              field.onChange(
                                next === true
                                  ? ([...field.value, faithId] as FaithId[])
                                  : (field.value.filter((f) => f !== faithId) as FaithId[]),
                              )
                            }
                            label={getFaith(faithId).name}
                          />
                        </li>
                      );
                    })}
                  </ul>
                  {errors.faiths ? (
                    <p role="alert" className="mt-3 text-xs text-destructive">
                      {errors.faiths.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>
        </fieldset>

        {/* Pricing & files */}
        <fieldset className="space-y-6 border-t border-border pt-10">
          <legend className="font-display text-2xl text-ink">Pricing and documents</legend>

          <Field label="Price range" htmlFor="app-price" required error={errors.priceRange?.message}>
            <Controller
              control={control}
              name="priceRange"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="app-price">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget friendly</SelectItem>
                    <SelectItem value="mid">Mid range</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <FileField
              id="app-logo"
              label="Business logo"
              hint="Optional. PNG or SVG, at least 512px."
              fileName={logoName}
              onChange={setLogoName}
            />
            <FileField
              id="app-doc"
              label="Business registration"
              hint="Optional at application. Required before approval."
              fileName={docName}
              onChange={setDocName}
            />
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <Controller
              control={control}
              name="agreeTerms"
              render={({ field }) => (
                <div>
                  <Checkbox
                    id="app-terms"
                    checked={field.value === true}
                    onCheckedChange={(next) => field.onChange(next === true ? true : undefined)}
                    label="I confirm the details above are accurate and I accept the retailer terms."
                  />
                  {errors.agreeTerms ? (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">
                      {errors.agreeTerms.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              control={control}
              name="agreeContact"
              render={({ field }) => (
                <div>
                  <Checkbox
                    id="app-contact"
                    checked={field.value === true}
                    onCheckedChange={(next) => field.onChange(next === true ? true : undefined)}
                    label="You may contact me about this application."
                  />
                  {errors.agreeContact ? (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">
                      {errors.agreeContact.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit application'}
          </Button>
          <p className="max-w-md text-xs leading-relaxed text-ink-muted">
            In this demonstration build, submitting stores your application locally and no review takes place. In a live
            build it would go to our retail team and you would receive an email confirmation.
          </p>
        </div>
      </form>
    </div>
  );
}

function FileField({
  id,
  label,
  hint,
  fileName,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  fileName: string | null;
  onChange: (name: string | null) => void;
}) {
  return (
    <div>
      <p className="text-[0.8125rem] font-medium text-ink">{label}</p>
      <label
        htmlFor={id}
        className="mt-1.5 flex cursor-pointer items-center gap-3 border border-dashed border-input bg-pearl px-4 py-3 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
      >
        <DocumentUpload size={18} variant="Linear" aria-hidden="true" />
        <span className="truncate">{fileName ?? 'Choose a file'}</span>
      </label>
      <input
        id={id}
        type="file"
        className="sr-only"
        accept="image/*,.pdf"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? null)}
      />
      <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>
    </div>
  );
}

/* ==========================================================================
   Login
   ========================================================================== */

export function RetailerLoginPage() {
  useDocumentMeta({
    title: 'Retailer login',
    description: 'Sign in to your retailer workspace.',
    canonicalPath: routes.retailersLogin,
  });

  const signIn = useAuthStore((s) => s.signIn);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="container grid gap-16 py-14 lg:grid-cols-2 lg:py-20">
      <div className="max-w-md">
        <PageHeader
          eyebrow="Retailer login"
          title="Welcome back"
          standfirst="Sign in to manage your catalogue, enquiries and business profile."
          breadcrumbs={[
            { label: 'Home', href: routes.home },
            { label: 'Become a retailer', href: routes.retailers },
            { label: 'Login' },
          ]}
        />

        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email.trim() || password.length < 8) {
              setError('Enter your email and a password of at least 8 characters.');
              return;
            }
            setError('');
            await signIn(email.trim(), 'Meera');
            toast.success('Signed in', {
              description: 'Demo session — no credentials were checked or sent anywhere.',
            });
            void navigate({ href: routes.retailersDashboard });
          }}
        >
          <Field label="Work email" htmlFor="login-email" required>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="studio@example.com"
            />
          </Field>

          <Field label="Password" htmlFor="login-password" required error={error || undefined}>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>

          <Button type="submit" size="lg" full>
            Sign in
          </Button>

          <p className="text-xs leading-relaxed text-ink-muted">
            This is a demonstration build. Authentication is simulated locally: no credentials are transmitted, verified
            or stored on a server, and any email and password combination will sign you in.
          </p>

          <p className="border-t border-border pt-5 text-sm text-ink-soft">
            Not a retailer yet?{' '}
            <Link to={routes.retailersApply} className="link-quiet text-ink">
              Apply to join
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block">
        <MediaImage mediaKey="groom-business" aspect="editorial" sizes="48vw" className="lg:aspect-[4/5]" />
      </div>
    </div>
  );
}
