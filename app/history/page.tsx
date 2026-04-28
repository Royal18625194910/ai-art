'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Image as ImageIcon, Layers, Sparkles, Plus } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { usePageTranslation, useCommonTranslation } from '@/hooks/use-translation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/business/history/stat-card';
import { FilterBar } from '@/components/business/history/filter-bar';
import { HistoryGrid } from '@/components/business/history/history-grid';
import { HistoryDetailModal } from '@/components/business/history/history-detail-modal';
import { PaginationControls } from '@/components/business/history/pagination-controls';
import { api } from '@/convex/_generated/api';
import { siteConfig } from '@/config/site';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user-store';

type GenerationMode = 'text-to-image' | 'image-to-image';
type FilterMode = 'all' | GenerationMode;
type DateRange = 'today' | 'last7Days' | 'last30Days' | 'thisMonth' | 'allTime';

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  mode: GenerationMode;
  size: string;
  quality: string;
  aspectRatio: string;
  creditsUsed: number;
  createdAt: number | Date;
  status: string;
  outputImages?: string[];
}

const ITEMS_PER_PAGE = 12;

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function HistoryPage() {
  const { t } = usePageTranslation('history');
  const { t: tCommon } = useCommonTranslation();
  const router = useRouter();

  // Get user from Zustand store
  const convexUserId = useUserStore((state) => state.convexUserId);
  const isUserSynced = useUserStore((state) => state.isSynced);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [dateRange, setDateRange] = useState<DateRange>('allTime');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Convex queries using Zustand user ID
  const generationsData = useQuery(
    api.generations.getUserGenerationsById,
    convexUserId
      ? {
          userId: convexUserId as any,
          searchQuery: debouncedSearchQuery || undefined,
          mode: filterMode,
          dateRange,
          limit: ITEMS_PER_PAGE,
          cursor: currentPage > 1 ? String((currentPage - 1) * ITEMS_PER_PAGE) : undefined,
        }
      : 'skip'
  );

  const stats = useQuery(
    api.generations.getUserGenerationStatsById,
    convexUserId ? { userId: convexUserId as any } : 'skip'
  );

  // Debug logging
  useEffect(() => {
    console.log('convexUserId from Zustand:', convexUserId);
    console.log('isUserSynced:', isUserSynced);
    console.log('generationsData:', generationsData);
    console.log('stats:', stats);
  }, [convexUserId, isUserSynced, generationsData, stats]);

  // Convex mutations
  const deleteGeneration = useMutation(api.generations.deleteGeneration);

  const isLoading = !isUserSynced || generationsData === undefined || stats === undefined;

  const items = useMemo(() => {
    return (generationsData?.items || []).map((item: HistoryItem) => ({
      ...item,
      createdAt: item.createdAt,
    }));
  }, [generationsData]);

  const totalPages = useMemo(() => {
    if (!generationsData?.total) return 1;
    return Math.ceil(generationsData.total / ITEMS_PER_PAGE);
  }, [generationsData]);

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

  const formatDate = useCallback((timestamp: number | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return tCommon('time.justNow');
    if (minutes < 60) return tCommon('time.minutesAgo', { count: minutes });
    if (hours < 24) return tCommon('time.hoursAgo', { count: hours });
    if (days < 7) return tCommon('time.daysAgo', { count: days });

    return date.toLocaleDateString();
  }, [tCommon]);

  const handleCopyPrompt = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.prompt);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = useCallback(async (id: string) => {
    if (confirm(t('delete.confirm'))) {
      try {
        await deleteGeneration({ generationId: id as any });
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('删除失败');
      }
    }
  }, [deleteGeneration, selectedItem, t]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filterMode, dateRange]);

  // Show loading while waiting for user sync
  if (!isUserSynced) {
    return (
      <div className="relative min-h-screen bg-background">
        <Header />
        <main className="relative pt-24 pb-16">
          <Container className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">正在同步用户信息...</p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-400" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {t('title')}
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground text-lg mt-2">{t('subtitle')}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              icon={ImageIcon}
              label={t('stats.total')}
              value={isLoading ? '—' : stats?.total || 0}
              color="text-purple-400"
            />
            <StatCard
              icon={Layers}
              label={t('stats.textToImage')}
              value={isLoading ? '—' : stats?.textToImage || 0}
              color="text-cyan-400"
            />
            <StatCard
              icon={ImageIcon}
              label={t('stats.imageToImage')}
              value={isLoading ? '—' : stats?.imageToImage || 0}
              color="text-pink-400"
            />
            <StatCard
              icon={Sparkles}
              label={t('stats.creditsUsed')}
              value={isLoading ? '—' : stats?.creditsUsed || 0}
              color="text-amber-400"
            />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6 mb-8"
          >
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterMode={filterMode}
              onFilterModeChange={setFilterMode}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              modeOptions={modeOptions}
              dateOptions={dateOptions}
            />
          </motion.div>

          {/* Search debug info - remove after fixing */}
          {debouncedSearchQuery && (
            <div className="mb-4 p-3 bg-purple-500/10 rounded-lg text-sm">
              <span className="text-muted-foreground">搜索关键词: </span>
              <span className="text-purple-400 font-medium">{debouncedSearchQuery}</span>
              <span className="text-muted-foreground ml-4">结果: </span>
              <span className="text-foreground font-medium">{items.length} 条</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">{t('gallery.loading')}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {debouncedSearchQuery ? t('filters.search.noResults') : t('gallery.empty')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {debouncedSearchQuery
                  ? `未找到包含 "${debouncedSearchQuery}" 的结果，请尝试其他关键词`
                  : t('emptyDesc')
                }
              </p>
              <div className="flex items-center gap-3">
                <Button variant="primary" onClick={() => router.push('/create')}>
                  <Plus className="w-5 h-5 mr-2" />
                  {t('gallery.createNow')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Content */}
          {!isLoading && items.length > 0 && (
            <>
              <HistoryGrid
                items={items}
                copiedId={copiedId}
                onCopyPrompt={handleCopyPrompt}
                onViewDetails={setSelectedItem}
                formatDate={formatDate}
                labels={{
                  copyPrompt: t('card.copyPrompt'),
                  download: t('card.download'),
                  viewDetails: t('card.viewDetails'),
                  empty: t('gallery.empty'),
                  emptyDesc: t('emptyDesc'),
                  createNow: t('gallery.createNow'),
                  noResults: t('filters.search.noResults'),
                  searchQuery,
                }}
              />

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </Container>
      </main>

      <HistoryDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        copiedId={copiedId}
        onCopyPrompt={handleCopyPrompt}
        onDelete={handleDelete}
        formatDate={formatDate}
        labels={{
          prompt: t('detail.prompt'),
          parameters: t('detail.parameters.title'),
          mode: t('detail.parameters.mode'),
          size: t('detail.parameters.size'),
          quality: t('detail.parameters.quality'),
          aspectRatio: t('detail.parameters.aspectRatio'),
          creditsUsed: t('detail.parameters.creditsUsed'),
          date: t('card.date'),
          download: t('detail.actions.download'),
          delete: t('card.delete'),
          copyPrompt: t('card.copyPrompt'),
          confirmCopy: tCommon('actions.confirm'),
          textToImage: t('filters.textToImage'),
          imageToImage: t('filters.imageToImage'),
          credits: tCommon('credits.label'),
        }}
      />

      <Footer />
    </div>
  );
}
