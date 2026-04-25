'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderSectionProps {
  title: string;
  subtitle: string;
}

export function HeaderSection({
  title,
  subtitle,
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
    </motion.div>
  );
}
