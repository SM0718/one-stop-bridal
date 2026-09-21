import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Call, Location, MessageText1, Sms } from 'iconsax-react';
import { type z } from 'zod';
import { contactSchema } from '@/lib/validations';
import { routes } from '@/config/routes';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaImage } from '@/components/ui/media';
import { Section, SectionHeader } from '@/components/editorial/Section';

type ContactValues = z.input<typeof contactSchema>;

const SUBJECTS = [
  { value: 'general', label: 'General enquiry' },
  { value: 'retailer', label: 'Retailer or vendor enquiry' },
  { value: 'support', label: 'Help with my account or plan' },
  { value: 'press', label: 'Press' },
  { value: 'privacy', label: 'Privacy or data request' },
] as const;

export function ContactPage() {
  useDocumentMeta({
    title: 'Contact',
    description: 'Get in touch about your wedding plan, a retailer application, or a privacy request.',
    canonicalPath: routes.contact,
  });

  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: 'general' },
  });

  return (
    <>
      <div className="container pt-10 lg:pt-14">
        <PageHeader
          eyebrow="Contact"
          title="Talk to us"
          standfirst="Questions about planning, a retailer application, or your data. We read everything that comes in and reply within two working days."
          breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Contact' }]}
        />
      </div>

      <div className="container py-12 lg:py-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_20rem] lg:gap-20">
          <form
            className="max-w-2xl space-y-6"
            onSubmit={handleSubmit(async () => {
              await new Promise((r) => setTimeout(r, 400));
              setSent(true);
              reset();
              toast.success('Message recorded', {
                description: 'This build does not send messages anywhere. Connect a backend to deliver it.',
              });
            })}
            noValidate
          >
            {sent ? (
              <div className="border border-border bg-muted/40 p-5" role="status">
                <p className="font-display text-xl text-ink">Thank you — that came through</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  In a live build this would reach our team and you would get a reply at the email you gave. Nothing was
                  actually transmitted here, because this is a demonstration build.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" htmlFor="contact-name" required error={errors.name?.message}>
                <Input id="contact-name" {...register('name')} autoComplete="name" />
              </Field>
              <Field label="Email" htmlFor="contact-email" required error={errors.email?.message}>
                <Input id="contact-email" type="email" {...register('email')} autoComplete="email" />
              </Field>
            </div>

            <Field label="What is this about" htmlFor="contact-subject" required error={errors.subject?.message}>
              <Controller
                control={control}
                name="subject"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="contact-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Message"
              htmlFor="contact-message"
              required
              error={errors.message?.message}
              hint="If you are writing about a specific piece or business, include its name or code."
            >
              <Textarea id="contact-message" rows={7} {...register('message')} />
            </Field>

            <Controller
              control={control}
              name="consent"
              render={({ field }) => (
                <div>
                  <Checkbox
                    id="contact-consent"
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                    label="You may reply to the email address I have given."
                  />
                  {errors.consent ? (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">
                      {errors.consent.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send message'}
            </Button>

            <p className="text-xs leading-relaxed text-ink-muted">
              We use what you send only to answer you. Read the{' '}
              <Link to={routes.privacy} className="underline decoration-gold/50 underline-offset-2">
                privacy notice
              </Link>{' '}
              for how long we keep it and how to have it deleted.
            </p>
          </form>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border p-6">
              <h2 className="eyebrow mb-4">Other ways to reach us</h2>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href="mailto:hello@onestopbridal.example" className="flex items-start gap-3 text-ink">
                    <Sms size={17} variant="Linear" className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
                    <span>
                      hello@onestopbridal.example
                      <span className="mt-0.5 block text-xs text-ink-muted">General and press</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="mailto:retail@onestopbridal.example" className="flex items-start gap-3 text-ink">
                    <Sms size={17} variant="Linear" className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
                    <span>
                      retail@onestopbridal.example
                      <span className="mt-0.5 block text-xs text-ink-muted">Retailer and vendor enquiries</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="tel:+912200000000" className="flex items-start gap-3 text-ink">
                    <Call size={17} variant="Linear" className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
                    <span>
                      +91 22 0000 0000
                      <span className="mt-0.5 block text-xs text-ink-muted">Monday to Friday, 10:00–18:00 IST</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/910000000000"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-start gap-3 text-ink"
                  >
                    <MessageText1 size={17} variant="Linear" className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
                    <span>
                      WhatsApp
                      <span className="mt-0.5 block text-xs text-ink-muted">For quick questions</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="border border-border p-6">
              <h2 className="eyebrow mb-3">Studio</h2>
              <p className="flex items-start gap-3 text-sm text-ink-soft">
                <Location size={17} variant="Linear" className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
                <span>
                  One Stop Bridal
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    Visits by appointment only. This address is illustrative.
                  </span>
                </span>
              </p>
            </div>

            <MediaImage mediaKey="worship-house" aspect="editorial" sizes="320px" />
          </aside>
        </div>
      </div>

      <Section tone="deep">
        <SectionHeader
          eyebrow="Before you write"
          title="These might answer it faster"
          description="Most messages we receive are about one of four things."
        />
        <ul className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {[
            { label: 'How do enquiries reach a retailer?', to: routes.faq },
            { label: 'How do I become a retailer?', to: routes.retailers },
            { label: 'How do shipping and returns work?', to: routes.shipping },
            { label: 'What do you do with my wedding details?', to: routes.privacy },
          ].map((item) => (
            <li key={item.label} className="bg-background p-5">
              <Link to={item.to} className="font-display text-lg text-ink link-quiet">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
