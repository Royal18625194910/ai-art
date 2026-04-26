'use client';

import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/app/history/page';
import { HistoryCard } from './history-card';

interface HistoryGridProps {
  items: HistoryItem[];
  copiedId: string | null;
  onCopyPrompt: (item: HistoryItem) => void;
  onViewDetails: (item: HistoryItem) => void;
  formatDate: (date: number | Date) => string;
  labels: {
    copyPrompt: string;
    download: string;
    viewDetails: string;
    empty: string;
    emptyDesc: string;
    createNow: string;
    noResults: string;
    searchQuery?: string;
  };
}

export function HistoryGrid({
  items,
  copiedId,
  onCopyPrompt,
  onViewDetails,
  formatDate,
  labels,
}: HistoryGridProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {labels.searchQuery ? labels.noResults : labels.empty}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">{labels.emptyDesc}</p>
        <Button variant="primary" onClick={() => (window.location.href = '/create')}>
          {labels.createNow}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <HistoryCard
            key={item.id}
            item={item}
            index={index}
            copiedId={copiedId}
            onCopyPrompt={onCopyPrompt}
            onViewDetails={onViewDetails}
            formatDate={formatDate}
            copyLabel={labels.copyPrompt}
            downloadLabel={labels.download}
            viewLabel={labels.viewDetails}
          />
        ))}
      </div>
    </motion.div>
  );
}
