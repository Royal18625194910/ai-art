'use client';

import { Sliders, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SelectOption {
  key: string;
  label: string;
}

interface ParametersPanelProps {
  selectedQuality: string;
  onQualityChange: (quality: string) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  qualityOptions: SelectOption[];
  aspectRatioOptions: SelectOption[];
  isGenerating: boolean;
  title: string;
  sizeLabel: string;
  aspectRatioLabel: string;
}

export function ParametersPanel({
  selectedQuality,
  onQualityChange,
  aspectRatio,
  onAspectRatioChange,
  qualityOptions,
  aspectRatioOptions,
  isGenerating,
  title,
  sizeLabel,
  aspectRatioLabel,
}: ParametersPanelProps) {
  const selectedQualityOption = qualityOptions.find((o) => o.key === selectedQuality);
  const selectedAspectRatioOption = aspectRatioOptions.find((o) => o.key === aspectRatio);

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            {sizeLabel}
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isGenerating}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-background/50 border border-border/50 rounded-xl text-foreground hover:border-purple-500/50 transition-all disabled:opacity-50"
              >
                <span className="text-sm">
                  {selectedQualityOption?.label || selectedQuality}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full min-w-48">
              {qualityOptions.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() => onQualityChange(option.key)}
                  className={cn(
                    'justify-between',
                    selectedQuality === option.key && 'text-purple-400'
                  )}
                >
                  {option.label}
                  {selectedQuality === option.key && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            {aspectRatioLabel}
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isGenerating}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-background/50 border border-border/50 rounded-xl text-foreground hover:border-purple-500/50 transition-all disabled:opacity-50"
              >
                <span className="text-sm">
                  {selectedAspectRatioOption?.label || aspectRatio}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full min-w-48">
              {aspectRatioOptions.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() => onAspectRatioChange(option.key)}
                  className={cn(
                    'justify-between',
                    aspectRatio === option.key && 'text-purple-400'
                  )}
                >
                  {option.label}
                  {aspectRatio === option.key && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
