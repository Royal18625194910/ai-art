'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GenerationState } from '@/hooks/use-generation';

interface GenerationProgressProps {
  isGenerating: boolean;
  progress: number;
  state: GenerationState | null;
  getStatusText: (state: GenerationState | null) => string;
  getStatusColor: (state: GenerationState | null) => string;
}

export function GenerationProgress({
  isGenerating,
  progress,
  state,
  getStatusText,
  getStatusColor,
}: GenerationProgressProps) {
  if (!isGenerating || progress <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          <span className="text-sm font-medium text-foreground">
            {getStatusText(state)}
          </span>
        </div>
        <span className={cn('text-sm font-medium', getStatusColor(state))}>
          {progress}%
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
