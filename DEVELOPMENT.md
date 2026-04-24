# AI Art 开发文档

## 项目概述

AI Art 是一个 AI 图像生成平台，基于 Next.js 15 + Convex + Clerk 构建。

## 核心配置

### 积分定价

| 套餐 | 积分数 | 价格 | 单价/积分 | 折扣 |
|------|--------|------|-----------|------|
| **Starter** | 10 credits | **$3.99** | $0.40/credit | - |
| **Standard** | 30 credits | **$9.99** | $0.33/credit | 18% OFF |
| **Premium** | 75 credits | **$19.99** | $0.27/credit | 33% OFF |

位置：`config/pricing.ts`

### 积分消耗规则

- **生成 1 张图** = 1 credit
- 1K 清晰度 = 1 credit
- 4K 清晰度 = 2 credits

### 技术支持

- 邮箱：2326182533@qq.com

位置：`config/site.ts`

## 项目结构

```
ai-art/
├── app/                    # Next.js App Router
│   ├── buy/
│   │   ├── page.tsx       # 购买页面
│   │   └── _components/   # 购买页面专属组件
│   │       ├── header-section.tsx
│   │       ├── package-card.tsx
│   │       └── credit-info.tsx
│   ├── create/
│   │   └── page.tsx       # 创作页面
│   ├── history/
│   │   └── page.tsx       # 历史记录页面
│   └── ...
├── components/
│   ├── business/          # 业务组件
│   ├── layout/           # 布局组件
│   ├── providers/        # Provider 组件
│   └── ui/               # UI 组件
├── config/
│   ├── pricing.ts        # 定价配置
│   └── site.ts           # 站点配置
├── convex/               # Convex 后端
│   ├── users.ts
│   ├── generations.ts
│   └── schema.ts
├── hooks/                # 自定义 Hooks
│   ├── use-payment.ts
│   ├── use-user-credits.ts
│   └── use-translation.ts
├── locales/              # 国际化
│   ├── pages/
│   ├── common/
│   └── types.ts
└── types/
    └── index.ts          # 类型定义
```

## 技术栈

- **框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS v4
- **后端**: Convex
- **认证**: Clerk
- **支付**: Creem (待集成)
- **国际化**: 自研 i18n 方案 (TS 文件)

## 开发规范

### 组件拆分

- 业务组件放 `app/{page}/_components/`
- 通用组件放 `components/`
- Hooks 放 `hooks/`
- 配置放 `config/`

### 代码组织

1. 配置优先：价格、邮箱等放 `config/` 目录
2. 组件单一职责：每个组件只做一件事
3. 自定义 Hooks：抽离可复用逻辑
4. 国际化：所有文案使用翻译函数

## 待完成任务

- [ ] 集成 Creem 支付系统
- [ ] 实现 AI 生图 API
- [ ] 添加 webhook 处理

## 环境变量

```bash
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Creem (待添加)
CREEM_API_KEY=
```
