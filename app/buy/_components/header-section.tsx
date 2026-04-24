'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderSectionProps {
  title: string;
  subtitle: string;
  balanceLabel: string;
  creditsLabel: string;
  currentCredits: number;
}

export function HeaderSection({
  title,
  subtitle,
  balanceLabel,
  creditsLabel,
  currentCredits,
}: HeaderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-purple-300">超值套餐</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>

      <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-card/50 backdrop-blur-xl border border-border/50">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div className="text-left">
          <p className="text-sm text-muted-foreground">{balanceLabel}</p>
          <p className="text-lg font-semibold text-foreground">
            {currentCredits} <span className="text-muted-foreground font-normal">{creditsLabel}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
