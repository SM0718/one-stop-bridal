import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, ArrowDown2, ArrowUp2, Calendar, Location, Trash } from 'iconsax-react';
import { type z } from 'zod';
import type { WeddingEventPlan } from '@/types';
import { eventSchema } from '@/lib/validations';
import { routes } from '@/config/routes';
import { useWeddingStore } from '@/stores/wedding';
import { useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { daysUntil, formatDate, formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Field, Input, Textarea } from '@/components/ui/input';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type EventValues = z.input<typeof eventSchema>;

export function PlanningEventsPage() {
  useDocumentMeta({
    title: 'Wedding ceremonies',
    description:
      'Add, rename, reorder or remove the ceremonies in your wedding, with dates, venues, budgets and guest counts.',
    canonicalPath: routes.planningEvents,
  });

  const context = useWeddingContext();
  const events = useWeddingStore((s) => s.events);
  const tasks = useWeddingStore((s) => s.tasks);
  const addFromTemplate = useWeddingStore((s) => s.addEventFromTemplateId);
  const addCustom = useWeddingStore((s) => s.addCustomEvent);
  const updateEvent = useWeddingStore((s) => s.updateEvent);
  const removeEvent = useWeddingStore((s) => s.removeEvent);
  const moveEvent = useWeddingStore((s) => s.moveEvent);
  const reseed = useWeddingStore((s) => s.reseedEvents);

  const [editing, setEditing] = useState<WeddingEventPlan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customName, setCustomName] = useState('');

  const usedTemplateIds = new Set(events.map((e) => e.templateId).filter(Boolean) as string[]);
  const available = context.events.filter((template) => !usedTemplateIds.has(template.id));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Ceremonies</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {events.length === 0
              ? 'You have no ceremonies yet. Add the ones you are holding, or start from the suggestions for your wedding context.'
              : `${events.length} ceremonies in ${context.label}. Rename anything — what these are called matters more than what we call them.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {available.length > 0 ? (
            <Button variant="outline" onClick={() => addFromTemplate(available[0].id)}>
              <Add size={16} variant="Linear" />
              Add {available[0].name}
            </Button>
          ) : null}
          {events.length === 0 ? <Button onClick={reseed}>Use suggested ceremonies</Button> : null}
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No ceremonies yet"
          description={`We can start you with the events commonly held for a ${context.primary.shortName} wedding, and you can remove or rename every one of them.`}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={reseed}>Add suggested ceremonies</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCustomName('');
                  addCustom(customName || 'Our ceremony');
                  setDialogOpen(false);
                }}
              >
                Add my own
              </Button>
            </div>
          }
        />
      ) : (
        <ol className="space-y-6">
          {events.map((event, index) => {
            const eventTasks = tasks.filter((t) => t.eventId === event.id);
            const done = eventTasks.filter((t) => t.completed).length;
            const days = daysUntil(event.date);

            return (
              <li key={event.id} className="border border-border">
                <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <Link
                    to={routes.planningChecklist}
                    search={{ event: event.id }}
                    aria-label={`Open the checklist for ${event.name}`}
                    className="group block min-w-0"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-xl text-ink decoration-gold/60 decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                        {event.name}
                      </h3>
                      {event.custom ? <Badge variant="outline">Yours</Badge> : null}
                      {days !== null ? (
                        <Badge variant={days < 0 ? 'muted' : 'gold'}>
                          {days > 0
                            ? `in ${days} ${days === 1 ? 'day' : 'days'}`
                            : days === 0
                              ? 'today'
                              : 'past'}
                        </Badge>
                      ) : null}
                    </div>

                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} variant="Linear" aria-hidden="true" />
                        {event.date ? formatDate(event.date, 'long') : 'No date set'}
                        {event.time ? ` at ${event.time}` : ''}
                      </span>
                      {event.venue ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Location size={13} variant="Linear" aria-hidden="true" />
                          {event.venue}
                        </span>
                      ) : null}
                      {event.guestCount ? <span>{event.guestCount} guests</span> : null}
                      {event.budget ? <span>{formatPrice(event.budget)}</span> : null}
                      <span>
                        {eventTasks.length === 0
                          ? 'No tasks attached'
                          : `${done}/${eventTasks.length} tasks done`}
                      </span>
                    </p>

                    {event.notes ? (
                      <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-ink-soft">{event.notes}</p>
                    ) : null}
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveEvent(event.id, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${event.name} earlier`}
                      className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
                    >
                      <ArrowUp2 size={16} variant="Linear" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveEvent(event.id, 1)}
                      disabled={index === events.length - 1}
                      aria-label={`Move ${event.name} later`}
                      className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
                    >
                      <ArrowDown2 size={16} variant="Linear" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(event);
                        setDialogOpen(true);
                      }}
                      className="ml-1 text-xs text-ink underline decoration-gold/50 underline-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEvent(event.id)}
                      aria-label={`Remove ${event.name}`}
                      className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
                    >
                      <Trash size={16} variant="Linear" />
                    </button>
                  </div>
                </div>

                {eventTasks.length > 0 ? (
                  <Accordion type="single" collapsible className="border-t border-border px-5">
                    <AccordionItem value="tasks" className="border-b-0">
                      <AccordionTrigger className="py-3 text-xs">Tasks for {event.name}</AccordionTrigger>
                      <AccordionContent className="pb-5 pr-0">
                        <ul className="space-y-2">
                          {eventTasks.map((task) => (
                            <li key={task.id} className="flex items-baseline gap-3 text-sm">
                              <span
                                className={cn(
                                  'h-1.5 w-1.5 shrink-0 rounded-full',
                                  task.completed ? 'bg-border' : 'bg-ink',
                                )}
                                aria-hidden="true"
                              />
                              <span className={task.completed ? 'text-ink-muted line-through' : 'text-ink-soft'}>
                                {task.title}
                              </span>
                              {task.dueDate ? (
                                <span className="text-xs text-ink-muted">{formatDate(task.dueDate, 'short')}</span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={routes.planningChecklist}
                          className="mt-4 inline-block text-xs font-medium text-ink link-quiet"
                        >
                          Manage tasks
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}

      {/* Add more */}
      <div className="grid gap-8 border-t border-border pt-8 lg:grid-cols-2">
        <section>
          <h3 className="eyebrow mb-3">Suggested for {context.label}</h3>
          {available.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Every ceremony from your wedding context is already in the plan. You can still add your own below.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {available.map((template) => (
                <li key={template.id} className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <div>
                    <p className="text-sm text-ink">{template.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{template.summary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addFromTemplate(template.id)}
                    className="shrink-0 text-xs text-ink underline decoration-gold/50 underline-offset-2"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="eyebrow mb-3">Add your own</h3>
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!customName.trim()) return;
              addCustom(customName.trim());
              setCustomName('');
            }}
          >
            <Field label="Ceremony name" htmlFor="custom-event" className="w-full sm:w-64">
              <Input
                id="custom-event"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Griha Pravesh"
                maxLength={80}
              />
            </Field>
            <Button type="submit" variant="outline">
              <Add size={16} variant="Linear" />
              Add ceremony
            </Button>
          </form>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            Any name you like. Nothing here is restricted to a preset list, which is how regional and family ceremonies
            are supported.
          </p>

          <div className="mt-8 border-t border-border pt-6">
            <h4 className="text-sm font-medium text-ink">Ritual services for your wedding</h4>
            <ul className="mt-3 space-y-2.5">
              {context.ritualServices.map((service) => (
                <li key={service.id} className="text-sm">
                  <Link
                    to={routes.vendorCategory(
                      service.vendorCategoryId === 'ritual-services' ? 'ritual-services' : service.vendorCategoryId,
                    )}
                    className="text-ink link-quiet"
                  >
                    {service.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-muted">{service.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editing}
        onSubmit={(values) => {
          if (!editing) return;
          updateEvent(editing.id, {
            name: values.name,
            date: values.date || null,
            time: values.time || null,
            venue: values.venue ?? '',
            guestCount: values.guestCount ?? null,
            budget: values.budget ?? null,
            notes: values.notes ?? '',
          });
        }}
      />
    </div>
  );
}

function EventDialog({
  open,
  onOpenChange,
  event,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: WeddingEventPlan | null;
  onSubmit: (values: z.output<typeof eventSchema>) => void;
}) {
  const { register, handleSubmit, formState } = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    values: {
      name: event?.name ?? '',
      date: event?.date ?? null,
      time: event?.time ?? '',
      venue: event?.venue ?? '',
      guestCount: event?.guestCount ?? null,
      budget: event?.budget ?? null,
      notes: event?.notes ?? '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit ceremony</DialogTitle>
          <DialogDescription>
            Set what you know. Dates and venues usually firm up late, and you can leave anything blank.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => {
            onSubmit(values as z.output<typeof eventSchema>);
            onOpenChange(false);
          })}
          noValidate
        >
          <DialogBody className="space-y-5">
            <Field label="Name" htmlFor="event-name" required error={formState.errors.name?.message}>
              <Input id="event-name" {...register('name')} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date" htmlFor="event-date">
                <Input id="event-date" type="date" {...register('date')} />
              </Field>
              <Field
                label="Start time"
                htmlFor="event-time"
                hint="24-hour, for example 18:30."
                error={formState.errors.time?.message}
              >
                <Input id="event-time" placeholder="18:30" {...register('time')} />
              </Field>
              <Field label="Guest count" htmlFor="event-guests">
                <Input id="event-guests" type="number" min={0} {...register('guestCount')} />
              </Field>
              <Field label="Budget for this ceremony" htmlFor="event-budget">
                <Input id="event-budget" type="number" min={0} step={1000} {...register('budget')} />
              </Field>
            </div>

            <Field label="Venue" htmlFor="event-venue">
              <Input id="event-venue" {...register('venue')} placeholder="Address or venue name" />
            </Field>

            <Field label="Notes" htmlFor="event-notes">
              <Textarea id="event-notes" rows={3} {...register('notes')} />
            </Field>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
