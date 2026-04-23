'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface MagicRingsProps {
  className?: string;
  color?: string;
  colorTwo?: string;
  ringCount?: number;
  speed?: number;
  opacity?: number;
  blur?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { base: 60, step: 40 },
  md: { base: 100, step: 60 },
  lg: { base: 150, step: 80 },
  xl: { base: 200, step: 100 },
};

export function MagicRings({
  className,
  color = '#A855F7',
  colorTwo = '#06B6D4',
  ringCount = 6,
  speed = 1,
  opacity = 0.6,
  blur = 0,
  size = 'md',
}: MagicRingsProps) {
  const { base, step } = sizeMap[size];

  const createRings = () => {
    const rings = [];
    for (let i = 0; i < ringCount; i++) {
      const sizePx = base + i * step;
      const progress = i / (ringCount - 1 || 1);
      
      const r1 = parseInt(color.slice(1, 3), 16);
      const g1 = parseInt(color.slice(3, 5), 16);
      const b1 = parseInt(color.slice(5, 7), 16);
      const r2 = parseInt(colorTwo.slice(1, 3), 16);
      const g2 = parseInt(colorTwo.slice(3, 5), 16);
      const b2 = parseInt(colorTwo.slice(5, 7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);
      
      const ringColor = `rgb(${r}, ${g}, ${b})`;
      
      rings.push({
        index: i,
        size: sizePx,
        color: ringColor,
        delay: i * 0.3 / speed,
        duration: (3 - i * 0.2) / speed,
        ringOpacity: opacity * (1 - progress * 0.4),
      });
    }
    return rings;
  };

  const rings = createRings();

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {rings.map((ring) => (
        <motion.div
          key={ring.index}
          className="absolute rounded-full border"
          style={{
            width: ring.size,
            height: ring.size,
            borderColor: ring.color,
            borderWidth: Math.max(1, 4 - ring.index * 0.5),
            opacity: ring.ringOpacity,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            boxShadow: `0 0 ${10 + ring.index * 5}px ${ring.color}40`,
          }}
          animate={{
            scale: [0.8, 1.1, 0.9, 1],
            rotate: [0, 180, 360],
            opacity: [ring.ringOpacity * 0.3, ring.ringOpacity, ring.ringOpacity * 0.6],
          }}
          transition={{
            duration: ring.duration,
            delay: ring.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      <motion.div
        className="absolute rounded-full"
        style={{
          width: base * 0.4,
          height: base * 0.4,
          background: `radial-gradient(circle, ${color}60 0%, ${colorTwo}30 50%, transparent 100%)`,
          boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${colorTwo}30`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.7],
        }}
        transition={{
          duration: 2 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: base * 0.15,
          height: base * 0.15,
          background: `linear-gradient(135deg, ${color} 0%, ${colorTwo} 100%)`,
          boxShadow: `0 0 20px ${color}80`,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 1, 0.9],
        }}
        transition={{
          duration: 1.5 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

export function MagicRingsBackground({
  className,
  color = '#A855F7',
  colorTwo = '#06B6D4',
}: {
  className?: string;
  color?: string;
  colorTwo?: string;
}) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <motion.div
        className="absolute"
        style={{
          left: '10%',
          top: '20%',
        }}
      >
        <MagicRings
          color={color}
          colorTwo={colorTwo}
          ringCount={4}
          speed={0.5}
          opacity={0.3}
          blur={2}
          size="sm"
        />
      </motion.div>

      <motion.div
        className="absolute"
        style={{
          right: '5%',
          top: '30%',
        }}
      >
        <MagicRings
          color={colorTwo}
          colorTwo={color}
          ringCount={5}
          speed={0.7}
          opacity={0.25}
          blur={3}
          size="md"
        />
      </motion.div>

      <motion.div
        className="absolute"
        style={{
          left: '30%',
          bottom: '10%',
        }}
      >
        <MagicRings
          color={color}
          colorTwo={colorTwo}
          ringCount={3}
          speed={0.6}
          opacity={0.2}
          blur={4}
          size="sm"
        />
      </motion.div>

      <motion.div
        className="absolute"
        style={{
          left: '20%',
          top: '40%',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute"
        style={{
          right: '10%',
          bottom: '20%',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${colorTwo}15 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
