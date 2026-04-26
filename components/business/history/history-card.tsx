'use client';

import { motion } from 'framer-motion';
import { Download, Copy, Eye, Check } from 'lucide-react';
import { HistoryItem } from '@/app/history/page';

interface HistoryCardProps {
  item: HistoryItem;
  index: number;
  copiedId: string | null;
  onCopyPrompt: (item: HistoryItem) => void;
  onViewDetails: (item: HistoryItem) => void;
  formatDate: (date: number | Date) => string;
  copyLabel: string;
  downloadLabel: string;
  viewLabel: string;
}

export function HistoryCard({
  item,
  index,
  copiedId,
  onCopyPrompt,
  onViewDetails,
  formatDate,
  copyLabel,
  downloadLabel,
  viewLabel,
}: HistoryCardProps) {
  // Use a placeholder if imageUrl is empty
  const imageUrl = item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-card/30 cursor-pointer"
      onClick={() => onViewDetails(item)}
    >
      <img
        src={imageUrl}
        alt={item.prompt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-white/80 mb-2 line-clamp-2">{item.prompt}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">{formatDate(item.createdAt)}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyPrompt(item);
              }}
              className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
              title={copyLabel}
            >
              {copiedId === item.id ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white" />
              )}
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
              title={downloadLabel}
            >
              <Download className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(item);
              }}
              className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
              title={viewLabel}
            >
              <Eye className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
