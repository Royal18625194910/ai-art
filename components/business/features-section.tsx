'use client';

import {
  Sparkles,
  Palette,
  Image as ImageIcon,
  Zap,
  Shield,
  Code2,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Container, Section } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface FeaturesSectionProps {
  className?: string;
}

const FEATURE_ICONS = [
  Sparkles,
  Palette,
  ImageIcon,
  Zap,
  Shield,
  Code2,
];

export function FeaturesSection({ className }: FeaturesSectionProps) {
  const { t, tObject } = useTranslation();
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  const featuresData = tObject('features.items');
  const features = Array.isArray(featuresData) ? featuresData : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as any,
      },
    },
  };

  return (
    <Section
      id="features"
      variant="alternate"
      className={cn('py-24 md:py-32', className)}
    >
      <Container>
        <div ref={sectionRef} className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm"
            >
              {t('features.badge')}
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            {t('features.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => {
            if (typeof feature !== 'object' || feature === null) return null;
            
            const { title, description } = feature as { title: string; description: string };
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];

            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className={cn(
                    'group h-full border-2 border-transparent',
                    'bg-background/50 backdrop-blur-sm',
                    'hover:border-purple-200 dark:hover:border-purple-800/50',
                    'hover:shadow-lg hover:shadow-purple-500/10',
                    'transition-all duration-300 cursor-pointer'
                  )}
                >
                  <CardHeader className="pb-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        'bg-gradient-to-br from-purple-500/10 to-cyan-500/10',
                        'group-hover:from-purple-500/20 group-hover:to-cyan-500/20',
                        'transition-all duration-300'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-6 h-6',
                          'text-purple-600 dark:text-purple-400',
                          'group-hover:scale-110 transition-transform duration-300'
                        )}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-3 text-lg flex items-center gap-2 group">
                      {title}
                      <ArrowRight
                        className={cn(
                          'w-4 h-4 opacity-0 -translate-x-2',
                          'group-hover:opacity-100 group-hover:translate-x-0',
                          'transition-all duration-300 text-purple-500'
                        )}
                      />
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="relative mt-20 md:mt-24">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
          <div
            className={cn(
              'relative rounded-3xl border border-border/50',
              'bg-gradient-to-br from-purple-500/5 via-background to-cyan-500/5',
              'p-8 md:p-12 text-center'
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Try it now</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to transform your ideas into art?
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join millions of creators who are already using AI Art to bring their imagination to life.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
