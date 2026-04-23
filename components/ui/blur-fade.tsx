import { cn } from '@/lib/utils';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  delay?: number;
  duration?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

export function BlurFade({
  children,
  className,
  variant,
  delay = 0,
  duration = 0.4,
  yOffset = 6,
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 0, filter: `blur(${blur})` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: 'easeOut',
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface BlurFadeTextProps {
  text: string;
  className?: string;
  delay?: number;
  yOffset?: number;
  blur?: string;
  duration?: number;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
}

export function BlurFadeText({
  text,
  className,
  delay = 0,
  yOffset = 6,
  blur = '6px',
  duration = 0.4,
  variant,
}: BlurFadeTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useMotionValue(0);
  const spring = useSpring(controls, {
    duration: 500,
    stiffness: 100,
    damping: 30,
  });
  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        controls.set(1);
      }, delay * 1000);
    }
  }, [isInView, controls, delay]);
  return (
    <motion.h1
      ref={ref}
      className={cn('relative inline-block', className)}
      style={{ opacity: spring }}
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur})` }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: yOffset, filter: `blur(${blur})` }
      }
      transition={{ duration, delay: 'easeOut' }}
    >
      {text}
    </motion.h1>
  );
}
