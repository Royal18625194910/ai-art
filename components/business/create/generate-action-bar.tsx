'use client';

import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationState } from '@/hooks/use-generation';

interface GenerateActionBarProps {
  estimatedCredits: number;
  isGenerating: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
  state: GenerationState | null;
  getStatusText: (state: GenerationState | null) => string;
  useCreditsLabel: string;
  generatingLabel: string;
  generateLabel: string;
}

export function GenerateActionBar({
  estimatedCredits,
  isGenerating,
  canGenerate,
  onGenerate,
  state,
  getStatusText,
  useCreditsLabel,
  generatingLabel,
  generateLabel,
}: GenerateActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-purple-300">
          {useCreditsLabel.replace('{count}', estimatedCredits.toString())}
        </span>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onGenerate}
        disabled={!canGenerate}
        className="w-full sm:w-auto"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {state ? getStatusText(state) : generatingLabel}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {generateLabel}
          </span>
        )}
      </Button>
    </motion.div>
  );
}
