export interface GalleryImage {
  id: number;
  prompt: string;
  promptEn: string;
  category: 'portrait' | 'poster' | 'ui' | 'infographic' | 'photo';
  likes: number;
  views: number;
  src: string;
  aspectRatio?: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    prompt: '便利店夜拍 - 真实城市街拍，年轻人夜间聚会场景',
    promptEn: 'Convenience store night scene - authentic urban street photography',
    category: 'portrait',
    likes: 3421,
    views: 12890,
    src: '/showcase/portrait-convenience-store.jpg',
  },
  {
    id: 2,
    prompt: '波士顿春天海报 - 水彩插画风格城市风景',
    promptEn: 'Boston Spring poster - watercolor illustration cityscape',
    category: 'poster',
    likes: 2890,
    views: 9876,
    src: '/showcase/poster-boston-spring.jpg',
  },
  {
    id: 3,
    prompt: '日本手游抽卡界面 - 日式奇幻RPG游戏UI设计',
    promptEn: 'Japanese gacha game UI - fantasy RPG interface design',
    category: 'ui',
    likes: 4567,
    views: 15678,
    src: '/showcase/ui-gacha-game.jpg',
  },
  {
    id: 4,
    prompt: '明制汉服拆解 - 科普百科信息图',
    promptEn: 'Ming Dynasty Hanfu breakdown - encyclopedia infographic',
    category: 'infographic',
    likes: 5678,
    views: 18990,
    src: '/showcase/infographic-hanfu.jpg',
  },
  {
    id: 5,
    prompt: '景德镇青花瓷 - 中国传统工艺科普图',
    promptEn: 'Jingdezhen Blue and White Porcelain - Chinese craft infographic',
    category: 'infographic',
    likes: 3234,
    views: 11234,
    src: '/showcase/infographic-porcelain.jpg',
  },
  {
    id: 6,
    prompt: '宋朝朋友圈 - 古风社交媒体UI设计',
    promptEn: 'Song Dynasty Social Feed - ancient-style social media UI',
    category: 'ui',
    likes: 4123,
    views: 14567,
    src: '/showcase/ui-song-dynasty-social.jpg',
  },
  {
    id: 7,
    prompt: '抖音直播界面 - 真实直播APP截图',
    promptEn: 'Live streaming interface - realistic app screenshot',
    category: 'ui',
    likes: 2345,
    views: 8765,
    src: '/showcase/ui-douyin-livestream.jpg',
  },
  {
    id: 8,
    prompt: 'Apple Park 发布会 - 蒂姆·库克演讲现场照片',
    promptEn: 'Apple Park Keynote - Tim Cook presentation photo',
    category: 'photo',
    likes: 6789,
    views: 23456,
    src: '/showcase/photo-apple-keynote.jpg',
  },
  {
    id: 9,
    prompt: '手写笔记 - 自然光照下的圆珠笔手写记录',
    promptEn: 'Handwritten notes - natural light ballpoint pen journal',
    category: 'photo',
    likes: 1876,
    views: 6543,
    src: '/showcase/photo-handwritten-notes.jpg',
  },
  {
    id: 10,
    prompt: '终结者淘宝页面 - 创意电商UI设计',
    promptEn: 'Terminator Taobao page - creative e-commerce UI design',
    category: 'ui',
    likes: 5678,
    views: 19876,
    src: '/showcase/ui-terminator-taobao.jpg',
  },
  {
    id: 11,
    prompt: 'AI视频生成器 - 现代化专业UI界面',
    promptEn: 'AI Video Generator - modern professional UI interface',
    category: 'ui',
    likes: 3456,
    views: 12345,
    src: '/showcase/ui-ai-video-generator.jpg',
  },
];

export const galleryCategories = ['all', 'portrait', 'poster', 'ui', 'infographic', 'photo'] as const;

export type GalleryCategory = (typeof galleryCategories)[number];
