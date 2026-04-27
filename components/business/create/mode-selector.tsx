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
      <div className="flex bg-muted/50 rounded-xl p-1 w-full sm:w-auto">
        <button
          onClick={() => onModeChange('text-to-image')}
          className={cn(
            'flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none whitespace-nowrap',
            mode === 'text-to-image'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>{textToImageLabel}</span>
        </button>
        <button
          onClick={() => onModeChange('image-to-image')}
          className={cn(
            'flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none whitespace-nowrap',
            mode === 'image-to-image'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>{imageToImageLabel}</span>
        </button>
      </div>
    </div>
  );
}
