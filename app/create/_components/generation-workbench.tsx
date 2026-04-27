'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { UploadedFile } from '@/components/ui/file-upload';
import type { GenerationState, GenerateParams, GenerateResult } from '@/hooks/use-generation';
import { ModeSelector } from '@/components/business/create/mode-selector';
import { TextToImageForm } from '@/components/business/create/text-to-image-form';
import { ImageToImageForm } from '@/components/business/create/image-to-image-form';
import { ParametersPanel } from '@/components/business/create/parameters-panel';
import { GenerationProgress } from '@/components/business/create/generation-progress';
import { ResultsGrid } from '@/components/business/create/results-grid';
import { GenerateActionBar } from '@/components/business/create/generate-action-bar';
import { ErrorPanel } from './error-panel';

type GenerationMode = 'text-to-image' | 'image-to-image';

const aspectRatioToSize: Record<string, string> = {
  '1:1': '1024x1024',
  '16:9': '1024x576',
  '9:16': '576x1024',
  '4:3': '1024x768',
  '3:4': '768x1024',
  '21:9': '1024x440',
  '2:3': '683x1024',
  'auto': 'auto',
};

const getStatusText = (state: GenerationState | null): string => {
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

const getStatusColor = (state: GenerationState | null): string => {
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

interface GenerationWorkbenchProps {
  t: (key: string) => string;
  tObject: (key: string) => Record<string, unknown>;
  tArray: (key: string) => string[];
  isGenerating: boolean;
  state: GenerationState;
  progress: number;
  error: string | null;
  result: GenerateResult | null;
  generate: (params: GenerateParams) => Promise<GenerateResult>;
  reset: () => void;
}

export function GenerationWorkbench({
  t,
  tObject,
  tArray,
  isGenerating,
  state,
  progress,
  error: generateError,
  result,
  generate,
  reset,
}: GenerationWorkbenchProps) {
  const [mode, setMode] = useState<GenerationMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('1k');
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);

  const qualityOptions = Object.entries(
    (tObject('parameters.size.options') as Record<string, string>) || {
      '1k': '1K (1积分)',
      '4k': '4K (2积分)',
    }
  ).map(([key, value]) => ({ key, label: value }));

  const aspectRatioOptions = Object.entries(
    (tObject('parameters.aspectRatio.options') as Record<string, string>) || {
      'auto': '自动',
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

  const handleModeChange = useCallback((newMode: GenerationMode) => {
    setMode(newMode);
    reset();
    setUploadedImages([]);
    console.log('[ModeChange] Resetting uploaded images',newMode);
  }, [reset]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    if (mode === 'image-to-image' && uploadedImages.length === 0) return;

    try {
      const params: GenerateParams = {
        mode,
        prompt: prompt.trim(),
        size: aspectRatioToSize[aspectRatio] || 'auto',
        ...(mode === 'image-to-image' && {
          input_urls: uploadedImages.map((img) => img.url),
        }),
      };

      await generate(params);
    } catch (err) {
      // 错误已在 hook 中处理
    }
  }, [mode, prompt, aspectRatio, uploadedImages, generate]);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(prompt);
  }, [prompt]);

  const handleDownload = useCallback(async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ai-art-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, []);

  const estimatedCredits = selectedQuality === '1k' ? 1 : 2;
  const canGenerate =
    !isGenerating && prompt.trim() && (mode === 'text-to-image' || uploadedImages.length > 0);

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Mode Selection & Form */}
      <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
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
      </div>

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
      {generateError && <ErrorPanel error={generateError} />}

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
  );
}
