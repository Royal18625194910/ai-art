'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

interface WarpBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  perspective?: number;
  sides?: number;
  maxZ?: number;
  fade?: boolean;
  baseColor?: string;
  waveColor?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function WarpBackground({
  children,
  className,
  perspective = 1000,
  sides = 5,
  maxZ = 100,
  fade = true,
  baseColor,
  waveColor,
}: WarpBackgroundProps) {
  const particles = useMemo(() => {
    const temp: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      temp.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    return temp;
  }, []);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fade && 'mask-image-radial',
        className
      )}
      style={{
        perspective: `${perspective}px`,
      }}
    >
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute rounded-full blur-3xl',
              waveColor || 'bg-purple-500/15'
            )}
            style={{
              width: `${400 + i * 200}px`,
              height: `${400 + i * 200}px`,
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              x: [0, 50, -30, 20, 0],
              y: [0, -40, 30, -20, 0],
              scale: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={cn(
              'absolute rounded-full',
              baseColor || 'bg-purple-400/30'
            )}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
