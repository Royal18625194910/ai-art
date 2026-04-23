'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { localeConfigs } from '@/stores/use-language-store';
import { Locale } from '@/types';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'select';
}

export function LanguageSwitcher({
  className,
  variant = 'dropdown',
}: LanguageSwitcherProps) {
  const { locale, setLocale, availableLocales, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
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
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-xl',
          'transition-all hover:bg-muted',
          'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
          isOpen && 'bg-muted'
        )}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {localeConfigs[locale].nativeName}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2',
            'w-48 rounded-xl border bg-background shadow-lg',
            'overflow-hidden z-50'
          )}
        >
          {availableLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3',
                'text-sm transition-colors',
                'hover:bg-muted',
                locale === loc && 'bg-purple-50 dark:bg-purple-950/30'
              )}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">{localeConfigs[loc].flag}</span>
                <div className="text-left">
                  <div className="font-medium">{localeConfigs[loc].nativeName}</div>
                  <div className="text-xs text-muted-foreground">
                    {localeConfigs[loc].name}
                  </div>
                </div>
              </span>
              {locale === loc && <Check className="w-4 h-4 text-purple-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
