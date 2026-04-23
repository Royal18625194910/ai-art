import { useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/stores/use-language-store';
import { Locale, Translation, TranslationValue } from '@/types';
import en from '@/locales/en.json';
import zhCN from '@/locales/zh-CN.json';
import zhTW from '@/locales/zh-TW.json';

const translations: Record<Locale, Translation> = {
  'en': en as unknown as Translation,
  'zh-CN': zhCN as unknown as Translation,
  'zh-TW': zhTW as unknown as Translation,
};

function getNestedValue(obj: Translation, path: string): TranslationValue | undefined {
  const keys = path.split('.');
  let result: TranslationValue = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      result = (result as Translation)[key];
    } else {
      return undefined;
    }
  }
  
  return result;
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
    (key: string): TranslationValue[] => {
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
      let result: TranslationValue = translations[locale];
      
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
