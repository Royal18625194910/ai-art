'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Users,
  MessageSquare,
  Code2,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Container } from '@/components/ui/container';
import { LanguageSwitcher } from '@/components/business/language-switcher';
import { footerLinks } from '@/config/site';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t, tObject } = useTranslation();
  const { ref: footerRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px 0px 0px',
  });

  const footerData = tObject('footer');

  const socialLinks = [
    { icon: MessageSquare, href: '#', label: 'Twitter' },
    { icon: Code2, href: '#', label: 'GitHub' },
    { icon: Users, href: '#', label: 'LinkedIn' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className={cn(
        'relative border-t border-border/50 bg-background py-16 md:py-24',
        className
      )}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16"
        >
          <div className="lg:col-span-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="flex items-center gap-2 mb-6 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Art
              </span>
            </a>

            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              {footerData.description as string || t('footer.description')}
            </p>

            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      'bg-muted/50 hover:bg-muted transition-colors',
                      'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            <div className="lg:hidden">
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {footerData.product as string || 'Product'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    {t(link.label)}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {footerData.company as string || 'Company'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    {t(link.label)}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex flex-col">
            <h3 className="font-semibold text-foreground mb-4">
              {footerData.legal as string || 'Legal'}
            </h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.legal.map((link, index) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    {t(link.label)}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>
        </motion.div>

        <div className="lg:hidden border-t border-border/50 pt-6">
          <h3 className="font-semibold text-foreground mb-4">
            {footerData.legal as string || 'Legal'}
          </h3>
          <ul className="space-y-3">
            {footerLinks.legal.map((link, index) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {footerData.copyright as string || t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Made with ❤️ by AI Art Team</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
