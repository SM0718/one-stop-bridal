import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Empty states explain what is missing and offer the next useful action,
 * rather than simply reporting that a list is empty.
 */
export function EmptyState({
  title,
  description,
  action,
  secondaryAction,
  icon,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border border-dashed border-border px-6 py-14 text-center', className)}>
      {icon ? <div className="mb-4 flex justify-center text-ink-muted">{icon}</div> : null}
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">{description}</p>
      {action || secondaryAction ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
