'use client';

import { Search, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterMode = 'all' | 'text-to-image' | 'image-to-image';
type DateRange = 'today' | 'last7Days' | 'last30Days' | 'thisMonth' | 'allTime';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  modeOptions: { value: FilterMode; label: string }[];
  dateOptions: { value: DateRange; label: string }[];
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  filterMode,
  onFilterModeChange,
  dateRange,
  onDateRangeChange,
  modeOptions,
  dateOptions,
}: FilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索提示词..."
          className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/50 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-36 justify-between">
            <span className="text-sm">
              {modeOptions.find((o) => o.value === filterMode)?.label}
            </span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-36">
          {modeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onFilterModeChange(option.value)}
              className={cn(
                'justify-between',
                filterMode === option.value && 'text-purple-400'
              )}
            >
              {option.label}
              {filterMode === option.value && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-40 justify-between">
            <span className="text-sm">
              {dateOptions.find((o) => o.value === dateRange)?.label}
            </span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {dateOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onDateRangeChange(option.value)}
              className={cn(
                'justify-between',
                dateRange === option.value && 'text-purple-400'
              )}
            >
              {option.label}
              {dateRange === option.value && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
