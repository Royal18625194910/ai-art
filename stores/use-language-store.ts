import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, type LocaleConfig } from '@/locales';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  zh: {
    code: 'zh',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  'zh-TW': {
    code: 'zh-TW',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    flag: '🇹🇼',
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'zh',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'ai-art-language-storage',
    }
  )
);
