import { cn } from '@/lib/utils';
import React from 'react';

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<{ x: number; y: number }>;
  strokeDasharray?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares = [],
  strokeDasharray = 0,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: AnimatedGridPatternProps) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-foreground/30',
        className
      )}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <pattern
        id={id}
        width={width}
        height={height}
        patternUnits="userSpaceOnUse"
        x={x}
        y={y}
      >
        <path
          d={`M.5 ${height}V.5H${width}`}
          fill="none"
          strokeDasharray={strokeDasharray}
          stroke="currentColor"
          strokeWidth="1"
        />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg className="overflow-visible" x={x} y={y}>
        {squares.map(({ x: xSquare, y: ySquare }, index) => (
          <rect
            key={`${xSquare}-${ySquare}-${index}`}
            width={width - 1}
            height={height - 1}
            x={xSquare * width + 1}
            y={ySquare * height + 1}
            fill="currentColor"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              begin={`${index * 0.1}s`}
              dur={`${duration}s`}
              values={`0;${maxOpacity};0`}
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
    </svg>
  );
}
