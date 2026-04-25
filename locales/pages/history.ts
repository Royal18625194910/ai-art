import type { HistoryTranslations } from '../types';

export const history = {
  zh: {
    title: '生成历史',
    subtitle: '查看你的所有生成记录',
    filters: {
      all: '全部',
      textToImage: '文生图',
      imageToImage: '图生图',
      search: {
        placeholder: '搜索提示词...',
        noResults: '未找到匹配的结果',
      },
      dateRange: {
        today: '今天',
        last7Days: '最近7天',
        last30Days: '最近30天',
        thisMonth: '本月',
        allTime: '全部时间',
      },
    },
    stats: {
      total: '总生成数',
      textToImage: '文生图',
      imageToImage: '图生图',
      creditsUsed: '消耗积分',
    },
    card: {
      copyPrompt: '复制提示词',
      download: '下载',
      viewDetails: '查看详情',
      delete: '删除',
      regenerate: '重新生成',
      date: '生成时间',
    },
    detail: {
      prompt: '提示词',
      negativePrompt: '负面提示词',
      parameters: {
        title: '生成参数',
        mode: '生成模式',
        size: '图片尺寸',
        quality: '清晰度',
        aspectRatio: '比例',
        creditsUsed: '消耗积分',
      },
      referenceImages: {
        title: '参考图片',
      },
      actions: {
        download: '下载图片',
      },
    },
    gallery: {
      loading: '加载中...',
      empty: '暂无生成记录',
      createNow: '立即创作',
      loadMore: '加载更多',
    },
    delete: {
      confirm: '确定要删除这条记录吗？此操作不可恢复。',
      success: '删除成功',
    },
  } as HistoryTranslations,
  en: {
    title: 'Generation History',
    subtitle: 'View all your generation records',
    filters: {
      all: 'All',
      textToImage: 'Text to Image',
      imageToImage: 'Image to Image',
      search: {
        placeholder: 'Search prompts...',
        noResults: 'No matching results found',
      },
      dateRange: {
        today: 'Today',
        last7Days: 'Last 7 Days',
        last30Days: 'Last 30 Days',
        thisMonth: 'This Month',
        allTime: 'All Time',
      },
    },
    stats: {
      total: 'Total Generated',
      textToImage: 'Text to Image',
      imageToImage: 'Image to Image',
      creditsUsed: 'Credits Used',
    },
    card: {
      copyPrompt: 'Copy Prompt',
      download: 'Download',
      viewDetails: 'View Details',
      delete: 'Delete',
      regenerate: 'Regenerate',
      date: 'Date',
    },
    detail: {
      prompt: 'Prompt',
      negativePrompt: 'Negative Prompt',
      parameters: {
        title: 'Parameters',
        mode: 'Mode',
        size: 'Size',
        quality: 'Quality',
        aspectRatio: 'Aspect Ratio',
        creditsUsed: 'Credits Used',
      },
      referenceImages: {
        title: 'Reference Images',
      },
      actions: {
        download: 'Download Image',
      },
    },
    gallery: {
      loading: 'Loading...',
      empty: 'No generation records yet',
      createNow: 'Create Now',
      loadMore: 'Load More',
    },
    delete: {
      confirm: 'Are you sure you want to delete this record? This action cannot be undone.',
      success: 'Deleted successfully',
    },
  } as HistoryTranslations,
  'zh-TW': {
    title: '生成歷史',
    subtitle: '查看你的所有生成記錄',
    filters: {
      all: '全部',
      textToImage: '文生圖',
      imageToImage: '圖生圖',
      search: {
        placeholder: '搜索提示詞...',
        noResults: '未找到匹配的結果',
      },
      dateRange: {
        today: '今天',
        last7Days: '最近7天',
        last30Days: '最近30天',
        thisMonth: '本月',
        allTime: '全部時間',
      },
    },
    stats: {
      total: '總生成數',
      textToImage: '文生圖',
      imageToImage: '圖生圖',
      creditsUsed: '消耗積分',
    },
    card: {
      copyPrompt: '複製提示詞',
      download: '下載',
      viewDetails: '查看詳情',
      delete: '刪除',
      regenerate: '重新生成',
      date: '生成時間',
    },
    detail: {
      prompt: '提示詞',
      negativePrompt: '負面提示詞',
      parameters: {
        title: '生成參數',
        mode: '生成模式',
        size: '圖片尺寸',
        quality: '清晰度',
        aspectRatio: '比例',
        creditsUsed: '消耗積分',
      },
      referenceImages: {
        title: '參考圖片',
      },
      actions: {
        download: '下載圖片',
      },
    },
    gallery: {
      loading: '載入中...',
      empty: '暫無生成記錄',
      createNow: '立即創作',
      loadMore: '加載更多',
    },
    delete: {
      confirm: '確定要刪除這條記錄嗎？此操作不可恢復。',
      success: '刪除成功',
    },
  } as HistoryTranslations,
};
