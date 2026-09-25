import { useEffect, useRef, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Bag2, Heart, Menu, SearchNormal1, User } from 'iconsax-react';
import { PRIMARY_NAV } from '@/config/navigation';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import { useCartStore, selectCartCount } from '@/stores/cart';
import { useWishlistStore, selectWishlistCount } from '@/stores/wishlist';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { Wordmark } from './Wordmark';
import { FaithSelectorButton } from '@/components/faith/FaithPickerDialog';

export function SiteHeader() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openSearch = useUIStore((s) => s.openSearch);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  /* Collapse the utility strip once the page scrolls, to give content room. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (navRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpenMenuId(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openMenuId]);

  /* Close any open menu whenever the location changes */
  useEffect(() => {
    setOpenMenuId(null);
  }, [pathname]);

  useEffect(() => {
    if (!isDesktop) setOpenMenuId(null);
  }, [isDesktop]);

  const activeItem = PRIMARY_NAV.find((i) => i.id === openMenuId) ?? null;

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenuId(null), 160);
  }

  function cancelClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        {/* Utility strip */}
        <div
          className={cn(
            'hidden overflow-hidden border-b border-border/70 bg-marigold-soft/60 transition-all duration-300 ease-editorial lg:block',
            scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100',
          )}
        >
          <div className="container flex h-9 items-center justify-between">
            <FaithSelectorButton className="flex items-center gap-2 text-2xs uppercase tracking-eyebrow text-ink-muted transition-colors hover:text-ink" />
            <div className="flex items-center gap-6 text-2xs uppercase tracking-eyebrow text-ink-muted">
              <Link to={routes.faq} className="transition-colors hover:text-ink">
                Help
              </Link>
              <Link to={routes.contact} className="transition-colors hover:text-ink">
                Contact
              </Link>
              <Link to={routes.retailers} className="transition-colors hover:text-ink">
                Become a retailer
              </Link>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="container flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="-ml-2 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} variant="Linear" />
            </button>
            <Wordmark />
          </div>

          <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {PRIMARY_NAV.map((item) => {
                const hasMenu = Boolean(item.columns);
                const isOpen = openMenuId === item.id;
                return (
                  <li
                    key={item.id}
                    onMouseEnter={() => {
                      if (!hasMenu) return;
                      cancelClose();
                      setOpenMenuId(item.id);
                    }}
                    onMouseLeave={() => hasMenu && scheduleClose()}
                  >
                    {hasMenu ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setOpenMenuId(isOpen ? null : item.id)}
                        onFocus={() => {
                          cancelClose();
                          setOpenMenuId(item.id);
                        }}
                        className={cn(
                          'relative py-2 text-[0.8125rem] transition-colors',
                          isOpen ? 'text-ink' : 'text-ink-soft hover:text-ink',
                        )}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute inset-x-0 -bottom-px h-px origin-left bg-gold transition-transform duration-300 ease-editorial',
                            isOpen ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        search={item.search}
                        className="link-quiet py-2 text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
                        activeProps={{ className: 'text-ink link-quiet-active' }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => openSearch()}
              className="flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink"
              aria-label="Search"
            >
              <SearchNormal1 size={20} variant="Linear" />
            </button>

            <Link
              to={routes.account}
              className="hidden h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink sm:flex"
              aria-label="Account"
            >
              <User size={20} variant="Linear" />
            </Link>

            <Link
              to={routes.wishlist}
              className="relative hidden h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink sm:flex"
              aria-label={wishlistCount > 0 ? `Saved items, ${wishlistCount} items` : 'Saved items'}
            >
              <Heart size={20} variant="Linear" />
              {wishlistCount > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center bg-rose px-1 text-[0.625rem] font-medium text-ivory">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              ) : null}
            </Link>

            <Link
              to={routes.cart}
              className="relative flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink"
              aria-label={cartCount > 0 ? `Bag, ${cartCount} items` : 'Bag'}
            >
              <Bag2 size={20} variant="Linear" />
              {cartCount > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center bg-rose px-1 text-[0.625rem] font-medium text-ivory">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {isDesktop && activeItem ? (
          <div ref={menuRef} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
            <MegaMenu item={activeItem} onNavigate={() => setOpenMenuId(null)} />
          </div>
        ) : null}
      </header>

      <MobileNav />

      {activeItem ? (
        <div
          className="fixed inset-0 top-16 z-30 hidden bg-ink/20 lg:block"
          aria-hidden="true"
          onClick={() => setOpenMenuId(null)}
        />
      ) : null}
    </>
  );
}
