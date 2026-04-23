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
import { MagicRings } from '@/components/ui/magic-rings';

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
      <div className="absolute inset-0 pointer-events-none">
        <MagicRings
          color="#A855F7"
          colorTwo="#06B6D4"
          ringCount={6}
          speed={0.8}
          attenuation={8}
          lineThickness={3}
          baseRadius={0.3}
          radiusStep={0.12}
          scaleRate={0.15}
          opacity={0.6}
          blur={4}
          noiseAmount={0.15}
          rotation={0}
          ringGap={1.8}
          fadeIn={0.6}
          fadeOut={0.4}
          className="absolute inset-0 w-full h-full"
        />
        
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

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
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-6 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
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
            <div className="relative">
              <MagicRings
                color="#A855F7"
                colorTwo="#06B6D4"
                ringCount={5}
                speed={1.2}
                attenuation={6}
                lineThickness={2}
                baseRadius={0.25}
                radiusStep={0.15}
                scaleRate={0.2}
                opacity={0.8}
                blur={6}
                noiseAmount={0.1}
                rotation={-15}
                ringGap={2}
                fadeIn={0.5}
                fadeOut={0.5}
                className="w-full aspect-square rounded-full"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-3 p-8">
                  {SAMPLE_IMAGES.map((src, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.8 + index * 0.15,
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className={cn(
                        'relative group rounded-2xl overflow-hidden',
                        index % 2 === 0 ? 'translate-y-4' : ''
                      )}
                      style={{
                        transform: `translate(${index === 1 ? '10px' : index === 2 ? '-10px' : '0'}, ${index % 2 === 0 ? '20px' : '-10px'})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      <img
                        src={src}
                        alt={`AI generated sample ${index + 1}`}
                        className="w-28 h-28 md:w-32 md:h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-purple-500/50 transition-colors pointer-events-none" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 blur-lg opacity-40"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 blur-lg opacity-30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
            </div>

            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/30 blur-2xl rounded-full"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="lg:hidden mt-12"
        >
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <MagicRings
                color="#A855F7"
                colorTwo="#06B6D4"
                ringCount={4}
                speed={1}
                attenuation={6}
                lineThickness={2}
                baseRadius={0.3}
                radiusStep={0.12}
                scaleRate={0.15}
                opacity={0.7}
                blur={4}
                noiseAmount={0.1}
                rotation={0}
                ringGap={1.5}
                fadeIn={0.6}
                fadeOut={0.4}
                className="w-full h-full rounded-full"
              />
            </div>
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
              className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
