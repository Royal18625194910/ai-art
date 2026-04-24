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

export interface CommonTranslations {
  nav: NavTranslations;
  actions: ActionsTranslations;
  credits: CreditsTranslations;
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
export interface BuyTranslations {
  title: string;
  subtitle: string;
  currentBalance: string;
  selectPackage: string;
  payWith: string;
  success: string;
  error: string;
}

// Create Page
export interface CreateTranslations {
  title: string;
  subtitle: string;
  modeText: string;
  modeImage: string;
  promptPlaceholder: string;
  generate: string;
  generating: string;
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
}

// 页面翻译总览
export interface PageTranslations {
  landing: LandingTranslations;
  buy: BuyTranslations;
  create: CreateTranslations;
  history: HistoryTranslations;
}

// 语言类型
export type Locale = 'zh' | 'en' | 'zh-TW';

// 完整翻译
export interface Translations {
  common: CommonTranslations;
  pages: PageTranslations;
}
