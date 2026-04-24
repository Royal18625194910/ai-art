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

// Re-export from locales for backward compatibility
export type { Locale, LocaleConfig } from '@/locales';
