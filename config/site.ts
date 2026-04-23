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
    label: 'nav.features',
    href: '#features',
  },
  {
    label: 'nav.gallery',
    href: '#gallery',
  },
  {
    label: 'nav.pricing',
    href: '#pricing',
  },
  {
    label: 'nav.faq',
    href: '#faq',
  },
];

export const footerLinks = {
  product: [
    { label: 'footer.features', href: '#features' },
    { label: 'footer.pricing', href: '#pricing' },
    { label: 'footer.docs', href: '#docs' },
  ],
  company: [
    { label: 'footer.about', href: '#about' },
    { label: 'footer.blog', href: '#blog' },
    { label: 'footer.careers', href: '#careers' },
  ],
  legal: [
    { label: 'footer.privacy', href: '#privacy' },
    { label: 'footer.terms', href: '#terms' },
  ],
};
