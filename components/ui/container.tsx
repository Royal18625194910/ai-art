import * as React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        {
          'max-w-3xl': size === 'sm',
          'max-w-5xl': size === 'md',
          'max-w-7xl': size === 'lg',
          'max-w-[90rem]': size === 'xl',
          'max-w-none': size === 'full',
        },
        className
      )}
      {...props}
    />
  )
);
Container.displayName = 'Container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'alternate' | 'gradient' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', padding = 'lg', ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        'relative',
        {
          'py-16 md:py-24': padding === 'lg',
          'py-8 md:py-12': padding === 'md',
          'py-24 md:py-32': padding === 'xl',
          'py-4 md:py-6': padding === 'sm',
          'py-0': padding === 'none',
          'bg-background': variant === 'default',
          'bg-muted/30': variant === 'alternate',
          'bg-gradient-to-b from-background to-muted/50': variant === 'gradient',
          'bg-foreground text-background': variant === 'dark',
        },
        className
      )}
      {...props}
    />
  )
);
Section.displayName = 'Section';

export { Container, Section };
