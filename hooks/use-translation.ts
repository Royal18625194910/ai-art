import { useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/stores/use-language-store';
import { Locale, Translation, TranslationValue } from '@/types';
import { translations } from '@/locales';
import type { LandingTranslations } from '@/locales';

function getNestedValue(obj: Translation, path: string): TranslationValue | undefined {
  const keys = path.split('.');
  let result: TranslationValue = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    
    if (Array.isArray(result)) {
      const index = parseInt(key, 10);
      if (!isNaN(index) && index >= 0 && index < result.length) {
        result = result[index];
      } else {
        return undefined;
      }
    } else if (typeof result === 'object') {
      result = (result as Translation)[key];
    } else {
      return undefined;
    }
  }
  
  return result;
}

function replaceParams(text: string, params: Record<string, string | number> = {}): string {
  let result = text;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);
  
  const t = useCallback(
    (key: string, params: Record<string, string | number> = {}): string => {
      const value = getNestedValue(translations[locale], key);
      if (typeof value === 'string') {
        return replaceParams(value, params);
      }
      return key;
    },
    [locale]
  );
  
  const tArray = useCallback(
    (key: string): string[] => {
      const value = getNestedValue(translations[locale], key);
      if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string');
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
  
  const common = useMemo(() => {
    return tObject('common');
  }, [tObject]);
  
  const pages = useMemo(() => {
    return tObject('pages');
  }, [tObject]);
  
  const availableLocales = useMemo(() => Object.keys(translations) as Locale[], []);
  
  return {
    locale,
    setLocale,
    t,
    tArray,
    tObject,
    common,
    pages,
    availableLocales,
  };
}

export function useCommonTranslation() {
  const { t, tArray, tObject } = useTranslation();
  
  return {
    t: (key: string, params?: Record<string, string | number>) => t(`common.${key}`, params),
    tArray: (key: string) => tArray(`common.${key}`),
    tObject: (key: string) => tObject(`common.${key}`),
    nav: tObject('common.nav'),
    common: tObject('common.common'),
    credits: tObject('common.credits'),
    language: tObject('common.language'),
    actions: tObject('common.actions'),
  };
}

export function usePageTranslation(page: 'landing' | 'create' | 'buy' | 'history') {
  const { t, tArray, tObject } = useTranslation();

  return {
    t: (key: string, params?: Record<string, string | number>) => t(`pages.${page}.${key}`, params),
    tArray: (key: string) => tArray(`pages.${page}.${key}`),
    tObject: (key: string) => tObject(`pages.${page}.${key}`),
    pageTranslations: tObject(`pages.${page}`),
  };
}

export function useLandingTranslation() {
  const locale = useLanguageStore((state) => state.locale);

  const landing = useMemo(
    () => translations[locale].pages.landing as LandingTranslations,
    [locale]
  );

  return { landing };
}
