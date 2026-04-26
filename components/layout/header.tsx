'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCommonTranslation } from '@/hooks/use-translation';
import { useScrollPosition, useScrollDirection } from '@/hooks/use-scroll-animation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/business/language-switcher';
import { authNavItems, landingNavItems } from '@/config/site';
import { useAuth, UserButton, SignInButton } from '@clerk/nextjs';
import { useUserCredits } from '@/hooks/use-user-credits';
import { AnimatedLoginButton } from '@/components/ui/animated-login-button';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollPosition = useScrollPosition();
  const scrollDirection = useScrollDirection();
  const { nav } = useCommonTranslation();
  const { isSignedIn, isLoaded } = useAuth();
  const { credits, isSignedIn: hasCredits } = useUserCredits();
  const router = useRouter();
  const pathname = usePathname();

  // 根据登录状态选择导航项
  const navItems = useMemo(() => {
    return isSignedIn ? authNavItems : landingNavItems;
  }, [isSignedIn]);

  const isActiveNav = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href.startsWith('#')) {
      // 只有在首页时才考虑 hash 导航的激活状态
      // 简单处理：pathname === '/' 时，hash 链接不显示为激活
      // 只有当滚动到对应 section 时才激活（可选实现 scroll spy）
      return false; // 暂不显示 hash 链接为激活状态
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  useEffect(() => {
    setIsScrolled(scrollPosition > 50);
  }, [scrollPosition]);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith('#')) {
      e.preventDefault();
      const target = href.slice(1);
      const element = document.getElementById(target);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else if (href !== '#') {
      e.preventDefault();
      router.push(href);
    }
  };

  const getNavLabel = (label: string) => {
    const key = label.replace('nav.', '') as keyof typeof nav;
    return nav[key] || label;
  };

  const isHidden = scrollDirection === 'down' && scrollPosition > 300;

  // 未登录用户在非首页时，重定向到首页
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const protectedRoutes = ['/create', '/buy', '/history'];
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        router.push('/');
      }
    }
  }, [isLoaded, isSignedIn, pathname, router]);

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
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => handleNavClick('/', e)}
          className="flex items-center gap-2 group"
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

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(item.href, e)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                isActiveNav(item.href)
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {getNavLabel(item.label)}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoaded && isSignedIn && (
            <div
              onClick={() => router.push('/buy')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 cursor-pointer hover:bg-purple-500/20 transition-colors"
            >
              <Coins className="w-4 h-4" />
              <span className="text-sm font-medium">{credits}</span>
            </div>
          )}
          <LanguageSwitcher variant="dropdown" />
          {isLoaded && !isSignedIn && (
            <SignInButton mode="redirect">
              <AnimatedLoginButton>
                {nav.login}
              </AnimatedLoginButton>
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

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher variant="dropdown" />

          {isLoaded && isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                  userButtonPopoverCard: 'shadow-xl border border-border/50',
                }
              }}
            />
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
                  className={cn(
                    'block px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActiveNav(item.href)
                      ? 'text-purple-400 bg-purple-500/10'
                      : 'hover:bg-muted'
                  )}
                >
                  {getNavLabel(item.label)}
                </a>
              ))}
            </div>
            <div className="px-4 py-4 border-t border-border/50">
              {isLoaded && isSignedIn && (
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/buy');
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 cursor-pointer hover:bg-purple-500/20 transition-colors"
                >
                  <Coins className="w-4 h-4" />
                  <span className="text-sm font-medium">{credits} 积分</span>
                </div>
              )}
              {isLoaded && !isSignedIn && (
                <SignInButton mode="redirect">
                  <AnimatedLoginButton className="w-full">
                    {nav.login}
                  </AnimatedLoginButton>
                </SignInButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
