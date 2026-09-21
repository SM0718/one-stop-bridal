import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { router } from './router';
import './styles/globals.css';

/* Fonts are self-hosted so there is no render-blocking request to a font CDN
   on a slow connection, and no layout shift when the display face loads. */
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /* Catalogue data changes rarely in a session; caching aggressively keeps
         repeat navigation instant and reduces work on low-end devices. */
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root was not found in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300} skipDelayDuration={200}>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'font-sans text-sm rounded-none border border-border bg-background text-ink',
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
