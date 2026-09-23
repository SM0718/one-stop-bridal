import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: ReactNode;
  /**
   * When true the shimmer pill is rendered onto a single element child (such
   * as a router Link) instead of a `<button>`, so the whole pill is clickable
   * and the child receives the merged styles and handlers.
   */
  asChild?: boolean;
}

/**
 * A button with a shimmering light which travels around the perimeter. From
 * Magic UI (v3 registry), with `asChild` support added on top.
 */
export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '100px',
      background = 'rgba(0, 0, 0, 1)',
      className,
      children,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const style = {
      '--spread': '90deg',
      '--shimmer-color': shimmerColor,
      '--radius': borderRadius,
      '--speed': shimmerDuration,
      '--cut': shimmerSize,
      '--bg': background,
    } as CSSProperties;

    const classes = cn(
      'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap',
      'border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black',
      'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
      className,
    );

    /* Decorative layers for the pill. `label` is what sits on top of them. */
    const pillLayers = (label: ReactNode) => (
      <>
        {/* spark container */}
        <div className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]">
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {label}
        {/* Highlight */}
        <div
          className={cn(
            'absolute inset-0 size-full',
            'rounded-2xl px-4 py-1.5 text-sm font-medium',
            'shadow-[inset_0_-8px_10px_#ffffff1f]',
            // transition
            'transform-gpu transition-all duration-300 ease-in-out',
            // on hover
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
            // on click
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
          )}
        />
        {/* backdrop */}
        <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      </>
    );

    if (asChild) {
      const child = Children.only(children);
      if (!isValidElement(child)) {
        throw new Error('ShimmerButton `asChild` expects a single React element child.');
      }
      const childProps = child.props as { children?: ReactNode; className?: string; style?: CSSProperties };
      return cloneElement(
        child,
        {
          ...child.props,
          className: cn(classes, childProps.className),
          style: { ...style, ...childProps.style },
        },
        pillLayers(childProps.children),
      );
    }

    return (
      <button ref={ref} style={style} className={classes} type="button" {...props}>
        {pillLayers(children)}
      </button>
    );
  },
);

ShimmerButton.displayName = 'ShimmerButton';