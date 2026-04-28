import type { ReactNode } from 'react';

export interface SiteConfig {
  name: string;
  description: string;
  author: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
    docs: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceFormatted: string;
  perCreditPrice: string;
  description: string;
  features: string[];
  isPopular: boolean;
  savingsPercent: number;
}

// Re-export from locales for backward compatibility
export type { Locale, LocaleConfig } from '@/locales';

export interface Translation {
  [key: string]: TranslationValue;
}

export type TranslationValue = string | string[] | Translation | null | undefined;
