import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { TAB_NAV } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { FaithSelectorButton } from '@/components/faith/FaithPickerDialog';

export function AccountLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuthStore((s) => s.user);

  return (
    <div className="container py-10 lg:py-14">
      <header className="border-b border-border pb-6">
        <p className="eyebrow mb-2">Your account</p>
        <h1 className="text-display-sm text-ink">{user ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : 'Your account'}</h1>
        <p className="mt-3 max-w-editorial text-sm leading-relaxed text-ink-soft">
          {user
            ? 'Your wedding profile, saved pieces and preferences in one place.'
            : 'Sign in to keep your wedding profile, saved pieces and plan across devices.'}
        </p>
        <FaithSelectorButton className="mt-4 inline-flex items-center gap-2 border border-border px-3 py-2 text-xs text-ink transition-colors hover:border-ink" />
      </header>

      <div className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
        <nav aria-label="Account" className="min-w-0 lg:pt-8">
          <ul className="rail gap-1 border-b border-border pb-3 lg:flex-col lg:border-b-0 lg:pb-0">
            {TAB_NAV.map((item) => {
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
  );
}
