# AI Art - AI 图像生成平台

一个现代化的 AI 图像生成平台，支持文生图和图生图功能。

## 功能特性

- **文生图**: 输入文字描述，AI 生成对应图片
- **图生图**: 上传参考图片，AI 融合特征生成新图
- **积分系统**: 按需购买积分，每次生成消耗 1 积分
- **多语言**: 支持简体中文、繁体中文、英文
- **历史记录**: 保存所有生成记录，支持下载和重新生成

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 15 | React 全栈框架 |
| TypeScript | 类型安全 |
| Tailwind CSS 4 | 原子化 CSS |
| Clerk | 用户认证 |
| Convex | 数据库 (用户、积分、历史记录) |
| Creem | 支付系统 |
| OpenAI | AI 生图 API (gpt-image-2) |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 填写以下必需的环境变量
```

必需的环境变量：

```bash
# Clerk 认证 (必需)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex 数据库 (必需)
CONVEX_DEPLOYMENT=dev:your-project
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# OpenAI (必需)
OPENAI_API_KEY=sk-...

# Creem 支付 (可选，用于购买积分)
CREEM_API_KEY=
CREEM_WEBHOOK_SECRET=

# 图片存储 R2/Cloudinary (可选，默认使用 base64)
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
R2_BUCKET=
R2_PUBLIC_URL=
```

### 3. 启动开发服务器

```bash
# 启动 Next.js 开发服务器
npm run dev

# 启动 Convex 开发服务器 (新开一个终端)
npx convex dev
```

访问 http://localhost:3000

## 项目结构

```
ai-art/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing Page
│   ├── create/            # 生图页面
│   ├── buy/               # 购买积分
│   ├── history/           # 历史记录
│   └── api/               # API 路由
│       ├── generate/      # 生图 API
│       ├── checkout/      # 支付 API
│       └── webhooks/      # Webhook 处理
├── components/
│   ├── ui/                # 基础 UI 组件
│   ├── business/          # 业务组件
│   └── layout/            # 布局组件
├── convex/                # Convex 数据库
│   ├── schema.ts          # 数据表结构
│   ├── users.ts           # 用户相关操作
│   ├── credits.ts         # 积分相关操作
│   ├── generations.ts     # 生图记录
│   ├── orders.ts          # 订单记录
│   └── transactions.ts    # 积分流水
├── hooks/                 # 自定义 Hooks
├── stores/                # Zustand 状态管理
├── lib/                   # 工具函数
├── types/                 # TypeScript 类型
└── locales/               # 多语言文件
```

## 架构说明

### 数据流

```
用户操作 → Next.js API Route → 业务逻辑 → Convex (数据存取)
                    ↓
              外部服务 (OpenAI/Creem)
```

### 原则

- **Convex 只做数据存储**: 仅提供基础的 CRUD 和原子操作
- **业务逻辑在 Next.js API**: AI 生图、支付流程、复杂计算都放在 API Routes
- **最小 MVP**: 优先核心功能，快速迭代

## 部署

### 部署到 Vercel

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 部署 Convex

```bash
npx convex deploy
```

## 定价

| 套餐 | 积分数 | 价格 | 单价 |
|------|--------|------|------|
| Starter | 10 | $3.99 | $0.40/积分 |
| Standard ⭐ | 30 | $9.99 | $0.33/积分 |
| Premium | 75 | $19.99 | $0.27/积分 |

- 新用户免费赠送 3 积分
- 每次生成消耗 1 积分

## 文档

- [开发文档](DEVELOPMENT.md) - 详细的架构和 API 设计
- [开发规范](DEVELOPMENT-GUIDELINES.md) - 代码规范和组件规范

## License

MIT
