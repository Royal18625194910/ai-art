'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Users,
  MessageSquare,
  Code2,
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

  const hasProductLinks = footerLinks.product.length > 0;
  const hasLegalLinks = footerLinks.legal.length > 0;

  return (
    <footer
      ref={footerRef}
      className={cn(
        'relative border-t border-border/50 bg-background py-12 md:py-16',
        className
      )}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="flex items-center gap-2 group"
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

            <div className="flex items-center gap-4">
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
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-border/50">
            <div className="flex flex-wrap items-center gap-6">
              {hasProductLinks && footerLinks.product.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(link.label)}
                </a>
              ))}
              {hasLegalLinks && footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(link.label)}
                </a>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              {footerData.copyright as string || t('footer.copyright')}
            </p>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
