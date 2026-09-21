import { useEffect } from 'react';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { SearchOverlay } from '@/components/navigation/SearchOverlay';
import { MediaQueryProvider } from '@/components/layout/MediaQueryProvider';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { FaithPickerDialog } from '@/components/faith/FaithPickerDialog';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Root shell: header, page transition, footer and the two global overlays.
 * The page transition is a short fade with a 6px lift — enough to signal a
 * change of page without becoming an effect in its own right.
 */
export function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reducedMotion = usePrefersReducedMotion();

  /* Announce route changes to assistive technology */
  useEffect(() => {
    const heading = document.querySelector('h1');
    if (heading instanceof HTMLElement) {
      heading.setAttribute('tabindex', '-1');
    }
  }, [pathname]);

  return (
    <MediaQueryProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <motion.main
          id="main"
          key={pathname}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0"
        >
          <Outlet />
        </motion.main>

        <SiteFooter />
        <MobileTabBar />

        <SearchOverlay />
        <FaithPickerDialog />
      </div>
    </MediaQueryProvider>
  );
}
