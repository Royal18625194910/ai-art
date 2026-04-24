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
- 自定义实现 - 支持中英繁三语
- **语言**: 简体中文 (zh-CN), English (en), 繁体中文 (zh-TW)

### 样式
- **Tailwind CSS 4** - 实用优先的CSS框架

### 后端
- **Convex** - 数据库（仅数据存储）
- **Clerk** - 用户认证
- **Creem** - 支付系统
- **OpenAI** - AI 生图 API (gpt-image-2)

## 3. 目录结构

```
ai-art/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首页
│   ├── create/                   # 生图页面
│   ├── buy/                      # 购买积分
│   ├── history/                  # 历史记录
│   ├── sign-in/                  # 登录
│   ├── api/                      # API 路由
│   │   ├── generate/             # 生图 API
│   │   ├── checkout/             # 支付 API
│   │   └── webhooks/             # Webhook 处理
│   ├── layout.tsx                # 全局布局
│   └── globals.css               # 全局样式
├── components/                   # 组件目录
│   ├── ui/                       # UI组件 (纯展示)
│   │   ├── button/
│   │   ├── card/
│   │   └── ...
│   ├── business/                 # 业务组件 (含逻辑)
│   │   ├── hero-section/
│   │   ├── features-section/
│   │   └── ...
│   └── layout/                   # 布局组件
│       ├── header/
│       └── footer/
├── convex/                       # Convex 数据库
│   ├── schema.ts                 # 数据表结构
│   ├── users.ts                  # 用户 + 积分操作
│   ├── generations.ts            # 生图记录
│   ├── payments.ts               # 付费记录
│   └── index.ts                  # 导出
├── hooks/                        # 自定义hooks
├── stores/                       # Zustand 状态管理
├── lib/                          # 工具库
│   ├── utils.ts                  # shadcn 工具
│   ├── common.ts                 # 通用工具函数
│   └── constants.ts              # 常量
├── types/                        # TypeScript 类型
├── locales/                      # 多语言文件
├── config/                       # 配置文件
└── public/                       # 静态资源
```

## 4. 代码规范

### 4.1 组件规范

#### UI 组件 vs 业务组件

| 类型 | 位置 | 职责 | 代码行数 |
|------|------|------|----------|
| **UI 组件** | `components/ui/` | 纯展示，无业务逻辑 | 无限制 |
| **业务组件** | `components/business/` | 含业务逻辑，调API | **≤ 300 行** |

#### 业务组件超过 300 行的拆分策略

```typescript
// 错误：一个组件 500+ 行
export function CreatePage() {
  // 状态定义
  // 处理函数
  // UI 渲染
  // ... 500 行代码
}

// 正确：拆分成多个部分
// 1. 提取自定义 hook
function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  // ... 逻辑
  return { isGenerating, generate };
}

// 2. 提取子组件
function PromptInput({ value, onChange }: PromptInputProps) {
  return <textarea ... />;
}

function ImageUploader({ onUpload }: ImageUploaderProps) {
  return <div ... />;
}

// 3. 主组件保持简洁
export function CreatePage() {
  const { isGenerating, generate } = useImageGeneration();
  
  return (
    <div>
      <PromptInput ... />
      <ImageUploader ... />
    </div>
  );
}
```

#### 组件文件结构

```
components/business/hero-section/
├── index.ts              # 导出
├── hero-section.tsx      # 主组件 (≤ 300 行)
├── hero-title.tsx        # 子组件 (如需要)
└── use-hero-animation.ts # 自定义 hook
```

### 4.2 Hooks 规范

**优先使用自定义 hooks 提取逻辑**：

```typescript
// hooks/use-generation.ts
export function useGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generate = async (params: GenerateParams) => {
    setIsLoading(true);
    try {
      const result = await fetch('/api/generate', ...);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, error, generate };
}

// 组件中使用
export function CreatePage() {
  const { isLoading, error, generate } = useGeneration();
  // 组件只负责 UI
}
```

**常用 hooks 列表**：
- `useGeneration()` - 生图逻辑
- `useCredits()` - 积分查询/操作
- `useHistory()` - 历史记录
- `useScrollAnimation()` - 滚动动画
- `useMediaQuery()` - 响应式

### 4.3 代码简洁原则

**要**：
```typescript
// 简洁、可读
const price = formatPrice(amount, currency);

// 提前返回
if (!user) return null;

// 使用工具函数
const className = cn('base', isActive && 'active');

// 解构简化
const { name, email } = user;
```

**不要**：
```typescript
// 冗余
const price = amount !== undefined && amount !== null 
  ? currency + amount.toFixed(2) 
  : '0.00';

// 嵌套过深
if (user) {
  if (user.isActive) {
    if (user.credits > 0) {
      // ...
    }
  }
}

// 过度抽象
const getClassName = (base: string, active: boolean) => {
  return `${base} ${active ? 'active' : ''}`;
};
```

### 4.4 工具函数规范

通用工具函数放在 `lib/common.ts`：

```typescript
// lib/common.ts

/**
 * 格式化价格
 */
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

/**
 * 截断文本
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * 防抖
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * 下载文件
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

### 4.5 导入顺序

```typescript
// 1. React/Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. 第三方库
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// 3. 自定义 hooks
import { useGeneration } from '@/hooks/use-generation';
import { useCredits } from '@/hooks/use-credits';

// 4. 组件
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 5. 工具/常量
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/common';

// 6. 类型
import type { GenerationParams } from '@/types';
```

### 4.6 命名规范

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| 组件 | PascalCase | `HeroSection` |
| Hooks | camelCase + use 前缀 | `useGeneration` |
| 工具函数 | camelCase | `formatPrice` |
| 常量 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| 类型/接口 | PascalCase | `GenerationParams` |
| 文件 | kebab-case | `hero-section.tsx` |

### 4.7 类型定义

```typescript
// 优先使用 interface
interface UserProps {
  id: string;
  name: string;
  email?: string; // 可选
}

// 简单类型可用 type
type Status = 'pending' | 'success' | 'error';

// 导出类型
export type { UserProps, Status };
```

## 5. 组件开发规范

### 5.1 UI 组件 (components/ui/)

- 纯展示，**不包含业务逻辑**
- 可复用，可配置
- 使用 `cn()` 合并类名

```typescript
// components/ui/button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'default', 
  size = 'md',
  children,
  onClick,
  className 
}: ButtonProps & { className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg transition-colors',
        variant === 'primary' && 'bg-purple-600 text-white',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        className
      )}
    >
      {children}
    </button>
  );
}
```

### 5.2 业务组件 (components/business/)

- **代码行数 ≤ 300 行**
- 逻辑提取到 hooks
- 复杂 UI 拆分子组件

```typescript
// components/business/create-form.tsx (≤ 300 行)
'use client';

import { useState } from 'react';
import { useGeneration } from '@/hooks/use-generation';
import { useCredits } from '@/hooks/use-credits';
import { Button } from '@/components/ui/button';
import { PromptInput } from './prompt-input';
import { ImagePreview } from './image-preview';

export function CreateForm() {
  const [prompt, setPrompt] = useState('');
  const { generate, isLoading, result } = useGeneration();
  const { balance } = useCredits();
  
  const handleSubmit = () => {
    if (!prompt.trim()) return;
    generate({ prompt });
  };
  
  return (
    <div className="space-y-4">
      <PromptInput value={prompt} onChange={setPrompt} />
      <div className="flex justify-between">
        <span>剩余: {balance} 积分</span>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? '生成中...' : '生成'}
        </Button>
      </div>
      {result && <ImagePreview src={result.url} />}
    </div>
  );
}
```

## 6. 多语言规范

### 6.1 目录结构

```
locales/
├── index.ts              # 导出
├── common/               # 公共翻译
│   ├── zh-CN.json
│   ├── zh-TW.json
│   └── en.json
└── pages/                # 页面翻译
    ├── create/
    ├── buy/
    └── history/
```

### 6.2 使用方式

```typescript
import { useTranslation } from '@/hooks/use-translation';

export function CreatePage() {
  const { t } = useTranslation('create');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## 7. 状态管理

### 7.1 Zustand Store

```typescript
// stores/use-ui-store.ts
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
}));
```

### 7.2 使用原则

- 优先使用组件本地状态 (`useState`)
- 跨组件共享状态才用 Zustand
- 避免过度使用全局状态

## 8. 后端架构 (Convex + Next.js API)

### 8.1 架构原则

- **Convex 只做数据存储**：基础 CRUD，原子操作
- **业务逻辑在 Next.js API**：AI 生图、支付、复杂计算

### 8.2 数据流

```
用户 → Next.js API → 业务逻辑 → Convex (存取数据)
              ↓
        OpenAI / Creem
```

### 8.3 Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 用户表 - 包含积分余额
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    credits: v.number(), // 剩余积分
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // 生图历史记录
  generations: defineTable({
    userId: v.id("users"),
    mode: v.union(v.literal("text-to-image"), v.literal("image-to-image")),
    prompt: v.string(),
    outputImage: v.string(),
    creditsUsed: v.number(),
    status: v.union(v.literal("pending"), v.literal("success"), v.literal("failed")),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),

  // 付费记录
  payments: defineTable({
    userId: v.id("users"),
    creemPaymentId: v.string(),
    packageType: v.union(v.literal("starter"), v.literal("standard"), v.literal("premium")),
    creditsAmount: v.number(),
    amount: v.number(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),
});
```

### 8.4 API Routes

```typescript
// app/api/generate/route.ts
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  const { prompt } = await req.json();
  
  // 1. 检查积分
  // 2. 预扣积分
  // 3. 调用 OpenAI
  // 4. 保存记录
  
  return Response.json({ success: true, imageUrl });
}
```

## 9. 样式规范

### 9.1 Tailwind CSS

```tsx
// 优先使用工具类
<div className="flex items-center justify-between p-4 bg-white rounded-lg">

// 响应式
<div className="text-sm md:text-base lg:text-lg">

// 状态
<button className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50">
```

### 9.2 主题色

- 主色：紫色 (`purple-500`, `purple-600`)
- 背景：深色 (`bg-background`, `bg-card`)
- 文字：`text-foreground`, `text-muted-foreground`

## 10. 页面清单

| 路由 | 状态 | 说明 |
|------|------|------|
| `/` | ✅ | Landing Page |
| `/sign-in` | ✅ | Clerk 登录 |
| `/create` | 🚧 | 文生图 + 图生图 |
| `/buy` | 🚧 | 购买积分 |
| `/history` | 🚧 | 历史记录 |

## 11. 定价

| 套餐 | 积分数 | 价格 | 单价 |
|------|--------|------|------|
| Starter | 10 | $3.99 | $0.40 |
| Standard | 30 | $9.99 | $0.33 |
| Premium | 75 | $19.99 | $0.27 |

- 新用户送 3 积分
- 每次生成消耗 1 积分

## 12. 环境变量

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex
NEXT_PUBLIC_CONVEX_URL=

# OpenAI
OPENAI_API_KEY=

# Creem
CREEM_API_KEY=
CREEM_WEBHOOK_SECRET=
```

## 13. 常用命令

```bash
# 开发
npm run dev              # Next.js
npx convex dev          # Convex

# 部署
npx convex deploy       # Convex 生产
```

---

**版本**: 2.0  
**最后更新**: 2026-04-24

## 更新日志

### v2.0 (2026-04-24)
- 合并 DEVELOPMENT.md 内容
- 新增代码规范章节（组件拆分、hooks、简洁原则）
- 新增 lib/common.ts 工具函数规范
- 简化整体结构
