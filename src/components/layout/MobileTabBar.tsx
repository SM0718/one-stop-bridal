import { Link, useRouterState } from '@tanstack/react-router';
import { Category, Heart, Home2, User } from 'iconsax-react';
import { selectWishlistCount, useWishlistStore } from '@/stores/wishlist';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'Home', href: '/', Icon: Home2, match: (p: string) => p === '/' },
  { label: 'Collections', href: '/collections', Icon: Category, match: (p: string) => p.startsWith('/collections') || p.startsWith('/product') },
  // Planning has been commented out for this bridal-only build.
  // { label: 'Planning', href: '/planning', Icon: Calendar, match: (p: string) => p.startsWith('/planning') },
  { label: 'Saved', href: '/wishlist', Icon: Heart, match: (p: string) => p.startsWith('/wishlist') },
  { label: 'Account', href: '/account', Icon: User, match: (p: string) => p.startsWith('/account') || p.startsWith('/cart') },
];

/**
 * Bottom tab bar for small screens. Five destinations only, thumb-reachable,
 * with the safe-area inset respected on notched devices.
 */
export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const savedCount = useWishlistStore(selectWishlistCount);

  return (
    <nav
      aria-label="Primary mobile"
      className="print-hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/97 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ label, href, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                to={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[0.625rem] uppercase tracking-wide transition-colors',
                  active ? 'text-ink' : 'text-ink-muted',
                )}
              >
                <Icon size={20} variant={active ? 'Bold' : 'Linear'} aria-hidden="true" />
                {label}
                {label === 'Saved' && savedCount > 0 ? (
                  <span className="absolute right-[22%] top-1.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                ) : null}
                {active ? (
                  <span aria-hidden="true" className="absolute inset-x-5 top-0 h-px bg-ink" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
