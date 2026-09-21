import { createContext, useContext, type ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface MediaQueryContextValue {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
}

const MediaQueryContext = createContext<MediaQueryContextValue>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  prefersReducedMotion: false,
});

/**
 * Resolves the handful of breakpoint questions the app actually needs once, so
 * components do not each attach their own matchMedia listeners.
 */
export function MediaQueryProvider({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <MediaQueryContext.Provider value={{ isMobile, isTablet, isDesktop, prefersReducedMotion }}>
      {children}
    </MediaQueryContext.Provider>
  );
}

export function useBreakpoint(): MediaQueryContextValue {
  return useContext(MediaQueryContext);
}
