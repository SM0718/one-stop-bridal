import type { FaithId } from '@/types';
import { getFaith } from '@/data/faiths';
import { cn } from '@/lib/utils';

/**
 * A small, factual marker of the selected wedding context. Used on planner
 * screens and product pages where it is useful to know why something is shown.
 */
export function FaithBadge({
  faith,
  className,
  prefix = 'For',
}: {
  faith: FaithId;
  className?: string;
  prefix?: string;
}) {
  const config = getFaith(faith);
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-2xs uppercase tracking-eyebrow text-ink-muted', className)}>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: config.accent.hex }}
      />
      {prefix} {config.shortName}
    </span>
  );
}

/** The set of traditions a piece or vendor suits, shown as text. */
export function FaithTags({ faiths, className, max = 4 }: { faiths: FaithId[]; className?: string; max?: number }) {
  const shown = faiths.slice(0, max);
  const rest = faiths.length - shown.length;
  return (
    <span className={cn('text-2xs uppercase tracking-eyebrow text-ink-muted', className)}>
      {shown.map((f) => getFaith(f).shortName).join(' · ')}
      {rest > 0 ? ` · +${rest}` : ''}
    </span>
  );
}
