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

### 5.1 语言文件结构

使用JSON格式存储翻译：
```json
// locales/zh-CN.json
{
  "hero": {
    "title": "AI 艺术创作平台",
    "subtitle": "用AI创造无限可能",
    "cta": "立即体验"
  },
  "features": {
    "title": "核心功能",
    "items": [
      { "title": "智能生成", "desc": "基于最新AI模型" }
    ]
  }
}
```

### 5.2 使用方式

通过自定义hook获取翻译：
```typescript
const t = useTranslation();
const title = t('hero.title');
```

### 5.3 语言切换

使用 Zustand 管理语言状态，提供语言切换组件。

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

## 11. 测试规范

- 为业务组件编写单元测试
- 为关键功能编写集成测试
- 确保多语言功能正常工作
- 测试不同语言环境下的UI表现

## 12. 部署规范

- 使用 Next.js 静态导出或Vercel部署
- 配置正确的环境变量
- 确保构建过程无错误
- 优化生产构建

---

**版本**: 1.0  
**最后更新**: 2026-04-23  
**维护者**: AI Art 开发团队
