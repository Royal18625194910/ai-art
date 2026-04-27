'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Info, Sparkles } from 'lucide-react';
import { usePageTranslation, useCommonTranslation } from '@/hooks/use-translation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { UploadedFile } from '@/components/ui/file-upload';
import { useGeneration, type GenerationState } from '@/hooks/use-generation';
import { siteConfig } from '@/config/site';
import { ModeSelector } from '@/components/business/create/mode-selector';
import { TextToImageForm } from '@/components/business/create/text-to-image-form';
import { ImageToImageForm } from '@/components/business/create/image-to-image-form';
import { ParametersPanel } from '@/components/business/create/parameters-panel';
import { GenerationProgress } from '@/components/business/create/generation-progress';
import { ResultsGrid } from '@/components/business/create/results-grid';
import { TipsPanel } from '@/components/business/create/tips-panel';
import { GenerateActionBar } from '@/components/business/create/generate-action-bar';
import { Spinner } from '@/components/ui/spinner';

type GenerationMode = 'text-to-image' | 'image-to-image';

// 映射清晰度到 KIE 的分辨率
const qualityToResolution: Record<string, string> = {
  '1k': '1K',
  '4k': '4K',
};

export default function CreatePage() {
  const { t, tObject, tArray } = usePageTranslation('create');
  const { t: tCommon } = useCommonTranslation();
  const [mounted, setMounted] = useState(false);

  const [mode, setMode] = useState<GenerationMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('1k');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);

  const {
    generate,
    isGenerating,
    state,
    progress,
    error: generateError,
    result,
    reset,
  } = useGeneration({
    onSuccess: () => {
      // 成功回调
    },
    onError: (err) => {
      console.error('Generation error:', err);
    },
  });

  useEffect(() => {
    setMounted(true);
    document.title = `${t('title')} | ${siteConfig.name}`;
  }, [t]);

  const qualityOptions = Object.entries(
    (tObject('parameters.size.options') as Record<string, string>) || {
      '1k': '1K (1积分)',
      '4k': '4K (2积分)',
    }
  ).map(([key, value]) => ({ key, label: value }));

  const aspectRatioOptions = Object.entries(
    (tObject('parameters.aspectRatio.options') as Record<string, string>) || {
      '1:1': '1:1 头像/商品图',
      '16:9': '16:9 封面/横版',
      '9:16': '9:16 短视频/壁纸',
      '4:3': '4:3 传统照片',
      '3:4': '3:4 笔记/详情页',
      '21:9': '21:9 电影/超宽屏',
      '2:3': '2:3 海报/Pinterest',
    }
  ).map(([key, value]) => ({ key, label: value }));

  const promptExamples = (tArray('textToImage.examples') as string[]).map((text) => ({ text }));
  const tipsItems = tArray('tips.items') as string[];

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    reset();
    setUploadedImages([]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (mode === 'image-to-image' && uploadedImages.length === 0) return;

    try {
      const params = {
        mode,
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio,
        resolution: qualityToResolution[selectedQuality] || '1K',
        ...(mode === 'image-to-image' && {
          input_urls: uploadedImages.map((img) => img.url),
        }),
      };

      await generate(params);
    } catch (err) {
      // 错误已在 hook 中处理
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      // 获取图片并转换为 blob 以实现跨域下载
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ai-art-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 清理 blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getStatusText = (state: GenerationState | null) => {
    switch (state) {
      case 'idle':
        return '准备中...';
      case 'generating':
        return '生成中...';
      case 'success':
        return '生成成功';
      case 'failed':
        return '生成失败';
      default:
        return '';
    }
  };

  const getStatusColor = (state: GenerationState | null) => {
    switch (state) {
      case 'idle':
        return 'text-yellow-400';
      case 'generating':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return '';
    }
  };

  const estimatedCredits = selectedQuality === '1k' ? 1 : 2;
  const canGenerate =
    !isGenerating &&
    prompt.trim() &&
    (mode === 'text-to-image' || uploadedImages.length > 0);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative pt-24 pb-16">
        <Container className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Wand2 className="w-6 h-6 text-purple-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('title')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mode Selection & Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
              >
                <ModeSelector
                  mode={mode}
                  onModeChange={handleModeChange}
                  textToImageLabel={t('mode.textToImage')}
                  imageToImageLabel={t('mode.imageToImage')}
                />

                <AnimatePresence mode="wait">
                  {mode === 'text-to-image' ? (
                    <TextToImageForm
                      prompt={prompt}
                      onPromptChange={setPrompt}
                      examples={promptExamples}
                      onExampleClick={setPrompt}
                      isGenerating={isGenerating}
                      title={t('textToImage.title')}
                      placeholder={t('textToImage.placeholder')}
                      tips={t('textToImage.tips')}
                      examplesLabel={t('textToImage.examplesLabel')}
                    />
                  ) : (
                    <ImageToImageForm
                      prompt={prompt}
                      onPromptChange={setPrompt}
                      uploadedImages={uploadedImages}
                      onImagesChange={setUploadedImages}
                      isGenerating={isGenerating}
                      uploadTitle={t('imageToImage.uploadTitle')}
                      uploadDesc={t('imageToImage.uploadDesc')}
                      dragHint={t('imageToImage.dragHint')}
                      tips={t('imageToImage.tips')}
                      maxFilesLabel={t('imageToImage.maxFiles')}
                      fileFormatLabel={t('imageToImage.fileFormat')}
                      promptTitle={t('textToImage.title')}
                      promptPlaceholder={t('textToImage.placeholder')}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Parameters */}
              <ParametersPanel
                selectedQuality={selectedQuality}
                onQualityChange={setSelectedQuality}
                aspectRatio={aspectRatio}
                onAspectRatioChange={setAspectRatio}
                qualityOptions={qualityOptions}
                aspectRatioOptions={aspectRatioOptions}
                isGenerating={isGenerating}
                title={t('parameters.title')}
                sizeLabel={t('parameters.size.label')}
                aspectRatioLabel={t('parameters.aspectRatio.label')}
              />

              {/* Generate Action */}
              <GenerateActionBar
                estimatedCredits={estimatedCredits}
                isGenerating={isGenerating}
                canGenerate={!!canGenerate}
                onGenerate={handleGenerate}
                state={state}
                getStatusText={getStatusText}
                useCreditsLabel={t('actions.useCredits')}
                generatingLabel={t('actions.generating')}
                generateLabel={t('actions.generate')}
              />

              {/* Progress */}
              <GenerationProgress
                isGenerating={isGenerating}
                progress={progress}
                state={state}
                getStatusText={getStatusText}
                getStatusColor={getStatusColor}
              />

              {/* Error */}
              {generateError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <Info className="w-5 h-5" />
                    <span className="font-medium">生成失败</span>
                  </div>
                  <p className="mt-2 text-sm text-red-300/80">{generateError}</p>
                </motion.div>
              )}

              {/* Results */}
              <ResultsGrid
                imageUrls={result?.imageUrls || []}
                isGenerating={isGenerating}
                onDownload={handleDownload}
                onRegenerate={handleGenerate}
                onCopyPrompt={handleCopyPrompt}
                title={t('results.title')}
                successLabel={t('results.success')}
                copyLabel={t('card.copyPrompt')}
                regenerateLabel={t('card.regenerate')}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TipsPanel tips={tipsItems} title={`💡 ${t('tips.title')}`} />
            </div>
          </div>
        </Container>
      </main>

      <Footer />

      {/* 全局 Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center justify-center text-center gap-8 p-10 rounded-3xl bg-card/95 border border-purple-500/20 shadow-2xl min-w-[320px]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl animate-pulse" />
                <Spinner className="relative w-14 h-14 text-purple-400" />
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`title-${state}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {state === 'generating' ? 'AI 正在创作...' : '准备创作...'}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${state}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed"
                  >
                    {state === 'generating'
                      ? '正在将您的创意转化为艺术作品，请稍候...'
                      : '正在检查积分和准备生成环境...'}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
