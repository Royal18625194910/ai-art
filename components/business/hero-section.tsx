'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Image, Brain, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { WarpBackground } from '@/components/ui/warp-background';

interface HeroSectionProps {
  className?: string;
}

const STATS = [
  { value: 2000000, label: 'stats.users', icon: Users, suffix: '+' },
  { value: 50000000, label: 'stats.images', icon: Image, suffix: '+' },
  { value: 50, label: 'stats.models', icon: Brain, suffix: '+' },
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
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

const codeLines = [
  'import { ColorBends } from "@/components/ui/color-bends";',
  '',
  'function App() {',
  '  return (',
  '    <ColorBends',
  '      color="#A855F7"',
  '      speed={0.2}',
  '      frequency={1.0}',
  '      noise={0.25}',
  '      bandWidth={0.14}',
  '      rotation={-60}',
  '      fadeTop={0.1}',
  '      iterations={1}',
  '      intensity={1.3}',
  '    />',
  '  );',
  '}',
];

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

  return (
    <section
      id="hero"
      className={cn(
        'relative min-h-screen flex flex-col justify-start overflow-hidden pt-20 pb-16',
        className
      )}
    >
      <WarpBackground className="absolute inset-0">
        <div className="absolute inset-0" />
      </WarpBackground>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="flex flex-col items-start text-left max-w-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge
                variant="secondary"
                className="mb-8 px-4 py-1.5 text-sm cursor-pointer inline-flex bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20"
                onClick={handleCtaClick}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {t('hero.badge')}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
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
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-6 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">
                积分制：1积分 = 1张图片
              </span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 mb-12"
            >
              <Button
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto text-base px-8 h-14 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
                onClick={handleCtaClick}
              >
                <span className="flex items-center gap-2">
                  开始创作
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 md:gap-12"
            >
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                const label = heroStats[stat.label.split('.')[1]] as string || stat.label;
                
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-5 h-5 text-purple-500" />
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-white/40">ColorBends.tsx</span>
                </div>
                <div className="w-16" />
              </div>

              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                {codeLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                    className="flex"
                  >
                    <span className="select-none text-white/20 w-8 flex-shrink-0 text-right pr-4">
                      {index + 1}
                    </span>
                    <pre className="flex-1 text-white/70">
                      {line.split(/(".*?"|'[^']*'|`[^`]*`)/g).map((part, partIndex) => {
                        if (part.match(/^["'`].*["'`]$/)) {
                          return <span key={partIndex} className="text-emerald-400">{part}</span>;
                        }
                        if (part.match(/\b(import|from|return|function)\b/)) {
                          return <span key={partIndex} className="text-purple-400">{part}</span>;
                        }
                        if (part.match(/\b(ColorBends|App)\b/)) {
                          return <span key={partIndex} className="text-cyan-400">{part}</span>;
                        }
                        if (part.match(/\b(color|speed|frequency|noise|bandWidth|rotation|fadeTop|iterations|intensity)\b/)) {
                          return <span key={partIndex} className="text-orange-400">{part}</span>;
                        }
                        if (part.match(/\b(\d+\.?\d*)\b/)) {
                          return <span key={partIndex} className="text-yellow-400">{part}</span>;
                        }
                        return <span key={partIndex}>{part}</span>;
                      })}
                    </pre>
                  </motion.div>
                ))}
              </div>

              <div className="absolute -right-20 top-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -left-20 bottom-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
            </div>

            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-2xl rounded-full"
            />
          </motion.div>
        </div>
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
