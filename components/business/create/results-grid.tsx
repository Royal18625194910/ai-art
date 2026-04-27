'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Download, RefreshCw, Copy, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  const handleZoom = useCallback((index: number) => {
    setZoomIndex(index);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setZoomIndex(null);
  }, []);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomIndex((prev) => (prev !== null && prev < imageUrls.length - 1 ? prev + 1 : prev));
  }, [imageUrls.length]);

  const handleDownloadZoomed = useCallback(() => {
    if (zoomIndex !== null) {
      onDownload(imageUrls[zoomIndex], zoomIndex);
    }
  }, [zoomIndex, imageUrls, onDownload]);

  return (
    <>
      <AnimatePresence>
        {imageUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-4 sm:p-6"
          >
            {/* Header - 移动端优化 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground whitespace-nowrap">{title}</h3>
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-400 border-green-500/20 text-xs sm:text-sm whitespace-nowrap"
                >
                  {successLabel}
                </Badge>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCopyPrompt}
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                >
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                  <span className="whitespace-nowrap">{copyLabel}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  disabled={isGenerating}
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                >
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                  <span className="whitespace-nowrap">{regenerateLabel}</span>
                </Button>
              </div>
            </div>

            {/* Grid - 响应式布局 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {imageUrls.map((img, index) => (
                <motion.div
                  key={`result-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted/30 cursor-pointer"
                  onClick={() => handleZoom(index)}
                >
                  <img
                    src={img}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* 桌面端悬停按钮 */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">#{index + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleZoom(index); }}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                          title="放大预览"
                        >
                          <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDownload(img, index); }}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                          title="下载图片"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 移动端始终显示按钮 */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:hidden bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">#{index + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleZoom(index); }}
                          className="p-2 bg-white/25 rounded-lg backdrop-blur-sm active:bg-white/40 transition-colors"
                        >
                          <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDownload(img, index); }}
                          className="p-2 bg-white/25 rounded-lg backdrop-blur-sm active:bg-white/40 transition-colors"
                        >
                          <Download className="w-4 h-4 text-white" />
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

      {/* Zoom Lightbox - 图片预览 */}
      <AnimatePresence>
        {zoomIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={handleCloseZoom}
          >
            {/* 顶部工具栏 */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6">
              {/* 图片计数器 */}
              <div className="px-3 py-1.5 bg-white/10 rounded-full text-white text-xs sm:text-sm backdrop-blur-sm">
                {zoomIndex + 1} / {imageUrls.length}
              </div>

              {/* 下载和关闭按钮 */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownloadZoomed(); }}
                  className="p-2 sm:p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                  title="下载图片"
                >
                  <Download className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
                </button>
                <button
                  onClick={handleCloseZoom}
                  className="p-2 sm:p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                  title="关闭"
                >
                  <X className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* 左右切换箭头 */}
            {imageUrls.length > 1 && zoomIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            )}
            {imageUrls.length > 1 && zoomIndex < imageUrls.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            )}

            {/* 图片容器 */}
            <motion.div
              key={`zoom-${zoomIndex}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center p-4 sm:p-16 pt-16 sm:pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrls[zoomIndex]}
                alt={`Preview ${zoomIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
