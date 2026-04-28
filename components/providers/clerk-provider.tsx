'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { zhCN, zhTW, enUS } from '@clerk/localizations';
import { useLanguageStore } from '@/stores/use-language-store';

const clerkLocalizations = {
  zh: zhCN,
  'zh-TW': zhTW,
  en: enUS,
};

export function LocalizedClerkProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguageStore();

  return (
    <ClerkProvider localization={clerkLocalizations[locale]}>
      {children}
    </ClerkProvider>
  );
}
