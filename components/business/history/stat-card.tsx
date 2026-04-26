'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color = 'text-purple-400',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 bg-card/30 rounded-xl border border-border/50',
        className
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center',
          color
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
