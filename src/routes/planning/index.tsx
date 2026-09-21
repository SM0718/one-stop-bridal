import { Link } from '@tanstack/react-router';
import { Calendar, Clock, Edit2, Location, TickCircle, Wallet2 } from 'iconsax-react';
import { routes } from '@/config/routes';
import {
  selectBudgetTotals,
  selectDatedEvents,
  selectGuestTotals,
  selectTaskProgress,
  useWeddingStore,
} from '@/stores/wedding';
import { useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { daysUntil, formatCount, formatDate, formatPrice, percentOf } from '@/lib/format';
import { useWishlistStore } from '@/stores/wishlist';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { FaithTags } from '@/components/faith/FaithBadge';

export function PlanningDashboardPage() {
  useDocumentMeta({
    title: 'Wedding planner',
    description: 'Your wedding date, events, tasks, budget and guest list in one place.',
    canonicalPath: routes.planning,
  });

  const context = useWeddingContext();
  const profile = useWeddingStore((s) => s.profile);
  const events = useWeddingStore((s) => s.events);
  const datedEvents = useWeddingStore(selectDatedEvents);
  const tasks = useWeddingStore((s) => s.tasks);
  const toggleTask = useWeddingStore((s) => s.toggleTask);
  const taskProgress = useWeddingStore(selectTaskProgress);
  const budget = useWeddingStore(selectBudgetTotals);
  const guests = useWeddingStore(selectGuestTotals);
  const savedCount = useWishlistStore((s) => s.items.length);

  const remaining = daysUntil(profile.weddingDate);
  const upcoming = tasks
    .filter((t) => !t.completed && t.dueDate)
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
    .slice(0, 6);

  const nextEvent = datedEvents.find((e) => (daysUntil(e.date) ?? 0) >= 0) ?? datedEvents[0];

  return (
    <div className="space-y-12">
      {/* Summary */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="eyebrow mb-4">
          At a glance
        </h2>
        <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Wedding date"
            value={profile.weddingDate ? formatDate(profile.weddingDate, 'short') : 'Not set'}
            note={remaining !== null && remaining > 0 ? `${remaining} days away` : undefined}
            href={routes.accountProfile}
          />
          <Stat
            label="Ceremonies"
            value={String(events.length)}
            note={nextEvent?.name ? `Next: ${nextEvent.name}` : 'None scheduled'}
            href={routes.planningEvents}
          />
          <Stat
            label="Tasks done"
            value={`${taskProgress.done} / ${taskProgress.total}`}
            note={taskProgress.remaining > 0 ? `${taskProgress.remaining} remaining` : 'All complete'}
            href={routes.planningChecklist}
          />
          <Stat
            label="Budget spent"
            value={budget.allocated > 0 ? `${budget.percentSpent}%` : 'Not set'}
            note={budget.allocated > 0 ? `${formatPrice(budget.spent)} of ${formatPrice(budget.allocated)}` : 'Add a total'}
            href={routes.planningBudget}
          />
        </dl>
      </section>

      {/* Context */}
      <section aria-labelledby="context-heading" className="border border-border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="context-heading" className="font-display text-xl text-ink">
              {context.label}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {context.isMultiTradition
                ? `Your plan draws on ${context.combined.length} traditions. Events and tasks from each appear throughout.`
                : context.primary.introduction.split('. ')[0] + '.'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <FaithTags faiths={context.combined.map((c) => c.id)} max={6} />
              <span className="text-2xs uppercase tracking-eyebrow text-ink-muted">
                {context.ritualServices.length} ritual services available
              </span>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={routes.planningEvents}>Manage ceremonies</Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Upcoming events */}
        <section aria-labelledby="events-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="events-heading" className="font-display text-2xl text-ink">
              Your ceremonies
            </h2>
            <Link to={routes.planningEvents} className="link-quiet text-xs text-ink-muted hover:text-ink">
              Manage
            </Link>
          </div>

          {datedEvents.length === 0 ? (
            <EmptyState
              className="mt-6"
              title="No dated ceremonies yet"
              description="Add dates to your events and they will appear here in order, along with the tasks attached to each."
              action={
                <Button asChild variant="outline">
                  <Link to={routes.planningEvents}>Add dates</Link>
                </Button>
              }
            />
          ) : (
            <ol className="mt-6 border-t border-border">
              {datedEvents.slice(0, 6).map((event) => {
                const eventTasks = tasks.filter((t) => t.eventId === event.id);
                const done = eventTasks.filter((t) => t.completed).length;
                const days = daysUntil(event.date);
                return (
                  <li key={event.id} className="border-b border-border py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg text-ink">{event.name}</h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={13} variant="Linear" aria-hidden="true" />
                            {formatDate(event.date, 'long')}
                          </span>
                          {event.venue ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Location size={13} variant="Linear" aria-hidden="true" />
                              {event.venue}
                            </span>
                          ) : null}
                          {eventTasks.length > 0 ? (
                            <span>
                              {done}/{eventTasks.length} tasks
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-ink-muted">
                        {days === null
                          ? 'No date'
                          : days > 0
                            ? `in ${days} ${days === 1 ? 'day' : 'days'}`
                            : days === 0
                              ? 'today'
                              : 'past'}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* Next tasks */}
        <section aria-labelledby="tasks-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="tasks-heading" className="font-display text-2xl text-ink">
              Next up
            </h2>
            <Link to={routes.planningChecklist} className="link-quiet text-xs text-ink-muted hover:text-ink">
              Full checklist
            </Link>
          </div>

          <Progress value={taskProgress.percent} className="mt-5" aria-label="Checklist progress" />

          {upcoming.length === 0 ? (
            <EmptyState
              className="mt-6"
              title={tasks.length === 0 ? 'Your checklist is empty' : 'Nothing outstanding'}
              description={
                tasks.length === 0
                  ? 'Tasks are generated from the traditions and ceremonies you selected, and you can add your own at any time.'
                  : 'Every task with a deadline is complete. Add more from the checklist.'
              }
              action={
                <Button asChild variant="outline">
                  <Link to={routes.planningChecklist}>Open checklist</Link>
                </Button>
              }
            />
          ) : (
            <ul className="mt-6 border-t border-border">
              {upcoming.map((task) => {
                const overdue = (daysUntil(task.dueDate) ?? 0) < 0;
                return (
                  <li key={task.id} className="border-b border-border">
                    <div className="flex items-start gap-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-pressed={task.completed}
                        aria-label={`Mark "${task.title}" complete`}
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-input transition-colors hover:border-ink"
                      >
                        <span className="sr-only">Complete</span>
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-ink">{task.title}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                          <span className={overdue ? 'text-destructive' : undefined}>
                            <Clock size={12} variant="Linear" className="mr-1 inline" aria-hidden="true" />
                            {overdue ? 'Overdue ' : 'Due '}
                            {formatDate(task.dueDate, 'short')}
                          </span>
                          {task.assignee ? <span>{task.assignee}</span> : null}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Budget and guests */}
      <div className="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="budget-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="budget-heading" className="font-display text-2xl text-ink">
              Budget
            </h2>
            <Link to={routes.planningBudget} className="link-quiet text-xs text-ink-muted hover:text-ink">
              Open budget
            </Link>
          </div>

          {budget.allocated === 0 ? (
            <EmptyState
              className="mt-6"
              title="No budget set"
              description="Enter a total and we will suggest an allocation across eleven categories that you can then adjust."
              action={
                <Button asChild variant="outline">
                  <Link to={routes.planningBudget}>Set a budget</Link>
                </Button>
              }
            />
          ) : (
            <div className="mt-6 border border-border p-5">
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dt className="eyebrow">Allocated</dt>
                  <dd className="mt-1 text-lg text-ink">{formatPrice(budget.allocated)}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Committed</dt>
                  <dd className="mt-1 text-lg text-ink">{formatPrice(budget.spent)}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Remaining</dt>
                  <dd className={budget.remaining < 0 ? 'mt-1 text-lg text-destructive' : 'mt-1 text-lg text-ink'}>
                    {formatPrice(budget.remaining)}
                  </dd>
                </div>
              </dl>
              <Progress
                value={Math.min(budget.percentSpent, 100)}
                className="mt-5"
                aria-label="Share of budget committed"
              />
              <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
                <Wallet2 size={14} variant="Linear" aria-hidden="true" />
                {percentOf(budget.spent, budget.allocated)}% of the allocation is committed.
              </p>
            </div>
          )}
        </section>

        <section aria-labelledby="guests-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="guests-heading" className="font-display text-2xl text-ink">
              Guests
            </h2>
            <Link to={routes.planningGuests} className="link-quiet text-xs text-ink-muted hover:text-ink">
              Open guest list
            </Link>
          </div>

          {guests.invited === 0 ? (
            <EmptyState
              className="mt-6"
              title="No guests added"
              description="Build your guest list with sides, RSVP status and dietary requirements, and track the numbers each ceremony needs."
              action={
                <Button asChild variant="outline">
                  <Link to={routes.planningGuests}>Add guests</Link>
                </Button>
              }
            />
          ) : (
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
              <div className="bg-background p-4">
                <dt className="eyebrow">Invited</dt>
                <dd className="mt-1 text-lg text-ink">{guests.invited}</dd>
              </div>
              <div className="bg-background p-4">
                <dt className="eyebrow">Attending</dt>
                <dd className="mt-1 text-lg text-ink">{guests.attending}</dd>
              </div>
              <div className="bg-background p-4">
                <dt className="eyebrow">Awaiting</dt>
                <dd className="mt-1 text-lg text-ink">{guests.pending}</dd>
              </div>
              <div className="bg-background p-4">
                <dt className="eyebrow">Declined</dt>
                <dd className="mt-1 text-lg text-ink">{guests.declined}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>

      {/* Saved */}
      <section aria-labelledby="saved-heading" className="border-t border-border pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="saved-heading" className="font-display text-2xl text-ink">
              Saved
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              {savedCount === 0
                ? 'Pieces, vendors and reading you save will collect here.'
                : `${formatCount(savedCount, 'item')} saved across your collections.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={routes.wishlist}>Saved items</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to={routes.accountSaved}>Saved collections</Link>
            </Button>
          </div>
        </div>
      </section>

      <p className="flex items-center gap-2 text-xs text-ink-muted">
        <TickCircle size={14} variant="Linear" aria-hidden="true" />
        Your plan is stored on this device. <Edit2 size={13} variant="Linear" aria-hidden="true" /> Everything here is
        editable, including the tasks we seeded.
        {profile.faith ? <Badge variant="outline">{context.primary.name}</Badge> : null}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string;
  note?: string;
  href: string;
}) {
  return (
    <div className="bg-background p-5">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2">
        <span className="block font-display text-2xl text-ink">{value}</span>
        <p className="mt-1.5 min-h-4 text-xs text-ink-muted">{note ?? ''}</p>
        <Link to={href} className="mt-3 inline-block text-xs font-medium text-ink link-quiet">
          Open
        </Link>
      </dd>
    </div>
  );
}
