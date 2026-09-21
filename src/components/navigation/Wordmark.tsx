import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { routes } from '@/config/routes';

/**
 * The wordmark is set in the display serif at a modest size with wide
 * letterspacing. It reads as an atelier nameplate rather than a logo lockup.
 */
export function Wordmark({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      to={routes.home}
      onClick={onClick}
      className={cn('group flex items-baseline gap-2', className)}
      aria-label="One Stop Bridal, home"
    >
      <span className="font-display text-[1.375rem] leading-none tracking-wide text-ink lg:text-2xl">
        One Stop Bridal
      </span>
      <span className="hidden text-2xs uppercase tracking-eyebrow text-ink-muted lg:inline">Est. 2025</span>
    </Link>
  );
}
