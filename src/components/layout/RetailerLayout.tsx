import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { RETAILER_NAV } from '@/config/navigation';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { useRetailerApplication } from '@/hooks/queries';
import { Badge } from '@/components/ui/badge';

export function RetailerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: application } = useRetailerApplication();

  return (
    <div className="border-t border-border bg-ivory-deep/40">
      <div className="container py-8 lg:py-12">
        <header className="border-b border-border pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Retailer workspace</p>
              <h1 className="text-display-sm text-ink">Meera Vasant Atelier</h1>
              <p className="mt-2 text-sm text-ink-soft">Mumbai, India · Bridalwear</p>
            </div>
            <div className="flex items-center gap-3">
              {application ? (
                <Badge
                  variant={
                    application.status === 'approved'
                      ? 'positive'
                      : application.status === 'rejected'
                        ? 'danger'
                        : application.status === 'needs-information'
                          ? 'warning'
                          : 'muted'
                  }
                >
                  {application.status.replace('-', ' ')}
                </Badge>
              ) : null}
              <Link
                to={routes.retailersProductNew}
                className="border border-ink bg-ink px-4 py-2.5 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-ink-soft"
              >
                Add a product
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
          <nav aria-label="Retailer" className="min-w-0 lg:pt-8">
            <ul className="rail gap-1 border-b border-border pb-3 lg:flex-col lg:border-b-0 lg:pb-0">
              {RETAILER_NAV.map((item) => {
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
