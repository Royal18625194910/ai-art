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

export const navItems: NavItem[] = [
  {
    label: 'nav.home',
    href: '/',
  },
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
