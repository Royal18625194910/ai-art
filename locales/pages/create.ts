import type { CreateTranslations } from '../types';

export const create = {
  zh: {
    title: 'AI 艺术创作',
    subtitle: '用文字描述你的创意',
    mode: {
      textToImage: '文生图',
      imageToImage: '图生图',
    },
    textToImage: {
      title: '提示词',
      placeholder: '描述你想生成的图片，例如：一只可爱的橘猫在夕阳下的海边散步...',
      tips: '提示词越详细，生成效果越好',
      examplesLabel: '示例：',
      examples: [
        '便利店夜拍 - 真实城市街拍，年轻人夜间聚会场景',
        '波士顿春天海报 - 水彩插画风格城市风景',
        '日本手游抽卡界面 - 日式奇幻RPG游戏UI设计',
      ],
    },
    imageToImage: {
      uploadTitle: '上传参考图片',
      uploadDesc: '上传一张图片作为参考，AI将根据图片生成新的艺术作品',
      dragHint: '点击或拖拽上传',
      tips: '上传清晰的图片可以获得更好的效果',
      maxFiles: '最多3张',
      fileFormat: '支持 JPG、PNG',
    },
    parameters: {
      title: '生成参数',
      size: {
        label: '清晰度',
        options: {
          '1k': '1K (1积分)',
          '4k': '4K (2积分)',
        },
      },
      aspectRatio: {
        label: '比例',
        options: {
          'auto': '自动',
          '1:1': '1:1 头像/商品图',
          '16:9': '16:9 封面/横版',
          '9:16': '9:16 短视频/壁纸',
          '4:3': '4:3 传统照片',
          '3:4': '3:4 笔记/详情页',
          '21:9': '21:9 电影/超宽屏',
          '2:3': '2:3 海报/Pinterest',
        },
      },
    },
    actions: {
      generate: '生成图片',
      generating: '生成中...',
      useCredits: '消耗 {count} 积分',
      currentBalance: '当前余额: {count} 积分',
    },
    results: {
      title: '生成结果',
      success: '生成成功',
    },
    card: {
      copyPrompt: '复制提示词',
      regenerate: '重新生成',
    },
    tips: {
      title: '创作技巧',
      items: [
        '描述越详细，生成效果越好',
        '可以在提示词中包含风格、光线、构图等元素',
        '尝试不同的风格预设获得多样化效果',
        '使用"高清"、"精细"等词可提升画质',
      ],
    },
  } as CreateTranslations,
  en: {
    title: 'AI Art Creation',
    subtitle: 'Describe your creativity with words',
    mode: {
      textToImage: 'Text to Image',
      imageToImage: 'Image to Image',
    },
    textToImage: {
      title: 'Prompt',
      placeholder: 'Describe the image you want to generate, e.g., a cute orange cat walking on the beach at sunset...',
      tips: 'The more detailed the prompt, the better the result',
      examplesLabel: 'Examples:',
      examples: [
        'Convenience store night scene - authentic urban street photography',
        'Boston Spring poster - watercolor illustration cityscape',
        'Japanese gacha game UI - fantasy RPG interface design',
      ],
    },
    imageToImage: {
      uploadTitle: 'Upload Reference Image',
      uploadDesc: 'Upload an image as reference, AI will generate new artwork based on it',
      dragHint: 'Click or drag to upload',
      tips: 'Clear images produce better results',
      maxFiles: 'Max 3 files',
      fileFormat: 'JPG, PNG supported',
    },
    parameters: {
      title: 'Parameters',
      size: {
        label: 'Quality',
        options: {
          '1k': '1K (1 credit)',
          '4k': '4K (2 credits)',
        },
      },
      aspectRatio: {
        label: 'Aspect Ratio',
        options: {
          'auto': 'Auto',
          '1:1': '1:1 Avatar/Product',
          '16:9': '16:9 Cover/Landscape',
          '9:16': '9:16 Shorts/Wallpaper',
          '4:3': '4:3 Classic Photo',
          '3:4': '3:4 Social/Detail',
          '21:9': '21:9 Cinema/Ultrawide',
          '2:3': '2:3 Poster/Pinterest',
        },
      },
    },
    actions: {
      generate: 'Generate',
      generating: 'Generating...',
      useCredits: 'Use {count} credits',
      currentBalance: 'Balance: {count} credits',
    },
    results: {
      title: 'Results',
      success: 'Success',
    },
    card: {
      copyPrompt: 'Copy Prompt',
      regenerate: 'Regenerate',
    },
    tips: {
      title: 'Tips',
      items: [
        'More detailed descriptions produce better results',
        'Include style, lighting, composition in your prompt',
        'Try different style presets for variety',
        'Use words like "HD" or "detailed" for better quality',
      ],
    },
  } as CreateTranslations,
  'zh-TW': {
    title: 'AI 藝術創作',
    subtitle: '用文字描述你的創意',
    mode: {
      textToImage: '文生圖',
      imageToImage: '圖生圖',
    },
    textToImage: {
      title: '提示詞',
      placeholder: '描述你想生成的圖片，例如：一隻可愛的橘貓在夕陽下的海邊散步...',
      tips: '提示詞越詳細，生成效果越好',
      examplesLabel: '示例：',
      examples: [
        '便利店夜拍 - 真實城市街拍，年輕人夜間聚會場景',
        '波士頓春天海報 - 水彩插畫風格城市風景',
        '日本手遊抽卡界面 - 日式奇幻RPG遊戲UI設計',
      ],
    },
    imageToImage: {
      uploadTitle: '上傳參考圖片',
      uploadDesc: '上傳一張圖片作為參考，AI將根據圖片生成新的藝術作品',
      dragHint: '點擊或拖拽上傳',
      tips: '上傳清晰的圖片可以獲得更好的效果',
      maxFiles: '最多3張',
      fileFormat: '支持 JPG、PNG',
    },
    parameters: {
      title: '生成參數',
      size: {
        label: '清晰度',
        options: {
          '1k': '1K (1積分)',
          '4k': '4K (2積分)',
        },
      },
      aspectRatio: {
        label: '比例',
        options: {
          'auto': '自動',
          '1:1': '1:1 頭像/商品圖',
          '16:9': '16:9 封面/橫版',
          '9:16': '9:16 短視頻/壁紙',
          '4:3': '4:3 傳統照片',
          '3:4': '3:4 筆記/詳情頁',
          '21:9': '21:9 電影/超寬屏',
          '2:3': '2:3 海報/Pinterest',
        },
      },
    },
    actions: {
      generate: '生成圖片',
      generating: '生成中...',
      useCredits: '消耗 {count} 積分',
      currentBalance: '當前餘額: {count} 積分',
    },
    results: {
      title: '生成結果',
      success: '生成成功',
    },
    card: {
      copyPrompt: '複製提示詞',
      regenerate: '重新生成',
    },
    tips: {
      title: '創作技巧',
      items: [
        '描述越詳細，生成效果越好',
        '可以在提示詞中包含風格、光線、構圖等元素',
        '嘗試不同的風格預設獲得多樣化效果',
        '使用"高清"、"精細"等詞可提升畫質',
      ],
    },
  } as CreateTranslations,
};
