import { AnimatePresence, motion } from 'framer-motion';
import {
  Children,
  memo,
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

interface AnimatedListProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedListItem = memo(
  ({ children, className }: { children: ReactNode; className?: string }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn('mx-auto w-full', className)}
    >
      {children}
    </motion.div>
  ),
);

/**
 * Reveals children one at a time with a spring pop. Note: items appear from
 * the bottom up (newest first) and the animation stops once the full set is
 * on screen, so pass children in reverse display order if you want 1…n.
 * From Magic UI (v3 registry), Tailwind v3 build.
 */
export function AnimatedList({ children, delay = 1000, className, ...props }: AnimatedListProps) {
  const [index, setIndex] = useState(0);
  const childrenArray = Children.toArray(children);

  useEffect(() => {
    if (index >= childrenArray.length) return;

    const interval = setInterval(
      () => {
        setIndex((prevIndex) => prevIndex + 1);
      },
      delay * (index + 1),
    );

    return () => clearInterval(interval);
  }, [index, delay, childrenArray.length]);

  const itemsToShow = useMemo(() => {
    return childrenArray.slice(0, index + 1).reverse();
  }, [index, childrenArray]);

  if (!children) return null;

  return (
    <div className={cn('flex flex-col items-center gap-4', className)} {...props}>
      <AnimatePresence>
        {itemsToShow.map((item) => (
          <AnimatedListItem key={(item as ReactElement).key}>{item}</AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
}