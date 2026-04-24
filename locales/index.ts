// 按语言组织的翻译导出
import type { Locale, Translations, CommonTranslations, PageTranslations } from './types';

// Common translations
import { common as commonZh } from './common/zh';
import { common as commonZhTw } from './common/zh-tw';
import { common as commonEn } from './common/en';

// Landing page translations
import { landing as landingZh } from './pages/landing/zh';
import { landing as landingZhTw } from './pages/landing/zh-tw';
import { landing as landingEn } from './pages/landing/en';

// Buy page translations
import { buy as buyZh } from './pages/buy/zh';
import { buy as buyZhTw } from './pages/buy/zh-tw';
import { buy as buyEn } from './pages/buy/en';

// Create page translations
import { create as createZh } from './pages/create/zh';
import { create as createZhTw } from './pages/create/zh-tw';
import { create as createEn } from './pages/create/en';

// History page translations
import { history as historyZh } from './pages/history/zh';
import { history as historyZhTw } from './pages/history/zh-tw';
import { history as historyEn } from './pages/history/en';

// 完整的翻译对象
export const translations: Record<Locale, Translations> = {
  zh: {
    common: commonZh,
    pages: {
      landing: landingZh,
      buy: buyZh,
      create: createZh,
      history: historyZh,
    },
  },
  'zh-TW': {
    common: commonZhTw,
    pages: {
      landing: landingZhTw,
      buy: buyZhTw,
      create: createZhTw,
      history: historyZhTw,
    },
  },
  en: {
    common: commonEn,
    pages: {
      landing: landingEn,
      buy: buyEn,
      create: createEn,
      history: historyEn,
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
export type { CommonTranslations } from './types';
