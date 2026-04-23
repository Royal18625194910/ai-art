'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Container, Section } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PricingSectionProps {
  className?: string;
}

export function PricingSection({ className }: PricingSectionProps) {
  const { t, tObject } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  const pricingData = tObject('pricing.plans');
  const plans = Array.isArray(pricingData) ? pricingData : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
      },
    },
  };

  return (
    <Section
      id="pricing"
      variant="gradient"
      className={cn('py-24 md:py-32', className)}
    >
      <Container>
        <div ref={sectionRef} className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm"
            >
              {t('pricing.badge')}
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            {t('pricing.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {t('pricing.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-muted/50"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-6 py-2.5 text-sm font-medium rounded-xl transition-all',
                billingCycle === 'monthly'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'px-6 py-2.5 text-sm font-medium rounded-xl transition-all relative',
                billingCycle === 'yearly'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                -20%
              </span>
            </button>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {plans.map((plan, index) => {
              if (typeof plan !== 'object' || plan === null) return null;
              
              const {
                name,
                price,
                period,
                description,
                features,
                cta,
                isPopular,
              } = plan as {
                name: string;
                price: string;
                period: string;
                description: string;
                features: string[];
                cta: string;
                isPopular?: boolean;
              };

              const featuresArray = Array.isArray(features) ? features : [];

              return (
                <motion.div
                  key={`${name}-${billingCycle}`}
                  variants={itemVariants}
                  className={cn(
                    'relative group',
                    isPopular && 'md:-mt-4 md:mb-4'
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge
                        variant="gradient"
                        className="flex items-center gap-1.5 px-4 py-1.5 text-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div
                    className={cn(
                      'relative h-full rounded-3xl transition-all duration-300',
                      isPopular
                        ? 'bg-gradient-to-br from-purple-500/10 via-background to-cyan-500/10 border-2 border-purple-200 dark:border-purple-800/50 shadow-xl shadow-purple-500/10'
                        : 'bg-background border border-border/50 hover:border-border hover:shadow-lg'
                    )}
                  >
                    {isPopular && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
                    )}

                    <div className="relative p-8">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          {name}
                          {isPopular && (
                            <Sparkles className="w-5 h-5 text-purple-500" />
                          )}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {description}
                        </p>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                            {price}
                          </span>
                          <span className="text-muted-foreground text-lg">
                            {period}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && price !== 'Custom' && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Save 20% with yearly billing
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 mb-8">
                        {featuresArray.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant={isPopular ? 'gradient' : 'outline'}
                        className={cn(
                          'w-full h-12 text-base',
                          isPopular && 'shadow-lg shadow-purple-500/25'
                        )}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {cta}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
