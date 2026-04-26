'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/app/history/page';

interface HistoryDetailModalProps {
  item: HistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  copiedId: string | null;
  onCopyPrompt: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  formatDate: (date: number | Date) => string;
  labels: {
    prompt: string;
    parameters: string;
    mode: string;
    size: string;
    quality: string;
    aspectRatio: string;
    creditsUsed: string;
    date: string;
    download: string;
    regenerate: string;
    delete: string;
    copyPrompt: string;
    confirmCopy: string;
    textToImage: string;
    imageToImage: string;
    credits: string;
  };
}

export function HistoryDetailModal({
  item,
  isOpen,
  onClose,
  copiedId,
  onCopyPrompt,
  onDelete,
  formatDate,
  labels,
}: HistoryDetailModalProps) {
  if (!item) return null;

  // Use a placeholder if imageUrl is empty
  const imageUrl = item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-square bg-black/50">
                <img
                  src={imageUrl}
                  alt={item.prompt}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {labels.prompt}
                  </h3>
                  <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-muted-foreground"
                    onClick={() => onCopyPrompt(item)}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedId === item.id ? labels.confirmCopy : labels.copyPrompt}
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {labels.parameters}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{labels.mode}</p>
                      <p className="text-sm font-medium text-foreground">
                        {item.mode === 'text-to-image' ? labels.textToImage : labels.imageToImage}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{labels.size}</p>
                      <p className="text-sm font-medium text-foreground">{item.size}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{labels.quality}</p>
                      <p className="text-sm font-medium text-foreground">{item.quality}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{labels.aspectRatio}</p>
                      <p className="text-sm font-medium text-foreground">{item.aspectRatio}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{labels.creditsUsed}</p>
                      <p className="text-sm font-medium text-foreground">
                        {item.creditsUsed} {labels.credits}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{labels.date}</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="primary" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    {labels.download}
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {labels.regenerate}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {labels.delete}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
