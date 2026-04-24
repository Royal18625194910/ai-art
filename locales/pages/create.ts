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
        '赛博朋克风格的城市夜景，霓虹灯，雨夜，未来感',
        '日式庭院，樱花盛开，小桥流水，宁静祥和',
        '太空飞船在星云中航行，科幻风格，壮丽景观',
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
          '1:1': '1:1 方形',
          '16:9': '16:9 宽屏',
          '9:16': '9:16 竖屏',
          '4:3': '4:3 标准',
          '3:4': '3:4 竖版',
          '21:9': '21:9 超宽',
          '2:3': '2:3 竖版',
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
        'Cyberpunk city at night, neon lights, rainy, futuristic',
        'Japanese garden, cherry blossoms, small bridge, peaceful',
        'Spaceship traveling through nebula, sci-fi style, magnificent view',
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
          '1:1': '1:1 Square',
          '16:9': '16:9 Widescreen',
          '9:16': '9:16 Portrait',
          '4:3': '4:3 Standard',
          '3:4': '3:4 Portrait',
          '21:9': '21:9 Ultrawide',
          '2:3': '2:3 Portrait',
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
        '賽博朋克風格的城市夜景，霓虹燈，雨夜，未來感',
        '日式庭院，櫻花盛開，小橋流水，寧靜祥和',
        '太空飛船在星雲中航行，科瑏風格，壯麗景觀',
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
          '1:1': '1:1 方形',
          '16:9': '16:9 寬屏',
          '9:16': '9:16 豎屏',
          '4:3': '4:3 標準',
          '3:4': '3:4 豎版',
          '21:9': '21:9 超寬',
          '2:3': '2:3 豎版',
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
