'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useScrollPosition, useScrollDirection } from '@/hooks/use-scroll-animation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/business/language-switcher';
import { navItems } from '@/config/site';
import { useAuth, UserButton, SignInButton } from '@clerk/nextjs';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollPosition = useScrollPosition();
  const scrollDirection = useScrollDirection();
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    setIsScrolled(scrollPosition > 50);
  }, [scrollPosition]);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const target = href.startsWith('#') ? href.slice(1) : href;
    const element = document.getElementById(target);
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const isHidden = scrollDirection === 'down' && scrollPosition > 300;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50'
          : 'bg-transparent',
        isHidden && '-translate-y-full',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <a
          href="#"
          className="flex items-center gap-2 group"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Art
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(item.href, e)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {t(item.label)}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher variant="dropdown" />
          {isLoaded && !isSignedIn && (
            <SignInButton mode="redirect">
              <Button variant="gradient" size="sm">
                <span className="flex items-center gap-1">
                  {t('nav.login')}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                  userButtonPopoverCard: 'shadow-xl border border-border/50',
                }
              }}
            />
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  {t(item.label)}
                </a>
              ))}
            </div>
            <div className="px-4 py-4 border-t border-border/50 space-y-3">
              <LanguageSwitcher variant="dropdown" />
              {isLoaded && !isSignedIn && (
                <SignInButton mode="redirect">
                  <Button variant="gradient" className="w-full justify-center">
                    <span className="flex items-center gap-1">
                      {t('nav.login')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </SignInButton>
              )}
              {isLoaded && isSignedIn && (
                <div className="flex items-center justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10',
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
