import { Link, type ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';

/** 404. Offers the routes people most often want rather than a dead end. */
export function RouteNotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col justify-center py-20">
      <p className="eyebrow mb-4">Page not found</p>
      <h1 className="max-w-2xl text-display-sm text-ink sm:text-display-md">
        That page has moved, or it never existed
      </h1>
      <p className="mt-5 max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">
        Check the address, or start from one of these. If you followed a link from somewhere on the site, tell us and we
        will fix it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to={routes.collections}>Browse collections</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to={routes.vendors}>Find vendors</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link to={routes.contact}>Report a broken link</Link>
        </Button>
      </div>
    </div>
  );
}

/** Route-level error boundary. Never shows a raw stack trace to a visitor. */
export function RouteError({ error, reset }: ErrorComponentProps) {
  const isNotFound = error instanceof Error && error.message.toLowerCase().includes('not found');

  return (
    <div className="container flex min-h-[60vh] flex-col justify-center py-20" role="alert">
      <p className="eyebrow mb-4">{isNotFound ? 'Not found' : 'Something went wrong'}</p>
      <h1 className="max-w-2xl text-display-sm text-ink sm:text-display-md">
        {isNotFound ? 'We could not find that' : 'This page did not load'}
      </h1>
      <p className="mt-5 max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">
        {isNotFound
          ? 'The piece or business you are looking for may have been removed, or the link may be incorrect.'
          : 'The problem is on our side. Try again, and if it keeps happening let us know what you were doing.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to={routes.home}>Go to the homepage</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link to={routes.contact}>Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
