import { Heart } from 'iconsax-react';
import type { SavedItemKind } from '@/types';
import { useWishlistStore } from '@/stores/wishlist';
import { cn } from '@/lib/utils';

/**
 * Save control shared by products, vendors and articles. Reads and writes the
 * wishlist store directly so state stays consistent wherever it appears.
 */
export function SaveButton({
  kind,
  refId,
  className,
  size = 20,
  variant = 'overlay',
  label,
}: {
  kind: SavedItemKind;
  refId: string;
  className?: string;
  size?: number;
  variant?: 'overlay' | 'plain';
  label?: string;
}) {
  const isSaved = useWishlistStore((s) => s.items.some((i) => i.kind === kind && i.refId === refId));
  const toggle = useWishlistStore((s) => s.toggle);

  const accessibleLabel = isSaved
    ? `Remove ${label ?? 'this item'} from saved`
    : `Save ${label ?? 'this item'}`;

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(kind, refId);
      }}
      className={cn(
        'flex items-center justify-center transition-colors',
        variant === 'overlay'
          ? 'h-10 w-10 bg-background/85 text-ink backdrop-blur-sm hover:bg-background'
          : 'h-11 w-11 text-ink-muted hover:text-ink',
        isSaved && 'text-gold-deep',
        className,
      )}
    >
      <Heart size={size} variant={isSaved ? 'Bold' : 'Linear'} />
    </button>
  );
}
