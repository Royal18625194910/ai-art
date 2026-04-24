import { Locale, Translation } from '@/types';

import commonEn from './common/en.json';
import commonZhCN from './common/zh-CN.json';
import commonZhTW from './common/zh-TW.json';

import landingEn from './pages/landing/en.json';
import landingZhCN from './pages/landing/zh-CN.json';
import landingZhTW from './pages/landing/zh-TW.json';

import createEn from './pages/create/en.json';
import createZhCN from './pages/create/zh-CN.json';
import createZhTW from './pages/create/zh-TW.json';

import buyEn from './pages/buy/en.json';
import buyZhCN from './pages/buy/zh-CN.json';
import buyZhTW from './pages/buy/zh-TW.json';

import historyEn from './pages/history/en.json';
import historyZhCN from './pages/history/zh-CN.json';
import historyZhTW from './pages/history/zh-TW.json';

const translations: Record<Locale, Translation> = {
  'en': {
    common: commonEn,
    pages: {
      landing: landingEn,
      create: createEn,
      buy: buyEn,
      history: historyEn,
    },
  } as unknown as Translation,
  'zh-CN': {
    common: commonZhCN,
    pages: {
      landing: landingZhCN,
      create: createZhCN,
      buy: buyZhCN,
      history: historyZhCN,
    },
  } as unknown as Translation,
  'zh-TW': {
    common: commonZhTW,
    pages: {
      landing: landingZhTW,
      create: createZhTW,
      buy: buyZhTW,
      history: historyZhTW,
    },
  } as unknown as Translation,
};

export function getTranslations(locale: Locale): Translation {
  return translations[locale];
}

export function getCommonTranslation(locale: Locale): Translation {
  return (translations[locale] as any)?.common || {};
}

export function getPageTranslation(locale: Locale, page: string): Translation {
  return (translations[locale] as any)?.pages?.[page] || {};
}

export { translations };
