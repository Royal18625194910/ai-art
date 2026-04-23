'use client';

import { cn } from '@/lib/utils';
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface MagicRingsProps {
  className?: string;
  color?: string;
  colorTwo?: string;
  ringCount?: number;
  speed?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  hoverScale?: number;
  parallax?: number;
  clickBurst?: boolean;
}

export function MagicRings({
  className,
  color = '#A855F7',
  colorTwo = '#6366F1',
  ringCount = 6,
  speed = 1,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0.1,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = false,
}: MagicRingsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [clickBurstTime, setClickBurstTime] = useState(-1);

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 168, g: 85, b: 247 };
  }, []);

  const lerpColor = useCallback(
    (color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }, t: number) => {
      return {
        r: Math.round(color1.r + (color2.r - color1.r) * t),
        g: Math.round(color1.g + (color2.g - color1.g) * t),
        b: Math.round(color1.b + (color2.b - color1.b) * t),
      };
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!followMouse || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    },
    [followMouse]
  );

  const handleClick = useCallback(() => {
    if (clickBurst) {
      setClickBurstTime(0);
    }
  }, [clickBurst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rgb1 = hexToRgb(color);
    const rgb2 = hexToRgb(colorTwo);

    let startTime = performance.now();
    let currentBurstTime = clickBurstTime;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      let actualCenterX = centerX;
      let actualCenterY = centerY;
      if (followMouse) {
        actualCenterX += (mouseRef.current.x - 0.5) * width * mouseInfluence;
        actualCenterY += (mouseRef.current.y - 0.5) * height * mouseInfluence;
      }

      ctx.clearRect(0, 0, width, height);

      const maxRadius = Math.min(width, height) * 0.45;
      const scale = isHovered ? hoverScale : 1;

      let burstScale = 1;
      let burstOpacity = 0;
      if (clickBurstTime >= 0) {
        const burstElapsed = (time - clickBurstTime) / 1000;
        if (burstElapsed < 0.5) {
          burstScale = 1 + burstElapsed * 0.5;
          burstOpacity = 1 - burstElapsed * 2;
        }
      }

      for (let i = 0; i < ringCount; i++) {
        const ringProgress = i / (ringCount - 1 || 1);
        const ringColor = lerpColor(rgb1, rgb2, ringProgress);

        const baseRingRadius = maxRadius * (baseRadius + i * radiusStep);
        const timeExpansion = elapsed * speed * scaleRate * scale * burstScale;
        const ringRadius = baseRingRadius * (1 + timeExpansion * 0.3);

        const cycleDuration = 2 + i * 0.3;
        const cyclePos = (elapsed % cycleDuration) / cycleDuration;

        let ringOpacity = 1;
        if (cyclePos < fadeIn) {
          ringOpacity = cyclePos / fadeIn;
        } else if (cyclePos > 1 - fadeOut) {
          ringOpacity = (1 - cyclePos) / fadeOut;
        }

        ringOpacity *= opacity;
        if (burstOpacity > 0) {
          ringOpacity = Math.min(1, ringOpacity + burstOpacity * 0.5);
        }

        const parallaxOffset = i * parallax * 20;
        const drawCenterX = actualCenterX + (isHovered ? parallaxOffset : 0);
        const drawCenterY = actualCenterY + (isHovered ? parallaxOffset : 0);

        const ringScale = ringRadius / maxRadius;
        const glowIntensity = Math.exp(-attenuation * (1 - ringScale));

        const segments = 200;
        const angularCutaway = Math.pow(ringGap, i);
        const startAngle = (rotation * Math.PI) / 180 + elapsed * speed * (0.5 + i * 0.1);
        const totalAngle = (2 - angularCutaway) * Math.PI;

        if (totalAngle <= 0) continue;

        ctx.save();
        ctx.globalAlpha = ringOpacity * glowIntensity;

        if (blur > 0) {
          ctx.shadowColor = `rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, ${ringOpacity})`;
          ctx.shadowBlur = blur;
        }

        ctx.beginPath();
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const angle = startAngle + t * totalAngle;

          let noiseOffset = 0;
          if (noiseAmount > 0) {
            const noiseSeed = i * 1000 + t * 100 + elapsed * speed * 0.5;
            noiseOffset = (Math.sin(noiseSeed) * Math.cos(noiseSeed * 1.3)) * noiseAmount * ringRadius * 0.05;
          }

          const r = ringRadius + noiseOffset;
          const x = drawCenterX + Math.cos(angle) * r;
          const y = drawCenterY + Math.sin(angle) * r;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = `rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, ${ringOpacity})`;
        ctx.lineWidth = lineThickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (blur > 0 && opacity > 0.5) {
          ctx.shadowBlur = blur * 2;
          ctx.globalAlpha = ringOpacity * glowIntensity * 0.3;
          ctx.strokeStyle = `rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, ${ringOpacity * 0.5})`;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    color,
    colorTwo,
    ringCount,
    speed,
    attenuation,
    lineThickness,
    baseRadius,
    radiusStep,
    scaleRate,
    opacity,
    blur,
    noiseAmount,
    rotation,
    ringGap,
    fadeIn,
    fadeOut,
    followMouse,
    mouseInfluence,
    hoverScale,
    parallax,
    clickBurstTime,
    isHovered,
    hexToRgb,
    lerpColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
