export type Locale = 'en' | 'zh-CN' | 'zh-TW';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

export type TranslationValue = string | number | boolean | Translation | Translation[];

export interface Translation {
  [key: string]: TranslationValue;
}

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

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}
