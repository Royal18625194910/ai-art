'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, Trash2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/app/history/page';
import { downloadImage } from '@/lib/common/download';

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
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleDownload = useCallback(async () => {
    if (item?.imageUrl) {
      const filename = `ai-art-${item.id}-${Date.now()}.png`;
      await downloadImage(item.imageUrl, filename);
    }
  }, [item]);

  const handleImageClick = useCallback(() => {
    setIsImageZoomed(true);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setIsImageZoomed(false);
  }, []);

  if (!item) return null;

  // Use a placeholder if imageUrl is empty
  const imageUrl = item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  return (
    <>
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
                <div
                  className="relative aspect-square bg-black/50 cursor-zoom-in group"
                  onClick={handleImageClick}
                >
                  <img
                    src={imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-contain"
                  />
                  {/* 悬停提示 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                    <div className="p-3 bg-black/50 rounded-full backdrop-blur-sm">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
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
                    <Button variant="primary" className="flex-1" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      {labels.download}
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

      {/* 图片放大预览 */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={handleCloseZoom}
          >
            {/* 顶部工具栏 */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end p-4 sm:p-6 gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                title={labels.download}
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleCloseZoom}
                className="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                title="关闭"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* 图片容器 */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full flex items-center justify-center pt-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrl}
                alt={item.prompt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
