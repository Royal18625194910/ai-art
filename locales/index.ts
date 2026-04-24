// 按页面组织的翻译导出
import type { Locale, Translations, CommonTranslations, PageTranslations } from './types';

// Common translations
import { common as commonTranslations } from './common';

// Page translations
import { landing } from './pages/landing';
import { buy } from './pages/buy';
import { create } from './pages/create';
import { history } from './pages/history';

// 完整的翻译对象 - 按语言组织
export const translations: Record<Locale, Translations> = {
  zh: {
    common: commonTranslations.zh,
    pages: {
      landing: landing.zh,
      buy: buy.zh,
      create: create.zh,
      history: history.zh,
    },
  },
  'zh-TW': {
    common: commonTranslations['zh-TW'],
    pages: {
      landing: landing['zh-TW'],
      buy: buy['zh-TW'],
      create: create['zh-TW'],
      history: history['zh-TW'],
    },
  },
  en: {
    common: commonTranslations.en,
    pages: {
      landing: landing.en,
      buy: buy.en,
      create: create.en,
      history: history.en,
    },
  },
};

// 便捷获取函数
export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function getCommon(locale: Locale): CommonTranslations {
  return translations[locale].common;
}

export function getPages(locale: Locale): PageTranslations {
  return translations[locale].pages;
}

// 获取特定页面翻译
export function getLanding(locale: Locale) {
  return translations[locale].pages.landing;
}

export function getBuy(locale: Locale) {
  return translations[locale].pages.buy;
}

export function getCreate(locale: Locale) {
  return translations[locale].pages.create;
}

export function getHistory(locale: Locale) {
  return translations[locale].pages.history;
}

// 导出所有类型
export * from './types';

// 导出页面翻译对象
export { landing, buy, create, history };
