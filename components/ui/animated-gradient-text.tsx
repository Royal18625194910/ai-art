import { cn } from '@/lib/utils';
import React from 'react';

interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  duration?: number;
}

export function AnimatedGradientText({
  children,
  className,
  from = 'from-purple-400',
  via = 'via-cyan-400',
  to = 'to-purple-400',
  duration = 3,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        from,
        via,
        to,
        className
      )}
      style={{
        backgroundSize: '200% 100%',
        animation: `gradient ${duration}s linear infinite`,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
