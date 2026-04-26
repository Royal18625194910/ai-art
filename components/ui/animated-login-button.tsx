'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLoginButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedLoginButton({ children, className, onClick }: AnimatedLoginButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative group px-6 py-2.5 rounded-full font-medium text-sm overflow-hidden',
        'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600',
        'text-white shadow-lg shadow-purple-500/25',
        'transition-all duration-300',
        'hover:shadow-purple-500/40 hover:shadow-xl',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />

      {/* Content */}
      <span className="relative flex items-center gap-2">
        <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
        <span>{children}</span>
      </span>
    </motion.button>
  );
}

export function NeonLoginButton({ children, className, onClick }: AnimatedLoginButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative px-6 py-2.5 rounded-lg font-medium text-sm',
        'bg-black/50 backdrop-blur-sm',
        'text-cyan-400 border border-cyan-500/50',
        'transition-all duration-300',
        'hover:border-cyan-400 hover:text-cyan-300',
        'shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity" />

      <span className="relative flex items-center gap-2">
        <span className="relative">
          {children}
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </span>
    </motion.button>
  );
}

export function GradientBorderButton({ children, className, onClick }: AnimatedLoginButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative px-6 py-2.5 rounded-full font-medium text-sm',
        'text-white',
        'group',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient border background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-px">
        <div className="absolute inset-0.5 rounded-full bg-black/80 backdrop-blur-sm group-hover:bg-black/60 transition-colors" />
      </div>

      {/* Animated gradient rotation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity -z-10 animate-pulse" />

      <span className="relative flex items-center gap-2">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-cyan-300 transition-all">
          {children}
        </span>
        <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform duration-300" />
      </span>
    </motion.button>
  );
}

export function GlowingOrbButton({ children, className, onClick }: AnimatedLoginButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative px-6 py-2.5 rounded-full font-medium text-sm',
        'bg-gradient-to-r from-violet-600 to-indigo-600',
        'text-white overflow-hidden',
        'shadow-lg shadow-violet-500/30',
        'group',
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full blur-sm opacity-0 group-hover:opacity-60 group-hover:translate-x-8 transition-all duration-700" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full blur-sm opacity-0 group-hover:opacity-60 group-hover:-translate-x-6 transition-all duration-700 delay-100" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity" />

      <span className="relative flex items-center gap-2">
        <span className="group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] transition-all">
          {children}
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] transition-all duration-300" />
      </span>
    </motion.button>
  );
}
