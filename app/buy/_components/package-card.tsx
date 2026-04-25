'use client';

import { motion } from 'framer-motion';
import { Check, Crown, Zap, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditPackage } from '@/types';
import { BuyTranslations } from '@/locales/types';

interface Labels {
  popularLabel: string;
  ctaButton: string;
  creditLabel: string;
}

interface PackageCardProps {
  pkg: CreditPackage;
  index: number;
  labels: Labels;
  t: (key: keyof BuyTranslations, params?: Record<string, string | number>) => string;
}

export function PackageCard({ pkg, index, labels, t }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className={cn(
        'relative rounded-2xl border-2 p-6 transition-all duration-300 flex flex-col',
        pkg.isPopular
          ? 'border-purple-500 bg-card/80 shadow-xl shadow-purple-500/10'
          : 'border-border/50 bg-card/30 hover:border-purple-500/50 hover:bg-card/50'
      )}
    >
      {pkg.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 px-4 py-1"
          >
            <Crown className="w-3.5 h-3.5 mr-1" />
            {labels.popularLabel}
          </Badge>
        </div>
      )}

      {pkg.savingsPercent > 0 && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            <Zap className="w-3.5 h-3.5 mr-1" />
            {t('savings', { percent: pkg.savingsPercent })}
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-purple-400" />
          <span className="text-2xl font-bold text-foreground">{pkg.credits}</span>
          <span className="text-sm text-muted-foreground">{labels.creditLabel}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-bold text-foreground">{pkg.priceFormatted}</span>
        </div>
        <p className="text-sm text-muted-foreground">{pkg.perCreditPrice}</p>
      </div>

      <div className="space-y-3 mb-6 flex-grow">
        {pkg.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        variant={pkg.isPopular ? 'primary' : 'secondary'}
        className="w-full cursor-pointer"
      >
        {labels.ctaButton}
      </Button>
    </motion.div>
  );
}
