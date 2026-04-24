'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown,
  Image as ImageIcon,
  Layers,
  Download,
  RefreshCw,
  Copy,
  Trash2,
  Eye,
  X,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle
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
import { siteConfig } from '@/config/site';

type GenerationMode = 'text-to-image' | 'image-to-image';
type FilterMode = 'all' | GenerationMode;
type DateRange = 'today' | 'last7Days' | 'last30Days' | 'thisMonth' | 'allTime';

interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
  mode: GenerationMode;
  size: string;
  styleStrength?: string;
  similarity?: number;
  quantity: number;
  creditsUsed: number;
  createdAt: Date;
  referenceImages?: string[];
}

const mockHistoryItems: HistoryItem[] = [
  {
    id: '1',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cat%20watercolor%20style%20soft%20lighting&image_size=square_hd&v=1',
    prompt: '一只可爱的猫咪，水彩画风格，柔和的光线',
    mode: 'text-to-image',
    size: '1024x1024',
    styleStrength: 'medium',
    quantity: 1,
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20city%20night%20neon%20lights&image_size=square_hd&v=2',
    prompt: '赛博朋克风格的城市夜景，霓虹灯光',
    mode: 'text-to-image',
    size: '1792x1024',
    styleStrength: 'high',
    quantity: 1,
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mystical%20forest%20mist%20fantasy%20style&image_size=square_hd&v=3',
    prompt: '神秘的森林，迷雾缭绕，奇幻风格',
    negativePrompt: 'blurry, low quality',
    mode: 'text-to-image',
    size: '1024x1024',
    styleStrength: 'medium',
    quantity: 2,
    creditsUsed: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: '4',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20astronaut%20cosmic%20background&image_size=square_hd&v=4',
    prompt: '未来科技感的宇航员，星际背景',
    mode: 'image-to-image',
    size: '1024x1024',
    similarity: 70,
    quantity: 1,
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    referenceImages: ['ref1.jpg'],
  },
  {
    id: '5',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20anime%20girl%20cherry%20blossoms&image_size=square_hd&v=5',
    prompt: '美丽的动漫女孩，樱花树下，柔和的光线',
    mode: 'text-to-image',
    size: '1024x1792',
    styleStrength: 'low',
    quantity: 1,
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: '6',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=surreal%20abstract%20art%20flowing%20colors&image_size=square_hd&v=6',
    prompt: '超现实抽象艺术，流动的色彩和几何图案',
    mode: 'text-to-image',
    size: '1024x1024',
    styleStrength: 'high',
    quantity: 4,
    creditsUsed: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: '7',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20landscape%20floating%20islands%20crystal%20waterfalls&image_size=square_hd&v=7',
    prompt: '奇幻风景，浮岛和水晶瀑布，史诗奇幻艺术',
    mode: 'text-to-image',
    size: '1792x1024',
    styleStrength: 'medium',
    quantity: 1,
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: '8',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20professional%20lighting&image_size=square_hd&v=8',
    prompt: '专业肖像摄影，工作室灯光，电影感',
    negativePrompt: 'cartoon, anime, illustration',
    mode: 'image-to-image',
    size: '1024x1024',
    similarity: 60,
    quantity: 1,
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    referenceImages: ['ref2.jpg', 'ref3.jpg'],
  },
];

export default function HistoryPage() {
  const { t, tObject } = usePageTranslation('history');
  const { t: tCommon } = useCommonTranslation();
  const [mounted, setMounted] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [dateRange, setDateRange] = useState<DateRange>('allTime');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    document.title = `${t('title')} | ${siteConfig.name}`;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [t]);

  const stats = useMemo(() => {
    const total = mockHistoryItems.length;
    const textToImage = mockHistoryItems.filter((item) => item.mode === 'text-to-image').length;
    const imageToImage = mockHistoryItems.filter((item) => item.mode === 'image-to-image').length;
    const creditsUsed = mockHistoryItems.reduce((sum, item) => sum + item.creditsUsed, 0);
    return { total, textToImage, imageToImage, creditsUsed };
  }, []);

  const filteredItems = useMemo(() => {
    return mockHistoryItems.filter((item) => {
      if (searchQuery && !item.prompt.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterMode !== 'all' && item.mode !== filterMode) {
        return false;
      }
      if (dateRange !== 'allTime') {
        const now = new Date();
        const itemDate = item.createdAt;
        const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateRange === 'today' && daysDiff > 0) return false;
        if (dateRange === 'last7Days' && daysDiff > 7) return false;
        if (dateRange === 'last30Days' && daysDiff > 30) return false;
        if (dateRange === 'thisMonth') {
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          if (itemDate.getMonth() !== currentMonth || itemDate.getFullYear() !== currentYear) {
            return false;
          }
        }
      }
      return true;
    });
  }, [searchQuery, filterMode, dateRange]);

  const modeOptions = [
    { value: 'all' as FilterMode, label: t('filters.all') },
    { value: 'text-to-image' as FilterMode, label: t('filters.textToImage') },
    { value: 'image-to-image' as FilterMode, label: t('filters.imageToImage') },
  ];

  const dateOptions: { value: DateRange; label: string }[] = [
    { value: 'today', label: t('filters.dateRange.today') },
    { value: 'last7Days', label: t('filters.dateRange.last7Days') },
    { value: 'last30Days', label: t('filters.dateRange.last30Days') },
    { value: 'thisMonth', label: t('filters.dateRange.thisMonth') },
    { value: 'allTime', label: t('filters.dateRange.allTime') },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return tCommon('common.justNow');
    if (minutes < 60) return tCommon('common.minutesAgo', { count: minutes });
    if (hours < 24) return tCommon('common.hoursAgo', { count: hours });
    if (days < 7) return tCommon('common.daysAgo', { count: days });
    
    return date.toLocaleDateString();
  };

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyPrompt = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.prompt);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('delete.confirm'))) {
      alert(t('delete.success'));
    }
  };

  const StatCard = ({ icon: Icon, label, value, color = 'text-purple-400' }: any) => (
    <div className="flex items-center gap-3 px-4 py-3 bg-card/30 rounded-xl border border-border/50">
      <div className={`w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );

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
              <Clock className="w-6 h-6 text-purple-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('title')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              icon={ImageIcon}
              label={t('stats.total')}
              value={mounted ? stats.total : '—'}
              color="text-purple-400"
            />
            <StatCard
              icon={Layers}
              label={t('stats.textToImage')}
              value={mounted ? stats.textToImage : '—'}
              color="text-cyan-400"
            />
            <StatCard
              icon={ImageIcon}
              label={t('stats.imageToImage')}
              value={mounted ? stats.imageToImage : '—'}
              color="text-pink-400"
            />
            <StatCard
              icon={Sparkles}
              label={t('stats.creditsUsed')}
              value={mounted ? stats.creditsUsed : '—'}
              color="text-amber-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('filters.search.placeholder')}
                  className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/50 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground hover:border-purple-500/50 transition-all min-w-36 justify-between"
                  >
                    <span className="text-sm">
                      {modeOptions.find((o) => o.value === filterMode)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-36">
                  {modeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setFilterMode(option.value)}
                      className={cn(
                        'justify-between',
                        filterMode === option.value && 'text-purple-400'
                      )}
                    >
                      {option.label}
                      {filterMode === option.value && (
                        <Check className="w-4 h-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground hover:border-purple-500/50 transition-all min-w-40 justify-between"
                  >
                    <span className="text-sm">
                      {dateOptions.find((o) => o.value === dateRange)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-40">
                  {dateOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setDateRange(option.value)}
                      className={cn(
                        'justify-between',
                        dateRange === option.value && 'text-purple-400'
                      )}
                    >
                      {option.label}
                      {dateRange === option.value && (
                        <Check className="w-4 h-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-4 flex items-center gap-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <span className="text-sm text-purple-300">
                  {t('batch.selected', { count: selectedItems.length })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {t('batch.downloadSelected')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t('batch.deleteSelected')}
                </Button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('batch.deselectAll')}
                </button>
              </div>
            )}
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">{t('gallery.loading')}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? t('filters.search.noResults') : t('gallery.empty')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchQuery ? tCommon('common.tryAgain') : t('gallery.emptyDesc')}
              </p>
              <Button variant="primary" onClick={() => (window.location.href = '/create')}>
                <Plus className="w-5 h-5 mr-2" />
                {t('gallery.createNow')}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-card/30"
                  >
                    <button
                      onClick={(e) => toggleSelection(item.id, e)}
                      className="absolute top-2 left-2 z-10 w-6 h-6 rounded-md border-2 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {selectedItems.includes(item.id) && (
                        <Check className="w-4 h-4 text-purple-400" />
                      )}
                    </button>

                    <Badge
                      variant="secondary"
                      className={cn(
                        'absolute top-2 right-2 z-10 text-xs',
                        item.mode === 'text-to-image'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                      )}
                    >
                      {item.mode === 'text-to-image' ? 'T2I' : 'I2I'}
                    </Badge>

                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white/80 mb-2 line-clamp-2">
                        {item.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">
                          {formatDate(item.createdAt)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPrompt(item);
                            }}
                            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                            title={t('card.copyPrompt')}
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-white" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                            title={t('card.download')}
                          >
                            <Download className="w-3.5 h-3.5 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                            title={t('card.viewDetails')}
                          >
                            <Eye className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="absolute inset-0 z-0"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button variant="ghost" className="text-muted-foreground">
                  {t('gallery.loadMore')}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </Container>
      </main>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square bg-black/50">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.prompt}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {t('detail.prompt')}
                    </h3>
                    <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedItem.prompt}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-muted-foreground"
                      onClick={() => handleCopyPrompt(selectedItem)}
                    >
                      {copiedId === selectedItem.id ? (
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedId === selectedItem.id ? t('results.promptCopied') : t('card.copyPrompt')}
                    </Button>
                  </div>

                  {selectedItem.negativePrompt && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {t('detail.negativePrompt')}
                      </h3>
                      <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedItem.negativePrompt}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {t('detail.parameters.title')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t('detail.parameters.mode')}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedItem.mode === 'text-to-image'
                            ? t('filters.textToImage')
                            : t('filters.imageToImage')}
                        </p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t('detail.parameters.size')}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedItem.size}
                        </p>
                      </div>
                      {selectedItem.styleStrength && (
                        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">
                            {t('detail.parameters.styleStrength')}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {selectedItem.styleStrength}
                          </p>
                        </div>
                      )}
                      {selectedItem.similarity !== undefined && (
                        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">
                            {t('detail.parameters.similarity')}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {selectedItem.similarity}%
                          </p>
                        </div>
                      )}
                      <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t('detail.parameters.creditsUsed')}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedItem.creditsUsed} {tCommon('credits.label')}
                        </p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t('card.date')}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(selectedItem.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedItem.referenceImages && selectedItem.referenceImages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {t('detail.referenceImages.title')}
                      </h3>
                      <div className="flex gap-2">
                        {selectedItem.referenceImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center"
                          >
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button variant="primary" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      {t('detail.actions.download')}
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {t('card.regenerate')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(selectedItem.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('card.delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
