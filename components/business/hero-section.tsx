'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Image, Palette, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { MagicRings, MagicRingsBackground } from '@/components/ui/magic-rings';

interface HeroSectionProps {
  className?: string;
}

const STATS = [
  { value: 2000000, label: 'stats.users', icon: Users, suffix: '+' },
  { value: 50000000, label: 'stats.images', icon: Image, suffix: '+' },
  { value: 500, label: 'stats.styles', icon: Palette, suffix: '+' },
];

const SAMPLE_IMAGES = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20cyberpunk%20city%20at%20night%20with%20neon%20lights%20and%20flying%20cars%2C%20cinematic%2C%20highly%20detailed&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20anime%20girl%20with%20pink%20hair%20and%20cherry%20blossoms%2C%20soft%20lighting%2C%20art%20station&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=surreal%20abstract%20art%20with%20flowing%20colors%20and%20geometric%20patterns%2C%20modern%20art&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20landscape%20with%20floating%20islands%20and%20crystal%20waterfalls%2C%20epic%20fantasy%20art&image_size=square_hd',
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
  hidden: { opacity: 0, filter: 'blur(10px)', y: 30 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
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

  return (
    <section
      id="hero"
      className={cn(
        'relative min-h-screen flex flex-col justify-start overflow-hidden pt-20 pb-16',
        className
      )}
    >
      <MagicRingsBackground color="#8B5CF6" colorTwo="#A78BFA" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-400/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

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
                className="mb-8 px-4 py-1.5 text-sm cursor-pointer inline-flex bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20 glass-card"
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
                <span className="block mt-2 text-gradient-purple">
                  {t('hero.titleHighlight')}
                </span>
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
              className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 glass-card"
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
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base px-8"
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
                      <Icon className="w-5 h-5 text-purple-400" />
                      <span className="text-2xl font-bold text-gradient-purple">
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
            className="relative"
          >
            <div className="relative flex items-center justify-center aspect-square">
              <MagicRings
                color="#8B5CF6"
                colorTwo="#A78BFA"
                ringCount={6}
                speed={0.8}
                opacity={0.8}
                blur={2}
                size="xl"
                className="absolute inset-0"
              />

              <div className="relative z-10 grid grid-cols-2 gap-4 p-8">
                {SAMPLE_IMAGES.map((src, index) => (
                  <motion.div
                    key={index}
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.8 + index * 0.15,
                    }}
                    className={cn(
                      'relative group rounded-2xl overflow-hidden shadow-xl shadow-purple-500/20 glass-card',
                      index % 2 === 0 ? 'translate-y-6' : '-translate-y-6'
                    )}
                    style={{
                      transform: `translate(${index === 1 ? '20px' : index === 2 ? '-20px' : '0'}, ${index % 2 === 0 ? '30px' : '-20px'})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <img
                      src={src}
                      alt={`AI generated sample ${index + 1}`}
                      className="w-28 h-28 md:w-36 md:h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-2xl group-hover:border-purple-500/60 transition-colors pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 blur-lg opacity-50"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 blur-lg opacity-40"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="lg:hidden mt-12 flex justify-center"
        >
          <div className="relative w-64 h-64">
            <MagicRings
              color="#8B5CF6"
              colorTwo="#A78BFA"
              ringCount={5}
              speed={0.6}
              opacity={0.7}
              blur={2}
              size="lg"
              className="absolute inset-0"
            />
          </div>
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
              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
