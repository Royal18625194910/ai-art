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
import { useLandingTranslation } from '@/hooks/use-translation';
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
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

export function FeaturesSection({ className }: FeaturesSectionProps) {
  const { landing } = useLandingTranslation();
  const features = landing.features;
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  return (
    <Section
      id="features"
      variant="alternate"
      className={cn('py-24 md:py-32 relative overflow-hidden', className)}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div ref={sectionRef} className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm glass-card border-purple-500/20 text-purple-400"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
              {features.badge}
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="text-gradient-purple">{features.title}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {features.subtitle}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.items.map((feature, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];

            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className={cn(
                    'group h-full border-2 border-transparent',
                    'glass-card',
                    'hover:border-purple-500/30',
                    'hover:shadow-xl hover:shadow-purple-500/10',
                    'transition-all duration-500 cursor-pointer card-hover'
                  )}
                >
                  <CardHeader className="pb-4">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center',
                        'bg-gradient-to-br from-purple-500/20 to-purple-400/20',
                        'group-hover:from-purple-500/30 group-hover:to-purple-400/30',
                        'transition-all duration-500',
                        'shadow-lg shadow-purple-500/10'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-7 h-7',
                          'text-purple-400',
                          'group-hover:scale-110 group-hover:text-purple-300 transition-all duration-500'
                        )}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-3 text-lg flex items-center gap-2 group">
                      {feature.title}
                      <ArrowRight
                        className={cn(
                          'w-4 h-4 opacity-0 -translate-x-2',
                          'group-hover:opacity-100 group-hover:translate-x-0',
                          'transition-all duration-300 text-purple-400'
                        )}
                      />
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mt-20 md:mt-24"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-400/10 to-purple-500/10 rounded-3xl blur-2xl" />
          <div
            className={cn(
              'relative rounded-3xl',
              'glass-card border-purple-500/20',
              'p-8 md:p-12 text-center',
              'shadow-glow'
            )}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
              <span>{features.cta.badge}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-gradient-purple">
                {features.cta.title}
              </span>
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              {features.cta.description}
            </p>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
