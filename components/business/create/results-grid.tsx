'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Download, RefreshCw, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ResultsGridProps {
  imageUrls: string[];
  isGenerating: boolean;
  onDownload: (url: string, index: number) => void;
  onRegenerate: () => void;
  onCopyPrompt: () => void;
  title: string;
  successLabel: string;
  copyLabel: string;
  regenerateLabel: string;
}

export function ResultsGrid({
  imageUrls,
  isGenerating,
  onDownload,
  onRegenerate,
  onCopyPrompt,
  title,
  successLabel,
  copyLabel,
  regenerateLabel,
}: ResultsGridProps) {
  return (
    <AnimatePresence>
      {imageUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-400 border-green-500/20"
              >
                {successLabel}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopyPrompt}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copyLabel}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                disabled={isGenerating}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {regenerateLabel}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {imageUrls.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square rounded-xl overflow-hidden border border-border/50"
              >
                <img
                  src={img}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">#{index + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDownload(img, index)}
                        className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
