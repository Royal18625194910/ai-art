'use client';

import { motion } from 'framer-motion';

interface TipsPanelProps {
  tips: string[];
  title: string;
}

export function TipsPanel({ tips, title }: TipsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6 sticky top-24"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
