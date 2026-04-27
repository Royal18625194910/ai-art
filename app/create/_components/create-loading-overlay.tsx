'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import type { GenerationState } from '@/hooks/use-generation';

interface CreateLoadingOverlayProps {
  isGenerating: boolean;
  state: GenerationState;
}

export function CreateLoadingOverlay({ isGenerating, state }: CreateLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-center justify-center text-center gap-8 p-10 rounded-3xl bg-card/95 border border-purple-500/20 shadow-2xl min-w-[320px]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl animate-pulse" />
              <Spinner className="relative w-14 h-14 text-purple-400" />
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${state}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold text-foreground">
                    {state === 'generating' ? 'AI 正在创作...' : '准备创作...'}
                  </h3>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${state}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed"
                >
                  {state === 'generating'
                    ? '正在将您的创意转化为艺术作品，请稍候...'
                    : '正在检查积分和准备生成环境...'}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
