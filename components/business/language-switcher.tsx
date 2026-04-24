'use client';

import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { localeConfigs } from '@/stores/use-language-store';
import { Locale } from '@/locales';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'select';
}

export function LanguageSwitcher({
  className,
  variant = 'dropdown',
}: LanguageSwitcherProps) {
  const { locale, setLocale, availableLocales } = useTranslation();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  if (variant === 'buttons') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {availableLocales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={cn(
              'px-2 py-1 text-sm rounded-lg transition-all',
              locale === loc
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {localeConfigs[loc].flag}
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-xl',
          'transition-all hover:bg-muted/50',
          'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
          'data-[state=open]:bg-muted/50',
          className
        )}
      >
        <Globe className="w-4 h-4 text-foreground" />
        <span className="hidden sm:inline text-foreground">
          {localeConfigs[locale].nativeName}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-popover border-border">
        {availableLocales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              'focus:bg-accent focus:text-accent-foreground',
              locale === loc && 'bg-accent/50'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{localeConfigs[loc].flag}</span>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {localeConfigs[loc].nativeName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {localeConfigs[loc].name}
                </span>
              </div>
            </div>
            {locale === loc && (
              <Check className="w-4 h-4 text-purple-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
