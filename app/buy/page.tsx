'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { usePageTranslation } from '@/hooks/use-translation';
import { useLanguageStore } from '@/stores/use-language-store';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { getCreditPackages, getPricingLabels } from '@/config/pricing';

import { HeaderSection } from './_components/header-section';
import { PackageCard } from './_components/package-card';
import { CreditInfo } from './_components/credit-info';

export default function BuyPage() {
  const { t, tObject, tArray } = usePageTranslation('buy');
  const { locale } = useLanguageStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 清除 URL 中的 Creem 回调参数
  useEffect(() => {
    const hasCallbackParams = searchParams.has('checkout_id') || searchParams.has('status');
    if (hasCallbackParams) {
      router.replace('/buy', { scroll: false });
    }
  }, [searchParams, router]);

  const packages = getCreditPackages(locale);
  const labels = getPricingLabels(locale);

  const features = tArray('features') as string[];
  const creditInfo = tObject('creditInfo') as {
    neverExpires: string;
    neverExpiresDesc: string;
    priority: string;
    priorityDesc: string;
    usage: string;
    support: string;
    supportDesc: string;
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/3 via-cyan-500/3 to-purple-500/3 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative pt-24 pb-16">
        <Container className="max-w-6xl mx-auto">
          <HeaderSection title={t('title')} subtitle={t('subtitle')} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} labels={labels} t={t} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">{t('creditLabel')}</h2>
              <p className="text-muted-foreground mt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  {t('creditRulesDescription')}
                </span>
              </p>
            </div>
            <CreditInfo features={features} creditInfo={creditInfo} />
          </motion.div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
