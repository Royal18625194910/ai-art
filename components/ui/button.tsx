import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'primary' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30': variant === 'primary',
            'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:from-purple-600 hover:to-purple-700 active:scale-95': variant === 'gradient',
            'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-400/25 animate-pulse-slow': variant === 'glow',
            'bg-primary text-primary-foreground shadow hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90': variant === 'destructive',
            'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80': variant === 'secondary',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline': variant === 'link',
          },
          {
            'h-10 px-6 py-2': size === 'default',
            'h-9 rounded-lg px-4 text-sm': size === 'sm',
            'h-14 rounded-2xl px-8 text-base font-medium': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
