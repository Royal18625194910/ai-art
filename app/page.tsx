'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/business/hero-section';
import { FeaturesSection } from '@/components/business/features-section';
import { GallerySection } from '@/components/business/gallery-section';
import { siteConfig } from '@/config/site';

export default function Home() {
  useEffect(() => {
    document.title = `${siteConfig.name} - AI Art Generation Platform`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', siteConfig.description);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/3 via-cyan-500/3 to-purple-500/3 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative">
        <HeroSection />
        <FeaturesSection />
        <GallerySection />
      </main>

      <Footer />
    </div>
  );
}
