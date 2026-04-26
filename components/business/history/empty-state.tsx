'use client';

import { motion } from 'framer-motion';
import { ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  searchQuery?: string;
  noResultsTitle?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  searchQuery,
  noResultsTitle,
}: EmptyStateProps) {
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
        {searchQuery ? noResultsTitle : title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button variant="primary" onClick={onAction}>
        <Plus className="w-5 h-5 mr-2" />
        {actionLabel}
      </Button>
    </motion.div>
  );
}
