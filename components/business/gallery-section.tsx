'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Maximize2, Heart, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandingTranslation } from '@/hooks/use-translation';
import type { LandingGalleryCategories } from '@/locales';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Container, Section } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GallerySectionProps {
  className?: string;
}

const GALLERY_IMAGES = [
  {
    id: 1,
    prompt: 'futuristic cyberpunk city at night with neon lights',
    category: 'scifi',
    likes: 1234,
    views: 5678,
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20cyberpunk%20city%20at%20night%20with%20neon%20lights%20and%20flying%20cars%2C%20cinematic%2C%20highly%20detailed&image_size=square_hd',
  },
  {
    id: 2,
    prompt: 'beautiful anime girl with pink hair and cherry blossoms',
    category: 'anime',
    likes: 2345,
    views: 8912,
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20anime%20girl%20with%20pink%20hair%20and%20cherry%20blossoms%2C%20soft%20lighting%2C%20art%20station&image_size=square_hd',
  },
  {
    id: 3,
    prompt: 'surreal abstract art with flowing colors and patterns',
    category: 'abstract',
    likes: 987,
    views: 4321,
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=surreal%20abstract%20art%20with%20flowing%20colors%20and%20geometric%20patterns%2C%20modern%20art&image_size=square_hd',
  },
  {
    id: 4,
    prompt: 'fantasy landscape with floating islands and waterfalls',
    category: 'fantasy',
    likes: 3456,
    views: 12345,
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20landscape%20with%20floating%20islands%20and%20crystal%20waterfalls%2C%20epic%20fantasy%20art&image_size=square_hd',
  },
  {
    id: 5,
    prompt: 'majestic dragon soaring over mountain peaks',
    category: 'fantasy',
    likes: 4567,
    views: 15678,
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=majestic%20dragon%20soaring%20over%20mountain%20peaks%20at%20sunset%2C%20epic%20fantasy%20art&image_size=square_hd',
  },
  {
    id: 6,
    prompt: 'elegant fashion portrait in studio lighting',
    category: 'portrait',
    likes: 2890,
    views: 9876,
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20fashion%20portrait%20with%20dramatic%20studio%20lighting%2C%20professional%20photography&image_size=square_hd',
  },
];

const CATEGORIES: Array<keyof LandingGalleryCategories> = ['all', 'scifi', 'anime', 'fantasy', 'abstract', 'portrait'];

export function GallerySection({ className }: GallerySectionProps) {
  const { landing } = useLandingTranslation();
  const gallery = landing.gallery;
  const [activeCategory, setActiveCategory] = useState<keyof LandingGalleryCategories>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  const filteredImages =
    activeCategory === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
      },
    },
  };

  return (
    <Section
      id="gallery"
      variant="default"
      className={cn('py-24 md:py-32 overflow-hidden relative', className)}
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div ref={sectionRef} className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="gradient"
              className="mb-6 px-4 py-1.5 text-sm glass-card border-purple-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
              {gallery.badge}
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="text-gradient-purple">{gallery.title}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {gallery.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                  activeCategory === category
                    ? 'glass-card border-purple-500/30 text-purple-400 shadow-glow'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground glass-card'
                )}
              >
                {gallery.categories[category]}
              </button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square glass-card">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: hoveredId === image.id ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <img
                      src={image.src}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>

                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent',
                      'transition-opacity duration-300',
                      hoveredId === image.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />

                  <div
                    className={cn(
                      'absolute top-4 right-4 flex gap-2',
                      'transition-all duration-300',
                      hoveredId === image.id
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-2'
                    )}
                  >
                    <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-red-500/30 transition-colors group/heart">
                      <Heart
                        className={cn(
                          'w-5 h-5 text-white transition-colors',
                          'group-hover/heart:fill-red-500 group-hover/heart:text-red-500'
                        )}
                      />
                    </button>
                  </div>

                  <div
                    className={cn(
                      'absolute bottom-4 left-4 right-4',
                      'transition-all duration-300',
                      hoveredId === image.id
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                    )}
                  >
                    <p className="text-white/90 text-sm font-medium mb-3 line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center gap-4 text-white/70 text-xs">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {image.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {image.views.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'absolute inset-0 border-2 rounded-2xl transition-all duration-300',
                      hoveredId === image.id
                        ? 'border-purple-500/50 shadow-glow'
                        : 'border-white/10'
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            variant="primary"
            size="lg"
          >
            <span className="flex items-center gap-2">
              {gallery.cta}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
