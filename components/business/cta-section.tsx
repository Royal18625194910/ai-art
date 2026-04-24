'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Stars } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTranslation, useTranslation } from '@/hooks/use-translation';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Container, Section } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps) {
  const { t } = usePageTranslation('landing');
  const { t: tCommon } = useTranslation();
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  const handleCtaClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Section
      variant="dark"
      className={cn(
        'relative py-24 md:py-32 overflow-hidden',
        'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
        className
      )}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.1)_0%,_transparent_70%)]" />
      </div>

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container className="relative z-10">
        <div ref={sectionRef} className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>{t('cta.badge')}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">{t('cta.title')}</span>
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                <span className="inline-flex items-center gap-2">
                  <Stars className="w-8 h-8 md:w-12 md:h-12 text-yellow-400" />
                  {t('cta.titleHighlight')}
                </span>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto text-base px-10 h-14 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/30"
                onClick={handleCtaClick}
              >
                <span className="flex items-center gap-2">
                  {t('cta.ctaPrimary')}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-10 h-14 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                {t('cta.ctaSecondary')}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <span>{t('cta.freeTrial')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>{t('cta.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>{t('cta.cancelAnytime')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </Section>
  );
}
