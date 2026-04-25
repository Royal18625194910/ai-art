'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Image as ImageIcon,
  X,
  ChevronDown,
  Download,
  RefreshCw,
  Copy,
  Plus,
  Wand2,
  Layers,
  Sliders,
  Info,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTranslation, useCommonTranslation } from '@/hooks/use-translation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload';
import { siteConfig } from '@/config/site';

type GenerationMode = 'text-to-image' | 'image-to-image';

export default function CreatePage() {
  const { t, tObject, tArray } = usePageTranslation('create');
  const [mounted, setMounted] = useState(false);

  const [mode, setMode] = useState<GenerationMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('1k');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    document.title = `${t('title')} | ${siteConfig.name}`;
  }, [t]);

  const qualityOptions = tObject('parameters.size.options') as Record<string, string> || {
    '1k': '1K (1积分)',
    '4k': '4K (2积分)',
  };

  const aspectRatioOptions = tObject('parameters.aspectRatio.options') as Record<string, string> || {
    '1:1': '1:1 方形',
    '16:9': '16:9 宽屏',
    '9:16': '9:16 竖屏',
    '4:3': '4:3 标准',
    '3:4': '3:4 竖版',
    '21:9': '21:9 超宽',
    '2:3': '2:3 竖版',
  };

  const promptExamples = tArray('textToImage.examples');
  const tipsItems = tArray('tips.items');

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    if (uploadedImages.length === 0 && mode === 'image-to-image') return;

    setIsGenerating(true);

    setTimeout(() => {
      const mockImage = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
        prompt.slice(0, 50) || 'art'
      )}&image_size=square_hd&v=${Date.now()}`;
      setGeneratedImages([mockImage]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  const estimatedCredits = selectedQuality === '1k' ? 1 : 2;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative pt-24 pb-16">
        <Container className="max-w-7xl mx-auto">
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
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex bg-muted/50 rounded-xl p-1">
                    <button
                      onClick={() => setMode('text-to-image')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        mode === 'text-to-image'
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Layers className="w-4 h-4" />
                      {t('mode.textToImage')}
                    </button>
                    <button
                      onClick={() => setMode('image-to-image')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        mode === 'image-to-image'
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ImageIcon className="w-4 h-4" />
                      {t('mode.imageToImage')}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {mode === 'text-to-image' ? (
                    <motion.div
                      key="text-to-image"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('textToImage.title')}
                        </label>
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={t('textToImage.placeholder')}
                          className="w-full h-32 px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t('textToImage.tips')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('textToImage.examplesLabel')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {promptExamples.map((example, index) => (
                            <button
                              key={index}
                              onClick={() => handleExampleClick(example as string)}
                              className="px-3 py-1.5 text-xs bg-purple-500/10 text-purple-300 rounded-lg hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                            >
                              {(example as string).slice(0, 20)}...
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="image-to-image"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('imageToImage.uploadTitle')}
                        </label>
                        <p className="text-sm text-muted-foreground mb-4">
                          {t('imageToImage.uploadDesc')}
                        </p>

                        <FileUpload
                          files={uploadedImages}
                          onFilesChange={setUploadedImages}
                          maxFiles={3}
                          accept="image/*"
                          uploadTitle={t('imageToImage.uploadTitle')}
                          uploadDesc={t('imageToImage.uploadDesc')}
                          dragHint={t('imageToImage.dragHint')}
                        />

                        <div className="mt-4 flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-purple-300">
                              {t('imageToImage.tips')}
                            </p>
                            <p className="text-xs text-purple-300/70 mt-1">
                              {t('imageToImage.maxFiles')} • {t('imageToImage.fileFormat')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('textToImage.title')}
                        </label>
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={t('textToImage.placeholder')}
                          className="w-full h-24 px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('parameters.title')}
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t('parameters.size.label')}
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-background/50 border border-border/50 rounded-xl text-foreground hover:border-purple-500/50 transition-all"
                        >
                          <span className="text-sm">{qualityOptions[selectedQuality]}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full min-w-48">
                        {Object.entries(qualityOptions).map(([key, value]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => setSelectedQuality(key)}
                            className={cn(
                              'justify-between',
                              selectedQuality === key && 'text-purple-400'
                            )}
                          >
                            {value}
                            {selectedQuality === key && (
                              <Check className="w-4 h-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t('parameters.aspectRatio.label')}
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-background/50 border border-border/50 rounded-xl text-foreground hover:border-purple-500/50 transition-all"
                        >
                          <span className="text-sm">{aspectRatioOptions[aspectRatio]}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full min-w-48">
                        {Object.entries(aspectRatioOptions).map(([key, value]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => setAspectRatio(key)}
                            className={cn(
                              'justify-between',
                              aspectRatio === key && 'text-purple-400'
                            )}
                          >
                            {value}
                            {aspectRatio === key && (
                              <Check className="w-4 h-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">
                    {t('actions.useCredits', { count: estimatedCredits })}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || (mode === 'image-to-image' && uploadedImages.length === 0)}
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      {t('actions.generating')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {t('actions.generate')}
                    </span>
                  )}
                </Button>
              </motion.div>

              <AnimatePresence>
                {generatedImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-foreground">
                          {t('results.title')}
                        </h3>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                          {t('results.success')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPrompt}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {t('card.copyPrompt')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleGenerate}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          {t('card.regenerate')}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      {generatedImages.map((img, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative max-w-md w-full aspect-square rounded-xl overflow-hidden border border-border/50"
                        >
                          <img
                            src={img}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/70">#{index + 1}</span>
                              <div className="flex items-center gap-1">
                                <button className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm">
                                  <Download className="w-3.5 h-3.5 text-white" />
                                </button>
                                <button className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm">
                                  <Plus className="w-3.5 h-3.5 text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6 sticky top-24"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  💡 {t('tips.title')}
                </h3>
                <ul className="space-y-3">
                  {tipsItems.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{tip as string}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
