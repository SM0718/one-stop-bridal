import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { useWeddingStore, selectTaskProgress } from '@/stores/wedding';
import { useWeddingContext } from '@/hooks/queries';
import { daysUntil } from '@/lib/format';
import { Progress } from '@/components/ui/progress';
import { FaithSelectorButton } from '@/components/faith/FaithPickerDialog';

const NAV = [
  { label: 'Overview', to: routes.planning },
  { label: 'Events', to: routes.planningEvents },
  { label: 'Checklist', to: routes.planningChecklist },
  { label: 'Timeline', to: routes.planningTimeline },
  { label: 'Budget', to: routes.planningBudget },
  { label: 'Guests', to: routes.planningGuests },
];

export function PlanningLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const progress = useWeddingStore(selectTaskProgress);
  const weddingDate = useWeddingStore((s) => s.profile.weddingDate);
  const context = useWeddingContext();

  const remaining = daysUntil(weddingDate);

  return (
    <div className="border-t border-border bg-ivory-deep/40">
      <div className="container py-8 lg:py-12">
        <header className="border-b border-border pb-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Wedding planner</p>
              <h1 className="text-display-sm text-ink">
                {remaining === null
                  ? 'Your wedding plan'
                  : remaining > 0
                    ? `${remaining} ${remaining === 1 ? 'day' : 'days'} to go`
                    : remaining === 0
                      ? 'Today is the day'
                      : 'Your wedding has passed'}
              </h1>
              <p className="mt-3 text-sm text-ink-soft">
                {weddingDate ? 'Everything below is planned around your date.' : 'Set a date to see your timeline fill in.'}
              </p>
              <FaithSelectorButton className="mt-4 inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs text-ink transition-colors hover:border-ink" />
            </div>

            <div className="w-full max-w-xs">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Checklist</span>
                <span className="text-sm text-ink">
                  {progress.done} of {progress.total}
                </span>
              </div>
              <Progress value={progress.percent} className="mt-3" aria-label="Checklist progress" />
              <p className="mt-2 text-xs text-ink-muted">
                {progress.remaining === 0
                  ? 'Every task is done.'
                  : `${progress.remaining} ${progress.remaining === 1 ? 'task' : 'tasks'} left, drawn from ${context.label}.`}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
          <nav aria-label="Planning" className="min-w-0 lg:pt-8">
            <ul className="rail gap-1 border-b border-border pb-3 lg:flex-col lg:border-b-0 lg:pb-0">
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to} className="shrink-0">
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block whitespace-nowrap py-2 text-[0.8125rem] transition-colors lg:whitespace-normal',
                        active ? 'text-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0 lg:pt-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
