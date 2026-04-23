import { useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/stores/use-language-store';
import { Locale, Translation } from '@/types';
import en from '@/locales/en.json';
import zhCN from '@/locales/zh-CN.json';
import zhTW from '@/locales/zh-TW.json';

const translations: Record<Locale, Translation> = {
  'en': en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
};

function getNestedValue(obj: Translation, path: string): string | string[] | undefined {
  const keys = path.split('.');
  let result: Translation | string | string[] | undefined = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      result = (result as Translation)[key];
    } else {
      return undefined;
    }
  }
  
  return typeof result === 'string' || Array.isArray(result) ? result : undefined;
}

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);
  
  const t = useCallback(
    (key: string): string => {
      const value = getNestedValue(translations[locale], key);
      if (typeof value === 'string') {
        return value;
      }
      return key;
    },
    [locale]
  );
  
  const tArray = useCallback(
    (key: string): string[] => {
      const value = getNestedValue(translations[locale], key);
      if (Array.isArray(value)) {
        return value;
      }
      return [];
    },
    [locale]
  );
  
  const tObject = useCallback(
    (key: string): Translation => {
      const keys = key.split('.');
      let result: Translation | string | string[] | undefined = translations[locale];
      
      for (const k of keys) {
        if (result && typeof result === 'object' && !Array.isArray(result)) {
          result = (result as Translation)[k];
        } else {
          return {};
        }
      }
      
      return typeof result === 'object' && !Array.isArray(result) ? (result as Translation) : {};
    },
    [locale]
  );
  
  const availableLocales = useMemo(() => Object.keys(translations) as Locale[], []);
  
  return {
    locale,
    setLocale,
    t,
    tArray,
    tObject,
    availableLocales,
  };
}
