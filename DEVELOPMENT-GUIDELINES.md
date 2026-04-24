# AI Art 项目开发规范

## 1. 项目概述

AI Art 是一个AI生图平台，提供先进的AI图像生成服务。本项目使用现代化的前端技术栈，注重用户体验和代码质量。

## 2. 技术栈

### 核心框架
- **Next.js 15** - React 框架，支持 Server Components 和 App Router
- **React 19** - UI 库
- **TypeScript** - 类型安全

### UI 组件库
- **shadcn/ui** - 高质量、可定制的UI组件
- **Magic UI** - 动画和特效组件
- **React Bits** - 实用React组件集合

### 状态管理
- **Zustand** - 轻量级、可扩展的状态管理

### 多语言
- **next-intl** 或自定义实现 - 支持中英繁三语
- **语言**: 简体中文 (zh-CN), English (en), 繁体中文 (zh-TW)

### 样式
- **Tailwind CSS 4** - 实用优先的CSS框架

## 3. 目录结构

```
ai-art/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # 本地化路由
│   │   ├── layout.tsx            # 根布局
│   │   ├── page.tsx              # 首页
│   │   └── ...                   # 其他页面
│   ├── layout.tsx                # 全局布局
│   ├── globals.css               # 全局样式
│   └── ...
├── components/                   # 组件目录
│   ├── ui/                       # UI组件 (纯展示组件)
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── ...
│   │   └── index.ts              # UI组件导出
│   ├── business/                 # 业务组件 (包含业务逻辑)
│   │   ├── hero-section/         # Hero 区域
│   │   ├── features-showcase/    # 功能展示
│   │   ├── gallery-preview/      # 作品预览
│   │   ├── pricing-section/      # 定价区域
│   │   ├── language-switcher/    # 语言切换
│   │   └── ...
│   ├── layout/                   # 布局组件
│   │   ├── header/
│   │   ├── footer/
│   │   ├── navigation/
│   │   └── ...
│   └── shared/                   # 共享组件
│       ├── loading-spinner/
│       ├── error-boundary/
│       └── ...
├── hooks/                        # 自定义hooks
│   ├── use-localization.ts       # 多语言hook
│   ├── use-scroll-animation.ts   # 滚动动画hook
│   ├── use-media-query.ts        # 响应式hook
│   └── ...
├── stores/                       # Zustand 状态管理
│   ├── use-language-store.ts     # 语言状态
│   ├── use-ui-store.ts           # UI状态（如侧边栏、模态框）
│   ├── use-user-store.ts         # 用户状态
│   └── index.ts                  # 统一导出
├── locales/                      # 多语言文件
│   ├── en.json                   # 英文
│   ├── zh-CN.json                # 简体中文
│   └── zh-TW.json                # 繁体中文
├── lib/                          # 工具库
│   ├── utils.ts                  # 通用工具函数
│   ├── constants.ts              # 常量定义
│   ├── animations.ts             # 动画配置
│   └── ...
├── types/                        # TypeScript 类型定义
│   ├── index.ts
│   ├── locale.ts
│   └── ...
├── config/                       # 配置文件
│   ├── site.ts                   # 站点配置
│   └── ...
└── public/                       # 静态资源
    ├── images/
    ├── icons/
    └── ...
```

## 4. 组件规范

### 4.1 UI组件与业务组件分离

**UI组件 (components/ui/)**:
- 纯展示组件，不包含业务逻辑
- 可以包含交互状态（如hover、active）
- 样式和行为可配置、可扩展
- 示例：Button, Card, Input, Modal

**业务组件 (components/business/)**:
- 包含特定业务逻辑
- 可以调用API、处理状态、使用hooks
- **代码行数限制：不超过300行**
- 示例：HeroSection, FeaturesShowcase, GalleryPreview

### 4.2 组件文件结构

每个组件应该有自己的目录，包含：
```
component-name/
├── component-name.tsx       # 组件主文件
├── component-name.test.tsx  # 测试文件（可选）
└── index.ts                 # 导出文件
```

### 4.3 组件导出规范

使用命名导出，避免默认导出：
```typescript
// index.ts
export { HeroSection } from './hero-section';
export type { HeroSectionProps } from './hero-section';
```

### 4.4 组件类型定义

使用 TypeScript 接口定义 props：
```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick?: () => void;
}
```

### 4.5 业务组件300行限制

为了保持组件的可维护性，业务组件代码行数**不得超过300行**。

如果组件超过300行，应该：
1. 拆分成更小的子组件
2. 将逻辑提取到自定义hooks中
3. 将纯展示部分提取为UI组件

## 5. 多语言规范

### 5.1 语言文件结构（优化后）

为了支持多页面扩展，采用**按页面/模块拆分**的目录结构：

```
locales/
├── index.ts                    # 统一导出
├── common/                     # 公共翻译（导航、按钮等）
│   ├── en.json
│   ├── zh-CN.json
│   └── zh-TW.json
├── pages/                      # 按页面拆分
│   ├── landing/               # Landing Page
│   │   ├── en.json
│   │   ├── zh-CN.json
│   │   └── zh-TW.json
│   ├── create/                # 生图页面
│   │   ├── en.json
│   │   ├── zh-CN.json
│   │   └── zh-TW.json
│   ├── buy/                   # 购买页面
│   │   ├── en.json
│   │   ├── zh-CN.json
│   │   └── zh-TW.json
│   └── history/               # 历史记录
│       ├── en.json
│       ├── zh-CN.json
│       └── zh-TW.json
└── types/
    └── index.ts               # 完整的翻译类型定义
```

### 5.2 公共翻译示例

`locales/common/zh-CN.json`:
```json
{
  "nav": {
    "home": "首页",
    "create": "创作",
    "buy": "购买积分",
    "history": "历史记录",
    "login": "登录",
    "logout": "退出"
  },
  "common": {
    "loading": "加载中...",
    "error": "出错了",
    "confirm": "确认",
    "cancel": "取消",
    "save": "保存",
    "delete": "删除",
    "download": "下载",
    "share": "分享",
    "retry": "重试"
  },
  "credits": {
    "label": "积分",
    "balance": "余额",
    "insufficient": "积分不足",
    "consumed": "消耗 {count} 积分"
  }
}
```

### 5.3 页面翻译示例

`locales/pages/create/zh-CN.json`:
```json
{
  "title": "AI 艺术创作",
  "mode": {
    "textToImage": "文生图",
    "imageToImage": "图生图"
  },
  "textToImage": {
    "placeholder": "请描述你想生成的图片...",
    "tips": "提示：描述越详细，效果越好"
  },
  "imageToImage": {
    "uploadTitle": "上传参考图片",
    "uploadDesc": "支持 1-3 张图片，AI 将融合各图片特征",
    "dragHint": "拖拽图片到此处，或点击选择",
    "maxFiles": "最多上传 3 张图片"
  },
  "actions": {
    "generate": "生成图片",
    "generating": "生成中..."
  }
}
```

### 5.4 使用方式

通过自定义hook获取翻译：

```typescript
'use client';

import { useTranslation, useCommonTranslation } from '@/hooks/use-translation';

export function CreatePage() {
  const { t } = useTranslation();
  const { nav, credits } = useCommonTranslation();
  
  return (
    <div>
      <h1>{t('pages.create.title')}</h1>
      
      <div>
        <button>{t('pages.create.mode.textToImage')}</button>
        <button>{t('pages.create.mode.imageToImage')}</button>
      </div>
      
      <textarea placeholder={t('pages.create.textToImage.placeholder')} />
      
      <button>{t('pages.create.actions.generate')}</button>
      
      <div>{credits.consumed(1)}</div>
    </div>
  );
}
```

### 5.5 带参数的翻译

```typescript
// 翻译定义: "consumed": "消耗 {count} 积分"
const { t } = useTranslation();
console.log(t('common.credits.consumed', { count: 5 }));
// 输出: "消耗 5 积分"
```

### 5.6 语言切换

使用 Zustand 管理语言状态，提供语言切换组件。默认语言为 `zh-CN`。

```typescript
// stores/use-language-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'zh-CN' | 'zh-TW';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'zh-CN',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'ai-art-language-storage',
    }
  )
);
```

## 6. 状态管理规范

### 6.1 Zustand Store 结构

每个store应该有明确的职责：
```typescript
// stores/use-language-store.ts
import { create } from 'zustand';

interface LanguageState {
  locale: 'en' | 'zh-CN' | 'zh-TW';
  setLocale: (locale: 'en' | 'zh-CN' | 'zh-TW') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: 'zh-CN',
  setLocale: (locale) => set({ locale }),
}));
```

### 6.2 Store 使用原则

- 只在必要时使用全局状态
- 优先使用组件本地状态
- 避免过度使用全局状态导致性能问题

## 7. 样式规范

### 7.1 Tailwind CSS 使用

优先使用 Tailwind CSS 工具类：
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
```

### 7.2 动画效果

使用 Magic UI 和 React Bits 实现炫酷动画：
- 滚动触发动画
- 视差效果
- 渐入渐出
- 悬浮效果

### 7.3 响应式设计

使用 Tailwind 响应式前缀：
```tsx
<div className="text-sm md:text-base lg:text-lg">
```

## 8. 命名规范

### 8.1 文件命名

- 组件文件：kebab-case (e.g., `hero-section.tsx`)
- hooks文件：kebab-case 带 `use-` 前缀 (e.g., `use-localization.ts`)
- store文件：kebab-case 带 `use-` 前缀 (e.g., `use-language-store.ts`)

### 8.2 变量命名

- 组件：PascalCase (e.g., `HeroSection`)
- hooks：camelCase 带 `use` 前缀 (e.g., `useLocalization`)
- 常量：UPPER_SNAKE_CASE (e.g., `DEFAULT_LOCALE`)
- 普通变量：camelCase (e.g., `isLoading`)

### 8.3 CSS类名

- 自定义类名：kebab-case (e.g., `.hero-section`)
- 避免使用语义化不明确的类名

## 9. 代码规范

### 9.1 TypeScript 严格模式

确保 TypeScript 配置启用严格模式：
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 9.2 导入顺序

按照以下顺序组织导入：
1. React 和 Next.js 相关
2. 第三方库
3. 自定义 hooks
4. 组件
5. 类型
6. 样式和资源

### 9.3 代码注释

- 为复杂逻辑添加注释
- 为公共API添加JSDoc注释
- 避免显而易见的注释

### 9.4 性能优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 和 `useCallback` 优化计算
- 懒加载非关键组件
- 图片优化（压缩、懒加载、响应式）

## 10. Landing Page 设计规范

### 10.1 页面结构

1. **导航栏** - 品牌logo、导航链接、语言切换、登录/注册
2. **Hero区域** - 主标题、副标题、CTA按钮、背景动画
3. **功能展示** - 核心功能卡片、图标、动画
4. **作品预览** - AI生成作品展示、画廊效果
5. **定价方案** - 套餐对比、特色列表
6. **用户评价** - 客户 testimonials
7. **FAQ** - 常见问题
8. **CTA区域** - 最终行动召唤
9. **页脚** - 链接、版权信息

### 10.2 动画效果要求

- 滚动触发的元素渐入
- 视差滚动效果
- 悬浮交互效果
- 平滑过渡动画
- 背景渐变动画
- 粒子效果（可选）

### 10.3 色彩方案

- 主色调：现代科技感（深蓝、紫色）
- 辅助色：活力色（橙、粉）
- 中性色：黑白灰
- 确保可访问性（对比度符合WCAG标准）

### 10.4 排版规范

- 标题：现代无衬线字体
- 正文：清晰易读的字体
- 建立明确的字体层级
- 响应式字体大小

## 11. 页面规划（MVP）

### 11.1 路由总览

| 路由 | 页面 | 功能描述 | 优先级 |
|------|------|----------|--------|
| `/` | Landing Page | 产品介绍、功能展示、定价、FAQ | P0 |
| `/sign-in` | Sign In | 用户登录/注册 (Clerk 托管) | P0 |
| `/create` | Create Page | 文生图 + 图生图 核心功能 | P0 |
| `/buy` | Buy Page | 积分套餐购买页面 | P0 |
| `/history` | History Page | 用户生成历史记录 | P1 |

### 11.2 Landing Page (`/`)

**文件位置**: `app/page.tsx`

**页面结构**:
```
┌──────────────────────────────────────────────────────────┐
│                    Header (导航栏)                         │
├──────────────────────────────────────────────────────────┤
│                    Hero Section                            │
│              (主标题 + CTA 按钮 + 数据统计)                │
├──────────────────────────────────────────────────────────┤
│                  Features Section                          │
│              (核心功能卡片展示)                             │
├──────────────────────────────────────────────────────────┤
│                  Gallery Section                           │
│              (社区生成作品展示)                             │
├──────────────────────────────────────────────────────────┤
│                  Pricing Section                           │
│              (积分套餐定价展示)                             │
├──────────────────────────────────────────────────────────┤
│                   FAQ Section                              │
│              (常见问题解答)                                │
├──────────────────────────────────────────────────────────┤
│                   CTA Section                              │
│              (行动召唤区域)                                │
├──────────────────────────────────────────────────────────┤
│                    Footer (页脚)                           │
└──────────────────────────────────────────────────────────┘
```

**功能点**:
- 展示产品价值主张
- 引导用户到 `/create` 或 `/buy`
- 展示定价套餐（需更新为积分制）

### 11.3 Sign-in Page (`/sign-in`)

**文件位置**: `app/sign-in/[[...sign-in]]/page.tsx`

**实现方式**: Clerk 托管的 `<SignIn />` 组件

**认证流程**:
```
未登录用户访问 /create → 重定向到 /sign-in
                                    ↓
                      用户登录/注册 (Clerk 处理)
                                    ↓
                      重定向回 /create 或之前页面
```

### 11.4 Create Page (`/create`) - 核心页面

**文件位置**: `app/create/page.tsx` (待开发)

**功能概述**: 支持两种生成模式 - 文生图和图生图

#### 11.4.1 文生图模式 (Text to Image)

**界面布局**:
```
┌─────────────────────────────────────────────────────┐
│  模式切换: [文生图] [图生图]                          │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  请描述你想生成的图片...                      │   │
│  │  (Prompt 输入框，支持多行)                   │   │
│  └─────────────────────────────────────────────┘   │
│  提示词建议: [写实风格] [动漫风格] [水彩画] [油画]   │
├─────────────────────────────────────────────────────┤
│  参数设置 (可选):                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 尺寸选择  │  │ 风格强度  │  │ 负向提示  │        │
│  │ 1024×1024│  │ 中等     │  │ (可选)    │        │
│  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────┤
│  [生成图片]  预计消耗: 1 credit                     │
│  剩余积分: 10 credits                                │
└─────────────────────────────────────────────────────┘
```

**核心参数**:
| 参数 | 选项 | 默认值 | 说明 |
|------|------|--------|------|
| 尺寸 | 512×512 / 1024×1024 / 1024×1792 / 1792×1024 | 1024×1024 | 输出图片分辨率 |
| 风格强度 | 低 / 中 / 高 | 中 | 影响创意程度 |
| 数量 | 1 / 2 / 4 | 1 | 一次生成数量 |
| 负向提示 | 文本输入 | 空 | 排除不想出现的内容 |

#### 11.4.2 图生图模式 (Image to Image)

**界面布局**:
```
┌─────────────────────────────────────────────────────┐
│  模式切换: [文生图] [图生图]                          │
├─────────────────────────────────────────────────────┤
│  上传参考图片 (最多3张):                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │         │ │         │ │  + 添加  │              │
│  │  图片1  │ │  图片2  │ │  更多    │              │
│  │         │ │         │ │         │              │
│  └─────────┘ └─────────┘ └─────────┘              │
├─────────────────────────────────────────────────────┤
│  请描述你想生成的图片...                              │
│  (基于参考图片的文字描述，可选)                       │
├─────────────────────────────────────────────────────┤
│  参数设置:                                           │
│  ┌──────────┐  ┌──────────┐                        │
│  │ 尺寸选择  │  │ 相似度    │                        │
│  │ 1024×1024│  │ 60%      │                        │
│  └──────────┘  └──────────┘                        │
├─────────────────────────────────────────────────────┤
│  [生成图片]  预计消耗: 1 credit                      │
└─────────────────────────────────────────────────────┘
```

**核心参数**:
| 参数 | 选项 | 默认值 | 说明 |
|------|------|--------|------|
| 参考图片 | 1-3张 | 1张 | 支持拖拽上传、点击选择 |
| 相似度滑块 | 0-100% | 60% | 控制与原图的相似程度 |
| 尺寸 | 同文生图 | 1024×1024 | 输出图片分辨率 |

**多图输入说明**:
- 支持同时上传1-3张参考图片
- 多张图片时，AI 会融合各图片的特征
- 用例: "用这张猫的姿态 + 这张画的风格 + 这张图的配色"

#### 11.4.3 生成流程

```
用户输入参数 → 点击生成 → 积分预扣 → 调用 gpt-image2 API
                                                ↓
用户下载 ← 保存到历史记录 ← 显示生成结果 ← API 返回图片
                                                ↓
                                  失败 → 退还积分 → 显示错误提示
```

### 11.5 Buy Page (`/buy`)

**文件位置**: `app/buy/page.tsx` (待开发)

**页面结构**:
```
┌──────────────────────────────────────────────────────────────┐
│  购买积分 - 选择适合你的套餐                                   │
│  当前余额: 10 credits                                          │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Starter  │  │ Standard │  │ Premium  │                   │
│  │          │  │  ⭐推荐   │  │          │                   │
│  ├──────────┤  ├──────────┤  ├──────────┤                   │
│  │ 10 credits│ │ 30 credits│ │ 75 credits│                   │
│  │          │  │          │  │          │                   │
│  │  $3.99   │  │  $9.99   │  │ $19.99   │                   │
│  │ $0.40/个 │  │ $0.33/个 │  │ $0.27/个 │                   │
│  ├──────────┤  ├──────────┤  ├──────────┤                   │
│  │ [选择]   │  │ [选择]   │  │ [选择]   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
├──────────────────────────────────────────────────────────────┤
│  已选择: Standard 套餐                                         │
│  积分数: 30 credits                                            │
│  价格: $9.99                                                   │
│                                                                │
│  [使用 Stripe 支付]  [使用 PayPal 支付]                       │
└──────────────────────────────────────────────────────────────┘
```

### 11.6 History Page (`/history`)

**文件位置**: `app/history/page.tsx` (待开发)

**页面结构**:
```
┌──────────────────────────────────────────────────────────────┐
│  生成历史                                                       │
│  共 24 张图片 | 筛选: [全部] [文生图] [图生图]                │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │  图片   │ │  图片   │ │  图片   │ │  图片   │           │
│  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤           │
│  │ 2026-04-24 │ │ 2026-04-23 │ │ 2026-04-22 │ │ 2026-04-21 │           │
│  │ 文生图   │ │ 图生图   │ │ 文生图   │ │ 文生图   │           │
│  │ [下载]  │ │ [下载]  │ │ [下载]  │ │ [下载]  │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├──────────────────────────────────────────────────────────────┤
│  点击图片查看详情:                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    [大图预览]                          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 生成时间: 2026-04-24 14:30                            │ │
│  │ 生成方式: 文生图                                         │ │
│  │ 提示词: "一只可爱的猫咪，水彩画风格，柔和的光线"          │ │
│  │ 尺寸: 1024×1024                                        │ │
│  │ 消耗积分: 1 credit                                      │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ [下载原图] [重新生成] [复制提示词] [删除]               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**功能列表**:
| 功能 | 描述 |
|------|------|
| 图片网格 | 瀑布流/网格布局展示历史图片 |
| 筛选 | 按生成方式、日期范围筛选 |
| 搜索 | 按提示词关键词搜索 |
| 分页 | 无限滚动/分页加载 |
| 详情查看 | 点击图片查看完整信息 |
| 下载 | 下载原图到本地 |
| 重新生成 | 使用相同参数再次生成 |
| 复制提示词 | 复制生成时的提示词 |
| 删除 | 删除单条历史记录 |

## 12. 定价与积分系统

### 12.1 套餐定价

| 套餐 | 积分数 | 价格 | 单价/积分 | 折扣 | 毛利率 |
|------|--------|------|-----------|------|--------|
| **Starter** | 10 credits | **$3.99** | $0.40/credit | 无 | 89% |
| **Standard** ⭐ | 30 credits | **$9.99** | $0.33/credit | 18% OFF | 86% |
| **Premium** | 75 credits | **$19.99** | $0.27/credit | 33% OFF | 83% |

### 12.2 定价说明

- **计价单位**: USD (支持多币种显示)
- **支付方式**: Stripe / PayPal (MVP)，后续可扩展支付宝、微信支付
- **套餐标识**: Standard 为推荐套餐，高亮显示 ⭐
- **优惠策略**: 买得越多，单价越低，鼓励批量购买

### 12.3 成本分析

- **单次生成成本**: 约 $0.044 (基于 gpt-image2 API 成本估算)
- **毛利率计算**: `(单价 - 成本) / 单价 × 100%`

| 套餐 | 单价 | 成本 | 毛利率 |
|------|------|------|--------|
| Starter | $0.40 | $0.044 | 89% |
| Standard | $0.33 | $0.044 | 86% |
| Premium | $0.27 | $0.044 | 83% |

### 12.4 积分消耗规则

| 操作 | 消耗积分 | 说明 |
|------|---------|------|
| **生成1张图（任意模式）** | 1 credit | 文生图、图生图均消耗1积分 |
| 图片放大/增强 | 1 credit | 后续迭代 |
| 批量生成 | N credits | 一次生成N张图消耗N积分 |

### 12.5 积分生命周期

- **获取方式**: 购买套餐、活动赠送、推荐奖励
- **有效期**: 购买后365天内有效
- **不可退还**: 积分一经充值，不予退款
- **优先级消耗**: 先过期的积分优先消耗

### 12.6 积分余额展示

- **位置**: 顶部导航栏右侧（登录后）
- **显示格式**: `10 credits`
- **交互**: 点击余额跳转到 `/buy` 购买页
- **预警**: 余额不足3积分时，显示黄色预警样式

### 12.7 数据模型

#### 用户积分模型
```typescript
interface UserCredits {
  userId: string;
  totalCredits: number;
  usedCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'consumption' | 'refund' | 'bonus';
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string; // 订单ID/生成记录ID
  createdAt: Date;
}
```

#### 生成记录模型
```typescript
interface GenerationRecord {
  id: string;
  userId: string;
  mode: 'text-to-image' | 'image-to-image';
  prompt: string;
  negativePrompt?: string;
  referenceImages?: string[]; // 参考图片 URL
  outputImage: string; // 生成图片 URL
  parameters: {
    size: string;
    styleStrength?: number;
    similarity?: number;
  };
  creditsUsed: number;
  status: 'pending' | 'success' | 'failed';
  errorMessage?: string;
  createdAt: Date;
}
```

#### 订单模型
```typescript
interface Order {
  id: string;
  userId: string;
  packageType: 'starter' | 'standard' | 'premium';
  creditsAmount: number;
  amount: number; // 价格
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentProvider: string; // 'stripe' | 'paypal'
  paymentIntentId?: string;
  paidAt?: Date;
  createdAt: Date;
}
```

## 13. 测试规范

- 为业务组件编写单元测试
- 为关键功能编写集成测试
- 确保多语言功能正常工作
- 测试不同语言环境下的UI表现

## 14. 部署规范

- 使用 Next.js 静态导出或Vercel部署
- 配置正确的环境变量
- 确保构建过程无错误
- 优化生产构建

---

**版本**: 1.1  
**最后更新**: 2026-04-24  
**维护者**: AI Art 开发团队

## 更新日志

### v1.1 (2026-04-24)

**新增章节**:
- **第11章 页面规划（MVP）**
  - 路由总览表（5个核心页面）
  - Landing Page 页面结构
  - Sign-in Page 认证流程
  - Create Page 核心功能（文生图 + 图生图）
  - Buy Page 购买页面设计
  - History Page 历史记录页面

- **第12章 定价与积分系统**
  - 三档套餐定价表（Starter/Standard/Premium）
  - 成本分析与毛利率计算
  - 积分消耗规则
  - 积分生命周期管理
  - 数据模型定义（UserCredits、GenerationRecord、Order）

**更新章节**:
- **第5章 多语言规范**
  - 新增优化后的目录结构（按页面/模块拆分）
  - 公共翻译与页面翻译分离
  - 带参数的翻译使用方式
  - 类型安全的语言状态管理

---
