'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Image, Brain, Play, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';

interface HeroSectionProps {
  className?: string;
}

const STATS = [
  { value: 2000000, label: 'stats.users', icon: Users, suffix: '+' },
  { value: 50000000, label: 'stats.images', icon: Image, suffix: '+' },
  { value: 50, label: 'stats.models', icon: Brain, suffix: '+' },
];

const SAMPLE_IMAGES = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20cyberpunk%20city%20at%20night%20with%20neon%20lights%20and%20flying%20cars%2C%20cinematic%2C%20highly%20detailed&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20anime%20girl%20with%20pink%20hair%20and%20cherry%20blossoms%2C%20soft%20lighting%2C%20art%20station&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=surreal%20abstract%20art%20with%20flowing%20colors%20and%20geometric%20patterns%2C%20modern%20art&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20landscape%20with%20floating%20islands%20and%20crystal%20waterfalls%2C%20epic%20fantasy%20art&image_size=square_hd',
];

const PREDEFINED_SQUARES = [
  { x: 3, y: 5 }, { x: 7, y: 2 }, { x: 12, y: 8 }, { x: 5, y: 14 },
  { x: 15, y: 3 }, { x: 9, y: 11 }, { x: 2, y: 17 }, { x: 18, y: 6 },
  { x: 11, y: 15 }, { x: 6, y: 9 }, { x: 14, y: 12 }, { x: 8, y: 4 },
  { x: 16, y: 18 }, { x: 4, y: 7 }, { x: 13, y: 1 }, { x: 10, y: 19 },
  { x: 1, y: 10 }, { x: 17, y: 13 }, { x: 12, y: 5 }, { x: 5, y: 16 },
  { x: 19, y: 8 }, { x: 7, y: 12 }, { x: 14, y: 3 }, { x: 3, y: 18 },
  { x: 11, y: 7 }, { x: 16, y: 14 }, { x: 6, y: 1 }, { x: 18, y: 10 },
  { x: 9, y: 17 }, { x: 2, y: 8 }, { x: 15, y: 5 }, { x: 8, y: 13 },
  { x: 13, y: 16 }, { x: 4, y: 11 }, { x: 17, y: 2 }, { x: 10, y: 6 },
  { x: 1, y: 14 }, { x: 12, y: 10 }, { x: 7, y: 19 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function HeroSection({ className }: HeroSectionProps) {
  const { t, tObject } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroStats = tObject('hero.stats');

  const handleCtaClick = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const squares = PREDEFINED_SQUARES;

  return (
    <section
      id="hero"
      className={cn(
        'relative min-h-screen flex flex-col justify-start overflow-hidden pt-20 pb-16',
        className
      )}
    >
      <div className="absolute inset-0">
        <AnimatedGridPattern
          width={20}
          height={20}
          x={-1}
          y={-1}
          squares={squares}
          className="opacity-30 dark:opacity-20"
          strokeDasharray={2}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <motion.div
          className="flex flex-col items-center text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="gradient"
              className="mb-8 px-4 py-1.5 text-sm cursor-pointer inline-flex"
              onClick={handleCtaClick}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {t('hero.badge')}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              <span className="block">{t('hero.title')}</span>
              <AnimatedGradientText
                from="from-purple-500"
                via="via-cyan-500"
                to="to-purple-500"
                duration={3}
                className="block mt-2"
              >
                {t('hero.titleHighlight')}
              </AnimatedGradientText>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto text-base px-8 h-14"
              onClick={handleCtaClick}
            >
              <span className="flex items-center gap-2">
                {t('hero.ctaPrimary')}
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base px-8 h-14 border-2"
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                {t('hero.ctaSecondary')}
              </span>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 md:gap-16 mb-16"
          >
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              const label = heroStats[stat.label.split('.')[1]] as string || stat.label;
              
              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-5 h-5 text-purple-500" />
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                      {mounted ? formatNumber(stat.value) : '0'}
                      {stat.suffix}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-4xl mt-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {SAMPLE_IMAGES.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1 + index * 0.1,
                    duration: 0.5,
                  }}
                  className={cn(
                    'relative group rounded-2xl overflow-hidden',
                    index % 2 === 0 ? 'translate-y-4' : ''
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <img
                    src={src}
                    alt={`AI generated sample ${index + 1}`}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-white/20 transition-colors pointer-events-none" />
                </motion.div>
              ))}
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-2xl rounded-full" />
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
