import { useCallback, useMemo } from 'react';
import { useLanguageStore, localeConfigs } from '@/stores/use-language-store';
import {
  type Locale,
  translations,
  type LandingTranslations,
  type BuyTranslations,
  type CreateTranslations,
  type HistoryTranslations,
  type CommonTranslations,
} from '@/locales';

// 通用 hook，返回所有翻译工具
export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);
  const safeLocale = (locale === 'zh' || locale === 'en' || locale === 'zh-TW') ? locale : 'zh';
  const currentTranslations = translations[safeLocale];

  const t = useCallback(
    <K extends keyof CommonTranslations>(key: K): CommonTranslations[K] => {
      return currentTranslations.common[key];
    },
    [currentTranslations]
  );

  const availableLocales = useMemo(() => Object.keys(localeConfigs) as Locale[], []);

  return {
    locale,
    setLocale,
    t,
    common: currentTranslations.common,
    pages: currentTranslations.pages,
    availableLocales,
    localeConfigs,
  };
}

// Landing 页面专用 hook
export function useLandingTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const safeLocale = (locale === 'zh' || locale === 'en' || locale === 'zh-TW') ? locale : 'zh';
  const landing = translations[safeLocale].pages.landing;

  return {
    t: useCallback(
      <K extends keyof LandingTranslations>(key: K): LandingTranslations[K] => {
        return landing[key];
      },
      [landing]
    ),
    landing,
  };
}

// Buy 页面专用 hook
export function useBuyTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const safeLocale = (locale === 'zh' || locale === 'en' || locale === 'zh-TW') ? locale : 'zh';
  const buy = translations[safeLocale].pages.buy;

  return {
    t: useCallback(
      <K extends keyof BuyTranslations>(key: K): BuyTranslations[K] => {
        return buy[key];
      },
      [buy]
    ),
    buy,
  };
}

// Create 页面专用 hook
export function useCreateTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const safeLocale = (locale === 'zh' || locale === 'en' || locale === 'zh-TW') ? locale : 'zh';
  const create = translations[safeLocale].pages.create;

  return {
    t: useCallback(
      <K extends keyof CreateTranslations>(key: K): CreateTranslations[K] => {
        return create[key];
      },
      [create]
    ),
    create,
  };
}

// History 页面专用 hook
export function useHistoryTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const safeLocale = (locale === 'zh' || locale === 'en' || locale === 'zh-TW') ? locale : 'zh';
  const history = translations[safeLocale].pages.history;

  return {
    t: useCallback(
      <K extends keyof HistoryTranslations>(key: K): HistoryTranslations[K] => {
        return history[key];
      },
      [history]
    ),
    history,
  };
}

// 保持向后兼容
export function usePageTranslation(page: 'landing' | 'buy' | 'create' | 'history') {
  const locale = useLanguageStore((state) => state.locale);
  const safeLocale = (locale === 'zh' || locale === 'en' || locale === 'zh-TW') ? locale : 'zh';
  const pageData = translations[safeLocale].pages[page];

  return {
    t: useCallback(
      (key: string, params?: Record<string, string | number>) => {
        const keys = key.split('.');
        let result: unknown = pageData;
        for (const k of keys) {
          if (result && typeof result === 'object') {
            result = (result as Record<string, unknown>)[k];
          } else {
            return key;
          }
        }
        let text = result as string;
        if (params && typeof text === 'string') {
          Object.entries(params).forEach(([key, value]) => {
            text = text.replace(new RegExp(`{${key}}`, 'g'), String(value));
          });
        }
        return text;
      },
      [pageData]
    ),
    tObject: useCallback(
      (key: string) => {
        const keys = key.split('.');
        let result: unknown = pageData;
        for (const k of keys) {
          if (result && typeof result === 'object') {
            result = (result as Record<string, unknown>)[k];
          } else {
            return {};
          }
        }
        return result as Record<string, unknown>;
      },
      [pageData]
    ),
    tArray: useCallback(
      (key: string) => {
        const keys = key.split('.');
        let result: unknown = pageData;
        for (const k of keys) {
          if (result && typeof result === 'object') {
            result = (result as Record<string, unknown>)[k];
          } else {
            return [];
          }
        }
        return Array.isArray(result) ? result : [];
      },
      [pageData]
    ),
  };
}

export function useCommonTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const safeLocale = (locale === 'zh' || locale === 'en' || locale === 'zh-TW') ? locale : 'zh';
  const common = translations[safeLocale].common;

  // Backward compatible t function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let result: unknown = common;
      for (const k of keys) {
        if (result && typeof result === 'object') {
          result = (result as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      let text = result as string;
      if (params && typeof text === 'string') {
        Object.entries(params).forEach(([key, value]) => {
          text = text.replace(`{${key}}`, String(value));
        });
      }
      return text;
    },
    [common]
  );

  return {
    nav: common.nav,
    actions: common.actions,
    credits: common.credits,
    time: common.time,
    t,
  };
}
