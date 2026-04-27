'use client';

import { useEffect } from 'react';
import { usePageTranslation } from '@/hooks/use-translation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { siteConfig } from '@/config/site';
import { TipsPanel } from '@/components/business/create/tips-panel';
import { CreateHeader } from './_components/create-header';
import { GenerationWorkbench } from './_components/generation-workbench';
import { CreateLoadingOverlay } from './_components/create-loading-overlay';
import { useGeneration } from '@/hooks/use-generation';
import { useToast } from '@/components/ui/toast';

export default function CreatePage() {
  const { t, tObject, tArray } = usePageTranslation('create');
  const { error } = useToast();

  const {
    generate,
    isGenerating,
    state,
    progress,
    error: generateError,
    result,
    reset,
  } = useGeneration({
    onSuccess: () => {},
    onError: (err) => {
      // 检查是否是积分不足错误
      if (err.includes('积分') || err.includes('credit') || err.includes('Insufficient')) {
        error('积分不足，请前往购买页面充值');
      } else {
        error('生成失败，请稍后重试');
      }
    },
  });

  useEffect(() => {
    document.title = `${t('title')} | ${siteConfig.name}`;
  }, [t]);

  const tipsItems = tArray('tips.items') as string[];

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative pt-24 pb-16">
        <Container className="max-w-7xl mx-auto">
          <CreateHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="grid lg:grid-cols-3 gap-8">
            <GenerationWorkbench
              t={t}
              tObject={tObject}
              tArray={tArray}
              isGenerating={isGenerating}
              state={state}
              progress={progress}
              error={generateError}
              result={result}
              generate={generate}
              reset={reset}
            />

            {/* Sidebar */}
            <div className="space-y-6">
              <TipsPanel tips={tipsItems} title={`💡 ${t('tips.title')}`} />
            </div>
          </div>
        </Container>
      </main>

      <Footer />

      <CreateLoadingOverlay isGenerating={isGenerating} state={state} />
    </div>
  );
}
