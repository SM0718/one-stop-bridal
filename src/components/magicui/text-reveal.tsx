import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

/**
 * A serif statement whose words fade in as they scroll through a fixed window.
 * From Magic UI's text-reveal, rebuilt here as a plain opacity + colour
 * reveal on top of this project's Tailwind v3 + framer-motion setup.
 */
export function TextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const words = text.split(' ');

  /* Each word takes its own slice of the scroll travel. */
  const startAt = 0.15;
  const wordWindow = 0.02;

  return (
    <div ref={targetRef} className={className}>
      <div className="relative w-full">
        {words.map((word, i) => (
          <TextRevealWord
            key={`${word}-${i}`}
            word={word}
            progress={scrollYProgress}
            startAt={startAt + i * wordWindow}
            windowSize={wordWindow}
          />
        ))}
      </div>
    </div>
  );
}

function TextRevealWord({
  word,
  progress,
  startAt,
  windowSize,
}: {
  word: string;
  progress: MotionValue<number>;
  startAt: number;
  windowSize: number;
}) {
  const wordProgress = useTransform(progress, [startAt, startAt + windowSize], [0, 1]);
  const opacity = useTransform(wordProgress, [0, 1], [0, 1]);
  const color = useTransform(
    wordProgress,
    [0, 1],
    ['rgba(38, 30, 27, 0.16)', 'rgba(38, 30, 27, 1)'],
  );

  return (
    <motion.span
      style={{ opacity, color }}
      className="relative inline-block will-change-[transform,opacity]"
    >
      <span className="font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.05]">
        {word}
        {'\u00A0'}
      </span>
    </motion.span>
  );
}