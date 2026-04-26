'use client';

import { Layers, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type GenerationMode = 'text-to-image' | 'image-to-image';

interface ModeSelectorProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  textToImageLabel: string;
  imageToImageLabel: string;
}

export function ModeSelector({
  mode,
  onModeChange,
  textToImageLabel,
  imageToImageLabel,
}: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex bg-muted/50 rounded-xl p-1">
        <button
          onClick={() => onModeChange('text-to-image')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            mode === 'text-to-image'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Layers className="w-4 h-4" />
          {textToImageLabel}
        </button>
        <button
          onClick={() => onModeChange('image-to-image')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            mode === 'image-to-image'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <ImageIcon className="w-4 h-4" />
          {imageToImageLabel}
        </button>
      </div>
    </div>
  );
}
