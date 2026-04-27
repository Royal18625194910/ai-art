'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface ErrorPanelProps {
  error: string;
}

export function ErrorPanel({ error }: ErrorPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6"
    >
      <div className="flex items-center gap-2 text-red-400">
        <Info className="w-5 h-5" />
        <span className="font-medium">生成失败</span>
      </div>
      <p className="mt-2 text-sm text-red-300/80">{error}</p>
    </motion.div>
  );
}
