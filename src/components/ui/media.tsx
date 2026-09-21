import * as React from 'react';
import { cn } from '@/lib/utils';
import { mediaAlt, mediaSrcSet, mediaUrl, MEDIA_WIDTHS } from '@/data/media';

/**
 * Image component for the whole platform.
 *
 * Performance decisions, since imagery dominates this site:
 * - a fixed aspect ratio reserves space before load, so there is no layout shift
 * - responsive `srcset` so phones never download desktop-sized files
 * - native lazy loading below the fold, eager + high priority for the hero
 * - an explicit tonal placeholder instead of a skeleton shimmer
 * - async decoding to keep the main thread free
 */
const ASPECT_CLASS: Record<string, string> = {
  editorial: 'aspect-editorial',
  portrait: 'aspect-portrait',
  square: 'aspect-square',
  wide: 'aspect-wide',
  banner: 'aspect-banner',
  video: 'aspect-video',
  none: '',
};

export type MediaAspect = keyof typeof ASPECT_CLASS;

interface MediaImageProps {
  mediaKey: string | null | undefined;
  /** Overrides the library alt text when the context needs something specific */
  alt?: string;
  aspect?: MediaAspect;
  /** Rendered width hint for the browser's srcset selection */
  sizes?: string;
  /** Above-the-fold images load eagerly at high priority */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Intrinsic dimensions used for the width/height attributes */
  width?: number;
  height?: number;
}

export function MediaImage({
  mediaKey,
  alt,
  aspect = 'editorial',
  sizes = '100vw',
  priority = false,
  className,
  imgClassName,
  width = 1024,
  height = 1280,
}: MediaImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const src = mediaKey ? mediaUrl(mediaKey, 1024) : null;
  const srcSet = mediaKey ? mediaSrcSet(mediaKey, MEDIA_WIDTHS) : undefined;
  const resolvedAlt = alt ?? (mediaKey ? mediaAlt(mediaKey) : '');

  /* Unknown or missing imagery renders as a warm tonal panel rather than a
     broken image, which is what a missing CDN asset would otherwise look like. */
  if (!src) {
    return (
      <div
        className={cn('relative overflow-hidden bg-champagne-soft', ASPECT_CLASS[aspect], className)}
        role="img"
        aria-label={resolvedAlt || 'Image unavailable'}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-champagne-soft via-muted to-blush/50" />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-muted', ASPECT_CLASS[aspect], className)}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={resolvedAlt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-expect-error fetchPriority is valid HTML but not in older React types
        fetchpriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-editorial',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}

/**
 * Slow, restrained zoom on hover for editorial and product imagery.
 * Disabled entirely for touch devices and reduced-motion users via CSS.
 */
export function MediaZoom({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('group/media overflow-hidden', className)}>
      <div className="h-full w-full transition-transform duration-[900ms] ease-editorial motion-safe:group-hover/media:scale-[1.03]">
        {children}
      </div>
    </div>
  );
}
