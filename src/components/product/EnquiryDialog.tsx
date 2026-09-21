import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { type z } from 'zod';
import { enquirySchema } from '@/lib/validations';
import { delay } from '@/lib/api/client';
import { useWeddingStore } from '@/stores/wedding';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

type EnquiryValues = z.input<typeof enquirySchema>;

/**
 * Enquiry form.
 *
 * Works for both priced and enquiry-only pieces. Submission is local: nothing
 * is sent anywhere, which the confirmation says plainly rather than implying a
 * message has reached the retailer.
 */
export function EnquiryDialog({
  open,
  onOpenChange,
  productName,
  retailerName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  retailerName: string;
}) {
  const weddingDate = useWeddingStore((s) => s.profile.weddingDate);
  const city = useWeddingStore((s) => s.profile.city);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city,
      eventDate: weddingDate ?? '',
      message: `I would like to ask about the ${productName}.`,
      channel: 'form',
      consent: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        email: '',
        phone: '',
        city,
        eventDate: weddingDate ?? '',
        message: `I would like to ask about the ${productName}.`,
        channel: 'form',
        consent: undefined,
      });
    }
  }, [open, reset, city, weddingDate, productName]);

  async function onSubmit() {
    await delay(undefined);
    toast.success('Enquiry saved', {
      description: 'In this demonstration build the enquiry is not transmitted. Connect a backend to deliver it.',
    });
    onOpenChange(false);
  }

  const consent = watch('consent');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <p className="eyebrow mb-2">Enquiry</p>
          <DialogTitle>{productName}</DialogTitle>
          <DialogDescription>
            Sent to {retailerName}. Most retailers reply within two working days.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogBody className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" htmlFor="enq-name" required error={errors.name?.message}>
                <Input id="enq-name" {...register('name')} aria-invalid={Boolean(errors.name)} autoComplete="name" />
              </Field>
              <Field label="Email" htmlFor="enq-email" required error={errors.email?.message}>
                <Input
                  id="enq-email"
                  type="email"
                  {...register('email')}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone or WhatsApp" htmlFor="enq-phone" error={errors.phone?.message}>
                <Input id="enq-phone" {...register('phone')} aria-invalid={Boolean(errors.phone)} autoComplete="tel" />
              </Field>
              <Field label="City" htmlFor="enq-city" error={errors.city?.message}>
                <Input id="enq-city" {...register('city')} />
              </Field>
            </div>

            <Field
              label="Your wedding date"
              htmlFor="enq-date"
              hint="Optional. Retailers use it to advise on production timelines."
            >
              <Input id="enq-date" type="date" {...register('eventDate')} />
            </Field>

            <Field label="Message" htmlFor="enq-message" required error={errors.message?.message}>
              <Textarea id="enq-message" rows={5} {...register('message')} aria-invalid={Boolean(errors.message)} />
            </Field>

            <div>
              <Checkbox
                id="enq-consent"
                checked={consent === true}
                onCheckedChange={(checked) =>
                  setValue('consent', checked === true ? true : (undefined as never), { shouldValidate: true })
                }
                label={`I agree that One Stop Bridal may share these details with ${retailerName} so they can respond.`}
              />
              {errors.consent ? (
                <p role="alert" className="mt-1.5 text-xs text-destructive">
                  {errors.consent.message}
                </p>
              ) : null}
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : isSubmitSuccessful ? 'Sent' : 'Send enquiry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
