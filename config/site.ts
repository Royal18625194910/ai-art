import { SiteConfig, NavItem } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'AI Art',
  description: '用AI创造无限可能的艺术作品',
  author: 'AI Art Team',
  url: 'https://ai-art.example.com',
  ogImage: 'https://ai-art.example.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/ai_art',
    github: 'https://github.com/ai-art',
    docs: 'https://docs.ai-art.example.com',
  },
};

// 联系邮箱
export const contactInfo = {
  supportEmail: '2326182533@qq.com',
};

// 闲鱼链接配置（中国大陆用户专享）
export const xianyuConfig = {
  enabled: true,
  // 闲鱼商品链接
  link: 'https://m.tb.cn/h.iuOjxmp?tk=7kFd598jjwZ',
  // 兑换码说明
  description: '购买后请复制兑换码，在下方输入框中兑换',
};

// 未登录时显示的导航（landing page 锚点）
export const landingNavItems: NavItem[] = [
  {
    label: 'nav.home',
    href: '/',
  },
  {
    label: 'nav.features',
    href: '#features',
  },
  {
    label: 'nav.gallery',
    href: '#gallery',
  },
];

// 已登录时显示的功能导航
export const authNavItems: NavItem[] = [
  {
    label: 'nav.create',
    href: '/create',
  },
  {
    label: 'nav.buy',
    href: '/buy',
  },
  {
    label: 'nav.history',
    href: '/history',
  },
];

// 默认导出（兼容旧代码）
export const navItems = authNavItems;

export const footerLinks = {
  product: [
    { label: 'footer.features', href: '#features' },
    { label: 'footer.gallery', href: '#gallery' },
  ],
  company: [],
  legal: [
    { label: 'footer.privacy', href: '#privacy' },
    { label: 'footer.terms', href: '#terms' },
  ],
};
