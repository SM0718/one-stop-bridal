import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Trash } from 'iconsax-react';
import { type z } from 'zod';
import type { Guest } from '@/types';
import { guestSchema } from '@/lib/validations';
import { routes } from '@/config/routes';
import { selectGuestTotals, useWeddingStore } from '@/stores/wedding';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatCount } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';

type GuestValues = z.input<typeof guestSchema>;

const SIDES = [
  { value: 'bride', label: "Bride's side" },
  { value: 'groom', label: "Groom's side" },
  { value: 'shared', label: 'Shared' },
] as const;

const RSVP_LABEL: Record<Guest['rsvp'], string> = {
  pending: 'Awaiting reply',
  attending: 'Attending',
  declined: 'Declined',
};

export function PlanningGuestsPage() {
  useDocumentMeta({
    title: 'Guest list',
    description: 'Build and manage your wedding guest list with RSVP status, sides and dietary requirements.',
    canonicalPath: routes.planningGuests,
  });

  const guests = useWeddingStore((s) => s.guests);
  const events = useWeddingStore((s) => s.events);
  const addGuest = useWeddingStore((s) => s.addGuest);
  const updateGuest = useWeddingStore((s) => s.updateGuest);
  const removeGuest = useWeddingStore((s) => s.removeGuest);
  const totals = useWeddingStore(selectGuestTotals);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [search, setSearch] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');

  const filtered = useMemo(
    () =>
      guests.filter((guest) => {
        if (sideFilter !== 'all' && guest.side !== sideFilter) return false;
        if (rsvpFilter !== 'all' && guest.rsvp !== rsvpFilter) return false;
        if (search.trim()) {
          const term = search.trim().toLowerCase();
          if (![guest.name, guest.city, guest.email].join(' ').toLowerCase().includes(term)) return false;
        }
        return true;
      }),
    [guests, sideFilter, rsvpFilter, search],
  );

  const dietaryNotes = guests.filter((g) => g.dietary.trim().length > 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Guest list</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {guests.length === 0
              ? 'Add guests with the side they belong to and their RSVP status. Plus-ones count towards your catering and seating numbers.'
              : `${formatCount(totals.invited, 'person', 'people')} invited including plus-ones, ${totals.attending} confirmed.`}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Add size={16} variant="Linear" />
          Add guest
        </Button>
      </div>

      {guests.length > 0 ? (
        <>
          <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Invited', value: totals.invited },
              { label: 'Attending', value: totals.attending },
              { label: 'Awaiting reply', value: totals.pending },
              { label: 'Declined', value: totals.declined },
            ].map((item) => (
              <div key={item.label} className="bg-background p-5">
                <dt className="eyebrow">{item.label}</dt>
                <dd className="mt-1.5 font-display text-2xl text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-end gap-4">
            <Field label="Search" htmlFor="guest-search" className="w-full sm:w-64">
              <Input
                id="guest-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, city or email"
              />
            </Field>
            <Field label="Side" htmlFor="guest-side" className="w-full sm:w-44">
              <Select value={sideFilter} onValueChange={setSideFilter}>
                <SelectTrigger id="guest-side">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sides</SelectItem>
                  {SIDES.map((side) => (
                    <SelectItem key={side.value} value={side.value}>
                      {side.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="RSVP" htmlFor="guest-rsvp-filter" className="w-full sm:w-44">
              <Select value={rsvpFilter} onValueChange={setRsvpFilter}>
                <SelectTrigger id="guest-rsvp-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All replies</SelectItem>
                  <SelectItem value="attending">Attending</SelectItem>
                  <SelectItem value="pending">Awaiting reply</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </>
      ) : null}

      {guests.length === 0 ? (
        <EmptyState
          title="No guests yet"
          description="Start with immediate family and the wedding party, then add in groups. You can change anyone's RSVP as replies come in."
          action={<Button onClick={() => setDialogOpen(true)}>Add your first guest</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No guests match"
          description="Try a different search or clear the filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setSideFilter('all');
                setRsvpFilter('all');
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <caption className="sr-only">Wedding guest list</caption>
            <thead className="border-b border-border">
              <tr className="eyebrow">
                <th scope="col" className="py-3 pr-4 font-normal">
                  Guest
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Side
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  City
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Plus-ones
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Reply
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((guest) => (
                <tr key={guest.id} className="align-top">
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(guest);
                        setDialogOpen(true);
                      }}
                      className="text-left font-medium text-ink hover:underline"
                    >
                      {guest.name}
                    </button>
                    {guest.dietary ? (
                      <p className="mt-1 text-xs text-ink-muted">Dietary: {guest.dietary}</p>
                    ) : null}
                  </td>
                  <td className="py-4 pr-4 text-ink-soft">
                    {SIDES.find((s) => s.value === guest.side)?.label}
                  </td>
                  <td className="py-4 pr-4 text-ink-soft">{guest.city || '—'}</td>
                  <td className="py-4 pr-4 text-ink-soft">{guest.plusOnes || '—'}</td>
                  <td className="py-4 pr-4">
                    <label className="sr-only" htmlFor={`rsvp-${guest.id}`}>
                      RSVP for {guest.name}
                    </label>
                    <select
                      id={`rsvp-${guest.id}`}
                      value={guest.rsvp}
                      onChange={(e) => updateGuest(guest.id, { rsvp: e.target.value as Guest['rsvp'] })}
                      className={cn(
                        'border bg-pearl px-2.5 py-1.5 text-xs focus:border-ink focus:outline-none',
                        guest.rsvp === 'attending'
                          ? 'border-ink text-ink'
                          : guest.rsvp === 'declined'
                            ? 'border-border text-ink-muted'
                            : 'border-border text-ink-soft',
                      )}
                    >
                      {(['pending', 'attending', 'declined'] as const).map((status) => (
                        <option key={status} value={status}>
                          {RSVP_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(guest);
                          setDialogOpen(true);
                        }}
                        className="text-xs text-ink-muted underline decoration-gold/50 underline-offset-2 hover:text-ink"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGuest(guest.id)}
                        aria-label={`Remove ${guest.name}`}
                        className="flex h-8 w-8 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
                      >
                        <Trash size={15} variant="Linear" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dietaryNotes.length > 0 ? (
        <section className="border-t border-border pt-8">
          <h3 className="eyebrow mb-4">Dietary requirements to pass to catering</h3>
          <ul className="space-y-2.5">
            {dietaryNotes.map((guest) => (
              <li key={guest.id} className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <span className="font-medium text-ink">{guest.name}</span>
                <span className="text-ink-soft">{guest.dietary}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            Give this list to your caterer two weeks before the wedding, and again for any ceremony with a separate menu.
            If a menu must be cooked to a religious requirement, confirm it in writing — see{' '}
            <Badge variant="outline">Catering</Badge> in the vendor directory.
          </p>
        </section>
      ) : null}

      {events.length > 0 ? (
        <section className="border-t border-border pt-8">
          <h3 className="eyebrow mb-3">Per-ceremony numbers</h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <li key={event.id} className="border border-border p-4">
                <p className="text-sm font-medium text-ink">{event.name}</p>
                <p className="mt-1.5 text-xs text-ink-muted">
                  {event.guestCount ? `${event.guestCount} guests planned` : 'Guest count not set'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <GuestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        guest={editing}
        onSubmit={(values) => {
          if (editing) {
            updateGuest(editing.id, {
              name: values.name,
              side: values.side,
              email: values.email,
              phone: values.phone,
              city: values.city ?? '',
              rsvp: values.rsvp,
              plusOnes: values.plusOnes,
              dietary: values.dietary ?? '',
              notes: values.notes ?? '',
            });
          } else {
            addGuest({
              name: values.name,
              side: values.side,
              email: values.email,
              phone: values.phone,
              city: values.city ?? '',
              invitedTo: [],
              rsvp: values.rsvp,
              plusOnes: values.plusOnes,
              dietary: values.dietary ?? '',
              notes: values.notes ?? '',
            });
          }
        }}
      />
    </div>
  );
}

function GuestDialog({
  open,
  onOpenChange,
  guest,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
  onSubmit: (values: z.output<typeof guestSchema>) => void;
}) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<GuestValues>({
    resolver: zodResolver(guestSchema),
    values: {
      name: guest?.name ?? '',
      side: guest?.side ?? 'bride',
      email: guest?.email ?? '',
      phone: guest?.phone ?? '',
      city: guest?.city ?? '',
      rsvp: guest?.rsvp ?? 'pending',
      plusOnes: guest?.plusOnes ?? 0,
      dietary: guest?.dietary ?? '',
      notes: guest?.notes ?? '',
    },
  });

  const side = watch('side');
  const rsvp = watch('rsvp');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{guest ? 'Edit guest' : 'Add a guest'}</DialogTitle>
          <DialogDescription>
            We only ask for what the list actually uses. Nothing here is shared with vendors unless you choose to.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => {
            onSubmit(values as z.output<typeof guestSchema>);
            onOpenChange(false);
          })}
          noValidate
        >
          <DialogBody className="space-y-5">
            <Field label="Name" htmlFor="guest-name" required error={formState.errors.name?.message}>
              <Input id="guest-name" {...register('name')} autoComplete="name" />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Side" htmlFor="guest-side-dialog" required>
                <Select value={side} onValueChange={(value) => setValue('side', value as Guest['side'])}>
                  <SelectTrigger id="guest-side-dialog">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIDES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Reply" htmlFor="guest-rsvp-dialog">
                <Select value={rsvp} onValueChange={(value) => setValue('rsvp', value as Guest['rsvp'])}>
                  <SelectTrigger id="guest-rsvp-dialog">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['pending', 'attending', 'declined'] as const).map((status) => (
                      <SelectItem key={status} value={status}>
                        {RSVP_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Email" htmlFor="guest-email" error={formState.errors.email?.message}>
                <Input id="guest-email" type="email" {...register('email')} autoComplete="email" />
              </Field>

              <Field label="Phone" htmlFor="guest-phone" error={formState.errors.phone?.message}>
                <Input id="guest-phone" {...register('phone')} autoComplete="tel" />
              </Field>

              <Field label="City" htmlFor="guest-city">
                <Input id="guest-city" {...register('city')} />
              </Field>

              <Field label="Plus-ones" htmlFor="guest-plus" hint="Additional seats including partners and children.">
                <Input id="guest-plus" type="number" min={0} max={10} {...register('plusOnes')} />
              </Field>
            </div>

            <Field label="Dietary requirements" htmlFor="guest-dietary" error={formState.errors.dietary?.message}>
              <Input id="guest-dietary" {...register('dietary')} placeholder="Vegetarian, no nuts…" />
            </Field>

            <Field label="Notes" htmlFor="guest-notes">
              <Textarea id="guest-notes" rows={2} {...register('notes')} />
            </Field>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{guest ? 'Save changes' : 'Add guest'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
