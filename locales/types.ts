// 通用类型定义
export interface NavTranslations {
  home: string;
  create: string;
  buy: string;
  history: string;
  login: string;
  logout: string;
}

export interface ActionsTranslations {
  confirm: string;
  cancel: string;
  save: string;
  delete: string;
  download: string;
  share: string;
  retry: string;
  loading: string;
}

export interface CreditsTranslations {
  label: string;
  balance: string;
  insufficient: string;
}

export interface TimeTranslations {
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
}

export interface CommonTranslations {
  nav: NavTranslations;
  actions: ActionsTranslations;
  credits: CreditsTranslations;
  time: TimeTranslations;
}

// Landing Page
export interface LandingHeroStats {
  users: string;
  images: string;
  templates: string;
}

export interface LandingHeroTranslations {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  creditsInfo: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: LandingHeroStats;
}

export interface LandingFeatureItem {
  title: string;
  description: string;
}

export interface LandingFeaturesTranslations {
  badge: string;
  title: string;
  subtitle: string;
  items: LandingFeatureItem[];
  cta: {
    badge: string;
    title: string;
    description: string;
  };
}

export interface LandingGalleryCategories {
  all: string;
  scifi: string;
  anime: string;
  fantasy: string;
  abstract: string;
  portrait: string;
}

export interface LandingGalleryTranslations {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  categories: LandingGalleryCategories;
}

export interface LandingCtaTranslations {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  freeTrial: string;
  noCreditCard: string;
  cancelAnytime: string;
}

export interface LandingTranslations {
  hero: LandingHeroTranslations;
  features: LandingFeaturesTranslations;
  gallery: LandingGalleryTranslations;
  cta: LandingCtaTranslations;
}

// Buy Page
export interface BuyPackage {
  name: string;
  credits: string;
  price: string;
  priceCN: string;
  description: string;
  perCreditPrice: string;
  features: string[];
  isPopular: boolean;
  savingsPercent: string;
}

export interface BuyPackages {
  starter: BuyPackage;
  standard: BuyPackage;
  premium: BuyPackage;
}

export interface BuyFAQItem {
  question: string;
  answer: string;
}

export interface BuyPayment {
  title: string;
  description: string;
  submit: string;
  processing: string;
  secureNote: string;
  selected: string;
}

export interface BuyTranslations {
  title: string;
  subtitle: string;
  currentBalance: string;
  selectPackage: string;
  payWith: string;
  success: string;
  error: string;
  packages: BuyPackages;
  faq: {
    title: string;
    items: BuyFAQItem[];
  };
  payment: BuyPayment;
  // Backward compatibility keys
  bestValue: string;
  recommended: string;
  savings: string;
}

// Create Page
export interface CreateTranslations {
  title: string;
  subtitle: string;
  mode: {
    textToImage: string;
    imageToImage: string;
  };
  textToImage: {
    title: string;
    placeholder: string;
    tips: string;
    examplesLabel: string;
    examples: string[];
  };
  imageToImage: {
    uploadTitle: string;
    uploadDesc: string;
    dragHint: string;
    tips: string;
    maxFiles: string;
    fileFormat: string;
  };
  parameters: {
    title: string;
    size: {
      label: string;
      options: Record<string, string>;
    };
    aspectRatio: {
      label: string;
      options: Record<string, string>;
    };
  };
  actions: {
    generate: string;
    generating: string;
    useCredits: string;
    currentBalance: string;
  };
  results: {
    title: string;
    success: string;
  };
  card: {
    copyPrompt: string;
    regenerate: string;
  };
  tips: {
    title: string;
    items: string[];
  };
}

// History Page
export interface HistoryTranslations {
  title: string;
  subtitle: string;
  filterAll: string;
  filterText: string;
  filterImage: string;
  download: string;
  delete: string;
  empty: string;
  emptyDesc: string;
}

// 页面翻译总览
export interface PageTranslations {
  landing: LandingTranslations;
  buy: BuyTranslations;
  create: CreateTranslations;
  history: HistoryTranslations;
}

// FAQ Section
export interface FAQItem {
  question: string;
  answer: string;
}

export interface LandingFAQTranslations {
  badge: string;
  title: string;
  subtitle: string;
  items: FAQItem[];
  contactTitle: string;
  contactDescription: string;
  contactCta: string;
}

// Pricing Section
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
}

export interface LandingPricingTranslations {
  badge: string;
  title: string;
  subtitle: string;
  plans: PricingPlan[];
  monthlyLabel: string;
  yearlyLabel: string;
  yearlyDiscount: string;
  footerNote: string;
  freeTrial: string;
  noCreditCard: string;
  cancelAnytime: string;
}

// Landing Page
export interface LandingTranslations {
  hero: LandingHeroTranslations;
  features: LandingFeaturesTranslations;
  gallery: LandingGalleryTranslations;
  cta: LandingCtaTranslations;
  faq: LandingFAQTranslations;
  pricing: LandingPricingTranslations;
  footer: {
    copyright: string;
  };
}

// 语言类型
export type Locale = 'zh' | 'en' | 'zh-TW';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

// 完整翻译
export interface Translations {
  common: CommonTranslations;
  pages: PageTranslations;
}
