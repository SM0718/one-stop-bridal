import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Calendar, Flag, Location } from 'iconsax-react';
import { routes } from '@/config/routes';
import { selectDatedEvents, useWeddingStore } from '@/stores/wedding';
import { useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { daysUntil, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { CHECKLIST_PHASES } from '@/data/planning';

interface TimelineEntry {
  id: string;
  kind: 'event' | 'task';
  date: string;
  title: string;
  detail?: string;
  eventName?: string;
  completed?: boolean;
  overdue?: boolean;
}

/**
 * Timeline.
 *
 * Events and task deadlines share one chronological axis, because "when is
 * everything actually happening" is the question a timeline should answer.
 */
export function PlanningTimelinePage() {
  useDocumentMeta({
    title: 'Wedding timeline',
    description: 'Your ceremonies and task deadlines in date order, from a year out to the wedding day.',
    canonicalPath: routes.planningTimeline,
  });

  const context = useWeddingContext();
  const events = useWeddingStore((s) => s.events);
  const datedEvents = useWeddingStore(selectDatedEvents);
  const tasks = useWeddingStore((s) => s.tasks);
  const weddingDate = useWeddingStore((s) => s.profile.weddingDate);

  const entries = useMemo<TimelineEntry[]>(() => {
    const list: TimelineEntry[] = [];

    for (const event of datedEvents) {
      if (!event.date) continue;
      list.push({
        id: `event-${event.id}`,
        kind: 'event',
        date: event.date,
        title: event.name,
        detail: event.venue || undefined,
      });
    }

    for (const task of tasks) {
      if (!task.dueDate) continue;
      const event = events.find((e) => e.id === task.eventId);
      list.push({
        id: `task-${task.id}`,
        kind: 'task',
        date: task.dueDate,
        title: task.title,
        eventName: event?.name,
        completed: task.completed,
        overdue: !task.completed && (daysUntil(task.dueDate) ?? 0) < 0,
      });
    }

    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [datedEvents, tasks, events]);

  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEntry[]>();
    for (const entry of entries) {
      const key = entry.date.slice(0, 7); // yyyy-MM
      const bucket = map.get(key) ?? [];
      bucket.push(entry);
      map.set(key, bucket);
    }
    return [...map.entries()];
  }, [entries]);

  const remaining = daysUntil(weddingDate);

  return (
    <div className="space-y-10">
      <div className="border-b border-border pb-6">
        <h2 className="font-display text-2xl text-ink">Timeline</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {entries.length === 0
            ? 'Set a wedding date and add dates to your ceremonies, and everything will fall into place here.'
            : `${entries.length} dated milestones across your ${context.label} plan${
                remaining !== null && remaining > 0 ? `, ${remaining} days out` : ''
              }.`}
        </p>
      </div>

      {/* The standard planning arc, for orientation */}
      <section aria-labelledby="arc-heading">
        <h3 id="arc-heading" className="eyebrow mb-4">
          The usual arc
        </h3>
        <ol className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CHECKLIST_PHASES.filter((p) => p.id !== 'wedding-day').map((phase) => {
            const phaseTasks = tasks.filter((t) => t.phase === phase.id);
            const done = phaseTasks.filter((t) => t.completed).length;
            return (
              <li key={phase.id} className="bg-background p-5">
                <p className="eyebrow">{phase.name}</p>
                <p className="mt-2 text-sm text-ink-soft">{phase.description}</p>
                <p className="mt-3 text-xs text-ink-muted">
                  {phaseTasks.length === 0 ? 'No tasks' : `${done} of ${phaseTasks.length} done`}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {grouped.length === 0 ? (
        <EmptyState
          title="Nothing dated yet"
          description="Add a date to at least one ceremony, or set due dates on your tasks, and they will appear here in order."
          action={
            <Button asChild variant="outline">
              <Link to={routes.planningEvents}>Add ceremony dates</Link>
            </Button>
          }
        />
      ) : (
        <ol className="space-y-10">
          {grouped.map(([month, monthEntries]) => (
            <li key={month}>
              <h3 className="sticky top-16 z-10 -mx-1 bg-ivory-deep/95 px-1 py-2 font-display text-lg text-ink backdrop-blur-sm lg:top-28">
                {new Date(`${month}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </h3>

              <ul className="mt-3 border-l border-border pl-6">
                {monthEntries.map((entry) => (
                  <li key={entry.id} className="relative py-3.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute -left-[1.72rem] top-5 h-2.5 w-2.5 rounded-full border',
                        entry.kind === 'event'
                          ? 'border-ink bg-ink'
                          : entry.completed
                            ? 'border-border bg-background'
                            : entry.overdue
                              ? 'border-destructive bg-destructive'
                              : 'border-ink bg-background',
                      )}
                    />
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className={cn(
                            'text-sm',
                            entry.kind === 'event' ? 'font-medium text-ink' : 'text-ink-soft',
                            entry.completed && 'text-ink-muted line-through',
                          )}
                        >
                          {entry.title}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                          <span className="inline-flex items-center gap-1.5">
                            {entry.kind === 'event' ? (
                              <Calendar size={12} variant="Linear" aria-hidden="true" />
                            ) : (
                              <Flag size={12} variant="Linear" aria-hidden="true" />
                            )}
                            {formatDate(entry.date, 'long')}
                          </span>
                          {entry.eventName ? <span>{entry.eventName}</span> : null}
                          {entry.detail ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Location size={12} variant="Linear" aria-hidden="true" />
                              {entry.detail}
                            </span>
                          ) : null}
                          {entry.overdue ? <Badge variant="danger">Overdue</Badge> : null}
                        </p>
                      </div>
                      <span className="text-xs text-ink-muted">
                        {entry.kind === 'event' ? 'Ceremony' : 'Task'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}

      <p className="border-t border-border pt-6 text-xs leading-relaxed text-ink-muted">
        Suggested deadlines are spaced from your wedding date using typical lead times. Suppliers in peak season often need
        longer, and made-to-measure pieces usually need eight weeks or more —{' '}
        <Link to={routes.planningChecklist} className="underline decoration-gold/50 underline-offset-2">
          adjust anything in the checklist
        </Link>
        .
      </p>
    </div>
  );
}
